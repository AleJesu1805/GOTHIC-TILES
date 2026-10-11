# Prompt para implementar el visualizador de audio

Copia el prompt completo a continuacion y usalo junto con el proyecto `GOTHIC-TILES` abierto en el editor:

```text
Actua como ingeniero senior de JavaScript y Web Audio API. Implementa directamente en el proyecto existente GOTHIC-TILES un visualizador de audio reactivo, integrado con la musica del juego y aislado en un modulo propio. Antes de editar, inspecciona el estado actual de los archivos implicados y conserva los cambios locales. No reemplaces archivos completos si bastan cambios acotados.

OBJETIVO VISUAL
Crea un visualizador en forma de anillo circular que rodee y mantenga centrado el emblema/logo de GOTHIC-TILES. Debe responder de forma sensible, perceptible y fluida a la energia real de la cancion (graves, medios y agudos), sin limitarse a una animacion decorativa que se mueva igual aunque no haya audio.

El proyecto ya tiene una estetica gotica: negro, metal, rojo sangre y acentos acero; usa las fuentes locales existentes. El titulo de bienvenida es `GOTHIC-TILES` y el emblema disponible es `assets/img/PentaCruzInvert.svg`. Inspecciona ambos recursos y el layout real antes de decidir cual se coloca en el centro del anillo. Mantén el logo legible y reconocible, con contraste suficiente; el anillo complementa la marca, no la tapa.

El visualizador debe permanecer asociado a la marca mientras suena la cancion durante la partida. El titulo actual esta dentro de `#welcome-screen`, que se oculta al comenzar; reorganiza o añade solo el markup imprescindible para que exista un contenedor de marca persistente durante la reproduccion. Elige una posicion y escala que preserven la lectura de los cuatro carriles y las fichas en movimiento. El visualizador no debe interceptar puntero/toque/teclado (`pointer-events: none`) ni alterar el area clicable del tablero. En movil debe conservar forma circular, estar centrado con el logo y no desbordar la pantalla.

ARQUITECTURA EXISTENTE QUE DEBES RESPETAR
- La aplicacion usa ES modules nativos; no hay bundler ni framework. No agregues dependencias.
- `js/entities/visualizador.js` existe actualmente como archivo vacio. Conviertelo en el modulo dedicado al visualizador; no dupliques su responsabilidad en `main.js`.
- `js/core/audio.js` exporta el `audioCtx` compartido para los efectos y define `canciones`. La musica principal se crea con `new Audio(ruta)` dentro de `canciones.reproducirCancion`; hoy no pasa por un `AnalyserNode`. Los efectos usan nodos del mismo `audioCtx` y `gananciaMaestra`.
- `js/main.js` controla el ciclo de partida, pausa, reanudacion, fin y regreso al menu. Su `gameLoop` usa `requestAnimationFrame` y limita el render del tablero con `FRAME_DURATION`.
- El tablero se dibuja en el `<canvas>` de `js/core/canvas.js`; `cleanCanvas()` lo limpia cada frame. No dibujes el anillo en ese canvas compartido ni cambies la logica de fichas, carriles, puntuacion o entradas para implementar el visualizador.
- Los estilos existentes estan en `css/style.css`; conserva su lenguaje visual, variables, tipografias y comportamiento responsive.

INTEGRACION DE AUDIO
1. Conecta el elemento de musica existente a un `AnalyserNode` del `audioCtx` compartido. No crees otro `AudioContext` ni un contexto por cancion. Mantén audible la ruta de la musica y conserva el control de volumen actual, los efectos, el audio mute del sistema cuando corresponda, y los mensajes de error actuales.
2. `createMediaElementSource()` solo se puede llamar una vez por cada elemento de audio. Guarda/reutiliza el nodo fuente y el grafo asociado por elemento; evita reconectar el mismo elemento o crear nodos nuevos en cada frame o cada llamada de render. Cuando cambie la cancion/elemento, actualiza la conexion de forma segura y sin conectar la salida dos veces.
3. Mantén intactos `play()`, `pause()`, `resume()`, `currentTime`, seleccion de nivel y manejo de rechazo de autoplay. Respeta la politica de autoplay del navegador: la activacion del contexto debe ocurrir dentro del flujo de inicio iniciado por el usuario. Si Web Audio no esta disponible, la politica del navegador impide analizar, o falla la conexion, la cancion debe seguir reproduciendose como antes y el juego debe funcionar sin visualizador; no hagas fallar el inicio de partida.
4. No hagas fetch, decodificacion de archivos, analisis de audio ni creacion de nodos en el bucle de dibujo. Lee los datos ya disponibles en el `AnalyserNode` con buffers tipados reutilizables.

MODULO Y CICLO DE VIDA
- Implementa una API pequena y explicita en `js/entities/visualizador.js` (por ejemplo, inicializar, actualizar/renderizar, activar/pausar y limpiar). Elige nombres coherentes con el codigo existente y evita exportar estado mutable innecesario.
- Conecta el render del visualizador al ciclo de vida existente del juego. No crees un segundo `requestAnimationFrame` permanente, timers de alta frecuencia ni listeners globales duplicados. Si necesitas que el anillo se vea antes o despues de las fichas, usa un canvas DOM dedicado y su orden de capas; no reutilices ni limpies el canvas del tablero.
- Activa la lectura/renderizado solo cuando la musica este reproduciendose y la partida este activa. En pausa, al terminar la cancion, al completar la partida, al volver al menu o al ocultarse la pagina, detén las lecturas y deja el anillo en un estado quieto/atenuado. Al reanudar, retoma sin crear ciclos o nodos duplicados. Limpia referencias y observadores cuando corresponda.
- Si usas `ResizeObserver` o eventos de visibilidad, registra cada observador/listener una sola vez y desconectalo al destruir el modulo. Gestiona correctamente cambios de tamano, orientacion y `devicePixelRatio`, limitando la resolucion del canvas para no multiplicar el coste de dibujo en pantallas densas.

