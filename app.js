const data = window.CATALOG_DATA;
const grid = document.querySelector('#brandGrid');
const search = document.querySelector('#search');
const count = document.querySelector('#resultCount');
const empty = document.querySelector('#emptyState');

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#whatsappLink').href = data.whatsapp;
document.querySelector('#telegramLink').href = data.telegram;

function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function brandVisual(lab) {
  const fallback = `<span class="brand-fallback" aria-hidden="true">${escapeHtml(initials(lab.nome))}</span>`;

  if (!lab.logo) return fallback;

  return `
    <span class="brand-logo-wrap">
      <img
        class="brand-logo"
        src="${escapeHtml(lab.logo)}"
        alt="Logo oficial ${escapeHtml(lab.nome)}"
        loading="lazy"
        onerror="this.closest('.brand-logo-wrap').innerHTML='${fallback.replace(/'/g, '&apos;')}'"
      >
    </span>`;
}

function render(query = '') {
  const q = normalize(query.trim());
  const filtered = data.laboratorios.filter((lab) => {
    const searchable = [lab.nome, lab.descricao, ...(lab.produtos || []).map((p) => p.nome)].join(' ');
    return !q || normalize(searchable).includes(q);
  });

  grid.innerHTML = filtered.map((lab) => {
    const primary = lab.cor || '#d4af37';
    const secondary = lab.corSecundaria || '#4f3b0e';

    return `
      <a
        class="brand-card"
        href="catalogo.html?marca=${encodeURIComponent(lab.id)}"
        style="--brand-primary:${escapeHtml(primary)};--brand-secondary:${escapeHtml(secondary)}"
        aria-label="Abrir catálogo ${escapeHtml(lab.nome)}"
      >
        <span class="brand-card-glow" aria-hidden="true"></span>
        <div class="brand-visual">${brandVisual(lab)}</div>
        <div class="brand-copy">
          <strong>${escapeHtml(lab.nome)}</strong>
          <span>${(lab.produtos || []).length} produtos</span>
          <small>Ver catálogo</small>
        </div>
        <b class="brand-arrow" aria-hidden="true">›</b>
      </a>`;
  }).join('');

  count.textContent = `${filtered.length} laboratórios`;
  empty.hidden = filtered.length !== 0;
}

search.addEventListener('input', (event) => render(event.target.value));
render();
