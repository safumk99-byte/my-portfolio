(() => {
  const modal = document.createElement('div');
  modal.className = 'gallery-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="gallery-backdrop" data-gallery-close></div>
    <div class="gallery-dialog" role="dialog" aria-modal="true" aria-label="Project screenshots">
      <button class="gallery-close" type="button" aria-label="Close screenshots" data-gallery-close>×</button>
      <div class="gallery-head">
        <div>
          <p class="gallery-kicker">PROJECT SCREENSHOTS</p>
          <h3 class="gallery-title">Project</h3>
        </div>
        <span class="gallery-counter">1 / 1</span>
      </div>
      <div class="gallery-stage">
        <button class="gallery-nav gallery-prev" type="button" aria-label="Previous screenshot">‹</button>
        <img class="gallery-image" src="" alt="Project screenshot">
        <button class="gallery-nav gallery-next" type="button" aria-label="Next screenshot">›</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const image = modal.querySelector('.gallery-image');
  const title = modal.querySelector('.gallery-title');
  const counter = modal.querySelector('.gallery-counter');
  const prev = modal.querySelector('.gallery-prev');
  const next = modal.querySelector('.gallery-next');
  let items = [];
  let current = 0;
  let lastTrigger = null;

  function render() {
    if (!items.length) return;
    const item = items[current];
    image.src = item.src;
    image.alt = item.alt;
    counter.textContent = `${current + 1} / ${items.length}`;
    prev.hidden = items.length < 2;
    next.hidden = items.length < 2;
  }

  function openGallery(trigger) {
    const gallery = trigger.closest('.project-card').querySelector('.project-gallery');
    if (!gallery) return;
    items = [...gallery.querySelectorAll('[data-gallery-image]')].map((el) => ({
      src: el.dataset.full || el.querySelector('img')?.src,
      alt: el.querySelector('img')?.alt || 'Project screenshot',
    }));
    current = Number(trigger.dataset.galleryIndex || 0);
    lastTrigger = trigger;
    title.textContent = trigger.closest('.project-card').querySelector('h3')?.textContent || 'Project';
    render();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');
  }

  function closeGallery() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
    image.src = '';
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('[data-gallery-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => openGallery(trigger));
  });

  modal.querySelectorAll('[data-gallery-close]').forEach((el) => el.addEventListener('click', closeGallery));
  prev.addEventListener('click', () => {
    if (!items.length) return;
    current = (current - 1 + items.length) % items.length;
    render();
  });
  next.addEventListener('click', () => {
    if (!items.length) return;
    current = (current + 1) % items.length;
    render();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') prev.click();
    if (event.key === 'ArrowRight') next.click();
  });
})();
