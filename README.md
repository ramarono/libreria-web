# Punto y Seguido, Librería — Landing Page & Espacio Editorial

Página web de portada y **Espacio Editorial** para **Punto y Seguido, Librería**, una librería independiente. Diseñada con una estética limpia, tranquila y editorial, pensada para funcionar 100% de forma estática en tu computadora sin necesidad de instalar bases de datos, Node.js o frameworks.

---

## 🚀 Cómo abrir la página localmente

Puedes ver la página en tu navegador de dos formas muy sencillas:

### Opción 1: Abrir directamente en el navegador
1. Navega en el explorador de archivos de tu equipo a esta carpeta (`Libreria_Web`).
2. Haz **doble clic** en el archivo `index.html` o `espacio-editorial.html`.
3. Se abrirá automáticamente en tu navegador web predeterminado (Safari, Chrome, Firefox, etc.).

### Opción 2: Usar un servidor local estático (Recomendado)
**Con Python:**
```bash
python3 -m http.server 8080
```
Luego abre en tu navegador:
- Portada principal: [http://localhost:8080](http://localhost:8080)
- Espacio Editorial: [http://localhost:8080/espacio-editorial.html](http://localhost:8080/espacio-editorial.html)

---

## 📚 El Espacio Editorial ("Índice Viviente")

En lugar de un blog convencional, el **Espacio Editorial** presenta un concepto contemporáneo de lectura ágil organizada por **Título de Libro**:

- **Buscador ágil**: Encuentra cualquier reseña al instante escribiendo el nombre del libro o autor.
- **Filtros por categoría**: Selecciona entre Reseñas por Título, Crítica Literaria o Escritor Invitado.
- **Lector interactivo con Foro**: Al hacer clic en cualquier tarjeta se despliega un panel de lectura cómodo con un espacio de **foro** donde los visitantes pueden leer e ingresar comentarios y reflexiones sobre cada libro.

---

## 📁 Carpeta `escritos/` (Cómo agregar nuevos libros y escritos)

Todos los contenidos del Espacio Editorial se guardan de forma limpia y estructurada dentro de la carpeta `escritos/`:

1. **`escritos/resenas-libros.json`**: Reseñas de los lectores. Se ordenan automáticamente por fecha de publicación (la más reciente primero).
2. **`escritos/critica-literaria.json`**: Artículos de fondo para la columna de crítica.
3. **`escritos/escritor-invitado.json`**: Colaboración especial con autores invitados.
4. **`escritos/biblioteca-virtual.json`**: Colección de libros clásicos libres de derechos de autor (dominio público) con sinopsis, fragmento y enlace de descarga completa.

---

## 🛠️ Los archivos del proyecto

- **`index.html`**: Portada principal con navegación, hero optimizado y manifiesto de Punto y Seguido, Librería.
- **`espacio-editorial.html`**: Espacio Editorial con reseñas ordenadas por fecha, crítica, escritor invitado, biblioteca virtual y buscador al final.
- **`styles.css`**: Hoja de estilos con diseño editorial, drawer lateral con fondo desenfocado (blur) y barra de progreso de lectura.
- **`editorial.js`**: Lógica de ordenamiento cronológico, lector lateral, barra de lectura interactiva, buscador y foro.
- **`assets/`**: Fotografías optimizadas (`hero-punto-y-seguido-opt.jpg`) e ilustraciones vectoriales.
- **`escritos/`**: Archivos de datos JSON para reseñas, columnas y clásicos de dominio público.

---

¡Disfruta haciendo crecer el Espacio Editorial y la Biblioteca Virtual de Punto y Seguido, Librería!
