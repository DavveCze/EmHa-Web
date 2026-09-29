<?php
declare(strict_types=1);

/**
 * Unit & Integration Tests for EmHa CMS InquiryManager (CRM)
 * Run via: php api/tests/InquiriesTest.php
 */

require_once __DIR__ . '/../admin/InquiryManager.php';

function assertInquiryCondition(bool $condition, string $testName): void {
    if (!$condition) {
        echo "❌ FAILED: {$testName}\n";
        exit(1);
    }
    echo "✓ PASSED: {$testName}\n";
}

echo "\n--- Running EmHa CMS InquiryManager Tests ---\n\n";

// Backup existing inquiries file if present
$inquiriesFile = InquiryManager::DATA_FILE;
$backupData = null;
if (file_exists($inquiriesFile)) {
    $backupData = file_get_contents($inquiriesFile);
}

try {
    // 1. Record new inquiry
    $testLead = [
        'surname' => 'Novák',
        'contact' => '+420 777 123 456',
        'service' => 'rekonstrukce',
        'message' => 'Poptávka na kompletní elektroinstalaci bytu 3+1 v Ostravě.',
        'ip' => '127.0.0.1',
    ];

    $recorded = InquiryManager::recordInquiry($testLead);
    assertInquiryCondition(!empty($recorded['id']) && str_starts_with($recorded['id'], 'inq_'), 'Generates unique inquiry ID');
    assertInquiryCondition($recorded['status'] === 'new', 'Initial inquiry status is new');
    assertInquiryCondition($recorded['serviceLabel'] === 'Rekonstrukce', 'Maps service enum to Czech label');

    // 2. List inquiries
    $list = InquiryManager::listInquiries();
    assertInquiryCondition(count($list) >= 1, 'Inquiry successfully saved and listed');
    assertInquiryCondition($list[0]['id'] === $recorded['id'], 'Newest inquiry is at the top of the list');

    // 3. Update status
    $updateStatusRes = InquiryManager::updateInquiry($recorded['id'], ['status' => 'in_progress']);
    assertInquiryCondition($updateStatusRes['success'] === true, 'Successfully updates status to in_progress');
    assertInquiryCondition($updateStatusRes['inquiry']['status'] === 'in_progress', 'Updated inquiry reflects in_progress status');

    // 4. Add internal note
    $noteText = 'Zavoláno zákazníkovi, domluvena osobní prohlídka na čtvrtek 15:00.';
    $updateNoteRes = InquiryManager::updateInquiry($recorded['id'], ['addNote' => $noteText]);
    assertInquiryCondition($updateNoteRes['success'] === true, 'Successfully appends internal note');
    $notes = $updateNoteRes['inquiry']['notes'] ?? [];
    assertInquiryCondition(count($notes) === 1 && $notes[0]['text'] === $noteText, 'Internal note correctly stored with timestamp');

    // 5. CSV Export
    $csv = InquiryManager::exportCsv();
    assertInquiryCondition(!empty($csv), 'Generates CSV string');
    assertInquiryCondition(str_starts_with($csv, "\xEF\xBB\xBF"), 'CSV contains UTF-8 BOM for Excel compatibility');
    assertInquiryCondition(str_contains($csv, 'Novák') && str_contains($csv, 'Rekonstrukce'), 'CSV includes inquiry records');

    // 6. Delete inquiry
    $deleted = InquiryManager::deleteInquiry($recorded['id']);
    assertInquiryCondition($deleted === true, 'Successfully deletes inquiry');
    $listAfter = InquiryManager::listInquiries();
    assertInquiryCondition(empty(array_filter($listAfter, fn($i) => ($i['id'] ?? '') === $recorded['id'])), 'Inquiry removed from list');

    echo "\nAll InquiryManager tests PASSED successfully!\n\n";
} finally {
    // Restore original file
    if ($backupData !== null) {
        file_put_contents($inquiriesFile, $backupData);
    } else if (file_exists($inquiriesFile)) {
        @unlink($inquiriesFile);
    }
}
