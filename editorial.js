/* ==========================================================================
   LIBRERÍA — LÓGICA DEL ESPACIO EDITORIAL Y FORO (JAVASCRIPT VANILLA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Almacenamiento local de datos cargados
  let state = {
    resenas: [],
    critica: [],
    invitado: [],
    activeFilter: 'todos',
    searchTerm: '',
    currentArticle: null
  };

  // 1. CARGA DE DATOS DESDE LA CARPETA `escritos/`
  async function loadEditorialData() {
    try {
      const [resenasRes, criticaRes, invitadoRes] = await Promise.all([
        fetch('escritos/resenas-libros.json').then(r => r.json()),
        fetch('escritos/critica-literaria.json').then(r => r.json()),
        fetch('escritos/escritor-invitado.json').then(r => r.json())
      ]);

      state.resenas = resenasRes || [];
      state.critica = criticaRes || [];
      state.invitado = invitadoRes || [];

      renderAll();
    } catch (error) {
      console.warn('Carga directa de JSON con fetch no disponible en file://. Usando fallbacks por defecto.', error);
      // Fallback estático en caso de abrir directamente por protocolo file:// sin servidor local
      state.resenas = [
        {
          id: "la-vegetariana",
          titulo: "La vegetariana",
          autor: "Han Kang",
          editorial: "Rata / Literatura Random House",
          categoria: "Narrativa Contemporánea",
          tiempoLectura: "4 min de lectura",
          fecha: "Septiembre 2026",
          extracto: "Una metamorfosis sorda en la Seúl contemporánea. Han Kang explora el rechazo a la violencia cotidiana a través de una renuncia radical.",
          contenido: "Antes de que el sueño comenzara, Yeonghye era una esposa ordinaria. Pero Han Kang no escribe sobre una dieta; escribe sobre el cuerpo como el último territorio de soberanía. La prosa de Kang, traducida con una precisión quirúrgica, desnuda las expectativas familiares y la violencia soterrada de la norma. Lo fascinante de esta novela es cómo el acto aparentemente pasivo de dejar de comer carne desencadena una fractura telúrica en todo su entorno.",
          comentarios: [
            { usuario: "Valeria M.", fecha: "Hace 2 días", texto: "Me impactó cómo el cambio de punto de vista en cada una de las tres partes transforma la percepción de la protagonista." }
          ]
        },
        {
          id: "la-obligacion-de-ser-humano",
          titulo: "La obligación de ser humano",
          autor: "Chantal Maillard",
          editorial: "Tusquets Editores",
          categoria: "Ensayo & Filosofía",
          tiempoLectura: "5 min de lectura",
          fecha: "Agosto 2026",
          extracto: "Un diálogo entre la compasión, la poesía y la filosofía política. Maillard nos invita a desaprender la violencia del yo.",
          contenido: "Chantal Maillard no escribe para complacer sino para desmantelar certezas. En este compendio de ensayos y anotaciones, la autora hispanobelga plantea la compasión no como un sentimiento piadoso, sino como un ejercicio de lucidez extrema ante el dolor ajeno.",
          comentarios: [
            { usuario: "Sofía R.", fecha: "Hace 1 semana", texto: "Es el libro que más he subrayado este año." }
          ]
        },
        {
          id: "un-amor",
          titulo: "Un amor",
          autor: "Sara Mesa",
          editorial: "Anagrama",
          categoria: "Ficción Española",
          tiempoLectura: "3 min de lectura",
          fecha: "Agosto 2026",
          extracto: "Una inmersión sofocante en la vida rural, el lenguaje opaco y las microdinámicas de poder en una pequeña comunidad aislada.",
          contenido: "Nat, una joven traductora, se instala en La Escapa, un núcleo rural en ruinas. Lo que parece un retiro para recuperar la calma se transforma de inmediato en un escenario tenso.",
          comentarios: []
        },
        {
          id: "ficciones",
          titulo: "Ficciones",
          autor: "Jorge Luis Borges",
          editorial: "Debolsillo",
          categoria: "Clásicos del Siglo XX",
          tiempoLectura: "6 min de lectura",
          fecha: "Julio 2026",
          extracto: "El laberinto, los espejos y las bibliotecas infinitas. Un mapa esencial para comprender la literatura arquitectónica.",
          contenido: "Revisitar Ficciones es recordar que toda lectura es una reescritura. En estos cuentos donde los libros inventados alteran la realidad física, Borges estableció el canon de la literatura como juego de espejos.",
          comentarios: []
        }
      ];

      state.critica = [{
        id: "critica-velocidad-lectura",
        titulo: "La ilusión de la prisa: por qué leer menos es leer mejor",
        autor: "Redacción Librería",
        rol: "Columna de Crítica",
        fecha: "Septiembre 2026",
        tiempoLectura: "5 min de lectura",
        extracto: "Frente al ritmo acelerado de las métricas de lectura, reivindicamos la lentitud como la única forma verdadera de intimidad con un texto.",
        contenido: "Vivimos en la era de la cuantificación. Medimos los pasos diarios, las horas de sueño y el número de libros que terminamos al año. Pero la literatura no es una carrera de consumo ni un catálogo por tachar.",
        comentarios: []
      }];

      state.invitado = [{
        id: "invitado-marina-garces",
        titulo: "Escribir en la intemperie: el valor de las librerías independientes",
        autor: "Marina Garcés",
        rol: "Filósofa & Ensayista Invitada",
        fecha: "Septiembre 2026",
        tiempoLectura: "6 min de lectura",
        extracto: "Una reflexión sobre la necesidad física de espacios donde los libros se encuentren con las personas fuera de la tiranía del algoritmo.",
        contenido: "Una librería no es una bodega de papel ni un simple punto de venta. Es un refugio de resistencia cultural. En un mundo donde todo nos invita a la inmediatez, entrar en una librería es una experiencia revolucionaria.",
        comentarios: []
      }];

      renderAll();
    }
  }

  // 2. RENDERIZADO DE LAS RESEÑAS Y COLUMNAS
  function renderAll() {
    renderResenas();
    renderCritica();
    renderInvitado();
  }

  function renderResenas() {
    const booksGrid = document.getElementById('books-grid');
    const bookCount = document.getElementById('book-count');
    if (!booksGrid) return;

    let filtered = state.resenas.filter(item => {
      const matchSearch = item.titulo.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                          item.autor.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchCategory = state.activeFilter === 'todos' || state.activeFilter === 'resenas';
      return matchSearch && matchCategory;
    });

    if (bookCount) {
      bookCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'título' : 'títulos'} disponibles`;
    }

    if (filtered.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-results">
          <p>No se encontraron reseñas con el título o autor "<strong>${state.searchTerm}</strong>".</p>
        </div>
      `;
      return;
    }

    booksGrid.innerHTML = filtered.map(book => `
      <article class="book-card reveal active" data-id="${book.id}">
        <div class="book-card-header">
          <span class="book-category-tag">${book.categoria}</span>
          <span class="book-read-time">${book.tiempoLectura}</span>
        </div>
        <h3 class="book-card-title">${book.titulo}</h3>
        <p class="book-card-author">Por ${book.autor}</p>
        <p class="book-card-excerpt">${book.extracto}</p>
        
        <div class="book-card-footer">
          <button class="btn-read-more" onclick="openArticleModal('${book.id}', 'resena')">
            Leer reseña &amp; Foro
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          
          <span class="comment-count-badge">
            💬 ${book.comentarios ? book.comentarios.length : 0}
          </span>
        </div>
      </article>
    `).join('');
  }

  function renderCritica() {
    const container = document.getElementById('critica-content');
    if (!container || state.critica.length === 0) return;
    const item = state.critica[0];

    if (state.activeFilter !== 'todos' && state.activeFilter !== 'critica') {
      document.getElementById('critica-section').style.display = 'none';
      return;
    } else {
      document.getElementById('critica-section').style.display = 'block';
    }

    container.innerHTML = `
      <h3 class="featured-card-title">${item.titulo}</h3>
      <p class="featured-card-meta">${item.autor} • ${item.tiempoLectura}</p>
      <p class="featured-card-excerpt">${item.extracto}</p>
      <button class="btn btn-primary btn-sm" onclick="openArticleModal('${item.id}', 'critica')">
        Leer columna completa
      </button>
    `;
  }

  function renderInvitado() {
    const container = document.getElementById('invitado-content');
    if (!container || state.invitado.length === 0) return;
    const item = state.invitado[0];

    if (state.activeFilter !== 'todos' && state.activeFilter !== 'invitado') {
      document.getElementById('invitado-section').style.display = 'none';
      return;
    } else {
      document.getElementById('invitado-section').style.display = 'block';
    }

    container.innerHTML = `
      <h3 class="featured-card-title">${item.titulo}</h3>
      <p class="featured-card-meta">${item.autor} (${item.rol})</p>
      <p class="featured-card-excerpt">${item.extracto}</p>
      <button class="btn btn-primary btn-sm" onclick="openArticleModal('${item.id}', 'invitado')">
        Leer artículo invitado
      </button>
    `;
  }

  // 3. BARRA DE BÚSQUEDA Y FILTROS
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value;
      renderResenas();
    });
  }

  const filterPills = document.getElementById('filter-pills');
  if (filterPills) {
    filterPills.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeFilter = pill.getAttribute('data-filter');
        renderAll();
      });
    });
  }

  // 4. ABRIR Y CERRA MODAL DEL LECTOR Y FORO
  window.openArticleModal = function(id, type) {
    let article = null;
    if (type === 'resena') {
      article = state.resenas.find(b => b.id === id);
    } else if (type === 'critica') {
      article = state.critica.find(c => c.id === id);
    } else if (type === 'invitado') {
      article = state.invitado.find(i => i.id === id);
    }

    if (!article) return;
    state.currentArticle = article;

    document.getElementById('modal-category').textContent = article.categoria || article.rol || 'Artículo Editorial';
    document.getElementById('modal-title').textContent = article.titulo;
    document.getElementById('modal-author').textContent = `Por ${article.autor}`;
    document.getElementById('modal-reading-time').textContent = article.tiempoLectura || '3 min';
    document.getElementById('modal-body').textContent = article.contenido;

    renderModalComments(article.comentarios || []);

    const modal = document.getElementById('reader-modal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeArticleModal() {
    const modal = document.getElementById('reader-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const modalOverlay = document.getElementById('reader-overlay');
  const modalCloseBtn = document.getElementById('reader-close');
  if (modalOverlay) modalOverlay.addEventListener('click', closeArticleModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeArticleModal);

  // 5. PUBLICAR COMENTARIO EN EL FORO DE DISCUSIÓN
  function renderModalComments(comments) {
    const commentsList = document.getElementById('modal-comments');
    if (!commentsList) return;

    if (!comments || comments.length === 0) {
      commentsList.innerHTML = `<p class="empty-comments">Aún no hay reflexiones en este foro. ¡Sé la primera persona en escribir!</p>`;
      return;
    }

    commentsList.innerHTML = comments.map(c => `
      <div class="comment-item">
        <div class="comment-header">
          <span class="comment-author">${c.usuario}</span>
          <span class="comment-date">${c.fecha}</span>
        </div>
        <p class="comment-text">${c.texto}</p>
      </div>
    `).join('');
  }

  const forumForm = document.getElementById('forum-form');
  if (forumForm) {
    forumForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('comment-author');
      const textInput = document.getElementById('comment-text');

      if (!authorInput.value.trim() || !textInput.value.trim() || !state.currentArticle) return;

      const newComment = {
        usuario: authorInput.value.trim(),
        fecha: "Hace un momento",
        texto: textInput.value.trim()
      };

      if (!state.currentArticle.comentarios) {
        state.currentArticle.comentarios = [];
      }
      state.currentArticle.comentarios.push(newComment);

      renderModalComments(state.currentArticle.comentarios);
      renderResenas();

      textInput.value = '';
    });
  }

  // Inicializar carga de datos
  loadEditorialData();
});
