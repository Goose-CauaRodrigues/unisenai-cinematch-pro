// ================================================
//  CineMatch Pro — main.js
//  Lógica da página de cadastro (index.html)
// ================================================

// ---------- Classe Filme ----------
class Filme {
  constructor({ titulo, ano, genero, duracao, nota, urlCapa, urlTrailer, sinopse }) {
    this.id        = crypto.randomUUID();
    this.titulo    = titulo;
    this.ano       = ano;
    this.genero    = genero;
    this.duracao   = Number(duracao);   // minutos
    this.nota      = Number(nota);
    this.urlCapa   = urlCapa;
    this.urlTrailer = urlTrailer;
    this.sinopse   = sinopse;
    this.cadastradoEm = new Date().toISOString();
  }
}

// ---------- Utilitários localStorage ----------
const STORAGE_KEY = 'cinematch_filmes';

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

// ---------- Estatísticas ----------
function atualizarEstatisticas() {
  const filmes = carregarFilmes();

  const totalFilmes   = filmes.length;
  const totalMinutos  = filmes.reduce((acc, f) => acc + (f.duracao || 0), 0);
  const totalHoras    = Math.floor(totalMinutos / 60);
  const minutosResto  = totalMinutos % 60;

  const generosMapa = filmes.reduce((acc, f) => {
    acc[f.genero] = (acc[f.genero] ?? 0) + 1;
    return acc;
  }, {});

  const generoFavorito = Object.entries(generosMapa)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const mediaNotas = totalFilmes
    ? (filmes.reduce((acc, f) => acc + (f.nota || 0), 0) / totalFilmes).toFixed(1)
    : '0.0';

  document.getElementById('stat-total').textContent      = totalFilmes;
  document.getElementById('stat-horas').textContent      = `${totalHoras}h ${minutosResto}min`;
  document.getElementById('stat-genero').textContent     = generoFavorito;
  document.getElementById('stat-nota').textContent       = `★ ${mediaNotas}`;
}

// ---------- Toast ----------
function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ---------- Preview de capa ----------
function setupPreviewCapa() {
  const inputCapa  = document.getElementById('urlCapa');
  const imgPreview = document.getElementById('capa-preview');
  if (!inputCapa || !imgPreview) return;

  inputCapa.addEventListener('input', () => {
    const url = inputCapa.value.trim();
    if (url) {
      imgPreview.src = url;
      imgPreview.style.display = 'block';
    } else {
      imgPreview.style.display = 'none';
    }
  });
}

// ---------- Extrair ID do YouTube ----------
function extrairYouTubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// ---------- Submissão do formulário ----------
function setupFormulario() {
  const form = document.getElementById('form-filme');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const getData = (id) => document.getElementById(id)?.value.trim() ?? '';

    const titulo    = getData('titulo');
    const ano       = getData('ano');
    const genero    = getData('genero');
    const duracao   = getData('duracao');
    const nota      = getData('nota');
    const urlCapa   = getData('urlCapa');
    const urlTrailer = getData('urlTrailer');
    const sinopse   = getData('sinopse');

    if (!titulo) {
      mostrarToast('⚠️ Informe o título do filme.');
      return;
    }

    const ytId = extrairYouTubeId(urlTrailer);
    if (urlTrailer && !ytId) {
      mostrarToast('⚠️ URL do trailer inválida. Use um link do YouTube.');
      return;
    }

    const filme = new Filme({
      titulo,
      ano,
      genero,
      duracao,
      nota,
      urlCapa,
      urlTrailer: ytId ? `https://www.youtube.com/embed/${ytId}` : '',
      sinopse,
    });

    const lista = carregarFilmes();
    lista.push(filme);
    salvarFilmes(lista);

    mostrarToast(`✅ "${titulo}" adicionado à videoteca!`);
    form.reset();

    const imgPreview = document.getElementById('capa-preview');
    if (imgPreview) imgPreview.style.display = 'none';

    atualizarEstatisticas();
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  setupFormulario();
  setupPreviewCapa();
  atualizarEstatisticas();
});
