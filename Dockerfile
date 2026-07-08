FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["DePasoAlimentos/DePasoAlimentos.csproj", "DePasoAlimentos/"]
COPY ["DePasoAlimentos.Application/DePasoAlimentos.Application.csproj", "DePasoAlimentos.Application/"]
COPY ["DePasoAlimentos.Domain/DePasoAlimentos.Domain.csproj", "DePasoAlimentos.Domain/"]
COPY ["DePasoAlimentos.Infrastructure/DePasoAlimentos.Infrastructure.csproj", "DePasoAlimentos.Infrastructure/"]

RUN dotnet restore "DePasoAlimentos/DePasoAlimentos.csproj"

COPY . .

RUN dotnet publish "DePasoAlimentos/DePasoAlimentos.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "DePasoAlimentos.dll"]
