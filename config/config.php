<?php
declare(strict_types=1);

// Configuração simples para alojamento PHP partilhado.
// Depois do upload, altere EUREKA_ADMIN_PASSWORD_HASH para uma nova palavra-passe.
const EUREKA_ADMIN_USERNAME = 'admin';
const EUREKA_ADMIN_PASSWORD_HASH = '$2b$12$ICaHsdHKV6uNx4FQAdi.DuAF9f.5k3JUIx.BSbJAyOIUfFoCRhjh.';
const EUREKA_SESSION_NAME = 'eureka_admin_session';
const EUREKA_SESSION_TIMEOUT = 86400;
const EUREKA_MENU_FILE = __DIR__ . '/../data/menu.json';
const EUREKA_BACKUP_DIR = __DIR__ . '/../backups';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name(EUREKA_SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

function eureka_json_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function eureka_is_admin(): bool
{
    if (empty($_SESSION['eureka_admin'])) {
        return false;
    }

    $authenticatedAt = (int) ($_SESSION['eureka_admin_at'] ?? 0);
    if ($authenticatedAt <= 0 || (time() - $authenticatedAt) > EUREKA_SESSION_TIMEOUT) {
        unset($_SESSION['eureka_admin'], $_SESSION['eureka_admin_at']);
        return false;
    }

    return true;
}

function eureka_require_admin(bool $json = false): void
{
    if (eureka_is_admin()) {
        return;
    }

    if ($json) {
        eureka_json_response(['ok' => false, 'error' => 'Sessão expirada. Entre novamente.'], 401);
    }

    header('Location: admin-login.php');
    exit;
}

function eureka_read_menu(): array
{
    if (!is_file(EUREKA_MENU_FILE) || !is_readable(EUREKA_MENU_FILE)) {
        throw new RuntimeException('O ficheiro data/menu.json não está disponível para leitura.');
    }

    $raw = file_get_contents(EUREKA_MENU_FILE);
    if ($raw === false) {
        throw new RuntimeException('Não foi possível ler o menu.');
    }

    $menu = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($menu) || !isset($menu['categories'], $menu['products']) || !is_array($menu['categories']) || !is_array($menu['products'])) {
        throw new RuntimeException('O formato do menu é inválido.');
    }

    return $menu;
}

function eureka_write_menu(array $menu): void
{
    if (!isset($menu['categories'], $menu['products']) || !is_array($menu['categories']) || !is_array($menu['products'])) {
        throw new InvalidArgumentException('O menu deve conter categorias e produtos.');
    }

    $encoded = json_encode($menu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . PHP_EOL;
    $backupDir = EUREKA_BACKUP_DIR;

    if (!is_dir($backupDir) && !mkdir($backupDir, 0755, true) && !is_dir($backupDir)) {
        throw new RuntimeException('Não foi possível criar a pasta de backups.');
    }

    if (is_file(EUREKA_MENU_FILE)) {
        $backupPath = $backupDir . '/menu-' . date('Ymd-His') . '.json';
        @copy(EUREKA_MENU_FILE, $backupPath);
    }

    $temporaryFile = EUREKA_MENU_FILE . '.tmp';
    if (file_put_contents($temporaryFile, $encoded, LOCK_EX) === false) {
        throw new RuntimeException('Não foi possível escrever data/menu.json. Verifique as permissões da pasta data.');
    }

    if (!rename($temporaryFile, EUREKA_MENU_FILE)) {
        @unlink($temporaryFile);
        throw new RuntimeException('Não foi possível concluir a gravação do menu.');
    }
}

function eureka_csrf_token(): string
{
    if (empty($_SESSION['eureka_csrf'])) {
        $_SESSION['eureka_csrf'] = bin2hex(random_bytes(32));
    }

    return (string) $_SESSION['eureka_csrf'];
}

function eureka_require_csrf(): void
{
    $token = (string) ($_SERVER['HTTP_X_EUREKA_CSRF'] ?? '');
    if ($token === '' || empty($_SESSION['eureka_csrf']) || !hash_equals((string) $_SESSION['eureka_csrf'], $token)) {
        eureka_json_response(['ok' => false, 'error' => 'Pedido não autorizado. Atualize o painel e tente novamente.'], 403);
    }
}

function eureka_request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        throw new InvalidArgumentException('O corpo do pedido está vazio.');
    }

    $payload = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        throw new InvalidArgumentException('O corpo do pedido é inválido.');
    }

    return $payload;
}
