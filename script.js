(() => {
  const root = document.documentElement;
  const tabs = [...document.querySelectorAll('[data-design-choice]')];
  const params = new URLSearchParams(location.search);
  const saved = params.get('design') || localStorage.getItem('taua-conceito-design');
  const names = tabs.map((tab) => tab.dataset.designChoice);

  function chooseDesign(name, focus = false) {
    if (!names.includes(name)) return;
    root.dataset.design = name;
    localStorage.setItem('taua-conceito-design', name);
    params.set('design', name);
    history.replaceState(null, '', `${location.pathname}?${params.toString()}${location.hash}`);
    tabs.forEach((tab) => {
      const selected = tab.dataset.designChoice === name;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', {
      territorio: '#f2eadb', casa: '#f5ead4', acervo: '#f7f7f4',
    }[name]);
  }

  chooseDesign(saved || 'territorio');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseDesign(tab.dataset.designChoice));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      chooseDesign(tabs[next].dataset.designChoice, true);
    });
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.product-card[data-category]')];
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      card.classList.toggle('is-hidden', selected !== 'all' && card.dataset.category !== selected);
    });
  }));

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
