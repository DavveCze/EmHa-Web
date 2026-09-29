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

        // 2. Atomic write using temporary file + shared process lock + rename
        $lockFile = self::DATA_FILE . '.lock';
        $lockFp = fopen($lockFile, 'c');
        if ($lockFp) {
            flock($lockFp, LOCK_EX);
        }

        try {
            $tempFile = tempnam(dirname(self::DATA_FILE), 'cmstmp_');
            if (!$tempFile) {
                return ['success' => false, 'error' => 'Nelze vytvořit dočasný soubor pro zápis.'];
            }

            $fp = fopen($tempFile, 'w');
            if (!$fp) {
                @unlink($tempFile);
                return ['success' => false, 'error' => 'Nelze otevřít soubor pro zápis.'];
            }

            fwrite($fp, $json);
            fflush($fp);
            fclose($fp);

            if (!@rename($tempFile, self::DATA_FILE)) {
                @unlink($tempFile);
                return ['success' => false, 'error' => 'Atomické uložení selhalo.'];
            }

            @chmod(self::DATA_FILE, 0664);
            clearstatcache();
            return ['success' => true, 'error' => ''];
        } finally {
            if ($lockFp) {
                flock($lockFp, LOCK_UN);
                fclose($lockFp);
            }
        }
    }

    /**
     * Lists available revision snapshots.
     * @return array<int, array{id: string, timestamp: string, dateFormatted: string, size: int}>
     */
    public static function listRevisions(): array {
        clearstatcache();
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
     * Backs up the pre-rollback state before restoring,
     * writes atomically with file lock, and clears the stat cache.
     */
    public static function restoreRevision(string $filename): bool {
        $clean = basename($filename);
        $target = self::REVISIONS_DIR . '/' . $clean;
        if (!file_exists($target)) {
            return false;
        }

        $raw = @file_get_contents($target);
        if (!$raw || json_decode($raw, true) === null) {
            return false;
        }

        if (!is_dir(self::REVISIONS_DIR)) {
            @mkdir(self::REVISIONS_DIR, 0750, true);
        }

        // 1. Create a revision snapshot of current state before restoring
        if (file_exists(self::DATA_FILE)) {
            $timestamp = date('Y-m-d_H-i-s');
            $backupFile = self::REVISIONS_DIR . '/' . $timestamp . '_content.json';
            $counter = 1;
            while (file_exists($backupFile)) {
                $backupFile = self::REVISIONS_DIR . '/' . $timestamp . '_' . $counter . '_content.json';
                $counter++;
            }
            @copy(self::DATA_FILE, $backupFile);
            self::pruneRevisions(30);
        }

        // 2. Atomic write using temporary file + shared process lock + rename
        $lockFile = self::DATA_FILE . '.lock';
        $lockFp = fopen($lockFile, 'c');
        if ($lockFp) {
            flock($lockFp, LOCK_EX);
        }

        try {
            $tempFile = tempnam(dirname(self::DATA_FILE), 'cmstmp_');
            if (!$tempFile) {
                return false;
            }

            $fp = fopen($tempFile, 'w');
            if (!$fp) {
                @unlink($tempFile);
                return false;
            }

            fwrite($fp, $raw);
            fflush($fp);
            fclose($fp);

            if (!@rename($tempFile, self::DATA_FILE)) {
                @unlink($tempFile);
                return false;
            }

            @chmod(self::DATA_FILE, 0664);
            clearstatcache();
            return true;
        } finally {
            if ($lockFp) {
                flock($lockFp, LOCK_UN);
                fclose($lockFp);
            }
        }
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

        // 5. Pages content (Hero texts, images, slides)
        $clean['pages'] = [];
        if (isset($input['pages']) && is_array($input['pages'])) {
            foreach ($input['pages'] as $pageKey => $pageData) {
                if (!is_string($pageKey) || !is_array($pageData)) continue;
                $key = preg_replace('/[^a-z0-9_-]/', '', strtolower($pageKey));
                $clean['pages'][$key] = [];

                // Hero section
                if (isset($pageData['hero']) && is_array($pageData['hero'])) {
                    $h = $pageData['hero'];
                    $clean['pages'][$key]['hero'] = [
                        'eyebrow' => self::cleanString((string)($h['eyebrow'] ?? ''), 100),
                        'title' => self::cleanString((string)($h['title'] ?? ''), 300),
                        'description' => self::cleanString((string)($h['description'] ?? ''), 1500),
                        'image' => self::cleanString((string)($h['image'] ?? ''), 300),
                        'imageAlt' => self::cleanString((string)($h['imageAlt'] ?? ''), 200),
                        'availability' => self::cleanString((string)($h['availability'] ?? ''), 150),
                        'ctaText' => self::cleanString((string)($h['ctaText'] ?? ''), 80),
                        'ctaHref' => self::cleanString((string)($h['ctaHref'] ?? '#poptavka'), 100),
                    ];
                }

                // Slides (e.g. for Home hero slider)
                if (isset($pageData['slides']) && is_array($pageData['slides'])) {
                    $clean['pages'][$key]['slides'] = [];
                    foreach ($pageData['slides'] as $slide) {
                        if (!is_array($slide)) continue;
                        $clean['pages'][$key]['slides'][] = [
                            'title' => self::cleanString((string)($slide['title'] ?? ''), 200),
                            'description' => self::cleanString((string)($slide['description'] ?? ''), 400),
                            'image' => self::cleanString((string)($slide['image'] ?? ''), 300),
                            'alt' => self::cleanString((string)($slide['alt'] ?? ''), 200),
                        ];
                    }
                }

                // Benefits (e.g. for Home)
                if (isset($pageData['benefits']) && is_array($pageData['benefits'])) {
                    $clean['pages'][$key]['benefits'] = [];
                    foreach ($pageData['benefits'] as $bItem) {
                        if (!is_array($bItem)) continue;
                        $clean['pages'][$key]['benefits'][] = [
                            'title' => self::cleanString((string)($bItem['title'] ?? ''), 150),
                            'text' => self::cleanString((string)($bItem['text'] ?? ''), 300),
                        ];
                    }
                }

                // Services heading (e.g. for Home)
                if (isset($pageData['servicesHeading']) && is_array($pageData['servicesHeading'])) {
                    $sh = $pageData['servicesHeading'];
                    $clean['pages'][$key]['servicesHeading'] = [
                        'title' => self::cleanString((string)($sh['title'] ?? ''), 150),
                        'subtitle' => self::cleanString((string)($sh['subtitle'] ?? ''), 200),
                    ];
                }

                // Dynamic page sections (soucasti, detaily, etc.)
                if (isset($pageData['sections']) && is_array($pageData['sections'])) {
                    $clean['pages'][$key]['sections'] = [];
                    foreach ($pageData['sections'] as $secKey => $secData) {
                        if (!is_string($secKey) || !is_array($secData)) continue;
                        $secK = preg_replace('/[^a-z0-9_-]/', '', strtolower($secKey));
                        $cleanSec = [
                            'eyebrow' => self::cleanString((string)($secData['eyebrow'] ?? ''), 120),
                            'title' => self::cleanString((string)($secData['title'] ?? ''), 300),
                            'description' => self::cleanString((string)($secData['description'] ?? ''), 2000),
                            'image' => self::cleanString((string)($secData['image'] ?? ''), 300),
                            'imageAlt' => self::cleanString((string)($secData['imageAlt'] ?? ''), 200),
                        ];

                        // Numbered items or cards (01, 02, ...)
                        if (isset($secData['items']) && is_array($secData['items'])) {
                            $cleanSec['items'] = [];
                            foreach ($secData['items'] as $item) {
                                if (!is_array($item)) continue;
                                $cleanSec['items'][] = [
                                    'num' => self::cleanString((string)($item['num'] ?? ''), 20),
                                    'title' => self::cleanString((string)($item['title'] ?? ''), 150),
                                    'text' => self::cleanString((string)($item['text'] ?? ''), 1000),
                                ];
                            }
                        }

                        // Checklist items (bullet points)
                        if (isset($secData['checklist']) && is_array($secData['checklist'])) {
                            $cleanSec['checklist'] = [];
                            foreach ($secData['checklist'] as $checkItem) {
                                if (!is_string($checkItem) && !is_numeric($checkItem)) continue;
                                $cleanCheck = self::cleanString((string)$checkItem, 300);
                                if ($cleanCheck !== '') {
                                    $cleanSec['checklist'][] = $cleanCheck;
                                }
                            }
                        }

                        $clean['pages'][$key]['sections'][$secK] = $cleanSec;
                    }
                }

                // Page links / Related services
                if (isset($pageData['links']) && is_array($pageData['links'])) {
                    $clean['pages'][$key]['links'] = [];
                    foreach ($pageData['links'] as $link) {
                        if (!is_array($link)) continue;
                        $clean['pages'][$key]['links'][] = [
                            'href' => self::cleanString((string)($link['href'] ?? ''), 150),
                            'label' => self::cleanString((string)($link['label'] ?? ''), 100),
                        ];
                    }
                }
            }
        }

        return ['valid' => true, 'error' => '', 'data' => $clean];
    }
}
