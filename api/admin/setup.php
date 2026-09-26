<?php
declare(strict_types=1);

/**
 * Setup script for EmHa CMS Admin Password
 * Run via CLI: php api/admin/setup.php [desired_password]
 * If no password argument is given, generates a cryptographically secure 16-char password.
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Setup script can only be run via CLI for security reasons.\n";
    exit(1);
}

$configFile = __DIR__ . '/../data/config.php';
$username = 'admin';

$password = $argv[1] ?? bin2hex(random_bytes(8)); // 16 characters

$algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
$hash = password_hash($password, $algo);

$code = "<?php\nreturn [\n    'username' => " . var_export($username, true) . ",\n    'passwordHash' => " . var_export($hash, true) . ",\n];\n";

if (!is_dir(dirname($configFile))) {
    mkdir(dirname($configFile), 0750, true);
}

file_put_contents($configFile, $code, LOCK_EX);

echo "\n=======================================================\n";
echo " EmHa CMS Admin Credentials Configured Successfully!   \n";
echo "=======================================================\n";
echo " Přihlašovací jméno : {$username}\n";
echo " Vygenerované heslo : {$password}\n";
echo " Hash uložen do     : api/data/config.php\n";
echo " Hashovací algoritmus: " . ($algo === PASSWORD_DEFAULT ? 'Bcrypt' : 'Argon2id') . "\n";
echo "=======================================================\n\n";
