(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: hairline border once the page scrolls
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobile-menu');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    menu.hidden = !open;
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // Reveal on scroll, staggered among siblings. Once shown, the reveal
  // classes are dropped so each element's own hover transitions apply.
  const reveals = [...document.querySelectorAll('.reveal')];
  const settle = el => el.classList.remove('reveal', 'in');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(settle);
  } else {
    reveals.forEach(el => {
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
      el.addEventListener('transitionend', function done(e) {
        if (e.target !== el || !el.classList.contains('in')) return;
        el.removeEventListener('transitionend', done);
        el.style.transitionDelay = '';
        settle(el);
      });
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  }

  // Hero chat demo: question → typing → answer, then the citation stamp
  const chat = document.querySelector('[data-chat]');
  if (chat) {
    const question = chat.querySelector('.msg-user');
    const typing = chat.querySelector('.typing');
    const answer = chat.querySelector('.msg-ai');
    const steps = [...answer.querySelectorAll('[data-step]')];
    const show = el => el.classList.add('on');

    if (reduceMotion) {
      [question, answer, ...steps].forEach(show);
    } else {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const play = async () => {
        await wait(450);
        show(question);
        await wait(650);
        show(typing);
        await wait(1300);
        typing.classList.remove('on');
        show(answer);
        for (const step of steps) {
          await wait(step.classList.contains('stamp') ? 650 : 420);
          show(step);
        }
      };
      const start = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        start.disconnect();
        play();
      }, { threshold: 0.35 });
      start.observe(chat);
    }
  }

  // Regulation filter
  const filterButtons = document.querySelectorAll('[data-filter]');
  const docs = document.querySelectorAll('.doc');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    docs.forEach(doc => { doc.hidden = filter !== 'all' && doc.dataset.type !== filter; });
  }));

  // Contact form: static hosting, so hand the message to the visitor's mail app
  const form = document.querySelector('[data-contact]');
  const note = document.querySelector('[data-form-note]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach(field => {
      const invalid = !field.value.trim();
      field.closest('.field').classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      note.textContent = 'Vui lòng điền đầy đủ các trường.';
      firstInvalid.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const name = data.name.trim();
    const subject = `Liên hệ từ website — ${name}`;
    const body = `Họ và tên: ${name}\nLiên hệ: ${data.reach.trim()}\n\n${data.message.trim()}`;
    location.href = `mailto:lienhe@hokinhdoanh.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Đang mở ứng dụng email của bạn…';
  });
})();
