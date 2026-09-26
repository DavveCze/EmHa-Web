<?php
declare(strict_types=1);

/**
 * Authentication & Session Guard for EmHa CMS
 * Provides Argon2id/Bcrypt validation, HttpOnly SameSite cookie sessions,
 * CSRF token management, and brute-force IP rate limiting.
 */
class Auth {
    private const CONFIG_FILE = __DIR__ . '/../data/config.php';
    private const SESSIONS_DIR = __DIR__ . '/../data/sessions';
    private const ATTEMPTS_FILE = __DIR__ . '/../data/login_attempts.json';
    private const COOKIE_NAME = 'emha_admin_session';

    public static function init(): void {
        if (!is_dir(self::SESSIONS_DIR)) {
            @mkdir(self::SESSIONS_DIR, 0750, true);
        }
    }

    /**
     * Verifies if user has a valid active session.
     */
    public static function check(): bool {
        self::init();
        $token = $_COOKIE[self::COOKIE_NAME] ?? null;
        if (!$token || !preg_match('/^[a-f0-9]{64}$/', $token)) {
            return false;
        }

        $sessionFile = self::SESSIONS_DIR . '/' . $token . '.json';
        if (!file_exists($sessionFile)) {
            return false;
        }

        $data = @json_decode((string)file_get_contents($sessionFile), true);
        if (!$data || empty($data['expires']) || $data['expires'] < time()) {
            @unlink($sessionFile);
            return false;
        }

        // Sliding expiration (extend by 2 hours)
        $data['expires'] = time() + 7200;
        @file_put_contents($sessionFile, json_encode($data));
        return true;
    }

    /**
     * Returns the CSRF token for the active session.
     */
    public static function getCsrfToken(): ?string {
        $token = $_COOKIE[self::COOKIE_NAME] ?? null;
        if (!$token || !preg_match('/^[a-f0-9]{64}$/', $token)) {
            return null;
        }

        $sessionFile = self::SESSIONS_DIR . '/' . $token . '.json';
        if (!file_exists($sessionFile)) {
            return null;
        }

        $data = @json_decode((string)file_get_contents($sessionFile), true);
        return $data['csrf'] ?? null;
    }

    /**
     * Validates incoming CSRF token against session token.
     */
    public static function validateCsrf(?string $submittedToken): bool {
        $validToken = self::getCsrfToken();
        if (!$validToken || empty($submittedToken)) {
            return false;
        }
        return hash_equals($validToken, $submittedToken);
    }

    /**
     * Attempt login with rate-limiting check.
     * @return array{success: bool, error: string, csrf: string}
     */
    public static function login(string $username, string $password, string $ip): array {
        self::init();

        // 1. Brute-force rate limit check (max 5 failed attempts per 15 min)
        if (self::isIpLocked($ip)) {
            return [
                'success' => false,
                'error' => 'Příliš mnoho neúspěšných pokusů o přihlášení. Zkuste to prosím za 15 minut.',
                'csrf' => '',
            ];
        }

        // 2. Load admin credentials from config
        if (!file_exists(self::CONFIG_FILE)) {
            return [
                'success' => false,
                'error' => 'Administrace ještě nebyla inicializována (spusťte setup.php).',
                'csrf' => '',
            ];
        }

        /** @var array{username: string, passwordHash: string} $config */
        $config = require self::CONFIG_FILE;

        $validUser = hash_equals($config['username'], trim($username));
        $validPass = password_verify($password, $config['passwordHash']);

        if (!$validUser || !$validPass) {
            self::recordFailedAttempt($ip);
            return [
                'success' => false,
                'error' => 'Neplatné uživatelské jméno nebo heslo.',
                'csrf' => '',
            ];
        }

        // Reset failed attempts on success
        self::clearFailedAttempts($ip);

        // 3. Create cryptographically secure session
        $sessionToken = bin2hex(random_bytes(32));
        $csrfToken = bin2hex(random_bytes(32));

        $sessionData = [
            'username' => $config['username'],
            'ip' => $ip,
            'created' => time(),
            'expires' => time() + 7200, // 2 hours
            'csrf' => $csrfToken,
        ];

        @file_put_contents(
            self::SESSIONS_DIR . '/' . $sessionToken . '.json',
            json_encode($sessionData),
            LOCK_EX
        );

        // 4. Set HttpOnly SameSite=Strict Secure cookie
        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (!empty($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
            || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

        if (!headers_sent()) {
            setcookie(self::COOKIE_NAME, $sessionToken, [
                'expires' => time() + 7200,
                'path' => '/',
                'domain' => '',
                'secure' => $isHttps,
                'httponly' => true,
                'samesite' => 'Strict',
            ]);
        }

        $_COOKIE[self::COOKIE_NAME] = $sessionToken;

        return [
            'success' => true,
            'error' => '',
            'csrf' => $csrfToken,
        ];
    }

    /**
     * Destroys current session and clears cookie.
     */
    public static function logout(): void {
        self::init();
        $token = $_COOKIE[self::COOKIE_NAME] ?? null;
        if ($token && preg_match('/^[a-f0-9]{64}$/', $token)) {
            $sessionFile = self::SESSIONS_DIR . '/' . $token . '.json';
            if (file_exists($sessionFile)) {
                @unlink($sessionFile);
            }
        }

        if (!headers_sent()) {
            setcookie(self::COOKIE_NAME, '', [
                'expires' => time() - 3600,
                'path' => '/',
                'samesite' => 'Strict',
            ]);
        }
        unset($_COOKIE[self::COOKIE_NAME]);
    }

    private static function isIpLocked(string $ip): bool {
        if (!file_exists(self::ATTEMPTS_FILE)) return false;
        $attempts = @json_decode((string)file_get_contents(self::ATTEMPTS_FILE), true);
        if (!$attempts || !isset($attempts[$ip])) return false;

        $record = $attempts[$ip];
        if (time() - $record['lastAttempt'] > 900) {
            return false; // Lockout expired after 15 min
        }
        return ($record['count'] >= 5);
    }

    private static function recordFailedAttempt(string $ip): void {
        $attempts = [];
        if (file_exists(self::ATTEMPTS_FILE)) {
            $attempts = @json_decode((string)file_get_contents(self::ATTEMPTS_FILE), true) ?: [];
        }

        $now = time();
        // Clean records older than 1 hour
        foreach ($attempts as $k => $v) {
            if ($now - $v['lastAttempt'] > 3600) unset($attempts[$k]);
        }

        if (!isset($attempts[$ip]) || ($now - $attempts[$ip]['lastAttempt'] > 900)) {
            $attempts[$ip] = ['count' => 1, 'lastAttempt' => $now];
        } else {
            $attempts[$ip]['count']++;
            $attempts[$ip]['lastAttempt'] = $now;
        }

        @file_put_contents(self::ATTEMPTS_FILE, json_encode($attempts), LOCK_EX);
    }

    private static function clearFailedAttempts(string $ip): void {
        if (!file_exists(self::ATTEMPTS_FILE)) return;
        $attempts = @json_decode((string)file_get_contents(self::ATTEMPTS_FILE), true) ?: [];
        if (isset($attempts[$ip])) {
            unset($attempts[$ip]);
            @file_put_contents(self::ATTEMPTS_FILE, json_encode($attempts), LOCK_EX);
        }
    }
}
