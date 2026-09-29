<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/InquiryManager.php';

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Check active session
if (!Auth::check()) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Neautorizovaný přístup. Přihlaste se prosím.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle CSV Export
if ($method === 'GET' && isset($_GET['export']) && $_GET['export'] === 'csv') {
    $csv = InquiryManager::exportCsv();
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="poptavky_emha_' . date('Y-m-d') . '.csv"');
    header('Pragma: no-cache');
    header('Expires: 0');
    echo $csv;
    exit;
}

header('Content-Type: application/json; charset=UTF-8');

// GET List of Inquiries
if ($method === 'GET') {
    $list = InquiryManager::listInquiries();
    $newCount = count(array_filter($list, fn($i) => ($i['status'] ?? 'new') === 'new'));

    echo json_encode([
        'success' => true,
        'data' => $list,
        'newCount' => $newCount,
        'csrf' => Auth::getCsrfToken(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// POST - Update status or add note
if ($method === 'POST') {
    $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!Auth::validateCsrf($csrf)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Neplatný bezpečnostní CSRF token relace. Obnovte prosím stránku.']);
        exit;
    }

    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!is_array($payload) || empty($payload['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Chybí ID poptávky.']);
        exit;
    }

    $res = InquiryManager::updateInquiry((string)$payload['id'], $payload);
    if (!$res['success']) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => $res['error']]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Poptávka byla úspěšně aktualizována.',
        'inquiry' => $res['inquiry'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// DELETE - Remove inquiry
if ($method === 'DELETE') {
    $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!Auth::validateCsrf($csrf)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Neplatný bezpečnostní CSRF token relace. Obnovte prosím stránku.']);
        exit;
    }

    $id = (string)($_GET['id'] ?? '');
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Chybí ID poptávky ke smazání.']);
        exit;
    }

    $deleted = InquiryManager::deleteInquiry($id);
    if (!$deleted) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Chyba při mazání poptávky ze souboru.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Poptávka byla odstraněna.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
