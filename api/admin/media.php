<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/MediaManager.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Neautorizovaný přístup.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: list all uploaded media
if ($method === 'GET') {
    $items = MediaManager::listMedia();
    echo json_encode([
        'success' => true,
        'media' => $items,
    ]);
    exit;
}

// All write operations require CSRF check
$csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
if (!Auth::validateCsrf($csrf)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Neplatný CSRF token.']);
    exit;
}

// POST: upload new file
if ($method === 'POST') {
    $file = $_FILES['file'] ?? null;
    $alt = (string)($_POST['alt'] ?? '');
    $title = (string)($_POST['title'] ?? '');

    if (!$file) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Nebyl odeslán žádný soubor.']);
        exit;
    }

    $result = MediaManager::upload($file, $alt, $title);
    if (!$result['success']) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => $result['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Obrázek byl úspěšně nahrán.',
        'item' => $result['item'],
    ]);
    exit;
}

// PATCH / PUT: update metadata (alt tag, title)
if ($method === 'PATCH' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
    $id = (string)($input['id'] ?? '');
    $alt = (string)($input['alt'] ?? '');
    $title = (string)($input['title'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Chybí ID obrázku.']);
        exit;
    }

    $result = MediaManager::updateMetadata($id, $alt, $title);
    if (!$result['success']) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => $result['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Popisek obrázku byl upraven.',
    ]);
    exit;
}

// DELETE: remove image
if ($method === 'DELETE') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
    $id = (string)($input['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Chybí ID obrázku.']);
        exit;
    }

    $result = MediaManager::delete($id);
    if (!$result['success']) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => $result['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Obrázek byl smazán.',
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
