# Assessment 8vo Semestre Equipo 7
## Descripción
Para nuestro proyecto, se desarrolló un cuestionario interactivo con modelos 3D, que calcula el resultado de adicción a las redes sociales del usuario, a partir de un MLP classifier.

## Integrantes del Equipo:
+ *Samuel Acevedo Sandoval - A01026893*
+ *Fernanda Cantú Ortega - A01782232*
+ *Sebastian Moncada Gonzalez - A01027028*
+ *Alina Rosas Macedo - A01252720*

## Estructura
- backend
- db
- db 2
- frontend
- inference
- nginx
- training

- proyecto/
├─ backend/
│  ├─ components/
│  ├─ utils/
├─ db/
├─ db 2/
├─ frontend/
├─ inference/
├─ nginx/
├─ training/

## Herramientas Usadas

**Frontend**: NextJS, Tailwind CSS, Three.js

**Backend**: NodeJS, ExpressJS

**Base de Datos**: MongoDB

## Cómo Correr El Proyecto
### Prerequisitos
[NodeJS v24.1.0](https://nodejs.org/en/download)

[NextJS v15.3.3](https://nextjs.org/docs/app/getting-started/installation)

[Docker](https://www.docker.com/products/docker-desktop/)

### Para Descargar

```git clone https://github.com/fernandacor/assessment.git```

```npm install```

### Correr el Proyecto
```npm run dev```

```docker compose -f docker-compose.yml -f docker-compose.dev.yml up```


