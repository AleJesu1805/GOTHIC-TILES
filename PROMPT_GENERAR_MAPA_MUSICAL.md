# Prompt para generar mapas musicales

Copia el texto siguiente y adjunta la canción en el formato de audio disponible:

```text
Actúa como analista musical y diseñador de mapas de ritmo para un juego tipo Piano Tiles. Analiza de principio a fin el archivo de audio adjunto, cualquiera que sea su formato. Usa la capacidad de reproducción o análisis de audio disponible; no deduzcas los tiempos solo por el nombre, los metadatos, una descripción o la letra.

OBJETIVO
Genera un mapa JSON emocionante, rítmicamente activo y fiel a la energía de la canción, con los instantes en los que el jugador debe pulsar uno de los cuatro carriles. No hagas un mapa minimalista: cuando la canción mantiene un groove claro, el mapa también debe mantener al jugador activo siguiendo sus pulsos y acentos principales. Evita tanto los largos tramos vacíos como una lluvia indiscriminada de notas; cada tile debe corresponder a un evento musical reconocible y jugable.

ANÁLISIS
1. Determina la duración real del audio y escucha la canción completa, incluidos el inicio, los silencios, los cambios de sección y el final. Identifica el tempo aproximado, el pulso, el groove, los acentos y qué secciones aumentan o reducen la energía.
2. Toma como tiempo 00:00:00 el comienzo exacto del archivo. Conserva los silencios iniciales: no desplaces el mapa para que el primer golpe quede en cero.
3. En las partes con ritmo estable, usa como base los pulsos principales claramente audibles y selecciona además los acentos importantes de batería, riff o melodía. En estribillos, drops y partes intensas, refleja el aumento de energía con más eventos rítmicos claros; en intros, puentes tranquilos y breakdowns, reduce la densidad de acuerdo con la música. Incluye fills o síncopas solo si destacan y se pueden tocar con claridad.
4. No representes cada nota instrumental, sílaba o subdivisión rápida: prioriza el pulso y los acentos que dan identidad al groove. No dejes huecos mayores de unos 3 segundos mientras la canción mantenga un pulso o riff claramente audible; vuelve a escuchar esos tramos y añade los pulsos o acentos evidentes que falten. Deja huecos más largos únicamente cuando haya silencio, una pausa, un breakdown realmente escaso o no exista un ataque claro que se pueda jugar; nunca inventes eventos para rellenar. Evita ecos, reverberaciones, notas sostenidas y eventos cuya posición temporal sea incierta. No dupliques un mismo acento en varios carriles. Evita ráfagas o marcas casi simultáneas salvo que sean acentos independientes, claramente audibles y razonablemente jugables.
5. Asigna cada evento elegido a un carril entre 0 y 3. Los carriles corresponden a las teclas A, S, D y F, respectivamente. Distribúyelos de forma variada y cómoda, sin cambiar la alineación temporal para forzar una secuencia. Nunca asignes más de dos tiles seguidos al mismo carril ni hagas que coincidan en caída más de dos tiles de ese carril; esto es especialmente importante para que el nivel se pueda jugar bien en móviles. Si un patrón musical produciría una concentración mayor, conserva solo los acentos más claros y jugables. Un acento simultáneo solo puede ocupar más de un carril si hay ataques distintos y claramente separables que justifiquen esas pulsaciones.
6. El timestamp es el momento musical exacto del ataque que el jugador debe pulsar, no el momento en que el tile aparece o comienza a caer. Expresa la posición con precisión de centésimas de segundo; no inventes precisión que el audio no permita. Mantén los tiempos dentro de la duración del archivo.

FORMATO DE SALIDA
Devuelve exclusivamente un objeto JSON válido, sin introducción, explicación, comentarios Markdown ni bloque de código. El archivo JSON final debe tener como máximo 800 líneas, contando todo el contenido. Para respetar el límite, puedes colocar varios timestamps por línea o compactar el JSON; no reduzcas la actividad musical ni elimines pulsos claros solo para acortar el archivo. Usa exactamente estas cuatro claves de texto y un arreglo de timestamps en cada una:

{
  "0": ["00:12:34", "00:24:68"],
  "1": ["00:16:02"],
  "2": [],
  "3": ["00:20:51"]
}

Cada timestamp debe tener el formato MM:SS:cc:
- MM: minutos desde el inicio, con al menos dos dígitos.
- SS: segundos entre 00 y 59, con dos dígitos.
- cc: centésimas entre 00 y 99, con dos dígitos.

REVISIÓN FINAL
Antes de responder, comprueba que el resultado se puede parsear como JSON; que existen solo las claves "0", "1", "2" y "3"; que todos sus valores son arreglos de cadenas con el formato indicado; que cada lista está en orden cronológico, no contiene duplicados, no supera la duración del audio y respeta el límite de dos tiles consecutivos o simultáneamente en caída por carril. Revisa también la canción completa para detectar huecos mayores de unos 3 segundos durante secciones rítmicamente activas y complétalos con pulsos o acentos audibles que falten, sin inventar notas en pausas reales. El JSON debe tener como máximo 800 líneas; si hace falta, compacta su formato antes de quitar cualquier evento musical claro. Conserva los arreglos vacíos cuando un carril no tenga un evento claro. No agregues BPM, nombre de canción, explicaciones ni otros campos.
```
