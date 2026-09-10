# NeoMotion

[![NeoMotion CI](https://github.com/AndresDev-Code/NeoMotion/actions/workflows/main.yml/badge.svg)](https://github.com/AndresDev-Code/NeoMotion/actions/workflows/main.yml)

NeoMotion es un proyecto personal que desarrollé con la idea de crear un canal de televisión de anime que funcione las 24 horas.

La idea nace de mi gusto por los antiguos canales de anime, especialmente de aquellos que tenían una programación continua, bloques de programación y una identidad propia.

No se trata de una plataforma con varios canales. NeoMotion representa un solo canal y todo el sistema está pensado alrededor de su programación.

## Sobre el proyecto

El proyecto cuenta con un backend y un frontend separados dentro del mismo repositorio.

El backend se encarga de la lógica de la aplicación, la API, la autenticación, la gestión del contenido y la programación.

El frontend es la parte con la que interactúa el usuario y está desarrollado con React.

## Estado del proyecto

NeoMotion es un proyecto terminado y funcional.

La idea es seguir mejorándolo con el tiempo, por lo que en el futuro podrían añadirse nuevas funciones, cambios o mejoras.

## Funciones actuales

- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Usuarios y perfiles.
- Series.
- Temporadas.
- Episodios.
- Contenido multimedia.
- Categorías.
- Favoritos.
- Recomendaciones.
- Noticias.
- Programación.
- Bloques de programación.
- Panel de administración.
- Reproducción de contenido.

## Tecnologías

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- PostgreSQL

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

### Herramientas

- Git
- GitHub
- IntelliJ IDEA
- Postman

## Capturas

### Página principal

![Página principal de NeoMotion](screenshots/pagina-principal.png)

### Programación

![Programación de NeoMotion](screenshots/programacion.png)

### En vivo

![Señal en vivo de NeoMotion](screenshots/en-vivo.png)

### Panel de administración

![Panel de administración de NeoMotion](screenshots/panel-administracion.png)

## Arquitectura

NeoMotion está separado en dos partes: un frontend desarrollado con React y un backend desarrollado con Spring Boot. Ambos se comunican mediante una API REST.

En el backend se mantiene una separación de responsabilidades entre las diferentes capas de la aplicación. Los controllers reciben las peticiones, los services gestionan la lógica del sistema y los repositories se encargan del acceso a PostgreSQL.

En general, el flujo es:

```text
Frontend → API REST → Controllers → Services → Repositories → PostgreSQL