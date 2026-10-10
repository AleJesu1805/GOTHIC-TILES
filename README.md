# GOTHIC-TILES

Juego de ritmo estilo "Piano Tiles" con estética gótica y sensación oscura. El objetivo es tocar los tiles correctos a tiempo para mantener el puntaje y completar cada cancion.

## Descripción

GOTHIC-TILES es una pequeña experiencia web inspirada en los juegos de reacción musical. Incluye:

- selección de niveles
- juego en varios carriles
- sistema de pausa y configuración de audio
- pantalla final con tiempo de partida
- soporte de PWA con manifest y service worker

## Controles

- A / S / D / F: cambiar o seleccionar carriles según el nivel
- Pausar: botón de la interfaz
- Reiniciar o volver al menú desde las pantallas finales y de pausa

## Requisitos

- navegador moderno compatible con HTML5, CSS3 y JavaScript
- opcionalmente, un servidor local para abrirlo más limpio y evitar problemas de carga de archivos

## Cómo ejecutarlo

### Opción 1: abrir directamente

Puedes abrir el archivo `index.html` en tu navegador.

### Opción 2: servidor local recomendado

Desde la carpeta del proyecto:

```bash
cd "GOTHIC-TILES"
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

## Estructura del proyecto

- `index.html`: estructura principal de la interfaz
- `css/style.css`: estilos visuales del juego
- `js/`: lógica del juego y renderizado
- `assets/`: fuentes, imágenes y recursos gráficos
- `manifest.json`: configuración de la aplicación web
- `sw.js`: service worker para capacidades tipo PWA

## Notas

Este proyecto es un juego front-end estático, por lo que no requiere instalación de dependencias ni compilación previa.
