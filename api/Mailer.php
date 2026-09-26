<?php
declare(strict_types=1);

/**
 * Mailer service for EmHa Elektro
 * Handles secure HTML email delivery with CRLF sanitization and XSS-safe templating.
 */
class Mailer {
    private string $defaultFrom;
    private string $defaultTo;
    private string $templatesDir;

    public function __construct(?string $templatesDir = null) {
        $this->templatesDir = $templatesDir ?? __DIR__ . '/templates';
        
        $envFrom = getenv('MAIL_FROM');
        $this->defaultFrom = ($envFrom && filter_var($envFrom, FILTER_VALIDATE_EMAIL)) 
            ? $envFrom 
            : 'poptavky@emha.cz';

        $envTo = getenv('MAIL_TO');
        $this->defaultTo = ($envTo && filter_var($envTo, FILTER_VALIDATE_EMAIL)) 
            ? $envTo 
            : 'info@emha.cz';
    }

    /**
     * Sanitizes a single-line email header value to prevent CRLF injection.
     */
    public static function sanitizeHeader(string $value): string {
        return trim(preg_replace('/[\r\n\t]+/', ' ', $value) ?? '');
    }

    /**
     * Sends an email via mail() with safe UTF-8 headers.
     */
    public function send(string $to, string $subject, string $htmlBody, ?string $replyTo = null, string $fromName = 'EmHa Elektro'): bool {
        $to = self::sanitizeHeader($to);
        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            error_log('Mailer error: Invalid recipient email: ' . $to);
            return false;
        }

