# NoteKeeper — The Personal Archive

**Um arquivo pessoal para registrar, organizar e preservar suas ideias.**

O NoteKeeper é uma aplicação full-stack de anotações desenvolvida com **.NET 10, ASP.NET Core e Angular**. Inspirado na estética de arquivos literários, bibliotecas antigas e máquinas de escrever, o projeto combina organização pessoal, autenticação segura e uma interface editorial para transformar o registro de informações em uma experiência mais envolvente.

A aplicação permite criar uma conta, organizar notas por categorias, editar informações, arquivar conteúdos e localizar registros por meio de filtros. Sua arquitetura separa as responsabilidades do backend e do frontend, mantendo as regras de negócio independentes da interface.

## ✦ Conceito e identidade visual

O NoteKeeper adota o conceito **The Personal Archive**: um espaço digital pessoal inspirado nos arquivos físicos em que cartas, manuscritos e ideias são preservados ao longo do tempo.

A interface utiliza uma paleta de tons de papel, madeira e bronze, tipografia editorial e elementos visuais inspirados em fichários e máquinas de escrever. As categorias remetem a gavetas de um arquivo, enquanto as notas são organizadas em uma interface visual de acompanhamento.

O resultado busca equilibrar uma identidade visual marcante com uma experiência de uso funcional e intuitiva.

## Tecnologias

### Backend

