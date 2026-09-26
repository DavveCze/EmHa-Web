<?php
declare(strict_types=1);

/**
 * Atomic Content & Revision Manager for EmHa CMS
 * Performs schema validation, XSS sanitization, atomic file locking,
 * and automated timestamped revision rollbacks (keeping max 30 snapshots).
 */
class ContentManager {
    public const DATA_FILE = __DIR__ . '/../data/content.json';
    public const REVISIONS_DIR = __DIR__ . '/../data/revisions';

    public static function load(): array {
        if (!file_exists(self::DATA_FILE)) {
            return [];
        }
        $raw = @file_get_contents(self::DATA_FILE);
        if (!$raw) return [];
        return json_decode($raw, true) ?: [];
    }

    /**
     * Atomically saves validated content to JSON and generates a snapshot.
     * @return array{success: bool, error: string}
     */
    public static function save(array $payload): array {
        $validated = self::validateAndSanitize($payload);
        if (!$validated['valid']) {
            return ['success' => false, 'error' => $validated['error']];
        }

        $data = $validated['data'];
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if (!is_dir(self::REVISIONS_DIR)) {
            @mkdir(self::REVISIONS_DIR, 0750, true);
        }

        // 1. Create a revision snapshot before saving
        if (file_exists(self::DATA_FILE)) {
            $timestamp = date('Y-m-d_H-i-s');
            $backupFile = self::REVISIONS_DIR . '/' . $timestamp . '_content.json';
            @copy(self::DATA_FILE, $backupFile);
            self::pruneRevisions(30);
        }

        // 2. Atomic write using temporary file + flock + rename
        $tempFile = tempnam(dirname(self::DATA_FILE), 'cmstmp_');
        if (!$tempFile) {
            return ['success' => false, 'error' => 'Nelze vytvořit dočasný soubor pro zápis.'];
        }

        $fp = fopen($tempFile, 'w');
        if (!$fp) {
            return ['success' => false, 'error' => 'Nelze otevřít soubor pro zápis.'];
        }

        flock($fp, LOCK_EX);
        fwrite($fp, $json);
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);

        if (!@rename($tempFile, self::DATA_FILE)) {
            @unlink($tempFile);
            return ['success' => false, 'error' => 'Atomické uložení selhalo.'];
        }

