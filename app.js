(function () {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('[data-progress]');
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let lastY = 0;

  const sun =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function paintTheme() {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      themeBtn.innerHTML = theme === 'dark' ? sun : moon;
    }
  }

  paintTheme();
  themeBtn &&
    themeBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      paintTheme();
    });

  menuBtn &&
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

  mobileNav &&
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (header) {
        if (y > 80 && y > lastY) header.classList.add('is-hidden');
        else header.classList.remove('is-hidden');
      }
      lastY = y;
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (y / max) * 100 : 0;
        progress.style.width = pct + '%';
      }
    },
    { passive: true }
  );

  document.querySelectorAll('[data-voices]').forEach((seg) => {
    const buttons = [...seg.querySelectorAll('button')];
    const reformers = document.querySelector('[data-grid="reformers"]');
    const puritans = document.querySelector('[data-grid="puritans"]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const which = btn.getAttribute('data-show');
        if (reformers) reformers.hidden = which === 'puritans';
        if (puritans) puritans.hidden = which === 'reformers';
      });
    });
  });

  document.querySelectorAll('.voice-card').forEach((card) => {
    card.tabIndex = 0;
    const toggles = [...card.querySelectorAll('[data-flip]')];
    const flip = () => {
      const on = card.classList.toggle('is-flipped');
      toggles.forEach((t) => t.setAttribute('aria-expanded', String(on)));
    };
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      flip();
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        flip();
      }
    });
  });

  const dialog = document.querySelector('#sola-dialog');
  const dialogBody = document.querySelector('[data-sola-body]');
  const closeBtn = document.querySelector('[data-dialog-close]');

  function openSola(key) {
    const data = window.SOLAS_DATA && window.SOLAS_DATA[key];
    if (!data || !dialog || !dialogBody) return;
    const verses = data.verses
      .map(
        (v) =>
          `<figure class="verse"><p>${v.text}</p><cite>${v.ref} · LSB</cite></figure>`
      )
      .join('');
    const paras = data.summary.map((p) => `<p>${p}</p>`).join('');
    dialogBody.innerHTML = `
      <p class="dialog-kicker">${data.english}</p>
      <h2>${data.latin}</h2>
      <div class="summary">${paras}</div>
      ${verses}
      <p style="margin-top:1rem"><a class="ext-link" href="${data.grokUrl}" target="_blank" rel="noopener noreferrer">Read more on Grokipedia</a></p>
    `;
    dialog.showModal();
  }

  document.querySelectorAll('[data-sola]').forEach((btn) => {
    btn.addEventListener('click', () => openSola(btn.getAttribute('data-sola')));
  });

  closeBtn && closeBtn.addEventListener('click', () => dialog.close());
  dialog &&
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

  document.querySelectorAll('[data-tabs]').forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        const id = tab.getAttribute('aria-controls');
        tablist.parentElement.querySelectorAll('[role="tabpanel"]').forEach((p) => {
          p.hidden = p.id !== id;
        });
      });
    });
  });

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'img-fallback';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', img.alt || 'Illustration unavailable');
      img.replaceWith(fallback);
    });
  });
})();
