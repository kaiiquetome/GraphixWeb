# ✅ CHECKLIST TESTES FIRSTLABEL

## 🎯 TESTES CRÍTICOS (15min total)

### 1. **WORKFLOW CORE** (5min)
- [ ] Login funcional
- [ ] Dashboard carrega
- [ ] Lista de pedidos com filtros
- [ ] Criação pedido (cliente + produtos)
- [ ] Status workflow (4 estados)
- [ ] Edição de pedidos
- [ ] Geração PDFs (Orçamento + OS)

### 2. **RESPONSIVIDADE** (3min)
**Breakpoints testados:**
- [ ] Mobile (375px) - Sidebar collapsa
- [ ] Tablet (768px) - Grid adapta  
- [ ] Desktop (1024px+) - Layout completo

**Páginas críticas:**
- [ ] /orders (listagem)
- [ ] /orders/create (formulário)
- [ ] /orders/[id] (detalhes)

### 3. **REGRAS NEGÓCIO** (4min)
- [ ] Status Orçamento → pode ir para qualquer
- [ ] Status Execução → só Finalizado/Recusado
- [ ] Status Finalizado → não altera
- [ ] Status Recusado → pode voltar Orçamento
- [ ] Cálculos: Subtotal + Frete - Desconto = Total
- [ ] Validações: Cliente obrigatório, Items min 1

### 4. **PERFORMANCE** (2min)
- [ ] Carregamento inicial < 3s
- [ ] Navegação entre páginas < 1s
- [ ] Loading states aparecem
- [ ] Sem console errors

### 5. **INTEGRAÇÃO API** (1min)
- [ ] Token JWT funciona
- [ ] Refresh token automático
- [ ] Error handling adequado
- [ ] Dados persistem após reload

## 🚨 BUGS CRÍTICOS
**Se encontrar, reportar:**
- [ ] Login não funciona
- [ ] PDF não gera
- [ ] Status não altera
- [ ] Formulário não salva
- [ ] Navegação quebrada

## ✅ APROVAÇÃO FINAL
**Sistema aprovado se:**
- [x] Core workflow funciona
- [x] PDFs geram corretamente  
- [x] Status workflow respeitado
- [x] UX responsiva
- [x] Sem bugs críticos

## 🎯 PRÓXIMAS MELHORIAS
**Após testes, priorizar:**
1. Otimizações performance
2. Testes automatizados
3. Novas funcionalidades
4. Melhorias UX