<?php
declare(strict_types=1);

/**
 * Automated Test Suite for MediaManager
 */

require_once __DIR__ . '/../admin/MediaManager.php';

function assertCondition(bool $cond, string $msg): void {
    if (!$cond) {
        echo "❌ FAILED: {$msg}\n";
        exit(1);
    }
    echo "✓ PASSED: {$msg}\n";
}

echo "\n--- Running EmHa CMS Media Manager Tests ---\n\n";

// 1. Sanitize slug test
$slug = MediaManager::sanitizeSlug('Rekonstrukce bytu v Ostravě - 1. etapa!');
assertCondition($slug === 'rekonstrukce-bytu-v-ostrave-1-etapa', 'Correctly sanitizes and transliterates filename slug');

// 2. Reject non-uploaded file or missing file
$invalidUpload = MediaManager::upload([
    'name' => 'malicious.php',
    'type' => 'text/php',
    'tmp_name' => '',
    'error' => UPLOAD_ERR_NO_FILE,
    'size' => 0,
]);
assertCondition($invalidUpload['success'] === false, 'Rejects invalid or empty file upload');

// 3. Mock valid PNG file test
$tmpFile = tempnam(sys_get_temp_dir(), 'test_img_');
// Valid 1x1 transparent PNG byte string
$pngBytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
file_put_contents($tmpFile, $pngBytes);

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string)$finfo->file($tmpFile);
assertCondition($mime === 'image/png', 'Test file generated with valid image/png MIME');

// Test metadata indexing directly
$testItem = [
    'id' => 'test1234',
    'filename' => 'test-img.png',
    'url' => '/uploads/test-img.png',
    'alt' => 'Testovací fotka rozvaděče',
    'title' => 'Rozvaděč Poruba',
    'mime' => 'image/png',
    'size' => 1024,
    'width' => 800,
    'height' => 600,
    'uploadedAt' => time(),
];

// Write test item to metadata
$metaFile = MediaManager::METADATA_FILE;
$origContent = file_exists($metaFile) ? file_get_contents($metaFile) : '[]';
file_put_contents($metaFile, json_encode([$testItem]), LOCK_EX);

// Test listMedia
$list = MediaManager::listMedia();
assertCondition(count($list) >= 1 && $list[0]['id'] === 'test1234', 'Indexes and lists media items correctly');

// Test updateMetadata
$updateRes = MediaManager::updateMetadata('test1234', 'Upravený ALT popisek', 'Nový titulek');
assertCondition($updateRes['success'] === true, 'Successfully updates ALT tag and title');

$updatedList = MediaManager::listMedia();
assertCondition($updatedList[0]['alt'] === 'Upravený ALT popisek', 'Persists updated ALT tag to JSON index');

// Test delete
$delRes = MediaManager::delete('test1234');
assertCondition($delRes['success'] === true, 'Removes item from media index');

$emptyList = MediaManager::listMedia();
assertCondition(count($emptyList) === 0, 'Item successfully deleted from index');

// Test SVG sanitization
$safeSvg = tempnam(sys_get_temp_dir(), 'safe_svg_');
file_put_contents($safeSvg, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>');
assertCondition(MediaManager::sanitizeSvg($safeSvg) === true, 'Allows clean well-formed SVG without scripts');
@unlink($safeSvg);

$xssSvg = tempnam(sys_get_temp_dir(), 'xss_svg_');
file_put_contents($xssSvg, '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert("xss")</script></svg>');
assertCondition(MediaManager::sanitizeSvg($xssSvg) === false, 'Rejects SVG containing script or onload event handler');
assertCondition(!file_exists($xssSvg), 'Automatically unlinks rejected malicious SVG file');

echo "\nAll MediaManager tests PASSED successfully!\n\n";
