/* Каталог, карточка товара с рекомендациями, корзина и оформление заказа на самовывоз.
   Без библиотек. Данные — lite/products.js. */
(function () {
  const P = window.LT_PRODUCTS, CATS = window.LT_CATS, CTRY = window.LT_COUNTRIES, S = window.LT_SHOP;
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const KEY = 'lt-cart-' + (document.documentElement.dataset.variant || 'x');

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const items = () => Object.entries(cart).filter(([id, q]) => byId[id] && q > 0).map(([id, q]) => ({ p: byId[id], q }));
  const total = () => items().reduce((s, i) => s + i.p.price * i.q, 0);
  const count = () => items().reduce((s, i) => s + i.q, 0);

  /* ---------- Картинка товара (заглушка, пока нет фото) ---------- */
  function art(p) {
    if (p.img) return `<img src="${p.img}" alt="" loading="lazy">`;
    const [a, b] = p.c, g = 'g' + p.id + Math.random().toString(36).slice(2, 6), h = 'h' + g;
    const defs = `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
      <linearGradient id="${h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    const lotus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.6"><path d="M0 8C-4 2-4-5 0-10 4-5 4 2 0 8Z"/><path d="M0 8C-6 6-10 1-11-5-5-4-1 0 0 8Z"/><path d="M0 8C6 6 10 1 11-5 5-4 1 0 0 8Z"/></g>`;
    const sh = `<ellipse cx="100" cy="184" rx="58" ry="7" fill="#000" opacity=".12"/>`;
    const shapes = {
      jar: `${sh}<rect x="58" y="58" width="84" height="26" rx="7" fill="${b}"/><rect x="50" y="82" width="100" height="98" rx="18" fill="url(#${g})"/><rect x="62" y="108" width="76" height="46" rx="6" fill="#fff" opacity=".22"/>${lotus(100, 131, 1.3)}<rect x="58" y="88" width="10" height="80" rx="5" fill="url(#${h})"/>`,
      tube: `${sh}<rect x="80" y="150" width="40" height="32" rx="6" fill="${b}"/><path d="M66 34h68l-8 118H74Z" fill="url(#${g})"/><rect x="64" y="28" width="72" height="10" rx="2" fill="${b}"/><path d="M72 44h8l-3 100h-6Z" fill="url(#${h})"/>${lotus(100, 96, 1.4)}`,
      bottle: `${sh}<rect x="86" y="22" width="28" height="26" rx="5" fill="${b}"/><rect x="92" y="46" width="16" height="16" fill="${a}"/><rect x="64" y="60" width="72" height="122" rx="22" fill="url(#${g})"/><rect x="72" y="96" width="56" height="54" rx="6" fill="#fff" opacity=".22"/>${lotus(100, 122, 1.4)}<rect x="70" y="68" width="10" height="100" rx="5" fill="url(#${h})"/>`,
      dropper: `${sh}<ellipse cx="100" cy="36" rx="14" ry="18" fill="${b}"/><rect x="84" y="50" width="32" height="26" rx="4" fill="#2b2b2b" opacity=".75"/><rect x="70" y="76" width="60" height="106" rx="14" fill="url(#${g})"/><rect x="78" y="106" width="44" height="50" rx="5" fill="#fff" opacity=".24"/>${lotus(100, 130, 1.2)}`,
      box: `${sh}<path d="M128 46l18-12v136l-18 12Z" fill="${b}" opacity=".85"/><path d="M58 46l18-12h70l-18 12Z" fill="${a}"/><rect x="58" y="46" width="70" height="136" fill="url(#${g})"/><rect x="66" y="92" width="54" height="50" fill="#fff" opacity=".2"/>${lotus(93, 116, 1.4)}`,
      sachet: `${sh}<path d="M56 30l7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 6-4v144l-6 4-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5Z" fill="url(#${g})"/><rect x="70" y="70" width="60" height="70" rx="30" fill="#fff" opacity=".2"/>${lotus(100, 104, 1.6)}`,
      bar: `${sh}<rect x="40" y="96" width="120" height="76" rx="26" fill="${b}"/><rect x="40" y="88" width="120" height="76" rx="26" fill="url(#${g})"/><ellipse cx="100" cy="126" rx="38" ry="22" fill="#fff" opacity=".18"/>${lotus(100, 126, 1.4)}`,
      towel: `${sh}<rect x="36" y="128" width="128" height="50" rx="12" fill="${b}"/><rect x="42" y="92" width="116" height="44" rx="12" fill="url(#${g})"/><rect x="48" y="60" width="104" height="40" rx="12" fill="${a}"/><rect x="48" y="60" width="104" height="12" rx="6" fill="url(#${h})"/><path d="M48 86h104M42 118h116M36 160h128" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-dasharray="4 5"/>`
    };
    return `<svg viewBox="0 0 200 200" aria-hidden="true">${defs}${shapes[p.shape] || shapes.box}</svg>`;
  }

  function addBtn(p, small) {
    const q = cart[p.id] || 0;
    if (!q) return `<button class="lt-add${small ? ' lt-add--s' : ''}" data-add="${p.id}" aria-label="Добавить «${esc(p.title)}» в корзину">${small ? '+' : 'В корзину'}</button>`;
    return `<span class="lt-step${small ? ' lt-step--s' : ''}"><button data-dec="${p.id}" aria-label="Меньше">−</button><b>${q}</b><button data-add="${p.id}" aria-label="Больше">+</button></span>`;
  }

  /* ---------- Каталог ---------- */
  const view = { cat: 'all', sub: 'all', q: '' };
  const root = $('[data-catalog]');

  function card(p) {
    return `<article class="lt-card" data-id="${p.id}">
      <button class="lt-card__img" data-open="${p.id}" aria-label="Подробнее: ${esc(p.title)}">${art(p)}${p.badge ? `<span class="lt-badge">${p.badge}</span>` : ''}</button>
      <div class="lt-card__body">
        <p class="lt-card__meta">${CTRY[p.country]} · ${p.vol}</p>
        <h3 class="lt-card__title"><button data-open="${p.id}">${esc(p.title)}</button></h3>
        <div class="lt-card__foot"><span class="lt-price">${rub(p.price)}</span><span data-ctl="${p.id}">${addBtn(p)}</span></div>
      </div></article>`;
  }

  function buildCatalog() {
    if (!root) return;
    root.innerHTML = `
      <div class="lt-cat">
        <nav class="lt-cats" aria-label="Категории">
          <button data-cat="all">Все товары <small>${P.length}</small></button>
          ${CATS.map(c => `<button data-cat="${c.id}">${c.title} <small>${P.filter(p => p.cat === c.id).length}</small></button>`).join('')}
        </nav>
        <div class="lt-cat__main">
          <div class="lt-tools">
            <div class="lt-subs" role="group" aria-label="Подкатегории"></div>
            <label class="lt-search"><span class="lt-vh">Поиск по каталогу</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
              <input id="lt-q" type="search" placeholder="Найти: маска, бальзам, чай…" autocomplete="off"></label>
          </div>
          <div class="lt-grid" aria-live="polite"></div>
        </div>
      </div>`;
    root.addEventListener('click', e => {
      const c = e.target.closest('[data-cat]'); if (c) { view.cat = c.dataset.cat; view.sub = 'all'; drawCatalog(); }
      const s = e.target.closest('[data-sub]'); if (s) { view.sub = s.dataset.sub; drawCatalog(); }
    });
    $('#lt-q', root).addEventListener('input', e => { view.q = e.target.value.trim().toLowerCase(); drawCatalog(); });
    drawCatalog();
  }

  function drawCatalog() {
    $$('[data-cat]', root).forEach(b => b.classList.toggle('is-on', b.dataset.cat === view.cat));
    const cat = CATS.find(c => c.id === view.cat);
    const subs = $('.lt-subs', root);
    subs.innerHTML = cat ? `<button data-sub="all" class="${view.sub === 'all' ? 'is-on' : ''}">Все</button>` +
      Object.entries(cat.subs).map(([k, t]) => `<button data-sub="${k}" class="${view.sub === k ? 'is-on' : ''}">${t}</button>`).join('') : '';
    subs.hidden = !cat;
    const list = P.filter(p => (view.cat === 'all' || p.cat === view.cat) && (view.sub === 'all' || p.sub === view.sub) &&
      (!view.q || (p.title + ' ' + p.desc).toLowerCase().includes(view.q)));
    $('.lt-grid', root).innerHTML = list.length ? list.map(card).join('') :
      `<p class="lt-empty">Ничего не нашлось. Попробуйте другое слово или <button data-cat="all">покажите все товары</button>.</p>`;
  }

  // Переходы из меню / героя: <a data-goto-cat="face">
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-goto-cat]'); if (!a || !root) return;
    view.cat = a.dataset.gotoCat; view.sub = 'all'; drawCatalog();
  });

  /* ---------- Карточка товара ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="lt-modal" id="lt-modal" aria-labelledby="lt-m-title"><div class="lt-modal__in"></div></dialog>
    <dialog class="lt-drawer" id="lt-drawer" aria-labelledby="lt-d-title"><div class="lt-drawer__in"></div></dialog>
    <div class="lt-toast" role="status" aria-live="polite"></div>`);
  const modal = $('#lt-modal'), drawer = $('#lt-drawer');
  let openId = null;

  function drawModal() {
    const p = byId[openId]; if (!p) return;
    const cat = CATS.find(c => c.id === p.cat);
    const rel = (p.with || []).map(id => byId[id]).filter(Boolean);
    $('.lt-modal__in', modal).innerHTML = `
      <button class="lt-x" data-close aria-label="Закрыть">×</button>
      <div class="lt-pm">
        <div class="lt-pm__img">${art(p)}</div>
        <div class="lt-pm__info">
          <p class="lt-card__meta">${cat.title} · ${cat.subs[p.sub]}</p>
          <h2 id="lt-m-title" class="lt-pm__title">${esc(p.title)}</h2>
          <p class="lt-pm__desc">${esc(p.desc)}</p>
          <dl class="lt-pm__dl"><div><dt>Страна</dt><dd>${CTRY[p.country]}</dd></div><div><dt>Объём</dt><dd>${p.vol}</dd></div></dl>
          <div class="lt-pm__buy"><span class="lt-price lt-price--l">${rub(p.price)}</span><span data-ctl="${p.id}">${addBtn(p)}</span></div>
        </div>
      </div>
      ${rel.length ? `<section class="lt-rel"><h3>С этим берут</h3><div class="lt-rel__list">${rel.map(miniRow).join('')}</div></section>` : ''}`;
  }

  function miniRow(r) {
    return `<div class="lt-mini"><button class="lt-mini__img" data-open="${r.id}" aria-label="Открыть: ${esc(r.title)}">${art(r)}</button>
      <div><button class="lt-mini__t" data-open="${r.id}">${esc(r.title)}</button><span class="lt-mini__p">${rub(r.price)}</span></div>
      <span data-ctl="${r.id}">${addBtn(r, true)}</span></div>`;
  }

  function openProduct(id) {
    openId = id; drawModal();
    if (!modal.open) modal.showModal();
    $('.lt-modal__in', modal).scrollTop = 0;
  }

  /* ---------- Корзина и оформление ---------- */
  let pane = 'cart', lastOrder = null;

  function recsForCart() {
    const inCart = new Set(items().map(i => i.p.id)), seen = new Set();
    return items().flatMap(i => i.p.with || []).filter(id => !inCart.has(id) && !seen.has(id) && seen.add(id)).slice(0, 3).map(id => byId[id]);
  }

  function drawDrawer() {
    const box = $('.lt-drawer__in', drawer);
    const head = t => `<header class="lt-dh"><h2 id="lt-d-title">${t}</h2><button class="lt-x" data-close aria-label="Закрыть">×</button></header>`;
    if (pane === 'cart') {
      const list = items();
      if (!list.length) {
        box.innerHTML = head('Корзина') + `<div class="lt-dempty"><p>Корзина пока пустая.</p><button class="lt-btn" data-close data-to="#catalog">Перейти в каталог</button></div>`;
        return;
      }
      const recs = recsForCart();
      box.innerHTML = head('Корзина') + `
        <div class="lt-dbody">
          <ul class="lt-lines">${list.map(({ p, q }) => `<li class="lt-line">
            <button class="lt-line__img" data-open="${p.id}" aria-label="${esc(p.title)}">${art(p)}</button>
            <div class="lt-line__t"><b>${esc(p.title)}</b><small>${rub(p.price)} × ${q}</small></div>
            <span data-ctl="${p.id}">${addBtn(p, true)}</span></li>`).join('')}</ul>
          ${recs.length ? `<section class="lt-rel lt-rel--cart"><h3>К заказу подойдёт</h3><div class="lt-rel__list">${recs.map(miniRow).join('')}</div></section>` : ''}
        </div>
        <footer class="lt-dfoot">
          <p class="lt-sum"><span>Итого</span><b>${rub(total())}</b></p>
          <p class="lt-note">Оплата при получении: наличными или переводом — как договоритесь с продавцом.</p>
          <button class="lt-btn lt-btn--wide" data-pane="form">Оформить заказ</button>
        </footer>`;
    } else if (pane === 'form') {
      box.innerHTML = head('Оформление') + `
        <form class="lt-form" id="lt-form" novalidate>
          <p class="lt-form__lead">${count()} ${plural(count(), 'товар', 'товара', 'товаров')} на ${rub(total())}. Оставьте контакты — мы соберём заказ и напишем, когда можно забирать.</p>
          <label for="lt-name">Ваше имя</label>
          <input id="lt-name" name="name" autocomplete="name" required placeholder="Анна">
          <label for="lt-phone">Телефон</label>
          <input id="lt-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+7 900 123-45-67">
          <fieldset><legend>Куда написать</legend>
            <div class="lt-radio">${['WhatsApp', 'Telegram', 'Позвонить'].map((m, i) => `<label><input type="radio" name="via" id="lt-via-${i}" value="${m}"${i ? '' : ' checked'}><span>${m}</span></label>`).join('')}</div>
          </fieldset>
          <label for="lt-comment">Комментарий <small>(необязательно)</small></label>
          <textarea id="lt-comment" name="comment" rows="2" placeholder="Например: заберу в субботу после обеда"></textarea>
          <div class="lt-pick"><b>Самовывоз</b><span>${S.city}, ${S.pickup}</span><small>${S.pickupNote}</small></div>
          <label class="lt-agree"><input type="checkbox" name="agree" required><span>Даю <a href="${S.consentUrl}" target="_blank">согласие на обработку персональных данных</a> и принимаю <a href="${S.privacyUrl}" target="_blank">политику конфиденциальности</a></span></label>
          <p class="lt-err" role="alert" hidden></p>
          <div class="lt-form__btns"><button type="button" class="lt-btn lt-btn--ghost" data-pane="cart">Назад</button><button class="lt-btn">Отправить заказ</button></div>
        </form>`;
      $('#lt-form').addEventListener('submit', submit);
      // Ошибка пропадает, как только поле исправили
      $('#lt-form').addEventListener('input', e => { e.target.removeAttribute('aria-invalid'); $('.lt-err', drawer).hidden = true; });
      setTimeout(() => $('#lt-name')?.focus(), 30);
    } else {
      const o = lastOrder;
      const text = `Здравствуйте! Заказ ${o.num}:\n` + o.lines.map(l => `— ${l.p.title} × ${l.q}`).join('\n') + `\nИтого: ${rub(o.sum)}\n${o.name}, ${o.phone}`;
      box.innerHTML = head('Заказ принят') + `
        <div class="lt-done">
          <p class="lt-done__num">Заказ ${o.num}</p>
          <p>Спасибо, ${esc(o.name)}! Мы соберём заказ и напишем вам в ${o.via === 'Позвонить' ? 'течение дня по телефону' : o.via} на номер ${esc(o.phone)}.</p>
          <div class="lt-pick lt-pick--big"><b>Где забрать</b><span>${S.city}, ${S.pickup}</span><small>${S.pickupNote}<br>${S.hours}</small>
            <a class="lt-link" href="${S.mapUrl}" target="_blank" rel="noopener">Открыть на карте →</a></div>
          <p class="lt-note">Товар можно посмотреть на месте. Оплата при получении — договоритесь с продавцом, как удобнее: наличные или перевод.</p>
          <ul class="lt-done__list">${o.lines.map(l => `<li><span>${esc(l.p.title)} × ${l.q}</span><b>${rub(l.p.price * l.q)}</b></li>`).join('')}<li class="is-sum"><span>Итого</span><b>${rub(o.sum)}</b></li></ul>
          <a class="lt-btn lt-btn--ghost lt-btn--wide" href="https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Отправить копию в WhatsApp</a>
          <button class="lt-btn lt-btn--wide" data-close>Готово</button>
        </div>`;
    }
  }

  function submit(e) {
    e.preventDefault();
    const f = e.target.elements, err = $('.lt-err', e.target), name = f.name.value.trim(), phone = f.phone.value.trim();
    const digits = phone.replace(/\D/g, '');
    if (!name) return showErr(err, 'Напишите, как к вам обращаться.', f.name);
    if (digits.length < 10 || digits.length > 12) return showErr(err, 'Проверьте номер телефона: нужно 10–11 цифр.', f.phone);
    if (!f.agree.checked) return showErr(err, 'Отметьте согласие на обработку данных — без него не сможем принять заказ.', f.agree);
    lastOrder = { num: 'ЗЛ-' + String(Date.now()).slice(-4), name, phone, via: f.via.value, comment: f.comment.value.trim(), lines: items(), sum: total() };
    // Здесь заказ уходит продавцу. В Тильде — форма с отправкой в Telegram/почту/CRM.
    cart = {}; save(); refreshAll();
    pane = 'done'; drawDrawer();
  }
  function showErr(el, msg, field) { el.textContent = msg; el.hidden = false; field.focus(); field.setAttribute('aria-invalid', 'true'); }
  function plural(n, a, b, c) { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; }

  function openCart() { pane = 'cart'; drawDrawer(); if (!drawer.open) drawer.showModal(); }

  /* ---------- Общие события ---------- */
  function refreshAll() {
    $$('[data-ctl]').forEach(el => { const p = byId[el.dataset.ctl]; el.innerHTML = addBtn(p, !!el.closest('.lt-mini, .lt-line')); });
    const n = count();
    $$('[data-cart-count]').forEach(el => { el.textContent = n; el.classList.toggle('is-empty', !n); });
    $$('[data-cart-total]').forEach(el => el.textContent = rub(total()));
  }
  let toastT;
  function toast(msg) {
    const t = $('.lt-toast'); t.innerHTML = msg;
    // Если открыто окно, всё вне его неактивно — переносим подсказку внутрь окна
    const host = $$('dialog').find(d => d.open) || document.body;
    if (t.parentNode !== host) { t.classList.remove('is-on'); host.append(t); }
    requestAnimationFrame(() => t.classList.add('is-on'));
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), dec = e.target.closest('[data-dec]');
    if (add || dec) {
      const id = (add || dec).dataset.add || dec.dataset.dec, was = cart[id] || 0;
      cart[id] = Math.max(0, was + (add ? 1 : -1)); if (!cart[id]) delete cart[id];
      save(); refreshAll();
      if (drawer.open && pane === 'cart') drawDrawer();
      if (add && !was) toast(`«${esc(byId[id].title)}» в корзине · <button data-cart-open>Открыть</button>`);
      return;
    }
    const op = e.target.closest('[data-open]');
    if (op) { if (drawer.open) drawer.close(); openProduct(op.dataset.open); return; }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); if (modal.open) modal.close(); openCart(); return; }
    const pn = e.target.closest('[data-pane]');
    if (pn && drawer.contains(pn)) { pane = pn.dataset.pane; drawDrawer(); return; }
    const cl = e.target.closest('[data-close]');
    if (cl) { cl.closest('dialog').close(); if (cl.dataset.to) $(cl.dataset.to)?.scrollIntoView({ behavior: 'smooth' }); }
  });
  // Клик по затемнению закрывает окно
  [modal, drawer].forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

  /* ---------- Данные магазина в разметке ---------- */
  const links = { map: S.mapUrl, wa: `https://wa.me/${S.whatsapp}`, tg: `https://t.me/${S.telegram}`, vk: `https://vk.com/${S.vk}` };
  $$('[data-shop]').forEach(el => el.textContent = S[el.dataset.shop]);
  $$('[data-link]').forEach(el => el.href = links[el.dataset.link]);
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Плавное появление блоков (контент виден и без него)
  const io = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: .12 });
  if (io) $$('[data-rise]').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('rise'); io.observe(el); } });

  /* ---------- Боковое меню ----------
     Пункты: каталог с категориями + секции страницы с атрибутом data-menu="Название". */
  const sections = $$('[data-menu][id]');
  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="lt-side" id="lt-side" aria-label="Меню"><div class="lt-side__in">
      <header class="lt-side__h"><span class="lt-side__logo">${S.name}</span><button class="lt-x" data-close aria-label="Закрыть меню">×</button></header>
      <nav class="lt-side__nav">
        <a href="#catalog" data-goto-cat="all" data-side-go><b>Каталог</b></a>
        <div class="lt-side__cats">${CATS.map(c => `<a href="#catalog" data-goto-cat="${c.id}" data-side-go>${c.title}<small>${P.filter(p => p.cat === c.id).length}</small></a>`).join('')}</div>
        ${sections.map(s => `<a href="#${s.id}" data-side-go><b>${s.dataset.menu}</b></a>`).join('')}
        <button data-cart-open data-side-go><b>Корзина</b><i data-cart-count class="is-empty">0</i></button>
      </nav>
      <footer class="lt-side__f">
        <p><small>Пункт выдачи</small>${S.city}, ${S.pickup}<br><span>${S.pickupNote}</span></p>
        <div class="lt-side__msg"><a href="${links.wa}" target="_blank" rel="noopener">WhatsApp</a><a href="${links.tg}" target="_blank" rel="noopener">Telegram</a><a href="${links.vk}" target="_blank" rel="noopener">ВК</a></div>
      </footer>
    </div></dialog>`);
  const side = $('#lt-side');
  side.addEventListener('click', e => {
    if (e.target === side) return side.close();
    const go = e.target.closest('[data-side-go]'); if (!go) return;
    side.close();
    const href = go.getAttribute('href');
    if (href) { e.preventDefault(); $(href)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  });
  document.addEventListener('click', e => { if (e.target.closest('[data-menu-open]')) side.showModal(); });

  buildCatalog(); refreshAll();
})();
