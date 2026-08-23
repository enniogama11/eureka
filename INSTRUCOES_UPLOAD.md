# Eureka Lounge — pacote PHP para upload

Este pacote foi preparado para alojamento partilhado com PHP e mantém a interface pública, o carrinho, a pesquisa, o filtro por categorias, a geração de PDF, o envio para WhatsApp, o login administrativo, o CRUD de produtos, o upload de imagens para Cloudinary e a exportação do menu.

## 1. Estrutura do upload

Envie **o conteúdo desta pasta**, e não a pasta `eureka` inteira, para a pasta pública do domínio `eniogama.unaux.com`. Dependendo do painel do alojamento, essa pasta pode chamar-se `public_html`, `htdocs` ou `domains/eniogama.unaux.com/public_html`.

| Elemento | Função |
|---|---|
| `index.php` | Menu público principal. |
| `admin-login.php` | Login do painel administrativo. |
| `admin.php` | Painel para editar, criar e eliminar produtos. |
| `api/` | Endpoints PHP do menu, autenticação, gravação e logout. |
| `config/` | Configuração da sessão e credencial administrativa. |
| `data/menu.json` | Dados editáveis do restaurante. |
| `backups/` | Cópias automáticas criadas antes de cada gravação. |
| `css/`, `js/`, `img/` | Estilos, lógica do frontend e imagem do logótipo. |
| `.htaccess` | Índice padrão e proteção de ficheiros internos. |

## 2. Passos de instalação

Primeiro, abra o gestor de ficheiros ou FTP do alojamento, entre na pasta pública associada a `eniogama.unaux.com` e carregue todos os ficheiros e pastas do pacote. Certifique-se de que os ficheiros ocultos, especialmente `.htaccess`, também são enviados; alguns programas FTP escondem esses ficheiros por defeito.

Em seguida, abra `https://eniogama.unaux.com/`. Se o alojamento estiver corretamente associado e o PHP estiver ativo, o menu deverá aparecer sem necessidade de executar uma compilação ou instalar dependências.

Aceda ao painel em `https://eniogama.unaux.com/admin-login.php`. A credencial inicial deste pacote é a seguinte:

| Campo | Valor inicial |
|---|---|
| Utilizador | `admin` |
| Senha | `eureka2024` |

Depois do primeiro acesso, recomenda-se alterar a senha no ficheiro `config/config.php`. Gere um novo hash com `password_hash('A_SUA_NOVA_SENHA', PASSWORD_DEFAULT)` num ambiente PHP seguro e substitua apenas o valor de `EUREKA_ADMIN_PASSWORD_HASH`. Não coloque a senha em texto simples no ficheiro.

## 3. Permissões de gravação

O painel precisa de conseguir gravar `data/menu.json` e criar ficheiros dentro de `backups/`. Em muitos alojamentos partilhados, as permissões padrão funcionam automaticamente. Se o painel mostrar “não foi possível escrever data/menu.json”, atribua temporariamente permissão de escrita ao proprietário do processo PHP na pasta `data` e na pasta `backups`, normalmente `755` para pastas e `644` para ficheiros, ou use a opção de permissões recomendada pelo próprio painel.

Não elimine os ficheiros `.htaccess` das pastas `config`, `data` e `backups`. Eles impedem o acesso direto a configurações, ao JSON editável e às cópias de segurança. A leitura pública do menu é feita por `api/menu.php`.

## 4. Cloudinary e imagens

A função de upload de imagem continua a utilizar o preset público configurado no projeto. Se o upload de uma imagem falhar, verifique no Cloudinary se o cloud name `dy2baee3r` e o preset `eureka_presets` ainda estão ativos. Também é possível preencher o campo da imagem com um URL externo compatível, caso seja necessário.

## 5. Verificação rápida depois do upload

| Teste | Resultado esperado |
|---|---|
| Abrir `/` | O menu, categorias e produtos aparecem. |
| Pesquisar um produto | Os resultados são filtrados em tempo real. |
| Adicionar produto | O contador e o total do carrinho são atualizados. |
| Abrir `/admin-login.php` | O login administrativo é apresentado. |
| Entrar no painel | `/admin.php` abre apenas depois de autenticar. |
| Editar e guardar um produto | O painel confirma a gravação e o menu público recebe a alteração. |
| Sair do painel | A sessão termina e o acesso volta ao login. |
| Abrir `data/menu.json` diretamente | O acesso deve ser bloqueado pelo `.htaccess`. |

## 6. Nota de segurança importante

A versão anterior do projeto continha um token de acesso GitHub exposto no JavaScript. O token foi removido desta versão e a gravação agora é local no servidor PHP. Como o token antigo pode continuar presente no histórico do repositório, deve ser revogado no GitHub e substituído por um novo apenas se voltar a ser necessária uma integração GitHub.

## 7. Limitação do alojamento gratuito

O pacote não depende de Node.js, Vite, Composer, base de dados ou processo em segundo plano. A única condição é que o serviço aceite PHP, sessões e escrita de ficheiros. Se o alojamento bloquear escrita em `data/menu.json`, o menu público continuará a poder ser lido, mas a edição pelo painel exigirá corrigir as permissões ou utilizar a opção de edição de ficheiros do próprio painel de hospedagem.
