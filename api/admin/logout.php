<?php
declare(strict_types=1);

require_once __DIR__ . '/Auth.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

Auth::logout();

echo json_encode([
    'success' => true,
    'message' => 'Odhlášení proběhlo úspěšně.',
]);
