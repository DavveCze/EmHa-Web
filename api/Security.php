<?php
declare(strict_types=1);

/**
 * Security, Anti-Abuse and Geo-Validation Service for EmHa Elektro
 */
class Security {
    public const ALLOWED_SERVICES = [
        'elektroinstalace' => 'Elektroinstalace',
        'rekonstrukce' => 'Rekonstrukce',
        'zabezpeceni-a-automatizace' => 'Zabezpečení a automatizace',
        'na-co-myslet-pri-rekonstrukcich' => 'Konzultace před rekonstrukcí',
        'opravy-a-servis' => 'Opravy a servis',
        'data-a-slaboproud' => 'Data a slaboproud',
        'jine' => 'Jiný požadavek',
    ];

    /**
     * Resolves client IP address safely, checking trusted headers.
     */
    public static function getClientIp(): string {
        // Cloudflare real IP
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cfIp = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) {
                return $cfIp;
            }
        }

        // Standard remote address
        $remote = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : '127.0.0.1';
    }

    /**
     * Checks if IP is localhost, loopback or private network.
     */
    public static function isLocalOrPrivateIp(string $ip): bool {
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }

        // Return true if it fails the "NO_PRIV_RANGE" check (meaning it IS private)
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }

    /**
     * Validates that visitor is located in the Czech Republic or submitting with Czech credentials.
     * @return array{allowed: bool, reason: string, country: string}
     */
    public static function verifyCzechVisitor(string $ip, string $contact): array {
        // 1. Phone number check: reject foreign international phone numbers
        $cleanPhone = preg_replace('/[^\d+]/', '', $contact);
        if ($cleanPhone !== null && str_starts_with($cleanPhone, '+')) {
            if (!str_starts_with($cleanPhone, '+420')) {
                return [
                    'allowed' => false,
                    'reason' => 'Poptávky přijímáme pouze pro realizace v ČR (zadána zahraniční telefonní předvolba).',
                    'country' => 'Foreign Phone',
                ];
            }
        }

        // 2. Allow localhost and internal development environments
        if (self::isLocalOrPrivateIp($ip)) {
            return ['allowed' => true, 'reason' => '', 'country' => 'CZ (Local/Dev)'];
        }

        // 3. Check standard proxy/CDN geo headers
        $geoHeaders = ['HTTP_CF_IPCOUNTRY', 'HTTP_X_COUNTRY_CODE', 'HTTP_GEOIP_COUNTRY_CODE'];
        foreach ($geoHeaders as $hdr) {
            if (!empty($_SERVER[$hdr])) {
                $hdrCountry = strtoupper(trim($_SERVER[$hdr]));
                if ($hdrCountry === 'CZ') {
                    return ['allowed' => true, 'reason' => '', 'country' => 'CZ'];
                }
                if ($hdrCountry !== 'XX' && $hdrCountry !== 'T1' && strlen($hdrCountry) === 2) {
                    return [
                        'allowed' => false,
                        'reason' => 'Poptávkový formulář je dostupný pouze pro návštěvníky z České republiky.',
                        'country' => $hdrCountry,
                    ];
                }
            }
        }

        // 4. Priority check: If contact is a valid CZ phone (+420 or 9 digits) or Czech email (.cz),
        // allow immediately without wasting time on external HTTP lookups
        if (self::isCzechContact($contact)) {
            return ['allowed' => true, 'reason' => '', 'country' => 'CZ (Verified Contact)'];
        }

        // 5. Fallback lookup via IP Geolocation API with local file caching for ambiguous contacts
        $country = self::lookupIpCountry($ip);
        if ($country !== null) {
            if ($country === 'CZ') {
                return ['allowed' => true, 'reason' => '', 'country' => 'CZ'];
            }
            return [
                'allowed' => false,
                'reason' => 'Poptávkový formulář je dostupný pouze pro návštěvníky z České republiky.',
                'country' => $country,
            ];
        }

        return ['allowed' => true, 'reason' => '', 'country' => 'CZ (Default)'];
    }

    /**
     * Checks if contact is a Czech phone (+420 or 9 digits) or ends in .cz
     */
    public static function isCzechContact(string $contact): bool {
        $v = trim($contact);
        $digits = preg_replace('/\D/', '', $v);
        
        // Czech phone: either 9 digits (standard CZ mobile/landline) or 12 digits starting with 420
        if (strlen($digits) === 9) {
            return true;
        }
        if (strlen($digits) === 12 && str_starts_with($digits, '420')) {
            return true;
        }

        // Czech email
        if (filter_var($v, FILTER_VALIDATE_EMAIL)) {
            return str_ends_with(strtolower($v), '.cz');
        }

        return false;
    }

    /**
     * Look up country code using a lightweight cache and fast HTTP query.
     */
    private static function lookupIpCountry(string $ip): ?string {
        $cacheFile = sys_get_temp_dir() . '/emha_geo_' . md5($ip) . '.json';
        
        // Cache for 24 hours
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400)) {
            $cached = @file_get_contents($cacheFile);
            if ($cached) {
                $data = json_decode($cached, true);
                if (!empty($data['country'])) {
                    return $data['country'];
                }
            }
        }

        // Fast query to ip-api.com with 0.8s timeout
        $url = 'http://ip-api.com/json/' . urlencode($ip) . '?fields=status,countryCode';
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 0.8,
                'ignore_errors' => true,
                'user_agent' => 'EmHa-GeoChecker/1.0',
            ],
        ]);

        $response = @file_get_contents($url, false, $ctx);
        if ($response) {
            $data = json_decode($response, true);
            if (!empty($data['status']) && $data['status'] === 'success' && !empty($data['countryCode'])) {
                $code = strtoupper($data['countryCode']);
                @file_put_contents($cacheFile, json_encode(['country' => $code]));
                return $code;
            }
        }

        return null;
    }

    /**
     * File-locked Rate Limiter preventing spam attacks and DDoS.
     * Default: Max 3 requests per 10 minutes per IP; max 30 requests/hour globally.
     * @return array{allowed: bool, retryAfter: int}
     */
    public static function checkRateLimit(
        string $ip,
        int $maxPerIp = 3,
        int $ipPeriod = 600,
        int $maxGlobal = 30,
        int $globalPeriod = 3600
    ): array {
        // Skip rate limit in CLI unit tests if requested
        if (getenv('DISABLE_RATE_LIMIT') === '1') {
            return ['allowed' => true, 'retryAfter' => 0];
        }

        $lockPath = sys_get_temp_dir() . '/emha_ratelimit.json';
        $fp = @fopen($lockPath, 'c+');
        if (!$fp) {
            // If temp file cannot be opened, permit request rather than failing client
            return ['allowed' => true, 'retryAfter' => 0];
        }

        if (!flock($fp, LOCK_EX)) {
            fclose($fp);
            return ['allowed' => true, 'retryAfter' => 0];
        }

        $now = time();
        $fileSize = filesize($lockPath);
        $records = [];
        if ($fileSize > 0) {
            $raw = fread($fp, $fileSize);
            $decoded = json_decode($raw ?: '', true);
            if (is_array($decoded)) {
                $records = $decoded;
            }
        }

        // Purge records older than global period
        $activeRecords = [];
        $ipCount = 0;
        $globalCount = 0;
        $oldestForIp = null;

        foreach ($records as $entry) {
            $entryTime = (int)($entry['t'] ?? 0);
            $entryIp = (string)($entry['ip'] ?? '');

            if ($now - $entryTime < $globalPeriod) {
                $activeRecords[] = $entry;
                $globalCount++;
            }

            if ($entryIp === $ip && ($now - $entryTime < $ipPeriod)) {
                $ipCount++;
                if ($oldestForIp === null || $entryTime < $oldestForIp) {
                    $oldestForIp = $entryTime;
                }
            }
        }

        // IP limit check
        if ($ipCount >= $maxPerIp) {
            $retryAfter = max(1, ($oldestForIp !== null ? ($oldestForIp + $ipPeriod - $now) : $ipPeriod));
            flock($fp, LOCK_UN);
            fclose($fp);
            return ['allowed' => false, 'retryAfter' => $retryAfter];
        }

        // Global limit check
        if ($globalCount >= $maxGlobal) {
            flock($fp, LOCK_UN);
            fclose($fp);
            return ['allowed' => false, 'retryAfter' => 300];
        }

        // Register new entry
        $activeRecords[] = ['ip' => $ip, 't' => $now];
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($activeRecords));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        return ['allowed' => true, 'retryAfter' => 0];
    }

    /**
     * Checks honeypot trap and minimum form fill timing.
     * @return array{isSpam: bool, reason: string}
     */
    public static function checkSpamTraps(array $input): array {
        // 1. Honeypot check: field must remain completely empty
        if (!empty($input['_hp_company'])) {
            return ['isSpam' => true, 'reason' => 'Honeypot filled'];
        }

        // 2. Timing check: form must take at least 3 seconds to fill (humans need >= 3s)
        $formTime = (int)($input['_form_time'] ?? 0);
        if ($formTime > 0) {
            $elapsed = time() - $formTime;
            // Less than 3 seconds or timestamp older than 72 hours (259200s)
            if ($elapsed < 3 || $elapsed > 259200) {
                return ['isSpam' => true, 'reason' => 'Timing threshold violation (' . $elapsed . 's)'];
            }
        }

        return ['isSpam' => false, 'reason' => ''];
    }

    /**
     * Validates and sanitizes submitted form data.
     * @return array{valid: bool, errors: array<string, string>, data: array<string, string>}
     */
    public static function validateAndSanitize(array $raw): array {
        $errors = [];
        $sanitized = [];

        // 1. Surname / Name
        $surname = trim((string)($raw['surname'] ?? ''));
        $surname = preg_replace('/[\p{C}]+/u', '', $surname); // Remove control characters
        if (mb_strlen($surname) < 2) {
            $errors['surname'] = 'Zadejte prosím své příjmení nebo jméno (alespoň 2 znaky).';
        } elseif (mb_strlen($surname) > 100) {
            $errors['surname'] = 'Příjmení může mít maximálně 100 znaků.';
        }
        $sanitized['surname'] = $surname;

        // 2. Contact (email or phone)
        $contact = trim((string)($raw['contact'] ?? ''));
        $contact = preg_replace('/[\p{C}]+/u', '', $contact);
        $isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false;
        $digitsOnly = preg_replace('/\D/', '', $contact);
        $isPhone = (strlen($digitsOnly) >= 9 && strlen($digitsOnly) <= 15);

        if (!$isEmail && !$isPhone) {
            $errors['contact'] = 'Zadejte platný e-mail nebo telefonní číslo (alespoň 9 číslic).';
        } elseif (mb_strlen($contact) > 150) {
            $errors['contact'] = 'Kontaktní údaj je příliš dlouhý (max. 150 znaků).';
        }
        $sanitized['contact'] = $contact;

        // 3. Service
        $service = trim((string)($raw['service'] ?? ''));
        if (empty($service) || !array_key_exists($service, self::ALLOWED_SERVICES)) {
            $errors['service'] = 'Vyberte prosím platnou službu z nabídky.';
            $sanitized['service'] = 'jine';
            $sanitized['serviceLabel'] = 'Jiný požadavek';
        } else {
            $sanitized['service'] = $service;
            $sanitized['serviceLabel'] = self::ALLOWED_SERVICES[$service];
        }

        // 4. Message
        $message = trim((string)($raw['message'] ?? ''));
        $message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $message); // Remove non-printable control chars, keep newlines
        if (mb_strlen($message) < 10) {
            $errors['message'] = 'Popište prosím stručně svou poptávku (alespoň 10 znaků).';
        } elseif (mb_strlen($message) > 4000) {
            $errors['message'] = 'Popis poptávky může mít maximálně 4 000 znaků.';
        }
        $sanitized['message'] = $message;

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'data' => $sanitized,
        ];
    }
}
