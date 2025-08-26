# 📋 GraphixHub - Documentação de Requisitos do Projeto FirstLabel

## 🎯 **VISÃO GERAL DO PROJETO**

### **Objetivo Principal**
Sistema integrado de gestão para a **gráfica FirstLabel**, focado em:
- **Gestão de Pedidos** (core business)
- **Ordem de Serviço** (processo produtivo)
- **Controle operacional** completo

### **Escopo Atual vs. Desenvolvido**
```
DESENVOLVIDO ATÉ AGORA:
✅ Login/Autenticação JWT
✅ Customer Management (CRUD completo)
✅ Product Management (CRUD completo)
❌ Order Management (não iniciado)
❌ Order Service Management (apenas listagem/edição)
❌ Relatórios PDF
❌ Controle de Estoque
```

---

## 📊 **ANÁLISE DETALHADA DOS REQUISITOS**

### **🔄 PRIMEIRA FASE (120h) - ESTADO ATUAL**

#### ✅ **IMPLEMENTADO:**
- **Login**: Sistema JWT funcional
- **Administração de Clientes**: CRUD completo via web
- **Administração de Produtos**: CRUD completo via web

#### ❌ **FALTANDO IMPLEMENTAR:**
- **Administração de Pedidos**: CRUD completo (1:N cliente-produto)
- **Emissão de Orçamento**: PDF A4
- **Emissão de Ordem de Serviço**: PDF A4
- **Importação XSLT**: Para clientes e produtos

#### 📋 **ENTIDADES PRINCIPAIS - MAPEAMENTO**

##### **CLIENTE (Customer)**
```typescript
// ✅ IMPLEMENTADO - Conforme requisitos
interface CustomerData {
  nome: string           // ✅ corporateName
  endereco: string       // ❌ FALTANDO no swagger
  telefone: string       // ✅ phone
  email: string          // ✅ email
  cnpj_cpf: string       // ✅ cnpj
  contato: string        // ✅ contact
}
```

##### **PRODUTO (Product)**
```typescript
// ✅ IMPLEMENTADO - Parcialmente conforme
interface ProductData {
  nome: string           // ✅ description
  descricao: string      // ✅ observation
  lote: string           // ❌ FALTANDO no swagger
  preco: number          // ❌ FALTANDO no swagger
  estoque_inicial: number // ❌ FALTANDO no swagger
  estoque_atual: number   // ❌ FALTANDO no swagger
}
```

##### **PEDIDO (Order)**
```typescript
// ❌ NÃO IMPLEMENTADO AINDA
interface PedidoData {
  cliente_id: number
  produtos: {
    produto_id: number
    quantidade: number
  }[]
  prazo: Date
  status: 'orcamento' | 'execucao' | 'finalizado' | 'recusado'
}
```

---

## 🚀 **SEGUNDA FASE (80h) - ROADMAP**

### **🔄 CONTROLE DE ESTOQUE**
- Gerenciamento via ordem de serviço
- Abatimento automático do estoque
- Tela de visualização entrada/saída

### **📊 RELATÓRIOS**
- Produtos (PDF)
- Clientes (PDF) 
- Ordem de Serviço (PDF)
- Pedidos por status (PDF)

### **👥 GESTÃO DE USUÁRIOS**
- Perfis: Admin e Operador
- Permissões diferenciadas
- CRUD de usuários

---

## 🎨 **DOCUMENTOS PDF REQUERIDOS**

### **📄 Layout Orçamento (A4)**
```
DADOS NECESSÁRIOS:
- Informações da empresa
- Dados do cliente
- Lista de produtos/serviços
- Quantidades e valores
- Total do orçamento
- Prazo de validade
```

### **📄 Layout Ordem de Serviço (A4)**
```
DADOS NECESSÁRIOS:
- Número da OS
- Cliente e contato
- Produtos a serem produzidos
- Especificações técnicas
- Prazos de produção
- Responsável pela execução
```

---

## 🔒 **REQUISITOS DE SEGURANÇA**