[![.NET](https://img.shields.io/badge/.NET%2010-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://learn.microsoft.com/aspnet/core/)
[![Entity Framework Core](https://img.shields.io/badge/Entity%20Framework%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://learn.microsoft.com/ef/core/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Swagger](https://img.shields.io/badge/OpenAPI%20%2F%20Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

- **C# e .NET 10:** desenvolvimento da API REST.
- **ASP.NET Core:** criação de endpoints, pipeline HTTP e autorização.
- **ASP.NET Core Identity:** gerenciamento de usuários e credenciais.
- **JWT Bearer:** autenticação das requisições protegidas.
- **Entity Framework Core:** persistência de dados e migrations.
- **SQL Server:** banco de dados relacional.
- **MediatR:** organização dos casos de uso por requests e handlers.
- **FluentResults:** representação de resultados e erros das operações.
- **Problem Details:** padronização das respostas de erro HTTP.
- **Swagger / OpenAPI:** documentação e exploração da API.

### Frontend

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Lucide](https://img.shields.io/badge/Lucide%20Icons-F56565?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

- **Angular:** construção da aplicação web com componentes standalone e roteamento.
- **TypeScript:** tipagem e organização da lógica do frontend.
- **Tailwind CSS:** estilização e composição dos layouts.
- **Lucide Icons:** ícones utilizados nos elementos da interface.
- **Angular Signals:** gerenciamento reativo do estado de autenticação.
- **HTTP Interceptors:** inclusão do token JWT nas requisições protegidas.
- **Angular Router:** navegação entre páginas e funcionalidades.

## Funcionalidades

### Autenticação e gerenciamento de sessão

- Cadastro de usuários com nome, e-mail e senha.
- Login com e-mail e senha.
- Autenticação por JWT Bearer.
- Consulta dos dados do usuário autenticado.
- Logout com revogação do token atual.
- Restauração da sessão ao recarregar a aplicação.
- Exibição do nome do usuário autenticado.
- Restrição das funcionalidades pessoais a usuários autenticados.
- Isolamento dos dados por usuário.

### Categorias

- Cadastro de categorias.
- Listagem das categorias cadastradas.
- Consulta individual por identificador.
- Edição de categorias existentes.
- Exclusão de categorias.
- Validação de títulos.
- Prevenção de títulos duplicados para o mesmo usuário.

### Notas

- Cadastro de notas.
- Listagem e consulta de notas.
- Edição e exclusão de registros.
- Associação opcional de uma ou mais categorias.
- Filtragem por múltiplas categorias.
- Gerenciamento de notas ativas e arquivadas.
- Pesquisa e organização visual das notas.
- Identificação do status de cada nota.

### Experiência de interface

- Identidade visual inspirada em arquivos literários.
- Organização das categorias em uma interface inspirada em fichários de madeira.
- Visualização das notas em colunas organizadas por status.
- Busca e filtros para facilitar a localização de registros.
- Componentes de formulário, feedback visual e modais de interação.
- Layout adaptável a diferentes tamanhos de tela.

## Regras de negócio

### Usuários

| Campo | Regra |
|---|---|
| Nome | Obrigatório e utilizado para identificar o usuário. |
| E-mail | Obrigatório, válido e único. |
| Senha | Obrigatória, com pelo menos 8 caracteres, incluindo um número e um caractere especial. |

Cada usuário pode consultar e modificar somente as próprias categorias e notas. As operações protegidas exigem autenticação válida.

### Categorias

| Campo ou operação | Regra |
|---|---|
| Título | Obrigatório, entre 2 e 100 caracteres. |
| Unicidade | Não são permitidos títulos duplicados para o mesmo usuário, desconsiderando diferenças de caixa e espaços nas extremidades. |
| Exclusão | Remove a categoria e suas associações com as notas, preservando as notas cadastradas. |

### Notas

| Campo ou operação | Regra |
|---|---|
| Título | Obrigatório, entre 2 e 100 caracteres. |
| Descrição | Opcional, com até 300 caracteres. |
| Status inicial | Toda nota nova começa como ativa. |
| Status disponíveis | Ativa ou arquivada. |
| Categorias | Opcionais; uma nota pode não possuir categorias associadas. |
| Unicidade | Não são permitidas notas com títulos duplicados para o mesmo usuário, desconsiderando diferenças de caixa e espaços nas extremidades. |
| Atualização | A lista de categorias enviada na atualização substitui as associações existentes. |

Ao atualizar uma nota, envie `categoriaIds: []` para remover todas as associações com categorias.

## Arquitetura do projeto

O repositório é organizado em duas aplicações independentes: uma API responsável pelas regras de negócio e persistência, e uma aplicação Angular responsável pela interface e interação com o usuário.

```text
NoteKeeper/
├── server/
│   ├── src/
│   │   ├── Dominio/
│   │   ├── Aplicacao/
│   │   ├── Infraestrutura/
│   │   └── Api/
│   ├── tests/
│   ├── NoteKeeper.slnx
│   └── dotnet-tools.json
│
├── client/
│   ├── src/
│   │   └── app/
│   ├── public/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
└── README.md
```

*Os nomes e arquivos exibidos representam a organização geral do projeto; a estrutura exata pode variar conforme a evolução do código.*

### Responsabilidades das camadas

- **Domínio:** entidades, conceitos e regras centrais do negócio.
- **Aplicação:** casos de uso, requests, handlers, contratos e representação de resultados por meio de FluentResults.
- **Infraestrutura:** persistência com Entity Framework Core, integração com o banco de dados e serviços externos às regras centrais.
- **API:** endpoints HTTP, autenticação, autorização, configuração da aplicação e conversão dos resultados dos casos de uso em respostas HTTP.
- **Client:** componentes Angular, páginas, serviços HTTP, estado de autenticação, navegação e apresentação visual.

Essa separação facilita a manutenção, os testes e a evolução das funcionalidades sem concentrar as responsabilidades em uma única camada.

## API REST

A API utiliza JSON para receber e retornar dados. As rotas pessoais exigem um token JWT válido no cabeçalho `Authorization`.

### Autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/cadastro` | Público | Cria uma conta. |
| `POST` | `/auth/login` | Público | Autentica o usuário e retorna o JWT. |
| `GET` | `/auth/me` | Bearer | Retorna os dados do usuário autenticado. |
| `POST` | `/auth/logout` | Bearer | Revoga o token atual. |

### Categorias

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/categorias` | Bearer | Lista as categorias do usuário. |
| `POST` | `/categorias` | Bearer | Cadastra uma categoria. |
| `GET` | `/categorias/{id}` | Bearer | Consulta uma categoria específica. |
| `PUT` | `/categorias/{id}` | Bearer | Atualiza uma categoria. |
| `DELETE` | `/categorias/{id}` | Bearer | Exclui uma categoria. |

### Notas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/notas` | Bearer | Lista as notas, com filtro opcional por categorias. |
| `POST` | `/notas` | Bearer | Cadastra uma nota. |
| `GET` | `/notas/{id}` | Bearer | Consulta uma nota específica. |
| `PUT` | `/notas/{id}` | Bearer | Atualiza uma nota e suas associações. |
| `DELETE` | `/notas/{id}` | Bearer | Exclui uma nota. |

### Filtro por múltiplas categorias

O endpoint `GET /notas` aceita o parâmetro `categoriaIds` repetido na query string.

Exemplo:

```http
GET /notas?categoriaIds=<id-da-categoria-1>&categoriaIds=<id-da-categoria-2>
```

O filtro é exclusivo: quando vários identificadores são informados, são retornadas somente as notas associadas a **todas as categorias especificadas**.

Sem o parâmetro, a API retorna todas as notas do usuário autenticado.

### Autenticação nas requisições

Após o login, utilize o token retornado pela API no cabeçalho das operações protegidas.

```http
Authorization: Bearer <seu-token-jwt>
```

A aplicação não utiliza refresh tokens. Quando o token expira, é necessário realizar o login novamente.

### Tratamento de erros

A API utiliza respostas `ProblemDetails` para padronizar os erros HTTP. Erros de validação podem incluir mensagens específicas para cada campo, enquanto as respostas de erro da aplicação podem conter um identificador de rastreamento (`traceId`) para auxiliar no diagnóstico.

A documentação interativa e os exemplos de requisições estão disponíveis pelo Swagger/OpenAPI, e o arquivo `server/src/Api/NoteKeeper.Api.http` reúne exemplos de chamadas HTTP.

## Configuração e execução

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
- [Node.js](https://nodejs.org/) e npm, em versões compatíveis com o Angular utilizado.
- [Angular CLI](https://angular.dev/tools/cli).
- SQL Server ou SQL Server LocalDB.
- Uma chave de assinatura JWT com pelo menos 32 bytes.
- A chave de licença do Lucky Penny Software, caso exigida pela configuração do MediatR utilizada no projeto.

### 1. Configurando o backend

Na raiz do repositório, configure as informações sensíveis por meio do User Secrets. Não armazene senhas, chaves JWT ou licenças diretamente no código-fonte.

```bash
dotnet user-secrets set "ConnectionStrings:SqlServer" "<connection-string-sql-server>" --project server/src/Api/NoteKeeper.Api.csproj

dotnet user-secrets set "Jwt:SigningKey" "<chave-aleatoria-com-pelo-menos-32-bytes>" --project server/src/Api/NoteKeeper.Api.csproj

dotnet user-secrets set "LuckyPenny:LicenseKey" "<chave-de-licenca>" --project server/src/Api/NoteKeeper.Api.csproj
```

Para um ambiente local que utilize SQL Server LocalDB, uma connection string de referência é:

```text
Server=(localdb)\MSSQLLocalDB;Database=NoteKeeperDb;Trusted_Connection=True;TrustServerCertificate=True
```

Adapte a conexão ao ambiente utilizado. LocalDB é uma opção para desenvolvimento no Windows; outros ambientes podem utilizar uma instância convencional do SQL Server.

### 2. Restaurando as ferramentas e o banco

Na raiz do repositório, execute:

```bash
dotnet tool restore

dotnet ef database update --project server/src/Infraestrutura/NoteKeeper.Infraestrutura.csproj --startup-project server/src/Api/NoteKeeper.Api.csproj
```

O primeiro comando restaura as ferramentas locais definidas no manifesto do projeto. O segundo aplica as migrations pendentes ao banco configurado.

Em ambiente de desenvolvimento, a API também aplica as migrations na inicialização, conforme sua configuração.

### 3. Executando a API

```bash
dotnet run --project server/src/Api/NoteKeeper.Api.csproj
```

Utilize a URL informada no terminal para acessar a API. Quando o Swagger estiver habilitado, sua interface estará disponível no caminho `/swagger` da URL correspondente.

### 4. Instalando as dependências do Angular

Abra outro terminal e acesse a pasta do frontend:

```bash
cd client
npm install
```

Confira a configuração do endereço da API no serviço de configuração ou ambiente utilizado pelo frontend. O endereço deve corresponder à URL em que o backend está sendo executado.

A API deve permitir a origem local do Angular por meio da configuração de CORS. No ambiente de desenvolvimento, o projeto utiliza a origem `http://localhost:4200`.

### 5. Executando o frontend

Ainda na pasta `client`, execute:

```bash
npx ng serve
```

A aplicação estará disponível, por padrão, em:

```text
http://localhost:4200
```

Mantenha o backend e o frontend em execução simultaneamente.

## Build e testes

### Backend

Para compilar a solução em modo Release:

```bash
dotnet build server/NoteKeeper.slnx --configuration Release
```

Para executar os testes automatizados:

```bash
dotnet test server/NoteKeeper.slnx
```

Os testes devem ser executados com as dependências e a configuração de banco necessárias para os projetos de teste utilizados.

### Frontend

Para gerar o build de produção, na pasta `client`, execute:

```bash
npx ng build
```

O Angular produzirá os arquivos compilados no diretório de saída configurado pelo projeto.

## Segurança e boas práticas

- Segredos e credenciais são configurados fora do código-fonte.
- As rotas pessoais exigem autenticação.
- O backend é responsável por aplicar o isolamento dos dados por usuário; a proteção não depende apenas dos filtros apresentados na interface.
- As senhas são gerenciadas pelo ASP.NET Core Identity.
- A assinatura e a expiração dos JWTs são configuradas no backend.
- O logout revoga o token atual por meio do mecanismo de revogação implementado na API.
- As migrations do Entity Framework Core versionam as alterações do esquema do banco.
- Os erros HTTP seguem um formato padronizado para facilitar o consumo pelo frontend.

## Objetivo do projeto

O NoteKeeper foi desenvolvido como um projeto full-stack para aplicar conhecimentos de desenvolvimento de APIs REST, arquitetura em camadas, autenticação, persistência relacional, testes e construção de interfaces modernas.

Além dos aspectos técnicos, o projeto explora como identidade visual, organização da informação e interação podem trabalhar juntas para criar uma aplicação com personalidade própria.

---

**NoteKeeper — The Personal Archive**

*Preserve your thoughts. Organize your world.*