        $fromEmail = $this->defaultFrom;
        $cleanFromName = self::sanitizeHeader($fromName);
        $encodedFromName = '=?UTF-8?B?' . base64_encode($cleanFromName) . '?=';
        $encodedSubject = '=?UTF-8?B?' . base64_encode(self::sanitizeHeader($subject)) . '?=';

        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
            'X-Mailer: PHP/' . phpversion(),
        ];

        if ($replyTo !== null) {
            $cleanReplyTo = self::sanitizeHeader($replyTo);
            if (filter_var($cleanReplyTo, FILTER_VALIDATE_EMAIL)) {
                $headers[] = 'Reply-To: ' . $cleanReplyTo;
            }
        }

        $headerString = implode("\r\n", $headers);
        $extraParams = '-f' . escapeshellarg($fromEmail);
        
        // Optional SMTP delivery if environment credentials are provided
        if (!empty(getenv('SMTP_HOST'))) {
            $smtpResult = $this->sendViaSmtp($to, $encodedSubject, $htmlBody, $headers);
            if ($smtpResult) {
                return true;
            }
            error_log('Mailer: SMTP failed, falling back to mail()');
        }

        $result = @mail($to, $encodedSubject, $htmlBody, $headerString, $extraParams);

        if (!$result) {
            error_log('Mailer: mail() call returned false for ' . $to);
        }

        return $result;
    }

    /**
     * Minimal authenticated SMTP sender fallback using socket stream.
     */
    private function sendViaSmtp(string $to, string $subject, string $htmlBody, array $headers): bool {
        $host = (string)getenv('SMTP_HOST');
        $port = (int)(getenv('SMTP_PORT') ?: 587);
        $user = (string)getenv('SMTP_USER');
        $pass = (string)getenv('SMTP_PASS');
        $secure = strtolower((string)(getenv('SMTP_SECURE') ?: 'tls'));

        $prefix = ($secure === 'ssl') ? 'ssl://' : '';
        $socket = @fsockopen($prefix . $host, $port, $errno, $errstr, 5);
        if (!$socket) {
            return false;
        }

        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function(string $cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
        };

        $read();
        $write('EHLO ' . gethostname());
        $ehlo = $read();

        if ($secure === 'tls' && str_contains($ehlo, 'STARTTLS')) {
            $write('STARTTLS');
            $read();
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                fclose($socket);
                return false;
            }
            $write('EHLO ' . gethostname());
            $read();
        }

        if (!empty($user) && !empty($pass)) {
            $write('AUTH LOGIN');
            $read();
            $write(base64_encode($user));
            $read();
            $write(base64_encode($pass));
            $authRes = $read();
            if (!str_starts_with($authRes, '235')) {
                fclose($socket);
                return false;
            }
        }

        $write('MAIL FROM: <' . $this->defaultFrom . '>');
        $read();
        $write('RCPT TO: <' . $to . '>');
        $read();
        $write('DATA');
        $read();

        $content = "To: " . $to . "\r\n";
        $content .= "Subject: " . $subject . "\r\n";
        $content .= implode("\r\n", $headers) . "\r\n\r\n";
        $content .= $htmlBody . "\r\n.\r\n";

        $write($content);
        $dataRes = $read();
        $write('QUIT');
        fclose($socket);

        return str_starts_with($dataRes, '250');
    }

    /**
     * Renders an HTML template replacing {{PLACEHOLDER}} with htmlspecialchars-escaped values.
     * Raw unescaped values can be prefixed with RAW_ if strictly required and sanitized.
     */
    public function renderTemplate(string $templateFilename, array $variables): string {
        $templatePath = $this->templatesDir . '/' . basename($templateFilename);
        if (!file_exists($templatePath)) {
            throw new RuntimeException('Template not found: ' . $templateFilename);
        }

        $content = file_get_contents($templatePath);
        if ($content === false) {
            throw new RuntimeException('Cannot read template: ' . $templateFilename);
        }

        foreach ($variables as $key => $val) {
            $stringVal = (string)$val;
            // Prevent HTML injection into templates
            $escaped = htmlspecialchars($stringVal, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            $content = str_replace('{{' . $key . '}}', $escaped, $content);
        }

        return $content;
    }

    /**
     * Sends admin notification email about a new inquiry.
     */
    public function sendAdminNotification(array $inquiryData): bool {
        $contact = $inquiryData['contact'] ?? '';
        $isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false;
        
        $contactUri = $isEmail ? ('mailto:' . $contact) : ('tel:' . preg_replace('/[^\d+]/', '', $contact));

        $variables = [
            'JMENO' => $inquiryData['surname'] ?? '',
            'KONTAKT' => $contact,
            'KONTAKT_URI' => $contactUri,
            'SLUZBA' => $inquiryData['serviceLabel'] ?? $inquiryData['service'] ?? '',
            'ZPRAVA' => $inquiryData['message'] ?? '',
            'DATUM' => date('d. m. Y H:i:s'),
            'IP' => $inquiryData['ip'] ?? 'N/A',
            'ZEME' => $inquiryData['country'] ?? 'CZ',
            'REFERRER' => $inquiryData['referrer'] ?? 'Přímo z webu',
        ];

        $html = $this->renderTemplate('email-admin.html', $variables);
        $subject = 'Nová poptávka: ' . ($inquiryData['surname'] ?? 'Zákazník') . ' — ' . ($inquiryData['serviceLabel'] ?? 'Elektroinstalace');
        
        $replyTo = $isEmail ? $contact : null;
        return $this->send($this->defaultTo, $subject, $html, $replyTo);
    }

    /**
     * Sends confirmation email to client if their contact is an email.
     */
    public function sendClientConfirmation(string $clientEmail, array $inquiryData): bool {
        if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $variables = [
            'JMENO' => $inquiryData['surname'] ?? 'zákazníku',
            'SLUZBA' => $inquiryData['serviceLabel'] ?? $inquiryData['service'] ?? '',
            'ZPRAVA' => $inquiryData['message'] ?? '',
        ];

        $html = $this->renderTemplate('email-client.html', $variables);
        $subject = 'Potvrzení přijetí poptávky — EmHa Elektro';

        return $this->send($clientEmail, $subject, $html);
    }
}