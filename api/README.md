# Demonstration API

Backend NestJS responsável por autenticação JWT, gestão de usuários e módulos de catálogo (produtos, preços e estoque). O projeto já expõe documentação Swagger e endpoint de saúde para observabilidade.

## Como executar

```bash
npm install
cp .env.example .env
npm run start:dev
```

- Swagger: `http://localhost:3001/api`
- Health check: `http://localhost:3001/health`

## Principais módulos
- **Auth** (`src/features/auth`) – login, registro e troca de senha com bcrypt e JWT.
- **User** (`src/features/user`) – CRUD completo com validações e DTOs dedicados.
- **Product/Price/Stock** (`src/features/*`) – estrutura desacoplada para manter preços e estoques sincronizados por produto.
- **Order** (`src/features/order`) – pedidos com itens comprados, endereço de entrega e dados de pagamento.
- **BaseService** – paginação, ordenação, seleção de campos e filtros dinâmicos via query string reutilizados pelos módulos de listagem.

## Convenções úteis
- Validações globais (`ValidationPipe`) com `whitelist` + `forbidNonWhitelisted`.
- `LoggingInterceptor` registra método, rota, status e tempo de resposta.
- `MongooseExceptionFilter` traduz erros de chave duplicada em respostas 409.
- Paginação e filtros prontos no `BaseService` + decorator `@ApiQueryList`.

## Scripts
| Comando | Descrição |
| --- | --- |
| `npm run start` | Sobe a API no modo padrão |
| `npm run start:dev` | Watch mode com recarga automática |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Testes end-to-end |
| `npm run lint` | ESLint + Prettier |

## Próximos passos sugeridos
- Configurar pipelines no GitLab CI para lint/test/build.
- Adicionar seeds para ambientes de desenvolvimento.
- Publicar imagens Docker a partir do diretório `api/`.
