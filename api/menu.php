<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

try {
    $menu = eureka_read_menu();
    eureka_json_response($menu);
} catch (Throwable $error) {
    error_log('[Eureka] menu.php: ' . $error->getMessage());
    eureka_json_response([
        'ok' => false,
        'error' => 'Não foi possível carregar o menu neste momento.'
    ], 500);
}
