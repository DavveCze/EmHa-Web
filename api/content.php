<?php
declare(strict_types=1);

/**
 * Public Content Endpoint
 * Serves active content with HTTP 304 ETag caching for fast, bandwidth-friendly loading.
 */

require_once __DIR__ . '/admin/ContentManager.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');

$data = ContentManager::load();
$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$etag = md5($json);

header('ETag: "' . $etag . '"');
header('Cache-Control: public, max-age=10, must-revalidate');

$clientEtag = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? preg_replace('/^W\//', '', trim($_SERVER['HTTP_IF_NONE_MATCH'], ' "')) : null;
if (!isset($_GET['t']) && $clientEtag === $etag) {
    http_response_code(304);
    exit;
}

echo $json;
