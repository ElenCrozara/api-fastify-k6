# API CRUD com Fastify e Testes de Performance com k6

Este projeto contém uma API CRUD simples construída com Fastify (Node.js) e instruções para realizar testes de performance utilizando o k6.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

* **Node.js** (versão 14 ou superior recomendada): [https://nodejs.org/](https://nodejs.org/)
* **npm** (geralmente instalado com o Node.js) ou **yarn**: [https://yarnpkg.com/](https://yarnpkg.com/)
* **k6**: [https://k6.io/installation/](https://k6.io/installation/)

## Configuração da API

Siga estas instruções para configurar e executar a API Fastify localmente.

1.  **Clonar o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <NOME_DO_REPOSITORIO>
    ```

2.  **Instalar as dependências:**
    Utilize npm:
    ```bash
    npm install
    ```
    Ou yarn:
    ```bash
    yarn install
    ```

3.  **Executar a API:**
    ```bash
    node app.js
    ```
    A API estará disponível em `http://localhost:3000`. Você verá uma mensagem no terminal indicando que o servidor está rodando.

## Endpoints da API

A API possui os seguintes endpoints CRUD para gerenciar itens:

* **`POST /items`**: Cria um novo item.
    * Corpo da requisição (JSON):
        ```json
        {
            "name": "Nome do item",
            "description": "Descrição do item (opcional)",
            "price": 10.99,
            "on_sale": true
        }
        ```
    * Resposta (JSON): O item criado com um ID gerado.
* **`GET /items`**: Lista todos os itens.
    * Resposta (JSON): Uma lista de todos os itens.
* **`GET /items/:id`**: Obtém um item específico pelo ID.
    * Parâmetro: `id` (inteiro)
    * Resposta (JSON): O item encontrado ou um erro 404 se não encontrado.
* **`PUT /items/:id`**: Atualiza um item existente pelo ID.
    * Parâmetro: `id` (inteiro)
    * Corpo da requisição (JSON): Os campos a serem atualizados (não precisa incluir todos).
    * Resposta (JSON): O item atualizado ou um erro 404 se não encontrado.
* **`DELETE /items/:id`**: Deleta um item existente pelo ID.
    * Parâmetro: `id` (inteiro)
    * Resposta: Código de status 204 (No Content) em caso de sucesso ou 404 se não encontrado.

## Testes de Performance com k6

Este projeto inclui um script de teste k6 básico para avaliar o desempenho da API.

1.  **Navegar até o diretório do projeto (se ainda não estiver lá):**
    ```bash
    cd <NOME_DO_REPOSITORIO>
    ```

2.  **Criar um arquivo de teste k6 (opcional):**
    Se você ainda não tem um arquivo de teste k6, crie um arquivo chamado `k6_script.js` (ou com outro nome de sua preferência) na raiz do projeto.

3.  **Adicionar o script de teste k6:**
    Cole o seguinte exemplo de script k6 no arquivo criado:

    ```javascript
    import http from 'k6/http';
    import { check, sleep } from 'k6';

    export const options = {
        vus: 10, // Número de usuários virtuais
        duration: '30s', // Duração do teste
        thresholds: {
            http_req_duration: ['p(95)<200'], // 95% das requisições devem ser menores que 200ms
            http_req_failed: ['rate<0.01'],    // A taxa de falha não deve exceder 1%
        },
    };

    export default function () {
        // Criar um novo item
        const createPayload = JSON.stringify({
            name: `Test Item ${Math.random()}`,
            price: Math.random() * 100,
        });
        const createRes = http.post('http://localhost:3000/items', createPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        check(createRes, { 'create item status is 201': (r) => r.status === 201 });

        // Listar os itens
        const listRes = http.get('http://localhost:3000/items');
        check(listRes, { 'list items status is 200': (r) => r.status === 200 });

        sleep(1);
    }
    ```

4.  **Executar os testes k6:**
    Certifique-se de que a API esteja rodando (`node app.js`) em outra janela do terminal. Em seguida, execute o script k6:
    ```bash
    k6 run k6_script.js
    ```
    Substitua `k6_script.js` pelo nome do seu arquivo de teste, se for diferente.

5.  **Analisar os resultados:**
    O k6 exibirá métricas detalhadas no terminal durante e após a execução do teste, incluindo:
    * Request rate
    * Response time (mínimo, médio, máximo, percentis)
    * Error rate
    * Número de requisições
    * Etc.

## Personalização dos Testes k6

Você pode personalizar o script de teste k6 para simular diferentes cenários de carga e testar endpoints específicos da API. Algumas opções comuns incluem:

* **Aumentar o número de usuários virtuais (`vus`)**: Para simular mais tráfego.
* **Aumentar a duração do teste (`duration`)**: Para testar a estabilidade da API por um período mais longo.
* **Adicionar testes para outros endpoints**: Como `GET /items/:id`, `PUT /items/:id` e `DELETE /items/:id`.
* **Implementar cenários mais complexos**: Como sequências de requisições (criar um item e depois obtê-lo).
* **Configurar thresholds**: Para definir limites de desempenho aceitáveis.

Consulte a [documentação oficial do k6](https://k6.io/docs/) para obter mais informações sobre como escrever scripts de teste.

## Contribuição

Contribuições para este projeto são bem-vindas. Sinta-se à vontade para abrir issues e enviar pull requests.


---

Este README fornece instruções claras para configurar a API e executar os testes de performance com k6. Adapte o conteúdo conforme necessário para o seu projeto específico. Certifique-se de substituir `<URL_DO_SEU_REPOSITORIO>` e `<NOME_DO_REPOSITORIO>` pelos valores corretos. Adicione também a licença que você deseja usar para o seu projeto.