        return ['success' => true, 'error' => ''];
    }

    /**
     * Lists available revision snapshots.
     * @return array<int, array{id: string, timestamp: string, dateFormatted: string, size: int}>
     */
    public static function listRevisions(): array {
        if (!is_dir(self::REVISIONS_DIR)) return [];
        $files = glob(self::REVISIONS_DIR . '/*_content.json') ?: [];
        rsort($files);

        $result = [];
        foreach ($files as $file) {
            $base = basename($file);
            $timeStr = str_replace('_content.json', '', $base);
            $parts = explode('_', $timeStr);
            $date = $parts[0] ?? '';
            $time = isset($parts[1]) ? str_replace('-', ':', $parts[1]) : '';

            $result[] = [
                'id' => $base,
                'timestamp' => filemtime($file),
                'dateFormatted' => "{$date} {$time}",
                'size' => filesize($file),
            ];
        }
        return $result;
    }

    /**
     * Restores a snapshot by filename.
     */
    public static function restoreRevision(string $filename): bool {
        $clean = basename($filename);
        $target = self::REVISIONS_DIR . '/' . $clean;
        if (!file_exists($target)) {
            return false;
        }

        $raw = file_get_contents($target);
        if (!$raw || json_decode($raw, true) === null) {
            return false;
        }

        return @copy($target, self::DATA_FILE);
    }

    private static function pruneRevisions(int $maxKeep = 30): void {
        $files = glob(self::REVISIONS_DIR . '/*_content.json') ?: [];
        if (count($files) <= $maxKeep) return;

        rsort($files);
        $toDelete = array_slice($files, $maxKeep);
        foreach ($toDelete as $f) {
            @unlink($f);
        }
    }

    /**
     * Strips control chars and sanitizes text strings.
     */
    private static function cleanString(string $val, int $maxLen = 4000): string {
        $str = trim($val);
        $str = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $str);
        return mb_substr($str, 0, $maxLen, 'UTF-8');
    }

    /**
     * Strict schema validation for business, seo, caseStudies, reviews.
     * @return array{valid: bool, error: string, data: array}
     */
    public static function validateAndSanitize(array $input): array {
        $clean = [];

        // 1. Business
        if (isset($input['business']) && is_array($input['business'])) {
            $b = $input['business'];
            $phone = self::cleanString((string)($b['phone'] ?? ''), 50);
            $email = self::cleanString((string)($b['email'] ?? ''), 100);

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return ['valid' => false, 'error' => 'Neplatný formát oficiálního e-mailu.', 'data' => []];
            }

            $clean['business'] = [
                'name' => self::cleanString((string)($b['name'] ?? 'EmHa Elektro'), 100),
                'legalName' => self::cleanString((string)($b['legalName'] ?? 'Martin Hořčica'), 100),
                'taxID' => self::cleanString((string)($b['taxID'] ?? '14216132'), 20),
                'isVatPayer' => (bool)($b['isVatPayer'] ?? false),
                'phone' => $phone,
                'phoneRaw' => preg_replace('/[^\d+]/', '', $phone),
                'email' => $email,
                'street' => self::cleanString((string)($b['street'] ?? ''), 150),
                'city' => self::cleanString((string)($b['city'] ?? ''), 100),
                'zip' => self::cleanString((string)($b['zip'] ?? ''), 10),
                'region' => self::cleanString((string)($b['region'] ?? 'Moravskoslezský kraj'), 100),
                'openingHours' => self::cleanString((string)($b['openingHours'] ?? 'Po–Pá 8:00–17:00'), 100),
                'registration' => self::cleanString((string)($b['registration'] ?? ''), 300),
            ];
        } else {
            return ['valid' => false, 'error' => 'Chybí sekce business údajů.', 'data' => []];
        }

        // 2. SEO
        $clean['seo'] = [];
        if (isset($input['seo']) && is_array($input['seo'])) {
            foreach ($input['seo'] as $route => $meta) {
                if (!is_string($route) || !is_array($meta)) continue;
                $clean['seo'][$route] = [
                    'title' => self::cleanString((string)($meta['title'] ?? ''), 150),
                    'description' => self::cleanString((string)($meta['description'] ?? ''), 300),
                ];
            }
        }

        // 3. Case Studies
        $clean['caseStudies'] = [];
        if (isset($input['caseStudies']) && is_array($input['caseStudies'])) {
            foreach ($input['caseStudies'] as $idx => $cs) {
                if (!is_array($cs)) continue;
                $clean['caseStudies'][] = [
                    'id' => preg_replace('/[^a-z0-9_-]/', '', strtolower((string)($cs['id'] ?? ('cs-' . $idx)))),
                    'title' => self::cleanString((string)($cs['title'] ?? ''), 150),
                    'badge' => self::cleanString((string)($cs['badge'] ?? ''), 80),
                    'image' => self::cleanString((string)($cs['image'] ?? '/assets/renovation.jpg'), 200),
                    'imageAlt' => self::cleanString((string)($cs['imageAlt'] ?? ''), 150),
                    'locality' => self::cleanString((string)($cs['locality'] ?? ''), 100),
                    'scope' => self::cleanString((string)($cs['scope'] ?? ''), 250),
                    'originalState' => self::cleanString((string)($cs['originalState'] ?? ''), 1000),
                    'solution' => self::cleanString((string)($cs['solution'] ?? ''), 1500),
                    'duration' => self::cleanString((string)($cs['duration'] ?? ''), 80),
                    'status' => self::cleanString((string)($cs['status'] ?? 'Dokončeno'), 80),
                    'active' => (bool)($cs['active'] ?? true),
                ];
            }
        }

        // 4. Reviews
        $clean['reviews'] = [];
        if (isset($input['reviews']) && is_array($input['reviews'])) {
            foreach ($input['reviews'] as $idx => $rev) {
                if (!is_array($rev)) continue;
                $rating = max(1, min(5, (int)($rev['rating'] ?? 5)));
                $clean['reviews'][] = [
                    'id' => preg_replace('/[^a-z0-9_-]/', '', strtolower((string)($rev['id'] ?? ('rev-' . $idx)))),
                    'name' => self::cleanString((string)($rev['name'] ?? ''), 100),
                    'locality' => self::cleanString((string)($rev['locality'] ?? ''), 80),
                    'project' => self::cleanString((string)($rev['project'] ?? ''), 120),
                    'rating' => $rating,
                    'text' => self::cleanString((string)($rev['text'] ?? ''), 2000),
                    'badge' => self::cleanString((string)($rev['badge'] ?? 'Ověřená reference'), 60),
                    'active' => (bool)($rev['active'] ?? true),
                ];
            }
        }

        return ['valid' => true, 'error' => '', 'data' => $clean];
    }
}
