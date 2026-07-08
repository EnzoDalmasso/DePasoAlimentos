# DePasoAlimentos

DePasoAlimentos es una aplicacion web para venta de alimentos congelados. El proyecto esta pensado como portfolio full stack, con foco principal en backend usando ASP.NET Core, Entity Framework Core, SQL Server y Docker, y un frontend publico construido con React y Tailwind CSS.

La aplicacion permite administrar:

- Productos del catalogo.
- Promociones y combos.
- Sugerencias de comidas.
- Imagenes subidas a Supabase Storage.
- Panel de administrador protegido con login.
- Carrito simple que arma el pedido y lo envia por WhatsApp.

El pago no se realiza online. El cliente envia el pedido por WhatsApp y paga al retirar, en efectivo o transferencia.

## Stack Tecnologico

- ASP.NET Core Web API.
- .NET 10.
- Entity Framework Core.
- SQL Server 2022.
- Docker / Docker Compose.
- React.
- Tailwind CSS.
- Supabase Storage.
- JWT para autenticacion del panel administrador.

## Arquitectura

La solucion esta organizada en capas simples:

```text
DePasoAlimentos
|-- DePasoAlimentos
|   |-- Controllers
|   |-- Program.cs
|   |-- appsettings.json
|   `-- DePasoAlimentos.http
|
|-- DePasoAlimentos.Application
|   |-- DTOs
|   |-- Interfaces
|   `-- Services
|
|-- DePasoAlimentos.Domain
|   `-- Entities
|
|-- DePasoAlimentos.Infrastructure
|   |-- Data
|   |   |-- AppDbContext.cs
|   |   `-- Migrations
|   `-- Repositories
|
|-- frontend
|   |-- src
|   |   |-- components
|   |   |-- context
|   |   |-- pages
|   |   |-- sections
|   |   |-- services
|   |   `-- types
|   `-- package.json
|
|-- docker-compose.yml
`-- README.md
```

### Responsabilidades Por Capa

`DePasoAlimentos`

Proyecto Web API. Contiene controllers, configuracion HTTP, CORS, autenticacion JWT, registro de servicios y archivo `.http` para probar endpoints.

`DePasoAlimentos.Domain`

Contiene las entidades principales del negocio:

- `Product`
- `Promotion`
- `FoodSuggestion`
- `AdminUser`

Esta capa no depende de ASP.NET Core, Entity Framework ni SQL Server.

`DePasoAlimentos.Application`

Contiene DTOs, interfaces y servicios de aplicacion. Aca vive la logica de casos de uso: crear productos, actualizar promociones, publicar sugerencias, autenticar administradores, etc.

`DePasoAlimentos.Infrastructure`

Contiene detalles tecnicos: Entity Framework Core, `AppDbContext`, migraciones y repositorios.

`frontend`

Aplicacion React que consume la API. Incluye catalogo publico, promociones, sugerencias, panel admin, subida de imagenes a Supabase y carrito para enviar pedidos por WhatsApp.

## Requisitos

- .NET SDK 10.
- Docker Desktop.
- Node.js.
- Visual Studio 2026 o compatible con .NET 10.
- Opcional: Visual Studio Code para trabajar el frontend.
- Cuenta de Supabase para almacenar imagenes.

## Variables Y Secretos

No se deben subir secretos reales a GitHub.

Archivos locales ignorados por Git:

- `.env`
- `DePasoAlimentos/appsettings.Development.json`
- `frontend/.env.local`

Archivos de ejemplo que si se suben:

- `.env.example`
- `DePasoAlimentos/appsettings.Development.example.json`
- `frontend/.env.example`

### Docker

Crear el archivo `.env` en la raiz usando `.env.example` como base:

```env
SQL_SERVER_PASSWORD=YOUR_LOCAL_SQL_SERVER_PASSWORD
```

### Backend

