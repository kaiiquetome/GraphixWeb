# GraphixHub - Sistema de Gestão para Indústria Gráfica

## 📋 Visão Geral

O GraphixHub é uma aplicação web moderna desenvolvida em Next.js 14+ com TypeScript para gerenciar operações de uma indústria gráfica. A aplicação consome a API GraphixHub e oferece uma interface intuitiva para gestão de pedidos, clientes, produtos e serviços de produção.

## 🏗️ Arquitetura e Fluxo de Dados

### Estrutura da Aplicação

```
src/
├── app/                    # App Router do Next.js 14+
│   ├── (auth)/            # Grupo de rotas de autenticação
│   ├── (dashboard)/       # Grupo de rotas do dashboard
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI base
│   ├── forms/            # Formulários específicos
│   └── layout/           # Componentes de layout
├── lib/                  # Utilitários e configurações
│   ├── api/              # Cliente HTTP e serviços
│   ├── utils/            # Funções utilitárias
│   └── hooks/            # Hooks customizados
├── providers/            # Context providers
└── types/                # Definições de tipos TypeScript
```

### Fluxo de Autenticação

1. **Inicialização**: A aplicação verifica tokens armazenados no localStorage
2. **Login**: Usuário insere credenciais → API valida → Tokens armazenados
3. **Proteção de Rotas**: Middleware verifica autenticação antes de renderizar
4. **Refresh Token**: Renovação automática de tokens expirados
5. **Logout**: Limpeza de tokens e redirecionamento

### Padrões de Projeto Aplicados

- **Clean Architecture**: Separação clara entre camadas (UI, Business, Data)
- **SOLID Principles**: Componentes com responsabilidades únicas
- **Repository Pattern**: Abstração da camada de dados
- **Observer Pattern**: Context API para gerenciamento de estado
- **Factory Pattern**: Criação de instâncias de componentes

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API GraphixHub rodando localmente

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd graphix-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=GraphixHub
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Execute a aplicação**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa verificação de código
- `npm run lint:fix` - Corrige problemas de linting automaticamente
- `npm run format` - Formata código com Prettier
- `npm run type-check` - Verifica tipos TypeScript

## 🎨 Design System e UI/UX

### Componentes UI

**Button**: Componente de botão com variantes e estados
- Variantes: primary, secondary, outline, ghost, danger
- Estados: loading, disabled
- Tamanhos: sm, md, lg

**Input**: Campo de entrada com validação
- Suporte a labels e mensagens de erro
- Validação integrada com React Hook Form
- Estilos consistentes com design system

**Card**: Container para conteúdo
- Sombras e bordas padronizadas
- Responsivo e acessível

### Paleta de Cores

```css
Primary: #3b82f6 (Azul)
Secondary: #64748b (Cinza)
Success: #22c55e (Verde)
Error: #ef4444 (Vermelho)
```

### Tipografia

- **Fonte Principal**: Inter (Google Fonts)
- **Hierarquia**: Títulos (h1-h6), Corpo, Caption
- **Pesos**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid e Flexbox para layouts responsivos

## 🔧 Tecnologias e Bibliotecas

### Core
- **Next.js 14+**: Framework React com App Router
- **TypeScript**: Tipagem estática para JavaScript
- **React 18**: Biblioteca de interface de usuário

### Styling
- **Tailwind CSS**: Framework CSS utilitário
- **clsx**: Utilitário para classes condicionais
- **tailwind-merge**: Merge inteligente de classes Tailwind

### Forms e Validação
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas TypeScript
- **@hookform/resolvers**: Integração entre React Hook Form e Zod

### HTTP Client
- **Axios**: Cliente HTTP com interceptors
- **Interceptors**: Tratamento automático de erros e tokens

### Estado e Context
- **Context API**: Gerenciamento de estado global
- **useReducer**: Estado complexo para autenticação
- **localStorage**: Persistência de dados de sessão

