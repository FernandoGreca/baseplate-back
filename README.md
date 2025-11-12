## Demonstration API

Monorepo simples contendo um backend NestJS em `api/` com autenticação JWT, módulos de catálogo (produtos, preços e estoque) e documentação Swagger pronta para uso.

### Pré-requisitos
- Node.js 20+
- MongoDB em execução (local ou remoto)

### Configurando variáveis de ambiente
1. Entre na pasta `api/`.
2. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
3. Ajuste os valores conforme seu ambiente:
   | Variável | Descrição |
   | --- | --- |
   | `PORT` | Porta HTTP exposta pela API |
   | `JWT_SECRET` | Segredo usado para assinar tokens |
   | `MONGODB_URI` | Connection string do MongoDB |

### Scripts úteis
Dentro de `api/` execute:

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala dependências |
| `npm run start:dev` | Sobe a API em modo watch |
| `npm run test` | Executa os testes unitários |
| `npm run lint` | Verifica o lint com ESLint/Prettier |

### Arquitetura resumida
- `src/features/auth`: login, registro, troca de senha e guard JWT.
- `src/features/user`: CRUD de usuários com bcrypt e DTOs validados.
- `src/features/product`: Produtos com preço/estoque vinculados.
- `src/features/order`: Pedidos com itens, pagamento e endereço de entrega.
- `src/features/price` e `stock`: Serviços especializados para manter relacionamentos consistentes.

### Documentação
Após iniciar o servidor, acesse `http://localhost:PORT/api` para visualizar o Swagger com autenticação por bearer token.

### Filtragem dinâmica (BaseService)
As rotas que utilizam o `BaseService` aceitam filtros via query string que são convertidos automaticamente em queries MongoDB conforme o tipo do campo definido no schema:

| Tipo | Operadores / Comportamento | Exemplo |
| --- | --- | --- |
| Número | `gt`, `gte`, `lt`, `lte`, igualdade (padrão) | `?age[gte]=30&age[lt]=50` |
| Data | Mesmos operadores de número, convertidos para `Date` | `?createdAt[gte]=2024-01-01&createdAt[lte]=2024-12-31` |
| String | Igualdade case-insensitive ou `contains` para buscas parciais | `?name=Fernando` ou `?name[contains]=fer` |

A sintaxe segue o padrão `campo[operador]=valor`. Se nenhum operador for informado, é usada igualdade (`$eq`). Para strings, `contains` gera um regex case-insensitive parcial; sem operador, é uma correspondência exata (ainda case-insensitive). Consultas múltiplas para o mesmo campo podem ser repetidas (`?age[gt]=20&age[lt]=40`). Campos inexistentes no schema são ignorados.
