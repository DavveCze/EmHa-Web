<?php
declare(strict_types=1);

/**
 * Inquiries / CRM Manager for EmHa CMS
 * Handles atomic persistence of leads, status lifecycle, notes, and CSV export.
 * Protected by api/data/.htaccess (Require all denied).
 */
class InquiryManager {
    public const DATA_FILE = __DIR__ . '/../data/inquiries.json';

    public const VALID_STATUSES = ['new', 'in_progress', 'quoted', 'completed', 'archived'];

    public const SERVICE_LABELS = [
        'elektroinstalace' => 'Elektroinstalace',
        'rekonstrukce' => 'Rekonstrukce',
        'zabezpeceni-a-automatizace' => 'Zabezpečení a automatizace',
        'na-co-myslet-pri-rekonstrukcich' => 'Konzultace před rekonstrukcí',
        'opravy-a-servis' => 'Opravy a servis',
        'data-a-slaboproud' => 'Data a slaboproud',
        'jine' => 'Jiný požadavek',
    ];

    /**
     * Atomically records a new incoming inquiry from contact form.
     * @param array $data Validated data from Security::validateAndSanitize
     * @return array The recorded inquiry object
     */
    public static function recordInquiry(array $data): array {
        $id = 'inq_' . bin2hex(random_bytes(4));
        $now = date('c');

        $inquiry = [
            'id' => $id,
            'receivedAt' => $now,
            'status' => 'new',
            'surname' => trim((string)($data['surname'] ?? '')),
            'contact' => trim((string)($data['contact'] ?? '')),
            'service' => trim((string)($data['service'] ?? 'rekonstrukce')),
            'serviceLabel' => self::SERVICE_LABELS[$data['service'] ?? ''] ?? ($data['service'] ?? 'Jiné'),
            'message' => trim((string)($data['message'] ?? '')),
            'ip' => (string)($data['ip'] ?? ''),
            'notes' => [],
        ];

        self::mutateList(function (array &$list) use ($inquiry) {
            array_unshift($list, $inquiry);
        });

        return $inquiry;
    }

    /**
     * Lists all inquiries (newest first).
     * @return array
     */
    public static function listInquiries(): array {
        if (!file_exists(self::DATA_FILE)) {
            return [];
        }
        $raw = @file_get_contents(self::DATA_FILE);
        if (!$raw) return [];
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    /**
     * Updates an inquiry's status or appends an internal note.
     * @return array{success: bool, error: string, inquiry?: array}
     */
    public static function updateInquiry(string $id, array $changes): array {
        $updatedInquiry = null;

        $success = self::mutateList(function (array &$list) use ($id, $changes, &$updatedInquiry) {
            foreach ($list as &$item) {
                if (($item['id'] ?? '') === $id) {
                    if (isset($changes['status']) && in_array($changes['status'], self::VALID_STATUSES, true)) {
                        $item['status'] = $changes['status'];
                    }

                    if (isset($changes['addNote']) && is_string($changes['addNote'])) {
                        $noteText = trim($changes['addNote']);
                        if (!empty($noteText)) {
                            if (!isset($item['notes']) || !is_array($item['notes'])) {
                                $item['notes'] = [];
                            }
                            $item['notes'][] = [
                                'id' => 'note_' . bin2hex(random_bytes(3)),
                                'timestamp' => date('c'),
                                'text' => mb_substr($noteText, 0, 1000, 'UTF-8'),
                            ];
                        }
                    }

                    $updatedInquiry = $item;
                    return;
                }
            }
        });

        if (!$success) {
            return ['success' => false, 'error' => 'Chyba při zápisu na disk.'];
        }
        if (!$updatedInquiry) {
            return ['success' => false, 'error' => 'Poptávka nebyla nalezena.'];
        }

        return ['success' => true, 'error' => '', 'inquiry' => $updatedInquiry];
    }

    /**
     * Deletes an inquiry by ID.
     */
    public static function deleteInquiry(string $id): bool {
        return self::mutateList(function (array &$list) use ($id) {
            $list = array_values(array_filter($list, fn($item) => ($item['id'] ?? '') !== $id));
        });
    }

    /**
     * Exports all inquiries into CSV with UTF-8 BOM.
     */
    public static function exportCsv(): string {
        $list = self::listInquiries();
        $output = fopen('php://temp', 'r+');
        if (!$output) return '';

        // UTF-8 BOM for Microsoft Excel on Windows
        fwrite($output, "\xEF\xBB\xBF");

        // Header row
        fputcsv($output, ['ID', 'Datum přijetí', 'Stav', 'Příjmení', 'Kontakt', 'Služba', 'Zpráva', 'Poznámky', 'IP adresa'], ';');

        $statusCzech = [
            'new' => 'Nová',
            'in_progress' => 'V řešení',
            'quoted' => 'Naceněno',
            'completed' => 'Dokončeno',
            'archived' => 'Archivováno',
        ];

        foreach ($list as $item) {
            $notesText = '';
            if (!empty($item['notes']) && is_array($item['notes'])) {
                $notesText = implode(' | ', array_map(fn($n) => ($n['timestamp'] ?? '') . ': ' . ($n['text'] ?? ''), $item['notes']));
            }

            fputcsv($output, [
                $item['id'] ?? '',
                $item['receivedAt'] ?? '',
                $statusCzech[$item['status'] ?? 'new'] ?? ($item['status'] ?? ''),
                $item['surname'] ?? '',
                $item['contact'] ?? '',
                $item['serviceLabel'] ?? ($item['service'] ?? ''),
                $item['message'] ?? '',
                $notesText,
                $item['ip'] ?? '',
            ], ';');
        }

        rewind($output);
        $csv = stream_get_contents($output) ?: '';
        fclose($output);
        return $csv;
    }

    /**
     * Atomic mutation helper with shared process file lock.
     */
    private static function mutateList(callable $callback): bool {
        $dir = dirname(self::DATA_FILE);
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }

        $lockFile = self::DATA_FILE . '.lock';
        $lockFp = fopen($lockFile, 'c');
        if ($lockFp) {
            flock($lockFp, LOCK_EX);
        }

        try {
            $tempFile = tempnam($dir, 'inqtmp_');
            if (!$tempFile) return false;

            $fp = fopen($tempFile, 'w');
            if (!$fp) {
                @unlink($tempFile);
                return false;
            }

            $currentList = self::listInquiries();
            $callback($currentList);

            $json = json_encode($currentList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            fwrite($fp, $json ?: '[]');
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
}