Crear `DePasoAlimentos/appsettings.Development.json` usando `appsettings.Development.example.json` como base:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=DePasoAlimentosDb;User Id=sa;Password=YOUR_LOCAL_PASSWORD;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "YOUR_MINIMUM_32_CHARACTERS_SECRET_KEY",
    "Issuer": "DePasoAlimentos",
    "Audience": "DePasoAlimentos.Admin"
  },
  "SeedAdmin": {
    "Email": "admin@example.com",
    "Password": "YOUR_INITIAL_ADMIN_PASSWORD"
  }
}
```

### Frontend

Crear `frontend/.env.local` usando `frontend/.env.example` como base:

```env
VITE_API_BASE_URL=http://localhost:5139/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
VITE_SUPABASE_BUCKET=depasoalimentos-images
```

## Levantar SQL Server Con Docker

Desde la raiz de la solucion:

```powershell
cd "C:\Proyectos .NET\DePasoAlimentos"
docker compose up -d
```

Verificar que el contenedor este corriendo:

```powershell
docker ps
```

El contenedor esperado es:

```text
depasoalimentos-sqlserver
```

## Aplicar Migraciones

Desde la raiz de la solucion:

```powershell
dotnet ef database update --project DePasoAlimentos.Infrastructure --startup-project DePasoAlimentos
```

Esto crea la base:

```text
DePasoAlimentosDb
```

## Ejecutar La API

Desde Visual Studio, ejecutar el proyecto `DePasoAlimentos`.

Tambien se puede ejecutar por terminal:

```powershell
dotnet run --project .\DePasoAlimentos\DePasoAlimentos.csproj
```

URL local:

```text
http://localhost:5139
```

OpenAPI en desarrollo:

```text
http://localhost:5139/openapi/v1.json
```

## Ejecutar El Frontend

Desde la carpeta `frontend`:

```powershell
cd "C:\Proyectos .NET\DePasoAlimentos\frontend"
npm install
npm.cmd run dev
```

URL publica:

```text
http://localhost:5173/
```

Panel administrador:

```text
http://localhost:5173/admin
```

## Imagenes

La API no guarda archivos binarios en SQL Server. Cada entidad guarda solo una URL:

```csharp
public string ImageUrl { get; set; } = string.Empty;
```

El archivo real se sube a Supabase Storage desde el panel admin del frontend.

Flujo:

```text
Frontend Admin -> Supabase Storage -> URL publica -> API -> SQL Server
```

Convencion recomendada para carpetas en Supabase:

```text
products/
promotions/
food-suggestions/
```

## Autenticacion Admin

El panel admin usa login con JWT.

Flujo general:

1. El administrador inicia sesion en `/admin`.
2. La API devuelve un token JWT.
3. El frontend guarda el token en `localStorage`.
4. Las acciones administrativas envian `Authorization: Bearer TOKEN`.
5. Los endpoints admin del backend validan rol `Admin`.

Tambien existe una pantalla simple para cambiar la contrasena del administrador.

## Endpoints Principales

### Auth

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| POST | `/api/auth/login` | Inicia sesion admin. |
| PUT | `/api/auth/change-password` | Cambia contrasena admin autenticado. |

### Products

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/products` | Lista productos activos para catalogo publico. |
| GET | `/api/products/admin` | Lista todos los productos, activos e inactivos. |
| GET | `/api/products/{id}` | Obtiene un producto activo por id. |
| POST | `/api/products` | Crea un producto. |
| PUT | `/api/products/{id}` | Actualiza un producto. |
| DELETE | `/api/products/{id}` | Elimina un producto. |
| PATCH | `/api/products/{id}/activate` | Activa un producto. |
| PATCH | `/api/products/{id}/deactivate` | Desactiva un producto. |

### Promotions

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/promotions` | Lista promociones activas. |
| GET | `/api/promotions/admin` | Lista todas las promociones. |
| GET | `/api/promotions/{id}` | Obtiene una promocion activa por id. |
| POST | `/api/promotions` | Crea una promocion. |
| PUT | `/api/promotions/{id}` | Actualiza una promocion. |
| DELETE | `/api/promotions/{id}` | Elimina una promocion. |
| PATCH | `/api/promotions/{id}/activate` | Activa una promocion. |
| PATCH | `/api/promotions/{id}/deactivate` | Desactiva una promocion. |

### Food Suggestions

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/foodsuggestions` | Lista sugerencias publicadas. |
| GET | `/api/foodsuggestions/admin` | Lista todas las sugerencias. |
| GET | `/api/foodsuggestions/{id}` | Obtiene una sugerencia publicada por id. |
| POST | `/api/foodsuggestions` | Crea una sugerencia. |
| PUT | `/api/foodsuggestions/{id}` | Actualiza una sugerencia. |
| DELETE | `/api/foodsuggestions/{id}` | Elimina una sugerencia. |
| PATCH | `/api/foodsuggestions/{id}/publish` | Publica una sugerencia. |
| PATCH | `/api/foodsuggestions/{id}/unpublish` | Despublica una sugerencia. |

## Frontend

La pagina publica incluye:

- Catalogo de productos.
- Promociones.
- Sugerencias de comidas.
- Vista detalle para cada tarjeta.
- Carrito simple de pedido.
- Envio del pedido por WhatsApp.

El panel admin incluye:

- Login.
- ABM de productos.
- ABM de promociones.
- ABM de sugerencias.
- Subida de imagenes.
- Cambio de contrasena.

## Validaciones

Los DTOs de entrada usan Data Annotations:

- Campos obligatorios con `[Required]`.
- Longitudes maximas con `[StringLength]`.
- Precios positivos con `[Range]`.

En precios se usa:

```csharp
ParseLimitsInInvariantCulture = true
```

Esto evita errores por diferencias de cultura entre separador decimal con punto o coma.

## Comandos Utiles

Compilar backend:

```powershell
dotnet build
```

Compilar frontend:

```powershell
cd "C:\Proyectos .NET\DePasoAlimentos\frontend"
npm.cmd run build
```

Lint frontend:

```powershell
cd "C:\Proyectos .NET\DePasoAlimentos\frontend"
npm.cmd run lint
```

## Notas De Diseno

- Se usan DTOs para no exponer directamente entidades de dominio.
- Se usan servicios para concentrar logica de aplicacion.
- Se usan repositorios para aislar el acceso a datos.
- Se usa JWT para proteger acciones administrativas.
- Las imagenes se manejan como URLs externas para evitar guardar binarios en SQL Server.
- El carrito vive en frontend porque no se guardan pedidos en base de datos en esta version.

## Proximos Pasos

- Pulir diseno visual con Figma.
- Revisar responsive final en mobile.
- Subir repositorio a GitHub.
- Preparar deploy de frontend en Vercel.
- Definir hosting para API y base de datos.
- Ajustar CORS para el dominio real de produccion.
