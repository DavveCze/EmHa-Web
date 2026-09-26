<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/../Security.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true) ?: [];

$username = (string)($input['username'] ?? '');
$password = (string)($input['password'] ?? '');
$ip = Security::getClientIp();

$result = Auth::login($username, $password, $ip);

if (!$result['success']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => $result['error']]);
    exit;
}

echo json_encode([
    'success' => true,
    'csrf' => $result['csrf'],
    'message' => 'Přihlášení bylo úspěšné.',
]);
