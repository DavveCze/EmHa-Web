<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/ContentManager.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

$method = $_SERVER['REQUEST_METHOD'];

// Check active session
if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Neautorizovaný přístup. Přihlaste se prosím.']);
    exit;
}

if ($method === 'GET') {
    $data = ContentManager::load();
    echo json_encode([
        'success' => true,
        'data' => $data,
        'csrf' => Auth::getCsrfToken(),
    ]);
    exit;
}

if ($method === 'POST') {
    // CSRF verification on all mutations
    $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!Auth::validateCsrf($csrf)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Neplatný bezpečnostní CSRF token relace. Obnovte prosím stránku.']);
        exit;
    }

    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Neplatný formát JSON požadavku.']);
        exit;
    }

    $res = ContentManager::save($payload);
    if (!$res['success']) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => $res['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Obsah byl úspěšně a bezpečně uložen na web.',
        'data' => ContentManager::load(),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
