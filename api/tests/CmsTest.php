<?php
declare(strict_types=1);

/**
 * Unit & Contract Tests for EmHa CMS Admin & Content Security
 * Run via: php api/tests/CmsTest.php
 */

require_once __DIR__ . '/../admin/Auth.php';
require_once __DIR__ . '/../admin/ContentManager.php';

function assertCondition(bool $condition, string $testName): void {
    if (!$condition) {
        echo "❌ FAILED: {$testName}\n";
        exit(1);
    }
    echo "✓ PASSED: {$testName}\n";
}

echo "\n--- Running EmHa CMS Security & Content Tests ---\n\n";

// 1. ContentManager load & schema
$initial = ContentManager::load();
assertCondition(!empty($initial['business']), 'ContentManager loads valid business section');
assertCondition(!empty($initial['seo']), 'ContentManager loads valid SEO section');
assertCondition(is_array($initial['caseStudies']), 'ContentManager loads case studies array');
assertCondition(is_array($initial['reviews']), 'ContentManager loads reviews array');
assertCondition(is_array($initial['pages']), 'ContentManager loads pages dictionary');

// 2. Schema validation: rejects missing business section
$invalidPayload = ['seo' => []];
$res = ContentManager::validateAndSanitize($invalidPayload);
assertCondition($res['valid'] === false, 'Rejects payload missing business section');

// 3. Schema validation: rejects invalid email format
$badEmailPayload = $initial;
$badEmailPayload['business']['email'] = 'invalid-email-format';
$resEmail = ContentManager::validateAndSanitize($badEmailPayload);
assertCondition($resEmail['valid'] === false, 'Rejects invalid business email');

// 4. Schema validation: sanitizes strings and limits review rating (1-5)
$testPayload = $initial;
$testPayload['reviews'][0]['rating'] = 10; // Out of bounds, should clamp to 5
$testPayload['pages']['rekonstrukce']['sections']['soucasti']['title'] = 'Testovací nadpis sekce';
$testPayload['pages']['rekonstrukce']['links'] = [['href' => '/test', 'label' => 'Test Link']];
$sanitized = ContentManager::validateAndSanitize($testPayload);
assertCondition($sanitized['valid'] === true, 'Validates well-formed payload');
assertCondition($sanitized['data']['reviews'][0]['rating'] === 5, 'Clamps review rating to maximum 5');
assertCondition($sanitized['data']['pages']['rekonstrukce']['sections']['soucasti']['title'] === 'Testovací nadpis sekce', 'Preserves and sanitizes custom section title');
assertCondition($sanitized['data']['pages']['rekonstrukce']['links'][0]['label'] === 'Test Link', 'Preserves and sanitizes custom page links');

// 5. Atomic save & revision snapshot creation
$saveRes = ContentManager::save($sanitized['data']);
assertCondition($saveRes['success'] === true, 'Atomic save succeeds');

$revisions = ContentManager::listRevisions();
assertCondition(count($revisions) > 0, 'Generates timestamped revision snapshot');

// 6. Auth: rejects invalid credentials
$failLogin = Auth::login('admin', 'WrongPassword123!', '192.168.1.100');
assertCondition($failLogin['success'] === false, 'Rejects invalid admin credentials');

// 7. Auth: successful login with configured master key
$successLogin = Auth::login('admin', 'EmHa2026MasterKey!', '192.168.1.100');
assertCondition($successLogin['success'] === true, 'Logs in successfully with valid credentials');
assertCondition(!empty($successLogin['csrf']), 'Generates non-empty CSRF token on login');

// 8. Auth: CSRF validation
assertCondition(Auth::validateCsrf($successLogin['csrf']) === true, 'Validates active session CSRF token');
assertCondition(Auth::validateCsrf('forged-token-attack') === false, 'Rejects forged CSRF token');

// 9. Auth: Rate limiting after multiple failed attempts
$testIp = '10.0.0.99';
for ($i = 0; $i < 5; $i++) {
    Auth::login('admin', 'wrong-pass', $testIp);
}
$lockedLogin = Auth::login('admin', 'EmHa2026MasterKey!', $testIp);
assertCondition($lockedLogin['success'] === false && str_contains($lockedLogin['error'], '15 minut'), 'Enforces 15-min IP lockout after 5 failed login attempts');

// 10. Auth: Logout
Auth::logout();
assertCondition(Auth::check() === false, 'Session destroyed after logout');

// 11. Rollback / Revision Restore
$beforeRevisions = ContentManager::listRevisions();
assertCondition(count($beforeRevisions) > 0, 'Revisions exist before rollback test');
$targetFile = $beforeRevisions[0]['id'];

assertCondition(ContentManager::restoreRevision('invalid_nonexistent_file.json') === false, 'Rejects nonexistent revision file');

$restoreSuccess = ContentManager::restoreRevision($targetFile);
assertCondition($restoreSuccess === true, 'restoreRevision succeeds with valid revision');

$afterRevisions = ContentManager::listRevisions();
assertCondition(count($afterRevisions) >= count($beforeRevisions), 'Revision list is updated with pre-rollback safety snapshot');
$restoredContent = ContentManager::load();
assertCondition(!empty($restoredContent['business']), 'Restored content is valid and loaded successfully');

echo "\nAll 11 CMS security, content, and rollback tests PASSED successfully!\n\n";

