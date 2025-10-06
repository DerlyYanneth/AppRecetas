## 🍴 MiAppRecetas

MiAppRecetas es una aplicación móvil desarrollada con React Native, Expo, Firestore Database y la API TheMealDB, que permite descubrir, consultar y gestionar recetas de manera sencilla y rápida.

## Características

-Explorar por categoría: Muestra una lista de categorías obtenidas desde la API TheMealDB.

-Recetas por categoría: Permite visualizar las recetas correspondientes a cada categoría seleccionada.

-Crear receta: Funcionalidad que permite registrar nuevas recetas personalizadas con los campos: título, ingredientes, instrucciones y URL de imagen.

-Ver recetas: Muestra todas las recetas creadas por el usuario y almacenadas en Firestore. Desde esta sección es posible editar o eliminar recetas.

-Detalle de receta: Presenta información completa de la receta, incluyendo ingredientes, pasos de preparación y un video de YouTube integrado.

-Favoritos: Permite agregar o eliminar recetas de favoritos para acceder fácilmente a ellas más adelante.

## Requisitos Previos

Antes de instalar y ejecutar el proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) y **npm**
- [Expo Go](https://expo.dev/client) en tu dispositivo móvil (Android o iOS)

Puedes verificar que Node.js y npm estén instalados con:

```bash
node -v
npm -v

```
----------------------------------------------
## Instalación y Ejecución

1. **Clona el repositorio:**

```bash
[(https://github.com/DerlyYanneth/AppRecetas)]

```
2. Ingresa a la carpeta del proyecto:

```bash
cd AppRecetas

```
3. Instala dependencias principales:

```bash
npm install
```

4. Instala dependencias:

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-webview #para visualizar los videos
```

5. Inicia la app en modo desarrollo:

```bash
npx expo start
```

6. Escanea el QR con Expo Go:
 - Abre la app Expo Go en tu celular y escanea el código QR que aparece en la terminal o en la interfaz web de Expo para ver la aplicación en tu dispositivo.
