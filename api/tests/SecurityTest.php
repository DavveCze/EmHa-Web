<?php
declare(strict_types=1);

/**
 * Contract & Security Unit Tests for EmHa Elektro Public Contact API
 * Run via: php api/tests/SecurityTest.php
 */

require_once __DIR__ . '/../Security.php';

function assertTrue(bool $condition, string $testName): void {
    if (!$condition) {
        echo "❌ FAILED: {$testName}\n";
        exit(1);
    }
    echo "✓ PASSED: {$testName}\n";
}

echo "\n--- Running EmHa API Contract & Security Tests ---\n\n";

// 1. Happy path: valid Czech mobile
$validData = [
    'surname' => 'Novák',
    'contact' => '+420 777 123 456',
    'service' => 'rekonstrukce',
    'message' => 'Poptávám kompletní elektroinstalaci bytu v Ostravě.',
];
$res = Security::validateAndSanitize($validData);
assertTrue($res['valid'] === true, 'Happy path with valid CZ phone (+420)');
assertTrue($res['data']['serviceLabel'] === 'Rekonstrukce', 'Service enum mapped to Czech label');

// 2. Happy path: valid Czech email
$validEmailData = [
    'surname' => 'Dvořáková',
    'contact' => 'petra.dvorakova@seznam.cz',
    'service' => 'elektroinstalace',
    'message' => 'Dobrý den, poptáváme rozvody v novostavbě rodinného domu.',
];
$res = Security::validateAndSanitize($validEmailData);
assertTrue($res['valid'] === true, 'Happy path with valid email');

// 3. Short surname (< 2 chars)
$invalidSurname = [
    'surname' => 'N',
    'contact' => 'jan@seznam.cz',
    'service' => 'opravy-a-servis',
    'message' => 'Nefunkční jistič v chodbě.',
];
$res = Security::validateAndSanitize($invalidSurname);
assertTrue($res['valid'] === false && isset($res['errors']['surname']), 'Rejects surname shorter than 2 chars');

// 4. Invalid contact (not an email and not a phone)
$invalidContact = [
    'surname' => 'Svoboda',
    'contact' => 'not-an-email-or-phone',
    'service' => 'data-a-slaboproud',
    'message' => 'Potřebujeme natáhnout datové kabely Cat6.',
];
$res = Security::validateAndSanitize($invalidContact);
assertTrue($res['valid'] === false && isset($res['errors']['contact']), 'Rejects invalid contact string');

// 5. Unknown service
$invalidService = [
    'surname' => 'Černý',
    'contact' => '777 111 222',
    'service' => 'hacker_injection',
    'message' => 'Poptávám nezávaznou konzultaci.',
];
$res = Security::validateAndSanitize($invalidService);
assertTrue($res['valid'] === false && isset($res['errors']['service']), 'Rejects service not present in ALLOWED_SERVICES enum');

// 6. Short message (< 10 chars)
$shortMessage = [
    'surname' => 'Kučera',
    'contact' => 'kucera@email.cz',
    'service' => 'jine',
    'message' => 'Ahoj',
];
$res = Security::validateAndSanitize($shortMessage);
assertTrue($res['valid'] === false && isset($res['errors']['message']), 'Rejects message shorter than 10 characters');

// 7. Anti-bot Honeypot trap
$honeypotSpam = [
    '_hp_company' => 'Bot Spammer Inc.',
    '_form_time' => time() - 10,
];
$res = Security::checkSpamTraps($honeypotSpam);
assertTrue($res['isSpam'] === true, 'Detects and flags honeypot field fill as spam');

// 8. Anti-bot Fast Timing trap (< 3 seconds)
$fastTimingSpam = [
    '_hp_company' => '',
    '_form_time' => time() - 1, // submitted after 1 second (inhuman)
];
$res = Security::checkSpamTraps($fastTimingSpam);
assertTrue($res['isSpam'] === true, 'Detects sub-3-second bot submission as spam');

// 9. Czech Visitor Verification: foreign phone prefix
$foreignPhone = Security::verifyCzechVisitor('127.0.0.1', '+49 170 1234567');
assertTrue($foreignPhone['allowed'] === false, 'Rejects foreign international telephone prefix (+49)');

$czechPhone = Security::verifyCzechVisitor('127.0.0.1', '+420 777 888 999');
assertTrue($czechPhone['allowed'] === true, 'Allows valid Czech phone prefix (+420)');

// 10. Czech Contact Format helper
assertTrue(Security::isCzechContact('+420 777 888 999') === true, 'Recognizes +420 as Czech contact');
assertTrue(Security::isCzechContact('777888999') === true, 'Recognizes 9-digit mobile as Czech contact');
assertTrue(Security::isCzechContact('klient@seznam.cz') === true, 'Recognizes .cz email as Czech contact');
assertTrue(Security::isCzechContact('klient@gmail.com') === false, 'Recognizes generic .com as non-cz without phone');

echo "\nAll 10 contract and security tests PASSED successfully!\n\n";
