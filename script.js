const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => { if (e.target.tagName === 'A') nav.classList.remove('open'); });

document.querySelectorAll('.add').forEach(btn => {
  btn.addEventListener('click', () => {
    const on = btn.classList.toggle('added');
    btn.textContent = on ? '✓' : '+';
  });
});

const dotsBox = document.querySelector('.pager__dots');
const arrows = document.querySelectorAll('.pager__arrow');
const PAGES = 5; let page = 0;
for (let i = 0; i < PAGES; i++) {
  const d = document.createElement('button');
  d.setAttribute('aria-label', 'Page ' + (i + 1));
  d.addEventListener('click', () => go(i));
  dotsBox.appendChild(d);
}
function go(n) {
  page = Math.max(0, Math.min(PAGES - 1, n));
  [...dotsBox.children].forEach((d, i) => d.classList.toggle('active', i === page));
  arrows[0].disabled = page === 0;
  arrows[1].disabled = page === PAGES - 1;
  const cards = [...document.querySelectorAll('#productGrid .card')];
  cards.forEach((c, i) => c.style.order = (i + page * 2) % cards.length);
}
arrows.forEach(a => a.addEventListener('click', () => go(page + Number(a.dataset.dir))));
go(0);

const reviews = [
  { n: 'Josh Smith', r: 'Manager of The New York Times', t: '“They are have a perfect touch for make something so professional ,interest and useful for a lot of people .”' },
  { n: 'Anna Miller', r: 'Interior designer', t: '“Great quality and fast delivery. The furniture looks exactly like in the catalog.”' },
  { n: 'Peter Novak', r: 'Business owner', t: '“We furnished the whole office here and the team loves it. Very friendly support.”' }
];
let ri = 0;
function showReview(i) {
  ri = (i + reviews.length) % reviews.length;
  const r = reviews[ri];
  revName.textContent = r.n; revRole.textContent = r.r; revText.textContent = r.t;
  revAva.textContent = r.n.split(' ').map(w => w[0]).join('');
}
revPrev.addEventListener('click', () => showReview(ri - 1));
revNext.addEventListener('click', () => showReview(ri + 1));

newsForm.addEventListener('submit', e => {
  e.preventDefault();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  newsMsg.textContent = ok ? 'Thank you! You are subscribed.' : 'Please enter a valid email address.';
  if (ok) newsForm.reset();
});

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.decor-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
});