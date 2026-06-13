// ================================================
//  CineMatch Pro — display.js
//  Lógica da página de videoteca (catalogo.html)
// ================================================

const STORAGE_KEY = 'cinematch_filmes';

// ---------- localStorage ----------
function carregarFilmes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function salvarFilmes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ---------- Estatísticas (aside) ----------
function atualizarEstatisticasCatalogo(filmes) {
  const total = filmes.length;

  const totalMinutos = filmes.reduce((acc, f) => acc + (f.duracao || 0), 0);
  const horas        = Math.floor(totalMinutos / 60);
  const minutos      = totalMinutos % 60;

  const generosMapa = filmes.reduce((acc, f) => {
    acc[f.genero] = (acc[f.genero] ?? 0) + 1;
    return acc;
  }, {});

  const topGeneros = Object.entries(generosMapa)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const mediaNotas = total
    ? (filmes.reduce((acc, f) => acc + (f.nota || 0), 0) / total).toFixed(1)
    : '0.0';

  const elTotal   = document.getElementById('cat-stat-total');
  const elTempo   = document.getElementById('cat-stat-tempo');
  const elNota    = document.getElementById('cat-stat-nota');
  const elGeneros = document.getElementById('cat-stat-generos');

  if (elTotal)   elTotal.textContent   = total;
  if (elTempo)   elTempo.textContent   = `${horas}h ${minutos}min`;
  if (elNota)    elNota.textContent    = `★ ${mediaNotas}`;
  if (elGeneros) {
    elGeneros.innerHTML = topGeneros.length
      ? topGeneros.map(([g, n]) => `<div class="stat-row"><span class="stat-label">${g}</span><span class="stat-value">${n}</span></div>`).join('')
      : '<span style="color:var(--text-muted);font-size:.85rem">Nenhum filme ainda</span>';
  }
}

// ---------- Gerar card HTML ----------
function criarCardHTML(filme) {
  const capaUrl = filme.urlCapa || 'https://via.placeholder.com/220x330/111827/e2a800?text=SEM+CAPA';
  const temTrailer = !!filme.urlTrailer;
  const estrelas   = '★'.repeat(Math.round(filme.nota || 0)) + '☆'.repeat(5 - Math.round(filme.nota || 0));

  return `
    <article class="card" data-id="${filme.id}">
      <div class="card-cover-wrap">
        <img
          src="${capaUrl}"
          alt="Capa do filme ${filme.titulo}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/220x330/111827/e2a800?text=CAPA+INDISPONÍVEL'"
        >
        ${filme.genero ? `<span class="card-badge">${filme.genero}</span>` : ''}
        ${temTrailer ? `
        <div class="card-play-overlay">
          <div class="play-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>` : ''}
      </div>
      <div class="card-body">
        <h2 class="card-title" title="${filme.titulo}">${filme.titulo}</h2>
        <div class="card-meta">
          ${filme.ano ? `<span>${filme.ano}</span>` : ''}
          ${filme.duracao ? `<span>⏱ ${filme.duracao}min</span>` : ''}
        </div>
        <span class="card-nota" style="font-size:.8rem;color:var(--accent)">${estrelas}</span>
        ${filme.sinopse ? `<p style="font-size:.78rem;color:var(--text-muted);margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${filme.sinopse}</p>` : ''}
      </div>
      <div class="card-footer">
        ${temTrailer ? `<button class="btn-sm btn-trailer" data-id="${filme.id}" data-titulo="${filme.titulo}" data-url="${filme.urlTrailer}">▶ Trailer</button>` : ''}
        <button class="btn-sm danger btn-excluir" data-id="${filme.id}">🗑 Excluir</button>
      </div>
    </article>
  `;
}

// ---------- Renderizar grid ----------
function renderizarGrid(filmes) {
  const grid = document.getElementById('grid-filmes');
  if (!grid) return;

  if (!filmes.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
        <h3>VIDEOTECA VAZIA</h3>
        <p>Você ainda não adicionou nenhum filme. Comece agora!</p>
        <a href="index.html">+ Cadastrar Filme</a>
      </div>
    `;
    return;
  }

  grid.innerHTML = filmes.map(criarCardHTML).join('');

  // Eventos dos botões de trailer
  grid.querySelectorAll('.btn-trailer').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModal(btn.dataset.titulo, btn.dataset.url);
    });
  });

  // Clique no card (se tem trailer)
  grid.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const filmeClicado = carregarFilmes().find((f) => f.id === id);
      if (filmeClicado?.urlTrailer) {
        abrirModal(filmeClicado.titulo, filmeClicado.urlTrailer);
      }
    });
  });

  // Eventos de excluir
  grid.querySelectorAll('.btn-excluir').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      excluirFilme(btn.dataset.id);
    });
  });
}

// ---------- Excluir filme ----------
function excluirFilme(id) {
  if (!confirm('Remover este filme da videoteca?')) return;
  let lista = carregarFilmes().filter((f) => f.id !== id);
  salvarFilmes(lista);
  aplicarFiltros();
}

// ---------- Modal ----------
function abrirModal(titulo, embedUrl) {
  const overlay   = document.getElementById('modal-overlay');
  const tituloEl  = document.getElementById('modal-titulo');
  const iframeEl  = document.getElementById('modal-iframe');

  if (!overlay) return;

  tituloEl.textContent = titulo;
  iframeEl.src         = embedUrl + '?autoplay=1&rel=0';
  overlay.classList.add('open');
}

function fecharModal() {
  const overlay  = document.getElementById('modal-overlay');
  const iframeEl = document.getElementById('modal-iframe');
  if (!overlay) return;

  overlay.classList.remove('open');
  // Para o vídeo ao fechar
  setTimeout(() => { iframeEl.src = ''; }, 300);
}

// ---------- Filtros ----------
function aplicarFiltros() {
  let filmes = carregarFilmes();

  const busca  = document.getElementById('busca')?.value.toLowerCase() ?? '';
  const genero = document.getElementById('filtro-genero')?.value ?? '';
  const ordem  = document.getElementById('filtro-ordem')?.value ?? 'recente';

  if (busca) {
    filmes = filmes.filter((f) => f.titulo.toLowerCase().includes(busca));
  }

  if (genero) {
    filmes = filmes.filter((f) => f.genero === genero);
  }

  filmes.sort((a, b) => {
    if (ordem === 'recente')     return new Date(b.cadastradoEm) - new Date(a.cadastradoEm);
    if (ordem === 'titulo')      return a.titulo.localeCompare(b.titulo);
    if (ordem === 'nota')        return (b.nota || 0) - (a.nota || 0);
    if (ordem === 'duracao')     return (b.duracao || 0) - (a.duracao || 0);
    return 0;
  });

  renderizarGrid(filmes);
  atualizarEstatisticasCatalogo(carregarFilmes()); // estatísticas sempre do total
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  aplicarFiltros();

  // Filtros em tempo real
  document.getElementById('busca')?.addEventListener('input', aplicarFiltros);
  document.getElementById('filtro-genero')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-ordem')?.addEventListener('change', aplicarFiltros);

  // Modal
  document.getElementById('modal-fechar')?.addEventListener('click', fecharModal);
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });
});
