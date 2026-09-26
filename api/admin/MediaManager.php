<?php
declare(strict_types=1);

/**
 * Media Manager for EmHa CMS
 * Handles secure file uploads, validation, metadata index, alt-tag updates,
 * and deletion of media assets.
 */
class MediaManager {
    public const UPLOADS_DIR = __DIR__ . '/../../public/uploads';
    public const METADATA_FILE = __DIR__ . '/../data/media.json';
    public const MAX_FILE_SIZE = 8388608; // 8 MB

    public const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/svg+xml' => 'svg',
    ];

    public static function init(): void {
        if (!is_dir(self::UPLOADS_DIR)) {
            @mkdir(self::UPLOADS_DIR, 0755, true);
        }
        $metaDir = dirname(self::METADATA_FILE);
        if (!is_dir($metaDir)) {
            @mkdir($metaDir, 0750, true);
        }
    }

    /**
     * Returns list of media items with metadata.
     * @return array<int, array<string, mixed>>
     */
    public static function listMedia(): array {
        self::init();
        if (!file_exists(self::METADATA_FILE)) {
            return [];
        }
        $raw = @file_get_contents(self::METADATA_FILE);
        $data = json_decode((string)$raw, true) ?: [];
        
        // Sort descending by uploadedAt
        usort($data, function ($a, $b) {
            return ($b['uploadedAt'] ?? 0) <=> ($a['uploadedAt'] ?? 0);
        });

        return $data;
    }

    /**
     * Saves uploaded file and indexes metadata.
     * @return array{success: bool, error: string, item: ?array<string, mixed>}
     */
    public static function upload(array $fileInfo, string $alt = '', string $title = ''): array {
        self::init();

        if (empty($fileInfo['tmp_name']) || !is_uploaded_file($fileInfo['tmp_name'])) {
            return ['success' => false, 'error' => 'Nebyl nahrán žádný platný soubor.', 'item' => null];
        }

        if (($fileInfo['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
            return ['success' => false, 'error' => 'Chyba nahrávání souboru: kód ' . $fileInfo['error'], 'item' => null];
        }

        if (($fileInfo['size'] ?? 0) > self::MAX_FILE_SIZE) {
            return ['success' => false, 'error' => 'Soubor přesahuje maximální povolenou velikost 8 MB.', 'item' => null];
        }

        // Verify MIME type with finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = (string)$finfo->file($fileInfo['tmp_name']);

        if (!isset(self::ALLOWED_MIME_TYPES[$mime])) {
            return ['success' => false, 'error' => 'Nepovolený formát obrázku. Povoleno: JPEG, PNG, WebP, SVG.', 'item' => null];
        }

        $extension = self::ALLOWED_MIME_TYPES[$mime];

        // Sanitize original filename
        $origName = pathinfo((string)($fileInfo['name'] ?? 'image'), PATHINFO_FILENAME);
        $cleanSlug = self::sanitizeSlug($origName);
        if (empty($cleanSlug)) {
            $cleanSlug = 'obrazek';
        }

        $uniqueId = substr(bin2hex(random_bytes(4)), 0, 8);
        $filename = "{$cleanSlug}-{$uniqueId}.{$extension}";
        $destination = self::UPLOADS_DIR . '/' . $filename;

        if (!move_uploaded_file($fileInfo['tmp_name'], $destination)) {
            return ['success' => false, 'error' => 'Nepodařilo se uložit soubor na disk.', 'item' => null];
        }

        // Get image dimensions if raster image
        $dimensions = [0, 0];
        if ($mime !== 'image/svg+xml') {
            $imgSize = @getimagesize($destination);
            if ($imgSize) {
                $dimensions = [(int)$imgSize[0], (int)$imgSize[1]];
            }
        }

        $publicUrl = '/uploads/' . $filename;
        $cleanAlt = htmlspecialchars(strip_tags(trim($alt)), ENT_QUOTES, 'UTF-8');
        $cleanTitle = htmlspecialchars(strip_tags(trim($title)), ENT_QUOTES, 'UTF-8');

        $newItem = [
            'id' => $uniqueId,
            'filename' => $filename,
            'url' => $publicUrl,
            'alt' => $cleanAlt,
            'title' => $cleanTitle ?: $origName,
            'mime' => $mime,
            'size' => (int)filesize($destination),
            'width' => $dimensions[0],
            'height' => $dimensions[1],
            'uploadedAt' => time(),
        ];

        self::saveItemToMetadata($newItem);

        return ['success' => true, 'error' => '', 'item' => $newItem];
    }

    /**
     * Updates alt and title attributes of an existing image.
     */
    public static function updateMetadata(string $id, string $alt, string $title = ''): array {
        $items = self::listMedia();
        $found = false;

        $cleanAlt = htmlspecialchars(strip_tags(trim($alt)), ENT_QUOTES, 'UTF-8');
        $cleanTitle = htmlspecialchars(strip_tags(trim($title)), ENT_QUOTES, 'UTF-8');

        foreach ($items as &$item) {
            if (($item['id'] ?? '') === $id) {
                $item['alt'] = $cleanAlt;
                if (!empty($cleanTitle)) {
                    $item['title'] = $cleanTitle;
                }
                $found = true;
                break;
            }
        }

        if (!$found) {
            return ['success' => false, 'error' => 'Obrázek nebyl nalezen.'];
        }

        self::writeMetadata($items);
        return ['success' => true, 'error' => ''];
    }

    /**
     * Deletes file and removes from metadata index.
     */
    public static function delete(string $id): array {
        $items = self::listMedia();
        $targetFile = null;
        $updatedItems = [];

        foreach ($items as $item) {
            if (($item['id'] ?? '') === $id) {
                $targetFile = self::UPLOADS_DIR . '/' . basename((string)$item['filename']);
            } else {
                $updatedItems[] = $item;
            }
        }

        if (!$targetFile) {
            return ['success' => false, 'error' => 'Obrázek nebyl nalezen v indexu.'];
        }

        if (file_exists($targetFile)) {
            @unlink($targetFile);
        }

        self::writeMetadata($updatedItems);
        return ['success' => true, 'error' => ''];
    }

    private static function saveItemToMetadata(array $newItem): void {
        $items = self::listMedia();
        $items[] = $newItem;
        self::writeMetadata($items);
    }

    private static function writeMetadata(array $items): void {
        $json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        @file_put_contents(self::METADATA_FILE, $json, LOCK_EX);
    }

    public static function sanitizeSlug(string $string): string {
        $table = [
            'á'=>'a', 'č'=>'c', 'ď'=>'d', 'é'=>'e', 'ě'=>'e', 'í'=>'i', 'ň'=>'n',
            'ó'=>'o', 'ř'=>'r', 'š'=>'s', 'ť'=>'t', 'ú'=>'u', 'ů'=>'u', 'ý'=>'y',
            'ž'=>'z', 'Á'=>'a', 'Č'=>'c', 'Ď'=>'d', 'É'=>'e', 'Ě'=>'e', 'Í'=>'i',
            'Ň'=>'n', 'Ó'=>'o', 'Ř'=>'r', 'Š'=>'s', 'Ť'=>'t', 'Ú'=>'u', 'Ů'=>'u',
            'Ý'=>'y', 'Ž'=>'z'
        ];
        $string = strtr($string, $table);
        $string = preg_replace('~[^\pL\d]+~u', '-', $string) ?? '';
        $string = preg_replace('~[^-\w]+~', '', $string) ?? '';
        $string = trim($string, '-');
        $string = preg_replace('~-+~', '-', $string) ?? '';
        return strtolower($string);
    }
}