### **Autenticação**
- ✅ JWT implementado
- ✅ Senhas criptografadas
- ✅ Redirecionamento pós-login

### **Autorização**
```
PERFIS:
- Admin: Acesso total
- Operador: Apenas emissão de OS
```

---

## 📈 **GAPS IDENTIFICADOS**

### **🚨 CRÍTICOS (Bloqueiam primeira fase)**
1. **Order Management**: Sistema de pedidos completo
2. **PDF Generation**: Orçamentos e OS em PDF A4
3. **Order-Product Relationship**: Relacionamento 1:N
4. **Status Workflow**: Estados do pedido

### **⚠️ IMPORTANTES (Segunda fase)**
1. **Controle de Estoque**: Campos faltando na API
2. **Relatórios**: Sistema de reports
3. **User Management**: Perfis e permissões
4. **XSLT Import**: Importação de templates

### **💡 MELHORIAS IDENTIFICADAS**
1. **Customer**: Falta campo endereço
2. **Product**: Falta preço e estoque
3. **Workflow**: Status do pedido
4. **UI/UX**: Layouts específicos para gráfica

---

## 🛠️ **TECNOLOGIAS - ALINHAMENTO**

### **Backend Requerido vs. Atual**
```
REQUERIDO: Microsoft C# Blazor + SQL Server
ATUAL: .NET API + Next.js frontend

STATUS: ✅ COMPATÍVEL
- API .NET pode servir Blazor
- Banco já estruturado
- Frontend Next.js pode coexistir
```

### **Repositório**
- ✅ GitHub já configurado
- ✅ Estrutura de projeto adequada

---

## 📋 **PRIORIZAÇÃO ESTRATÉGICA**

### **🔥 FASE 1 - COMPLETAR (60h restantes)**
1. **Order Management CRUD** (20h)
2. **PDF Generation System** (15h)
3. **Order-Product Integration** (10h)
4. **Status Workflow** (10h)
5. **Testing & Polish** (5h)

### **🚀 FASE 2 - NOVA (80h)**
1. **Controle de Estoque** (25h)
2. **Sistema de Relatórios** (20h)
3. **User Management** (15h)
4. **XSLT Import** (15h)
5. **Backup System** (5h)

---

## 🎯 **CRITÉRIOS DE ACEITAÇÃO - CHECKLIST**

### **✅ PRIMEIRA FASE**
- [ ] Login funcional com JWT
- [ ] CRUD Clientes completo
- [ ] CRUD Produtos completo
- [ ] CRUD Pedidos (1:N cliente-produto)
- [ ] Emissão PDF Orçamento A4
- [ ] Emissão PDF Ordem de Serviço A4

### **⏳ SEGUNDA FASE**
- [ ] Controle estoque via OS
- [ ] Relatórios PDF (4 tipos)
- [ ] Perfis Admin/Operador
- [ ] Backup automático

---

## 💡 **INSIGHTS ARQUITETURAIS**

### **1. Foco no Core Business**
O projeto é **centrado em pedidos e ordens de serviço**, não apenas CRUD genérico.

### **2. Workflow Específico**
```
Cliente → Produto → Pedido → Orçamento → OS → Produção → Estoque
```

### **3. PDF como Entrega**
Documentos PDF são **outputs críticos** do sistema, não apenas relatórios.

### **4. Controle Operacional**
Sistema visa **controle operacional real** de uma gráfica, com estoque e produção.

---

## 🚨 **AÇÕES IMEDIATAS RECOMENDADAS**

### **1. Completar Order Management**
- Implementar CRUD de pedidos
- Relacionamento cliente-produto
- Status workflow

### **2. Sistema de PDF**
- Biblioteca de geração PDF
- Templates A4 profissionais
- Integração com dados

### **3. Ajustes na API**
- Campos faltantes (endereço, preço, estoque)
- Endpoints para relatórios
- Status de pedidos

---

*Documento criado para orientar desenvolvimento alinhado com requisitos reais do cliente FirstLabel*