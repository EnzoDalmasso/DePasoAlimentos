# DePasoAlimentos

Aplicacion web para la venta y gestion de alimentos congelados.

El sistema permite publicar productos, promociones y sugerencias de comidas, administrar imagenes, precios, horarios de atencion y recibir pedidos por WhatsApp. El pago no se realiza online: el cliente arma el pedido desde la web y coordina el retiro con el comercio.

## URLs

```text
Web:   https://de-paso-alimentos.vercel.app
Admin: https://de-paso-alimentos.vercel.app/admin
API:   https://depasoalimentos.onrender.com
```

## Tecnologias

- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- PostgreSQL
- Supabase Database
- Supabase Storage
- React
- TypeScript
- Tailwind CSS
- Docker
- JWT para autenticacion del administrador

## Funcionalidades

- Catalogo publico de productos.
- Seccion de promociones.
- Seccion de sugerencias de comidas.
- Vista detalle para productos, promociones y sugerencias.
- Carrito simple con envio del pedido por WhatsApp.
- Horarios de atencion visibles para el cliente.
- Dias especiales para feriados o cambios imprevistos.
- Panel administrador protegido con login.
- ABM de productos, promociones y sugerencias.
- Carga de imagenes desde el panel administrador.
- Gestion de horarios desde el panel administrador.
- Cambio de contrasena del administrador.

## Arquitectura

El proyecto esta separado en capas para mantener responsabilidades claras:

```text
DePasoAlimentos
|-- DePasoAlimentos                 # API ASP.NET Core
|-- DePasoAlimentos.Application     # DTOs, interfaces y servicios
|-- DePasoAlimentos.Domain          # Entidades del dominio
|-- DePasoAlimentos.Infrastructure  # EF Core, DbContext y repositorios
|-- frontend                        # Aplicacion React
|-- Dockerfile                      # Imagen de la API para deploy
|-- docker-compose.yml              # PostgreSQL local opcional
`-- README.md
```

## Configuracion Local

Crear los archivos locales a partir de los ejemplos incluidos.

### Backend

Archivo:

```text
DePasoAlimentos/appsettings.Development.json
```

Referencia:

```text
DePasoAlimentos/appsettings.Development.example.json
```

Valores necesarios:

```text
ConnectionStrings:DefaultConnection
Jwt:Key
Jwt:Issuer
Jwt:Audience
SeedAdmin:Email
SeedAdmin:Password
```

La base usa PostgreSQL. Para Supabase se recomienda usar el Session Pooler:

```text
Host=HOST_DEL_POOLER;Port=5432;Database=postgres;Username=USUARIO;Password=PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

### Frontend

Archivo:

```text
frontend/.env.local
```

Referencia:

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

## Ejecucion Local

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

## Endpoints Principales

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

## Deploy

El frontend esta desplegado en Vercel desde la carpeta `frontend`.

La API esta preparada para desplegarse como servicio Docker. Variables requeridas en produccion:

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

## Comandos Utiles

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

## Seguridad

Los archivos locales con secretos no se versionan:

```text
.env
.env.local
.env.*.local
DePasoAlimentos/appsettings.Development.json
frontend/.env.local
frontend/.env.*.local
```
