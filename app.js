const data = window.CATALOG_DATA;
const grid = document.querySelector('#brandGrid');
const search = document.querySelector('#search');
const count = document.querySelector('#resultCount');
const empty = document.querySelector('#emptyState');

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#whatsappLink').href = data.whatsapp;
document.querySelector('#telegramLink').href = data.telegram;

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function render(query = '') {
  const q = normalize(query.trim());
  const filtered = data.laboratorios.filter((lab) => !q || normalize(lab.nome).includes(q));
  grid.innerHTML = filtered.map((lab) => `
    <a class="brand-card" href="catalogo.html?marca=${encodeURIComponent(lab.id)}">
      <div class="brand-initial">${lab.nome.charAt(0)}</div>
      <div><strong>${lab.nome}</strong><span>${lab.produtos.length} produtos</span></div>
      <b aria-hidden="true">›</b>
    </a>`).join('');
  count.textContent = `${filtered.length} laboratórios`;
  empty.hidden = filtered.length !== 0;
}

search.addEventListener('input', (event) => render(event.target.value));
render();