COMPORTAMIENTO VISUAL Y SENSIBILIDAD
- Dibuja un anillo radial alrededor del logo con una cantidad moderada de barras o una curva circular de buena definicion. La geometria debe permanecer circular y centrada aun cuando cambie el tamano del contenedor. No uses animaciones aleatorias que escondan la respuesta al sonido.
- Usa datos de frecuencia/energia de graves, medios y agudos para variar de forma audible y visualmente clara la amplitud, pulsacion o color. Ajusta `fftSize`, `minDecibels`, `maxDecibels` y `smoothingTimeConstant` tras probarlos con varias canciones del proyecto; evita un rango que deje el anillo casi inmovil o que lo haga temblar constantemente.
- Aplica normalizacion y suavizado temporal con ataque rapido y relajacion algo mas lenta: los golpes deben sentirse inmediatos y las colas deben decaer con fluidez. Evita saltos bruscos, saturacion constante y una respuesta tan filtrada que parezca retrasada. Si incorporas una ganancia de sensibilidad, limitala para que no se vuelva inestable.
- Conserva el estilo oscuro/metalico y la paleta local; el rojo puede destacar los picos y el acero los niveles medios. No animes filtros pesados, sombras enormes, desenfoques, gradientes complejos recalculados por frame, ni propiedades CSS que provoquen layout continuo.
- Respeta `prefers-reduced-motion`: ofrece una presentacion estatica o de movimiento reducido sin eliminar toda indicacion visual de audio. Evita flashes rapidos o estroboscopicos.

RENDIMIENTO Y AISLAMIENTO
- El visualizador es decorativo e independiente: si falla, el tablero, la musica y los controles siguen funcionando. No modifiques la temporizacion de fichas, puntuacion, eventos de entrada ni estado de partida para obtener datos visuales.
- Reutiliza `Uint8Array`/`Float32Array` y cualquier objeto grafico; no asignes arreglos, objetos, gradientes o closures por frame. No consultes el DOM ni midas layout en cada frame.
- Limita el trabajo a un canvas pequeno que contenga el anillo y al ritmo del game loop existente. Puedes actualizar el dibujo a una frecuencia menor que la del juego si visualmente sigue siendo fluido. Suspende el trabajo cuando la pestana este oculta o la musica no este activa.
- Usa `pointer-events: none`, capas y `z-index` deliberados. El visualizador no debe bloquear los controles ni ocultar fichas de forma que afecte la jugabilidad. Si no existe una posicion segura, reduce el anillo o adapta el layout; no cambies las mecanicas.
- No agregues dependencias, workers, procesamiento de muestras en CPU, ni canvases de pantalla completa para una figura pequeña.

ALCANCE DE CAMBIOS
Inspecciona primero `index.html`, `css/style.css`, `js/core/audio.js`, `js/main.js`, `js/config.js`, `js/core/canvas.js` y `js/entities/visualizador.js`. Implementa la solucion en el modulo dedicado y modifica solo los archivos de integracion estrictamente necesarios. No reescribas el service worker, la configuracion de niveles, los mapas de tiempos ni otros modulos sin una necesidad concreta. Conserva cambios locales preexistentes y no reviertas trabajo ajeno.

VERIFICACION OBLIGATORIA
1. Comprueba que los modulos importan sin errores y que la aplicacion inicia con y sin soporte funcional para el visualizador. Prueba al menos dos canciones distintas y confirma que el anillo reacciona a sus cambios de intensidad, no solo al volumen inicial.
2. Prueba iniciar, pausar, reanudar, finalizar y volver al menu. Confirma que la musica y el volumen siguen comportandose como antes, que el anillo se detiene cuando corresponde y que nunca aparecen ciclos `requestAnimationFrame` o conexiones de audio duplicados.
3. Comprueba controles de teclado y puntero, carriles, fichas y puntuacion antes/despues. Confirma que el visualizador no roba entradas ni cambia el resultado del juego.
4. Revisa escritorio y movil, orientacion vertical/horizontal, redimensionado y `prefers-reduced-motion`. El logo debe quedar centrado dentro del anillo, sin desbordes y sin tapar zonas criticas del tablero.
5. Compara el rendimiento con el visualizador activo e inactivo durante una partida. No debe producir caidas perceptibles de FPS, carga sostenida de CPU ni pausas de audio. Si no hay una suite de pruebas configurada, realiza una comprobacion manual breve en el servidor local del proyecto y explica claramente que se verifico y que no.
6. Revisa la consola, errores de carga y el diff final. Resume los archivos tocados, decisiones de integracion y verificaciones realizadas; declara cualquier limitacion real, sin afirmar pruebas que no se ejecutaron.

CRITERIOS DE ACEPTACION
- Existe un modulo dedicado y la forma del visualizador es un anillo alrededor del logo real de GOTHIC-TILES.
- El movimiento responde de manera clara, sensible y suave a la musica que se esta reproduciendo.
- El audio original, efectos, volumen, autoplay, pausa, reanudacion y controles del juego conservan su comportamiento.
- El modulo no crea un ciclo de animacion independiente permanente, no duplica nodos de audio y no bloquea el tablero.
- El visualizador se detiene/limpia correctamente fuera de la reproduccion activa y no provoca lag perceptible.
- La implementacion funciona de forma responsive y tiene un fallback sin visualizador cuando el analisis Web Audio no sea posible.
```
