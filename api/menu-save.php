<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
eureka_require_admin(true);
eureka_require_csrf();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    eureka_json_response(['ok' => false, 'error' => 'Método não permitido.'], 405);
}

function eureka_normalize_menu(array $payload): array
{
    if (!isset($payload['categories'], $payload['products']) || !is_array($payload['categories']) || !is_array($payload['products'])) {
        throw new InvalidArgumentException('O menu deve conter categorias e produtos.');
    }

    $categories = [];
    foreach ($payload['categories'] as $category) {
        if (!is_array($category) || trim((string) ($category['id'] ?? '')) === '' || trim((string) ($category['name'] ?? '')) === '') {
            throw new InvalidArgumentException('Existe uma categoria inválida.');
        }

        $category['id'] = is_numeric($category['id']) ? (int) $category['id'] : trim((string) $category['id']);
        $category['name'] = trim((string) $category['name']);
        $category['emoji'] = trim((string) ($category['emoji'] ?? '🍽️')) ?: '🍽️';
        $categories[] = $category;
    }

    $categoryIds = array_map(static fn (array $category): string => (string) $category['id'], $categories);
    $products = [];
    foreach ($payload['products'] as $product) {
        if (!is_array($product) || trim((string) ($product['id'] ?? '')) === '' || trim((string) ($product['name'] ?? '')) === '') {
            throw new InvalidArgumentException('Existe um produto inválido.');
        }

        $category = trim((string) ($product['category'] ?? ''));
        $price = $product['price'] ?? null;
        if ($category === '' || !in_array($category, $categoryIds, true) || !is_numeric($price) || (float) $price < 0) {
            throw new InvalidArgumentException('Um produto tem categoria ou preço inválido.');
        }

        $product['id'] = is_numeric($product['id']) ? (int) $product['id'] : trim((string) $product['id']);
        $product['category'] = $category;
        $product['name'] = trim((string) $product['name']);
        $product['price'] = (float) $price;
        if (floor($product['price']) === $product['price']) {
            $product['price'] = (int) $product['price'];
        }
        $product['description'] = trim((string) ($product['description'] ?? ''));
        $product['image'] = trim((string) ($product['image'] ?? ''));

        $items = [];
        foreach (($product['items'] ?? []) as $item) {
            if (!is_array($item) || trim((string) ($item['name'] ?? '')) === '' || !is_numeric($item['price'] ?? null)) {
                continue;
            }
            $items[] = [
                'name' => trim((string) $item['name']),
                'price' => (float) $item['price']
            ];
        }
        $product['items'] = $items;
        $products[] = $product;
    }

    $restaurant = isset($payload['restaurant']) && is_array($payload['restaurant'])
        ? $payload['restaurant']
        : eureka_read_menu()['restaurant'] ?? [];

    return [
        'restaurant' => $restaurant,
        'categories' => $categories,
        'products' => $products
    ];
}

try {
    $payload = eureka_request_json();
    $menu = eureka_normalize_menu($payload);
    eureka_write_menu($menu);
    eureka_json_response(['ok' => true, 'menu' => $menu]);
} catch (InvalidArgumentException | JsonException $error) {
    eureka_json_response(['ok' => false, 'error' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('[Eureka] menu-save.php: ' . $error->getMessage());
    eureka_json_response(['ok' => false, 'error' => 'Não foi possível guardar o menu.'], 500);
}
