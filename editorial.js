/* ==========================================================================
   PUNTO Y SEGUIDO, LIBRERÍA — LÓGICA DEL ESPACIO EDITORIAL Y FORO (JAVASCRIPT VANILLA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Almacenamiento local de datos cargados
  let state = {
    resenas: [],
    critica: [],
    invitado: [],
    biblioteca: [],
    activeFilter: 'todos',
    searchTerm: '',
    currentArticle: null
  };

  // Mapeo cronológico de fechas para ordenamiento estricto
  const dateWeightMap = {
    'septiembre 2026': 202609,
    'agosto 2026': 202608,
    'julio 2026': 202607,
    'junio 2026': 202606,
    'mayo 2026': 202605
  };

  function parseDateWeight(dateStr) {
    if (!dateStr) return 0;
    const lower = dateStr.toLowerCase().trim();
    if (dateWeightMap[lower]) return dateWeightMap[lower];
    // Intento de extracción de año/mes genérico
    const parts = lower.split(' ');
    if (parts.length === 2 && !isNaN(parts[1])) {
      const year = parseInt(parts[1], 10);
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const monthIdx = months.indexOf(parts[0]);
      if (monthIdx !== -1) {
        return year * 100 + (monthIdx + 1);
      }
    }
    return 202601;
  }

  // 1. CARGA DE DATOS DESDE LA CARPETA `escritos/`
  async function loadEditorialData() {
    try {
      const [resenasRes, criticaRes, invitadoRes, bibliotecaRes] = await Promise.all([
        fetch('escritos/resenas-libros.json').then(r => r.json()),
        fetch('escritos/critica-literaria.json').then(r => r.json()),
        fetch('escritos/escritor-invitado.json').then(r => r.json()),
        fetch('escritos/biblioteca-virtual.json').then(r => r.json())
      ]);

      state.resenas = resenasRes || [];
      state.critica = criticaRes || [];
      state.invitado = invitadoRes || [];
      state.biblioteca = bibliotecaRes || [];

      // Ordenar reseñas por fecha de publicación (más reciente primero siempre)
      sortResenasByDate();

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
          contenido: "Antes de que el sueño comenzara, Yeonghye era una esposa ordinaria. Pero Han Kang no escribe sobre una dieta; escribe sobre el cuerpo como el último territorio de soberanía. La prosa de Kang, traducida con una precisión quirúrgica, desnuda las expectativas familiares y la violencia soterrada de la norma. Lo fascinante de esta novela es cómo el acto aparentemente pasivo de dejar de comer carne desencadena una fractura telúrica en todo su entorno. Una lectura inquietante, poética y profundamente inolvidable.",
          comentarios: [
            { usuario: "Valeria M.", fecha: "Hace 2 días", texto: "Me impactó cómo el cambio de punto de vista en cada una de las tres partes transforma la percepción de la protagonista. Es escalofriante y hermoso a la vez." },
            { usuario: "Carlos E.", fecha: "Hace 5 días", texto: "¿Creen que la renuncia de Yeonghye es un acto de libertad o una rendición? Me quedé debatiendo esto durante días." }
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
          contenido: "Chantal Maillard no escribe para complacer sino para desmantelar certezas. En este compendio de ensayos y anotaciones, la autora hispanobelga plantea la compasión no como un sentimiento piadoso, sino como un ejercicio de lucidez extrema ante el dolor ajeno. A través de referencias a la filosofía oriental, la tragedia griega y la literatura del siglo XXI, el libro cuestiona nuestra pretensión de inocencia en un mundo interconectado.",
          comentarios: [
            { usuario: "Sofía R.", fecha: "Hace 1 semana", texto: "Es el libro que más he subrayado este año. La forma en que une ética y poesía es insuperable." }
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
          contenido: "Nat, una joven traductora, se instala en La Escapa, un núcleo rural en ruinas. Lo que parece un retiro para recuperar la calma se transforma de inmediato en un escenario tenso donde la amabilidad es ambigua y la intemperie física refleja la precariedad emocional. Sara Mesa maneja la tensión atmosférica con una maestría excepcional: cada frase parece contener una amenaza contenida.",
          comentarios: [
            { usuario: "Mateo L.", fecha: "Hace 3 días", texto: "La atmósfera opresiva del pueblo está tan bien lograda que sientes el polvo y la incomodidad de la protagonista." }
          ]
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
          contenido: "Revisitar Ficciones es recordar que toda lectura es una reescritura. En estos cuentos donde los libros inventados alteran la realidad física y los detectives se pierden en geometrías conceptuales, Borges estableció el canon de la literatura como juego de espejos. Una obra imprescindible para nuestra librería y para cualquier lector que busque asombro intelectual.",
          comentarios: [
            { usuario: "Elena G.", fecha: "Hace 2 semanas", texto: "'El jardín de senderos que se bifurcan' sigue siendo mi relato favorito de todos los tiempos. Cada relectura revela una capa nueva." }
          ]
        }
      ];

      state.critica = [{
        id: "critica-velocidad-lectura",
        titulo: "La ilusión de la prisa: por qué leer menos es leer mejor",
        autor: "Redacción Punto y Seguido, Librería",
        rol: "Columna de Crítica",
        fecha: "Septiembre 2026",
        tiempoLectura: "5 min de lectura",
        extracto: "Frente al ritmo acelerado de las métricas de lectura y los retos anuales de libros, reivindicamos la lentitud como la única forma verdadera de intimidad con un texto.",
        contenido: "Vivimos en la era de la cuantificación. Medimos los pasos diarios, las horas de sueño y el número de libros que terminamos al año. Pero la literatura no es una carrera de consumo ni un catálogo por tachar. Leer a ritmo de vértigo neutraliza el verdadero propósito del libro: dejar que una frase nos detenga, nos perturbe o nos obligue a mirar por la ventana durante diez minutos.\n\nLa verdadera crítica no mide cuántas páginas se leen, sino cuánta resonancia deja una idea en el tiempo.",
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
        contenido: "Una librería no es una bodega de papel ni un simple punto de venta. Es un refugio de resistencia cultural. En un mundo donde todo nos invita a la inmediatez y la recomendación automatizada, entrar en una librería donde alguien ha elegido cada volumen con sus propias manos es una experiencia revolucionaria. Aquí las lecturas no compiten por nuestra atención; nos invitan al silencio y al encuentro.",
        comentarios: []
      }];

      state.biblioteca = [
        {
          id: "la-metamorfosis",
          titulo: "La metamorfosis",
          autor: "Franz Kafka",
          año: "1915",
          categoria: "Dominio Público",
          tiempoLectura: "2 horas aprox.",
          licencia: "Libre de derechos de autor (Dominio Público)",
          extracto: "«Al despertar Gregorio Samsa una mañana, tras un sueño intranquilo, se encontró sobre su cama convertido en un monstruoso insecto».",
          sinopsis: "Una de las obras cumbre de la literatura universal del siglo XX sobre la alienación y deshumanización.",
          contenido: "Al despertar Gregorio Samsa una mañana, tras un sueño intranquilo, se encontró sobre su cama convertido en un monstruoso insecto. Estaba tumbado sobre su dura espalda, y al levantar un poco la cabeza vio su vientre abombado, pardo, dividido por partes duras en forma de arco, sobre cuya cima apenas podía sostenerse el cobertor, a punto ya de escurrirse por completo.\n\nSus muchas patas, ridículamente pequeñas en comparación con el resto de su tamaño, le vibraban desamparadas ante los ojos. «¿Qué me ha ocurrido?», pensó. No era un sueño...",
          enlacePublico: "https://www.gutenberg.org/ebooks/57864"
        },
        {
          id: "noches-blancas",
          titulo: "Noches blancas",
          autor: "Fiódor Dostoyevski",
          año: "1848",
          categoria: "Dominio Público",
          tiempoLectura: "1.5 horas aprox.",
          licencia: "Libre de derechos de autor (Dominio Público)",
          extracto: "«Era una noche maravillosa, una de esas noches que quizá solo se dan cuando somos jóvenes, querido lector».",
          sinopsis: "Una novela sentimental en cuatro noches de verano a orillas del canal en San Petersburgo.",
          contenido: "Era una noche maravillosa, una de esas noches que quizá solo se dan cuando somos jóvenes, querido lector. El cielo estaba tan estrellado, tan luminoso, que al mirarlo uno no podía menos de preguntarse: ¿es posible que bajo semejante cielo viva gente enfadada y caprichosa?...",
          enlacePublico: "https://www.gutenberg.org/ebooks/36034"
        },
        {
          id: "el-retrato-de-dorian-gray",
          titulo: "El retrato de Dorian Gray",
          autor: "Oscar Wilde",
          año: "1890",
          categoria: "Dominio Público",
          tiempoLectura: "5 horas aprox.",
          licencia: "Libre de derechos de autor (Dominio Público)",
          extracto: "«La única manera de librarse de una tentación es ceder ante ella».",
          sinopsis: "El manifiesto estético y filosófico de Wilde sobre la belleza eterna, la vanidad y la moral.",
          contenido: "El estudio estaba lleno del intenso olor de las rosas, y cuando la suave brisa del verano se movía entre los árboles del jardín, llegaba por la puerta abierta el pesado aroma de las lilas o el perfume más delicado de los espinos de flores rosadas...",
          enlacePublico: "https://www.gutenberg.org/ebooks/174"
        },
        {
          id: "cumbres-borrascosas",
          titulo: "Cumbres Borrascosas",
          autor: "Emily Brontë",
          año: "1847",
          categoria: "Dominio Público",
          tiempoLectura: "6 horas aprox.",
          licencia: "Libre de derechos de autor (Dominio Público)",
          extracto: "«De lo que sea que estén hechas nuestras almas, la suya y la mía son lo mismo».",
          sinopsis: "La salvaje tragedia gótica en los páramos de Yorkshire sobre un amor indomable.",
          contenido: "Acabo de regresar de una visita a mi casero, el solitario vecino con el que tendré que lidiar. Es sin duda un paraje hermoso. En toda Inglaterra no creo que hubiera podido encontrar una situación tan completamente apartada del bullicio de la sociedad...",
          enlacePublico: "https://www.gutenberg.org/ebooks/768"
        }
      ];

      sortResenasByDate();
      renderAll();
    }
  }

  function sortResenasByDate() {
    state.resenas.sort((a, b) => {
      const weightA = parseDateWeight(a.fecha);
      const weightB = parseDateWeight(b.fecha);
      return weightB - weightA; // Orden descendente (más reciente primero)
    });
  }

  // 2. RENDERIZADO DE TODAS LAS SECCIONES
  function renderAll() {
    renderResenas();
    renderCritica();
    renderInvitado();
    renderBiblioteca();
  }

  // A) SECCIÓN RESEÑAS (Ordenadas por fecha siempre)
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
      bookCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'reseña disponible' : 'reseñas disponibles'}`;
    }

    if (filtered.length === 0) {
      booksGrid.innerHTML = `
        <div class="empty-results" style="grid-column: 1 / -1;">
          <p>No se encontraron reseñas con el criterio "<strong>${state.searchTerm}</strong>".</p>
        </div>
      `;
      return;
    }

    booksGrid.innerHTML = filtered.map(book => `
      <article class="book-card reveal active" data-id="${book.id}">
        <div class="book-card-header">
          <span class="book-category-tag">${book.categoria}</span>
          <span class="book-date-tag">🗓️ ${book.fecha}</span>
        </div>
        <h3 class="book-card-title">${book.titulo}</h3>
        <p class="book-card-author">Por ${book.autor} • <span style="color: var(--text-light);">${book.tiempoLectura}</span></p>
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
            💬 ${book.comentarios ? book.comentarios.length : 0} comentarios
          </span>
        </div>
      </article>
    `).join('');
  }

  // B) SECCIÓN CRÍTICA LITERARIA
  function renderCritica() {
    const container = document.getElementById('critica-content');
    if (!container || state.critica.length === 0) return;
    const item = state.critica[0];

    const isVisible = state.activeFilter === 'todos' || state.activeFilter === 'critica';
    const matchSearch = item.titulo.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.autor.toLowerCase().includes(state.searchTerm.toLowerCase());

    const section = document.getElementById('critica-section');
    if (section) {
      section.style.display = (isVisible && matchSearch) ? 'block' : 'none';
    }

    container.innerHTML = `
      <h3 class="featured-card-title">${item.titulo}</h3>
      <p class="featured-card-meta">${item.autor} • ${item.tiempoLectura} • ${item.fecha}</p>
      <p class="featured-card-excerpt">${item.extracto}</p>
      <button class="btn btn-primary btn-sm" onclick="openArticleModal('${item.id}', 'critica')">
        Leer columna completa
      </button>
    `;
  }

  // C) SECCIÓN ESCRITOR INVITADO
  function renderInvitado() {
    const container = document.getElementById('invitado-content');
    if (!container || state.invitado.length === 0) return;
    const item = state.invitado[0];

    const isVisible = state.activeFilter === 'todos' || state.activeFilter === 'invitado';
    const matchSearch = item.titulo.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.autor.toLowerCase().includes(state.searchTerm.toLowerCase());

    const section = document.getElementById('seccion-invitado');
    if (section) {
      section.style.display = (isVisible && matchSearch) ? 'block' : 'none';
    }

    container.innerHTML = `
      <h3 class="featured-card-title">${item.titulo}</h3>
      <p class="featured-card-meta">${item.autor} (${item.rol}) • ${item.tiempoLectura}</p>
      <p class="featured-card-excerpt">${item.extracto}</p>
      <button class="btn btn-primary btn-sm" onclick="openArticleModal('${item.id}', 'invitado')">
        Leer artículo invitado
      </button>
    `;
  }

  // D) SECCIÓN BIBLIOTECA VIRTUAL (DOMINIO PÚBLICO)
  function renderBiblioteca() {
    const libraryGrid = document.getElementById('library-grid');
    if (!libraryGrid) return;

    let filtered = state.biblioteca.filter(book => {
      const matchSearch = book.titulo.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchCategory = state.activeFilter === 'todos' || state.activeFilter === 'biblioteca';
      return matchSearch && matchCategory;
    });

    const librarySection = document.getElementById('seccion-biblioteca');
    if (librarySection) {
      if (state.activeFilter !== 'todos' && state.activeFilter !== 'biblioteca') {
        librarySection.style.display = 'none';
      } else {
        librarySection.style.display = 'block';
      }
    }

    if (filtered.length === 0) {
      libraryGrid.innerHTML = `
        <div class="empty-results" style="grid-column: 1 / -1;">
          <p>No se encontraron obras en la Biblioteca Virtual con "<strong>${state.searchTerm}</strong>".</p>
        </div>
      `;
      return;
    }

    libraryGrid.innerHTML = filtered.map(book => `
      <article class="library-card reveal active" data-id="${book.id}">
        <div class="library-card-header">
          <span class="library-year-badge">${book.año}</span>
          <span class="library-license-badge">Libre de derechos</span>
        </div>
        <h3 class="library-card-title">${book.titulo}</h3>
        <p class="library-card-author">De ${book.autor} • ${book.tiempoLectura}</p>
        <p class="library-card-excerpt">${book.extracto}</p>
        
        <div class="library-card-footer">
          <button class="btn btn-primary btn-sm" onclick="openArticleModal('${book.id}', 'biblioteca')">
            Leer fragmento en visor
          </button>
          <a href="${book.enlacePublico}" target="_blank" rel="noopener noreferrer" class="btn-read-more">
            Descargar texto completo ↗
          </a>
        </div>
      </article>
    `).join('');
  }

  // 3. BARRA DE BÚSQUEDA Y FILTRADO AL FINAL
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value.trim();
      renderAll();
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

  // 4. LECTOR LATERAL DERECHO INTERACTIVO & FORO
  const readerPanel = document.getElementById('reader-panel');
  const readingProgressBar = document.getElementById('reading-progress-bar');

  // Actualización de barra de progreso de lectura milimétrica al hacer scroll dentro del panel
  if (readerPanel && readingProgressBar) {
    readerPanel.addEventListener('scroll', () => {
      const scrollTop = readerPanel.scrollTop;
      const scrollHeight = readerPanel.scrollHeight - readerPanel.clientHeight;
      if (scrollHeight > 0) {
        const progress = (scrollTop / scrollHeight) * 100;
        readingProgressBar.style.width = `${progress}%`;
      } else {
        readingProgressBar.style.width = '0%';
      }
    }, { passive: true });
  }

  window.openArticleModal = function (id, type) {
    let article = null;
    let isLibrary = false;

    if (type === 'resena') {
      article = state.resenas.find(b => b.id === id);
    } else if (type === 'critica') {
      article = state.critica.find(c => c.id === id);
    } else if (type === 'invitado') {
      article = state.invitado.find(i => i.id === id);
    } else if (type === 'biblioteca') {
      article = state.biblioteca.find(b => b.id === id);
      isLibrary = true;
    }

    if (!article) return;
    state.currentArticle = article;

    // Categoría y licencia
    document.getElementById('modal-category').textContent = article.categoria || article.rol || 'Espacio Editorial';
    const licenseTag = document.getElementById('modal-license');
    if (licenseTag) {
      if (article.licencia) {
        licenseTag.textContent = article.licencia;
        licenseTag.style.display = 'inline-block';
      } else {
        licenseTag.style.display = 'none';
      }
    }

    // Datos principales
    document.getElementById('modal-title').textContent = article.titulo;
    document.getElementById('modal-author').textContent = `Por ${article.autor}`;
    document.getElementById('modal-date').textContent = article.fecha || (article.año ? `Año ${article.año}` : 'Edición');
    document.getElementById('modal-reading-time').textContent = article.tiempoLectura || 'Lectura';
    document.getElementById('modal-body').textContent = article.contenido;

    // Enlace externo si es libro de biblioteca virtual
    const actionsContainer = document.getElementById('modal-actions');
    const externalLink = document.getElementById('modal-external-link');
    if (actionsContainer && externalLink) {
      if (isLibrary && article.enlacePublico) {
        actionsContainer.style.display = 'block';
        externalLink.href = article.enlacePublico;
      } else {
        actionsContainer.style.display = 'none';
      }
    }

    // Comentarios y foro
    renderModalComments(article.comentarios || []);

    // Restablecer scroll y barra de progreso al abrir
    if (readerPanel) readerPanel.scrollTop = 0;
    if (readingProgressBar) readingProgressBar.style.width = '0%';

    // Abrir drawer lateral
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

  // Cerrar con tecla Escape (accesibilidad recomendada)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('reader-modal');
      if (modal && modal.classList.contains('open')) {
        closeArticleModal();
      }
    }
  });

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