## 📁 Estrutura de Arquivos Detalhada

### Componentes UI (`src/components/ui/`)

```typescript
// button.tsx - Componente de botão reutilizável
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

// input.tsx - Campo de entrada com validação
interface InputProps {
  label?: string
  error?: string
  helperText?: string
}
```

### Serviços de API (`src/lib/api/`)

```typescript
// client.ts - Cliente HTTP configurado
class ApiClient {
  private setupInterceptors() // Interceptors para tokens e erros
  async get<T>(url: string): Promise<T>
  async post<T>(url: string, data?: any): Promise<T>
}

// auth.ts - Serviços de autenticação
class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse>
  static async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse>
}
```

### Providers (`src/providers/`)

```typescript
// auth-provider.tsx - Context de autenticação
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
}
```

## 🔒 Segurança e Autenticação

### JWT Token Management
- **Access Token**: Autenticação de requisições
- **Refresh Token**: Renovação automática de tokens
- **Interceptors**: Adição automática de headers de autorização

### Proteção de Rotas
- **Middleware**: Verificação de autenticação
- **Redirects**: Redirecionamento automático para login
- **Loading States**: Estados de carregamento durante verificação

### Validação de Dados
- **Zod Schemas**: Validação de entrada de usuário
- **Type Safety**: Tipagem TypeScript para prevenir erros
- **Error Handling**: Tratamento consistente de erros

## 📊 Performance e Otimização

### Next.js 14 Features
- **App Router**: Roteamento baseado em arquivos
- **Server Components**: Renderização no servidor
- **Client Components**: Interatividade no cliente
- **Code Splitting**: Carregamento sob demanda

### Otimizações Implementadas
- **Lazy Loading**: Carregamento de componentes sob demanda
- **Image Optimization**: Otimização automática de imagens
- **Bundle Analysis**: Análise de tamanho de bundle
- **Caching**: Cache de requisições HTTP

## 🧪 Testes e Qualidade

### Linting e Formatação
- **ESLint**: Regras de qualidade de código
- **Prettier**: Formatação consistente
- **TypeScript**: Verificação de tipos

### Convenções de Código
- **Naming**: camelCase para variáveis, PascalCase para componentes
- **Imports**: Imports organizados por tipo
- **Comments**: Documentação de funções complexas
- **Error Handling**: Try-catch consistente

## 🚀 Deploy e Produção

### Build de Produção
```bash
npm run build
npm run start
```

### Variáveis de Ambiente
- `NEXT_PUBLIC_API_URL`: URL da API GraphixHub
- `NEXT_PUBLIC_APP_NAME`: Nome da aplicação
- `NEXT_PUBLIC_APP_VERSION`: Versão da aplicação

### Otimizações de Produção
- **Minificação**: Código minificado automaticamente
- **Tree Shaking**: Remoção de código não utilizado
- **Compression**: Compressão gzip/brotli
- **CDN**: Distribuição de conteúdo estático

## 🔄 Próximos Passos

### Funcionalidades Planejadas
1. **Dashboard Completo**: Métricas e gráficos
2. **CRUD de Entidades**: Clientes, Produtos, Pedidos
3. **Sistema de Relatórios**: Exportação de dados
4. **Notificações**: Sistema de alertas
5. **Upload de Arquivos**: Gestão de documentos

### Melhorias Técnicas
1. **Testes Unitários**: Jest e React Testing Library
2. **Testes E2E**: Playwright ou Cypress
3. **PWA**: Progressive Web App
4. **Offline Support**: Funcionalidade offline
5. **Internationalization**: Suporte a múltiplos idiomas

## 📞 Suporte

Para dúvidas ou problemas:
- **Issues**: Abra uma issue no repositório
- **Documentação**: Consulte a documentação da API
- **Desenvolvedor**: Entre em contato com a equipe de desenvolvimento

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Licença**: MIT 