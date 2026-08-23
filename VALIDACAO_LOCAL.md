# Validação local do Eureka PHP

Data: 23 de agosto de 2026.

O servidor PHP local apresentou `index.php` com HTTP 200 e o menu foi renderizado no navegador com as sete categorias, os produtos, o carrinho, o botão de PDF e o botão de WhatsApp. O carregamento ocorreu através de `api/menu.php`.

A página `admin-login.php` apresentou HTTP 200, manteve o visual existente e mostrou os campos Utilizador, Senha e Entrar. O link de retorno aponta para `index.php`.

Nos testes HTTP, uma senha incorreta devolveu HTTP 401; a credencial inicial `admin` / `eureka2024` devolveu HTTP 200; o acesso sem sessão a `admin.php` redirecionou para `admin-login.php`; e a gravação autenticada do menu via `api/menu-save.php`, com token CSRF, devolveu HTTP 200. O ficheiro `data/menu.json` foi restaurado ao conteúdo inicial após o teste.

A sintaxe de todos os ficheiros PHP e JavaScript foi validada sem erros.

A validação visual no navegador também confirmou que o login redireciona para `admin.php` e que o painel mostra categorias, produtos, edição, upload Cloudinary, exportação do menu, logout e o novo botão “Salvar no servidor”.

Na validação final, a página pública renderizou imagens e, ao clicar em “Adicionar” para Asinhas, atualizou o contador para 1, abriu o item no carrinho, mostrou o total de 2 500 Kz e exibiu a notificação de sucesso.
