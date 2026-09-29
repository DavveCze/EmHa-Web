<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/ContentManager.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if (!Auth::check()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Neautorizovaný přístup.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $revisions = ContentManager::listRevisions();
    echo json_encode([
        'success' => true,
        'revisions' => $revisions,
    ]);
    exit;
}

if ($method === 'POST') {
    $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!Auth::validateCsrf($csrf)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Neplatný CSRF token.']);
        exit;
    }

    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
    $revId = (string)($input['revisionId'] ?? '');

    if (empty($revId) || !ContentManager::restoreRevision($revId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Požadovanou revizi se nepodařilo obnovit.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Předchozí verze byla úspěšně obnovena na web.',
        'data' => ContentManager::load(),
        'revisions' => ContentManager::listRevisions(),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
