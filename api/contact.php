<?php
declare(strict_types=1);

/**
 * Public Contact / Inquiry Endpoint for EmHa Elektro
 * POST /api/contact.php
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Handle preflight CORS OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    http_response_code(204);
    exit;
}

// Reject non-POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Metoda není povolena. Povolena je pouze metoda POST.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Enforce max payload limit (32 KB)
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 32768) {
    http_response_code(413);
    echo json_encode([
        'success' => false,
        'error' => 'Požadavek je příliš velký (max. 32 KB).',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/Security.php';
require_once __DIR__ . '/Mailer.php';
if (file_exists(__DIR__ . '/admin/InquiryManager.php')) {
    require_once __DIR__ . '/admin/InquiryManager.php';
}

// Parse JSON or form data
$rawBody = file_get_contents('php://input');
$input = [];
if (!empty($rawBody)) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
if (empty($input) && !empty($_POST)) {
    $input = $_POST;
}

// 1. Anti-bot honeypot and time-trap check
$spamCheck = Security::checkSpamTraps($input);
if ($spamCheck['isSpam']) {
    // Return silent success to avoid teaching bots how to bypass
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Děkujeme za Vaši poptávku. Ozveme se Vám co nejdříve.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Client IP & Rate Limiting
$clientIp = Security::getClientIp();
$rateCheck = Security::checkRateLimit($clientIp);
if (!$rateCheck['allowed']) {
    http_response_code(429);
    header('Retry-After: ' . $rateCheck['retryAfter']);
    echo json_encode([
        'success' => false,
        'error' => 'Příliš mnoho odeslaných požadavků. Počkejte prosím několik minut a zkuste to znovu.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Czech Visitor Verification (Geo check + contact format)
$contactValue = (string)($input['contact'] ?? '');
$geoCheck = Security::verifyCzechVisitor($clientIp, $contactValue);
if (!$geoCheck['allowed']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => $geoCheck['reason'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Input Validation & Sanitization
$validation = Security::validateAndSanitize($input);
if (!$validation['valid']) {
    http_response_code(400);
    $firstError = reset($validation['errors']) ?: 'Zkontrolujte prosím zadané údaje.';
    echo json_encode([
        'success' => false,
        'error' => $firstError,
        'errors' => $validation['errors'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 5. Send Emails via Mailer
$mailer = new Mailer();
$data = $validation['data'];
$data['ip'] = $clientIp;
$data['country'] = $geoCheck['country'];
$data['referrer'] = $_SERVER['HTTP_REFERER'] ?? 'Webové stránky EmHa';

try {
    // 5. Persist inquiry into CRM database if InquiryManager is available (CMS mode)
    if (class_exists('InquiryManager')) {
        try {
            InquiryManager::recordInquiry($data);
        } catch (Throwable $e) {
            error_log('EmHa contact.php: Failed to record inquiry in InquiryManager: ' . $e->getMessage());
        }
    }

    $adminSent = $mailer->sendAdminNotification($data);

    // If client provided a valid email, send auto-confirmation
    if (filter_var($data['contact'], FILTER_VALIDATE_EMAIL)) {
        @$mailer->sendClientConfirmation($data['contact'], $data);
    }

    if (!$adminSent) {
        error_log('EmHa contact.php: mailer returned false for admin notification.');
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Děkujeme za Vaši poptávku! Úspěšně jsme ji přijali a brzy se Vám ozveme.',
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('EmHa contact.php exception: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Omlouváme se, při odesílání došlo k technické chybě. Kontaktujte nás prosím přímo na telefonu nebo e-mailu.',
    ], JSON_UNESCAPED_UNICODE);
}
