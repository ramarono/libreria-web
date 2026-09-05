# Librería — Landing Page & Espacio Editorial

Primera versión local de la página de portada y el **Espacio Editorial** para **Librería**, una librería independiente. Diseñada con una estética limpia, tranquila y editorial, pensada para funcionar 100% de forma estática en tu computadora sin necesidad de instalar bases de datos, Node.js o frameworks.

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

## 📁 Carpeta `escritos/` (Cómo agregar nuevas reseñas y artículos)

Todos los contenidos del Espacio Editorial se guardan de forma limpia y estructurada dentro de la carpeta `escritos/`:

1. **`escritos/resenas-libros.json`**: Aquí están las reseñas de libros ordenadas por título. Para añadir un nuevo libro, solo agrega un bloque como este:
   ```json
   {
     "id": "nombre-del-libro",
     "titulo": "Título del Libro",
     "autor": "Nombre del Autor",
     "editorial": "Nombre de la Editorial",
     "categoria": "Narrativa Contemporánea",
     "tiempoLectura": "3 min de lectura",
     "fecha": "Septiembre 2026",
     "extracto": "Resumen breve de una frase.",
     "contenido": "Texto completo de la reseña...",
     "comentarios": []
   }
   ```
2. **`escritos/critica-literaria.json`**: Contiene los artículos de la columna de crítica de fondo.
3. **`escritos/escritor-invitado.json`**: Contiene la colaboración especial del autor invitado del mes.

---

## 🛠️ Los archivos del proyecto

- **`index.html`**: Portada principal con navegación y manifiesto.
- **`espacio-editorial.html`**: Página del Espacio Editorial y foro de lecturas por título.
- **`styles.css`**: Hoja de estilos con la paleta de colores, tipografías y modal lector.
- **`script.js`**: Interacciones principales y menú móvil.
- **`editorial.js`**: Lógica de búsqueda por título, filtros y sistema de comentarios del foro.
- **`assets/`**: Carpeta para la imagen principal (`hero-libreria.svg` o `imagen-principal.jpg`).
- **`escritos/`**: Carpeta con los contenidos de reseñas, crítica y escritor invitado.

---

¡Disfruta haciendo crecer el Espacio Editorial de tu librería!
