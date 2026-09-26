<?php
declare(strict_types=1);

/**
 * Local Development Server Router for EmHa PHP API
 * Routes requests to the appropriate PHP script in api/
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '';

// Normalize /api/contact or /api/contact.php
if ($uri === '/api/contact' || $uri === '/api/contact.php') {
    require __DIR__ . '/contact.php';
    exit;
}

if ($uri === '/api/content' || $uri === '/api/content.php') {
    require __DIR__ . '/content.php';
    exit;
}

if ($uri === '/api/admin/login' || $uri === '/api/admin/login.php') {
    require __DIR__ . '/admin/login.php';
    exit;
}

if ($uri === '/api/admin/logout' || $uri === '/api/admin/logout.php') {
    require __DIR__ . '/admin/logout.php';
    exit;
}

if ($uri === '/api/admin/content' || $uri === '/api/admin/content.php') {
    require __DIR__ . '/admin/content.php';
    exit;
}

if ($uri === '/api/admin/revisions' || $uri === '/api/admin/revisions.php') {
    require __DIR__ . '/admin/revisions.php';
    exit;
}

if ($uri === '/api/admin/media' || $uri === '/api/admin/media.php') {
    require __DIR__ . '/admin/media.php';
    exit;
}

// If file exists directly in api/, serve it
$file = __DIR__ . str_replace('/api', '', $uri);
if (file_exists($file) && !is_dir($file) && str_ends_with($file, '.php')) {
    require $file;
    exit;
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'API endpoint not found: ' . $uri]);
