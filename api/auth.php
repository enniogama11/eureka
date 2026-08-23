<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    eureka_json_response(['ok' => false, 'error' => 'Método não permitido.'], 405);
}

try {
    $payload = eureka_request_json();
    $username = trim((string) ($payload['username'] ?? ''));
    $password = (string) ($payload['password'] ?? '');

    if ($username === '' || $password === '') {
        eureka_json_response(['ok' => false, 'error' => 'Preencha o utilizador e a senha.'], 422);
    }

    if (!hash_equals(EUREKA_ADMIN_USERNAME, $username) || !password_verify($password, EUREKA_ADMIN_PASSWORD_HASH)) {
        usleep(250000);
        eureka_json_response(['ok' => false, 'error' => 'Utilizador ou senha incorretos.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['eureka_admin'] = true;
    $_SESSION['eureka_admin_at'] = time();

    eureka_json_response(['ok' => true]);
} catch (Throwable $error) {
    error_log('[Eureka] auth.php: ' . $error->getMessage());
    eureka_json_response(['ok' => false, 'error' => 'Não foi possível iniciar a sessão.'], 500);
}
