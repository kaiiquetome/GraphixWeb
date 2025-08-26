# Lista Completa de Rotas da API GraphixWeb

## Base URL
```
https://graphixhub-production.up.railway.app/api/v1/
```

---

## 1. AUTENTICAÇÃO (`auth`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| POST | `/auth/login` | Fazer login | Body: `{ username, password }` |
| POST | `/auth/refresh-token` | Renovar token | Body: `{ jwtToken, refreshToken }` |

---

## 2. USUÁRIOS (`user`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/user` | Listar todos os usuários | - |
| GET | `/user/{id}` | Obter usuário específico | id: int |
| POST | `/user` | Criar novo usuário | Body: User object |
| PUT | `/user` | Atualizar usuário | Body: User object |
| DELETE | `/user/{id}` | Deletar usuário | id: int |

---

## 3. CLIENTES (`customer`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/customer` | Listar todos os clientes | - |
| GET | `/customer/{id}` | Obter cliente específico | id: int |
| GET | `/customer` | Listar clientes com filtro | Query: `StartDate`, `EndDate`, `PageSize` |
| POST | `/customer` | Criar novo cliente | Body: Customer object |
| PUT | `/customer` | Atualizar cliente | Body: Customer object |
| DELETE | `/customer/{id}` | Deletar cliente | id: int |

---

## 4. PRODUTOS (`product`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/product` | Listar todos os produtos | - |
| GET | `/product/{id}` | Obter produto específico | id: int |
| POST | `/product` | Criar novo produto | Body: Product object |
| PUT | `/product` | Atualizar produto | Body: Product object |
| DELETE | `/product/{id}` | Deletar produto | id: int |

---

## 5. PEDIDOS (`order`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/order` | Listar todos os pedidos | - |
| GET | `/order/{id}` | Obter pedido específico | id: int |
| GET | `/order` | Listar pedidos com filtro | Query: `StartDate`, `EndDate`, `PageSize` |
| POST | `/order` | Criar novo pedido | Body: OrderDto object |
| PUT | `/order` | Atualizar pedido | Body: OrderDto object |
| DELETE | `/order/{id}` | Deletar pedido | id: int |
| GET | `/order/download` | Download de arquivo do pedido | Query: `Id`, `OrderDeadline` |
| GET | `/order/export` | Exportar pedidos | Query: `StartDate`, `EndDate` |

---

## 6. ORDENS DE SERVIÇO (`orderService`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/orderService` | Listar todas as OS | - |
| GET | `/orderService/{id}` | Obter OS específica | id: int |
| GET | `/orderService` | Listar OS com filtro | Query: `StartDate`, `EndDate`, `PageSize` |
| POST | `/orderService` | Criar nova OS | Body: OSDto object |
| PUT | `/orderService` | Atualizar OS | Body: OSDto object |
| DELETE | `/orderService/{id}` | Deletar OS | id: int |
| GET | `/orderService/download` | Download de arquivo da OS | Query: `Id` |

---

## 7. CONTAS (`account`)

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/account` | Listar todas as contas | - |
| GET | `/account/{id}` | Obter conta específica | id: int |
| POST | `/account` | Criar nova conta | Body: Account object |
| PUT | `/account` | Atualizar conta | Body: Account object |
| DELETE | `/account/{id}` | Deletar conta | id: int |

---

## 8. FLUXO DE CAIXA (`cashFLow`)

> **Nota:** Há um typo no endpoint original - está "cashFLow" em vez de "cashFlow"

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| GET | `/cashFLow` | Listar fluxo de caixa por período | Query: `startDate`, `endDate` |
| GET | `/cashFLow` | Listar fluxo com paginação | Query: `StartDate`, `EndDate`, `PageSize` |
| GET | `/cashFLow/{id}` | Obter entrada específica | id: int |
| POST | `/cashFLow` | Criar nova entrada | Body: CashFlow object |
| PUT | `/cashFLow` | Atualizar entrada | Body: CashFlow object |
| DELETE | `/cashFLow/{id}` | Deletar entrada | id: int |

---

## Resumo dos Endpoints

### Estatísticas Gerais
- **Total de endpoints:** 38
- **Módulos principais:** 8
- **Métodos HTTP suportados:** GET, POST, PUT, DELETE
- **Autenticação:** JWT com refresh token

### Funcionalidades Especiais
- **Download de arquivos:**
  - Pedidos: `/order/download`
  - Ordens de Serviço: `/orderService/download`
- **Export de dados:**
  - Pedidos: `/order/export`
- **Paginação:**
  - Disponível em endpoints específicos com parâmetro `PageSize`
- **Filtros por data:**
  - Disponível em clientes, pedidos, ordens de serviço e fluxo de caixa

### Padrões de URL
- **Base:** `https://graphixhub-production.up.railway.app/api/v1/`
- **Padrão CRUD:** `/{recurso}` para listar/criar, `/{recurso}/{id}` para operações específicas
- **Downloads:** `/{recurso}/download` com parâmetros de query
- **Exports:** `/{recurso}/export` com parâmetros de query

### Observações Técnicas
- Todos os endpoints requerem autenticação via JWT (exceto `/auth/login`)
- Tokens têm validade de 15 minutos com refresh automático
- Headers customizados incluem `ngrok-skip-browser-warning: true`
- Responses seguem padrão `BaseListModel<T>` para listas paginadas