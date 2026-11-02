# Biblioteca Gustavo

API REST de biblioteca desenvolvida com Node.js e Express. Permite cadastrar, consultar, atualizar e excluir livros e leitores, além de registrar empréstimos e devoluções.

## Identificação

- Repositório: https://github.com/setembroo895-hub/BIBLIOTECAGUSTAVO
- Projeto individual (1 integrante).
- Uma regra de negócio exigida; cinco regras de empréstimo implementadas, descritas abaixo.

## Requisitos e execução

Instale Node.js 18 ou superior e npm. Execute os comandos na raiz do repositório:

```bash
git clone https://github.com/setembroo895-hub/BIBLIOTECAGUSTAVO.git
cd BIBLIOTECAGUSTAVO
npm install
npm start
```

A API ficará disponível em `http://localhost:3000`. Encerre com `Ctrl+C`. A porta 3000 deve estar livre.

## Organização

```text
BIBLIOTECAGUSTAVO/
├── README.md
├── package.json
├── .gitignore
└── BIBLIOTECA/
    └── servidor.js
```

O manifesto fica na raiz; o código do servidor permanece em `BIBLIOTECA/`.

## Dados e persistência

Os dados são armazenados em arrays na memória, sem banco de dados. A aplicação inicia vazia e todos os registros são perdidos ao reiniciar o servidor. Os IDs numéricos são gerados automaticamente.

| Entidade | Campos |
| --- | --- |
| Livro | `id`, `titulo`, `autor` |
| Leitor | `id`, `nome`, `email` |
| Empréstimo | `id`, `livro_id`, `leitor_id`, `devolvido` |

## Endpoints

Envie corpos de requisição em JSON com `Content-Type: application/json`.

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/` | Mensagem de apresentação |
| GET | `/livros` | Listar livros |
| GET | `/livros/:id` | Consultar livro |
| POST | `/livros` | Criar livro |
| PUT | `/livros/:id` | Atualizar título e autor |
| DELETE | `/livros/:id` | Excluir livro sem empréstimo pendente |
| GET | `/leitores` | Listar leitores |
| GET | `/leitores/:id` | Consultar leitor |
| POST | `/leitores` | Criar leitor |
| PUT | `/leitores/:id` | Atualizar nome e email |
| DELETE | `/leitores/:id` | Excluir leitor sem empréstimo pendente |
| GET | `/emprestimos` | Listar empréstimos |
| GET | `/emprestimos/:id` | Consultar empréstimo |
| POST | `/emprestimos` | Registrar empréstimo |
| PUT | `/emprestimos/:id/devolucao` | Registrar devolução |

Livros e leitores possuem CRUD completo. Empréstimos oferecem criação, consulta e devolução; não possuem exclusão ou alteração geral.

## Validações e regras de negócio

Título e autor do livro, assim como nome e email do leitor, devem ser textos não vazios. Espaços nas extremidades são removidos. O email não possui validação de formato ou unicidade.

1. Um empréstimo exige livro e leitor existentes.
2. Um livro não pode ter dois empréstimos pendentes ao mesmo tempo.
3. Um empréstimo já devolvido não pode ser devolvido novamente.
4. Um livro com empréstimo pendente não pode ser excluído.
5. Um leitor com empréstimo pendente não pode ser excluído.

Após a devolução, o livro pode ser emprestado novamente e as exclusões são permitidas. Empréstimos devolvidos permanecem no histórico, inclusive após a exclusão do livro ou leitor relacionado.

Criações retornam `201`, consultas e demais operações bem-sucedidas retornam `200`, validações retornam `400` e IDs inexistentes nas rotas de consulta/alteração/exclusão retornam `404`. Erros tratados são retornados no formato `{"erro":"mensagem"}`. Rotas não cadastradas usam a resposta 404 padrão do Express.

## Exemplo de uso

Exemplos para terminal Bash, com o servidor em execução. Em uma execução vazia, os primeiros IDs são 1.

```bash
curl -X POST http://localhost:3000/livros -H 'Content-Type: application/json' -d '{"titulo":"Dom Casmurro","autor":"Machado de Assis"}'
curl -X POST http://localhost:3000/leitores -H 'Content-Type: application/json' -d '{"nome":"Gustavo","email":"gustavo@example.com"}'
curl -X POST http://localhost:3000/emprestimos -H 'Content-Type: application/json' -d '{"livro_id":1,"leitor_id":1}'
curl http://localhost:3000/livros
curl -X PUT http://localhost:3000/emprestimos/1/devolucao
curl -X PUT http://localhost:3000/livros/1 -H 'Content-Type: application/json' -d '{"titulo":"Memórias Póstumas de Brás Cubas","autor":"Machado de Assis"}'
curl -X DELETE http://localhost:3000/livros/1
```

Para conferir as regras, tente repetir o empréstimo antes de devolver o livro, excluir o livro ou leitor durante um empréstimo pendente, registrar uma segunda devolução ou criar um empréstimo com IDs inexistentes. Essas tentativas devem retornar `400`.

## Versionamento e entrega

As correções devem ser registradas em novos commits com mensagens que descrevam as alterações reais. Para as próximas etapas, faça commits à medida que implementar e validar cada mudança. Não altere datas nem crie commits artificiais para simular desenvolvimento anterior.

A inclusão deste README corrige a ausência de documentação. As alterações atuais não corrigem retroativamente um histórico com commit único nem uma entrega fora do prazo; esses pontos dependem dos critérios e da reavaliação do responsável.
