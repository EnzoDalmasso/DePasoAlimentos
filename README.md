# DePasoAlimentos

Aplicacion web para la administracion y venta de alimentos congelados.

El proyecto permite mostrar un catalogo publico de productos, promociones y sugerencias de comidas. Tambien incluye un panel administrador para cargar, editar y eliminar contenido, subir imagenes y gestionar la informacion que ve el cliente.

El pedido se arma desde la web mediante un carrito simple y se envia por WhatsApp. No incluye pago online: el cliente coordina el retiro y paga en efectivo o transferencia.

## Tecnologias

- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- PostgreSQL
- Supabase Database
- Docker opcional para base local
- React
- Tailwind CSS
- Supabase Storage
- JWT para autenticacion del administrador

## Funcionalidades

- Catalogo publico de productos.
- Seccion de promociones.
- Seccion de sugerencias de comidas.
- Vista detalle para productos, promociones y sugerencias.
- Carrito de pedido con envio por WhatsApp.
- Horarios visibles para el cliente.
- Dias especiales para feriados o cambios imprevistos.
- Panel administrador protegido con login.
- ABM de productos, promociones y sugerencias.
- Subida de imagenes a Supabase Storage.
- Cambio de contrasena del administrador.

## Estructura

```text
DePasoAlimentos
|-- DePasoAlimentos                 # API ASP.NET Core
|-- DePasoAlimentos.Application     # DTOs, interfaces y servicios
|-- DePasoAlimentos.Domain          # Entidades del dominio
|-- DePasoAlimentos.Infrastructure  # EF Core, DbContext y repositorios
|-- frontend                        # Aplicacion React
|-- Dockerfile                      # Imagen de la API para deploy
|-- docker-compose.yml
`-- README.md
```

## Configuracion local

Antes de ejecutar el proyecto, crear los archivos locales a partir de los ejemplos incluidos.

### Base de datos

El proyecto esta preparado para usar PostgreSQL. Para produccion se recomienda Supabase Database, porque permite tener la base en el mismo ecosistema donde ya se guardan las imagenes.

Connection string de ejemplo para Supabase:

```text
Host=db.YOUR_SUPABASE_PROJECT_REF.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_SUPABASE_DATABASE_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

En un hosting de backend, la variable se carga como:

```text
ConnectionStrings__DefaultConnection
```

### Docker local opcional

Crear `.env` en la raiz del proyecto:

```env
POSTGRES_PASSWORD=YOUR_LOCAL_POSTGRES_PASSWORD
```

Si se usa Docker local, la connection string puede ser:

```text
Host=localhost;Port=5432;Database=depasoalimentos;Username=depasoalimentos;Password=YOUR_LOCAL_POSTGRES_PASSWORD
```

### Backend

Crear `DePasoAlimentos/appsettings.Development.json` usando como referencia:

```text
DePasoAlimentos/appsettings.Development.example.json
```

Variables necesarias:

- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`
- `SeedAdmin:Email`
- `SeedAdmin:Password`

### Frontend

Crear `frontend/.env.local` usando como referencia:

```text
frontend/.env.example
```

Variables necesarias:

```env
VITE_API_BASE_URL=http://localhost:5139/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
VITE_SUPABASE_BUCKET=depasoalimentos-images
```

## Ejecucion

Levantar PostgreSQL local opcional:

```powershell
docker compose up -d
```

Aplicar migraciones:

```powershell
dotnet ef database update --project DePasoAlimentos.Infrastructure --startup-project DePasoAlimentos
```

Ejecutar la API:

```powershell
dotnet run --project .\DePasoAlimentos\DePasoAlimentos.csproj
```

Ejecutar el frontend:

```powershell
cd frontend
npm install
npm.cmd run dev
```

URLs locales:

```text
Frontend: http://localhost:5173
Admin:    http://localhost:5173/admin
API:      http://localhost:5139
```

## Endpoints principales

### Auth

| Metodo | Ruta |
| --- | --- |
| POST | `/api/auth/login` |
| PUT | `/api/auth/change-password` |

### Productos

| Metodo | Ruta |
| --- | --- |
| GET | `/api/products` |
| GET | `/api/products/admin` |
| POST | `/api/products` |
| PUT | `/api/products/{id}` |
| DELETE | `/api/products/{id}` |
| PATCH | `/api/products/{id}/activate` |
| PATCH | `/api/products/{id}/deactivate` |

### Promociones

| Metodo | Ruta |
| --- | --- |
| GET | `/api/promotions` |
| GET | `/api/promotions/admin` |
| POST | `/api/promotions` |
| PUT | `/api/promotions/{id}` |
| DELETE | `/api/promotions/{id}` |
| PATCH | `/api/promotions/{id}/activate` |
| PATCH | `/api/promotions/{id}/deactivate` |

### Sugerencias

| Metodo | Ruta |
| --- | --- |
| GET | `/api/foodsuggestions` |
| GET | `/api/foodsuggestions/admin` |
| POST | `/api/foodsuggestions` |
| PUT | `/api/foodsuggestions/{id}` |
| DELETE | `/api/foodsuggestions/{id}` |
| PATCH | `/api/foodsuggestions/{id}/publish` |
| PATCH | `/api/foodsuggestions/{id}/unpublish` |

### Horarios

| Metodo | Ruta |
| --- | --- |
| GET | `/api/store-hours` |
| PUT | `/api/store-hours/weekly/{id}` |
| POST | `/api/store-hours/special-days` |
| PUT | `/api/store-hours/special-days/{id}` |
| DELETE | `/api/store-hours/special-days/{id}` |

## Comandos utiles

Compilar backend:

```powershell
dotnet build -c Release
```

Compilar frontend:

```powershell
cd frontend
npm.cmd run build
```

Lint frontend:

```powershell
cd frontend
npm.cmd run lint
```

## Deploy

El frontend puede publicarse en Vercel desde la carpeta `frontend`.

La API se puede publicar como servicio Docker en un hosting compatible. Variables necesarias para produccion:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
SeedAdmin__Email
SeedAdmin__Password
ASPNETCORE_ENVIRONMENT=Production
PORT=8080
```

El valor de `ConnectionStrings__DefaultConnection` debe apuntar a Supabase PostgreSQL usando el Session Pooler.
