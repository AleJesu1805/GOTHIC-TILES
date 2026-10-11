# Prompt para generar mapas musicales

Copia el texto siguiente y adjunta la canción en el formato de audio disponible:

```text
Actúa como analista musical y diseñador de mapas de ritmo para un juego tipo Piano Tiles. Analiza de principio a fin el archivo de audio adjunto, cualquiera que sea su formato. Usa la capacidad de reproducción o análisis de audio disponible; no deduzcas los tiempos solo por el nombre, los metadatos, una descripción o la letra.

OBJETIVO
Genera un mapa JSON con los instantes en los que el jugador debe pulsar uno de los cuatro carriles. Incluye únicamente los golpes, ataques o cambios rítmicos más claros, audibles y jugables. El mapa debe ser intencionalmente selectivo: no intentes representar todas las notas, sílabas, golpes de batería ni subdivisiones. Es mejor omitir un evento dudoso o secundario que llenar el mapa de pulsaciones.

ANÁLISIS
1. Determina la duración real del audio y escucha la canción completa, incluidos el inicio, los silencios, los cambios de sección y el final.
2. Toma como tiempo 00:00:00 el comienzo exacto del archivo. Conserva los silencios iniciales: no desplaces el mapa para que el primer golpe quede en cero.
3. Localiza solo eventos con un ataque claro y fácil de reconocer, como golpes destacados de batería, acentos fuertes del riff o de la melodía, entradas/cortes evidentes y cambios de sección marcados. Prioriza los eventos que un jugador pueda percibir y anticipar con claridad.
4. No marques cada pulso regular por defecto. Evita notas débiles, sonidos de fondo, ecos, reverberaciones, sostenidos, adornos rápidos, subdivisiones repetitivas y eventos cuya posición temporal sea incierta. No dupliques un mismo acento en varios carriles. Evita ráfagas o marcas casi simultáneas salvo que sean acentos independientes, claramente audibles y razonablemente jugables.
5. Asigna cada evento elegido a un carril entre 0 y 3. Los carriles corresponden a las teclas A, S, D y F, respectivamente. Distribúyelos de forma variada y cómoda, sin cambiar la alineación temporal para forzar una secuencia. Nunca asignes más de dos tiles seguidos al mismo carril ni hagas que coincidan en caída más de dos tiles de ese carril; esto es especialmente importante para que el nivel se pueda jugar bien en móviles. Si un patrón musical produciría una concentración mayor, conserva solo los acentos más claros y jugables. Un acento simultáneo solo puede ocupar más de un carril si hay ataques distintos y claramente separables que justifiquen esas pulsaciones.
6. El timestamp es el momento musical exacto del ataque que el jugador debe pulsar, no el momento en que el tile aparece o comienza a caer. Expresa la posición con precisión de centésimas de segundo; no inventes precisión que el audio no permita. Mantén los tiempos dentro de la duración del archivo.

FORMATO DE SALIDA
Devuelve exclusivamente un objeto JSON válido, sin introducción, explicación, comentarios Markdown ni bloque de código. Usa exactamente estas cuatro claves de texto y un arreglo de timestamps en cada una:

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
Antes de responder, comprueba que el resultado se puede parsear como JSON; que existen solo las claves "0", "1", "2" y "3"; que todos sus valores son arreglos de cadenas con el formato indicado; que cada lista está en orden cronológico, no contiene duplicados, no supera la duración del audio y respeta el límite de dos tiles consecutivos o simultáneamente en caída por carril. Conserva los arreglos vacíos cuando un carril no tenga un evento claro. No agregues BPM, nombre de canción, explicaciones ni otros campos.
```
