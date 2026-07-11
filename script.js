const year = document.querySelector('#year');
const shareButton = document.querySelector('#shareButton');

year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-track]').forEach((link) => {
  link.addEventListener('click', () => {
    const key = `apex_click_${link.dataset.track}`;
    const current = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(current + 1));
  });
});

shareButton.addEventListener('click', async () => {
  const shareData = {
    title: 'APEX Supply Brasil',
    text: 'Acesse os catálogos oficiais e os canais de atendimento da APEX Supply Brasil.',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    const originalText = shareButton.textContent;
    shareButton.textContent = 'Link copiado';
    setTimeout(() => {
      shareButton.textContent = originalText;
    }, 1800);
  } catch (error) {
    console.error('Não foi possível compartilhar:', error);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.error('Falha ao registrar service worker:', error);
    });
  });
}
