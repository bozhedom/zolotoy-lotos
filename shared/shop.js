/* Золотой Лотос — общий движок витрины для всех 5 вариантов дизайна.
   Каталог, корзина-калькулятор, оформление, демо-оплата, бот-помощник, меню.
   В Тильде эти функции закрывают штатные блоки: Store (каталог), ST100 (корзина),
   платёжные системы (ЮKassa / Т-Банк / CloudPayments) и виджет бота. */
(function () {
  const P = window.ZL_PRODUCTS, C = window.ZL_COUNTRIES, N = window.ZL_NEEDS, S = window.ZL_SHOP;
  const variant = document.documentElement.dataset.variant || 'demo';
  const KEY = 'zl-cart-' + variant;
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- состояние ---------- */
  let state = { cart: {}, delivery: 'pickup', promo: '' };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  function totals() {
    const items = Object.entries(state.cart).filter(([id, q]) => byId[id] && q > 0);
    const count = items.reduce((s, [, q]) => s + q, 0);
    const subtotal = items.reduce((s, [id, q]) => s + byId[id].price * q, 0);
    const promoPct = S.promo[state.promo] || 0;
    const tierPct = subtotal >= S.tierFrom ? S.tierPercent : 0;
    const pct = Math.max(promoPct, tierPct);
    const discount = Math.round(subtotal * pct / 100);
    const after = subtotal - discount;
    const delivery = state.delivery === 'courier' && count ? (after >= S.freeDeliveryFrom ? 0 : S.courierPrice) : 0;
    return { items, count, subtotal, pct, promoPct, tierPct, discount, delivery, total: after + delivery, after };
  }

  /* ---------- иллюстрации товаров (заглушки вместо фото) ---------- */
  function art(p) {
    const [a, b] = p.c, g = 'g' + p.id, h = 'h' + p.id;
    const defs = `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
      <linearGradient id="${h}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    const lotus = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.6"><path d="M0 8C-4 2-4-5 0-10 4-5 4 2 0 8Z"/><path d="M0 8C-6 6-10 1-11-5-5-4-1 0 0 8Z"/><path d="M0 8C6 6 10 1 11-5 5-4 1 0 0 8Z"/></g>`;
    const shadow = `<ellipse cx="100" cy="184" rx="58" ry="7" fill="#000" opacity=".16"/>`;
    const shapes = {
      jar: `${shadow}<rect x="58" y="58" width="84" height="26" rx="7" fill="${b}"/><rect x="58" y="58" width="84" height="10" rx="5" fill="url(#${h})"/><rect x="50" y="82" width="100" height="98" rx="18" fill="url(#${g})"/><rect x="62" y="108" width="76" height="46" rx="6" fill="#fff" opacity=".22"/>${lotus(100, 131, 1.3)}<rect x="58" y="88" width="10" height="80" rx="5" fill="url(#${h})"/>`,
      tube: `${shadow}<rect x="80" y="150" width="40" height="32" rx="6" fill="${b}"/><path d="M66 34h68l-8 118H74Z" fill="url(#${g})"/><rect x="64" y="28" width="72" height="10" rx="2" fill="${b}"/><path d="M72 44h8l-3 100h-6Z" fill="url(#${h})"/>${lotus(100, 96, 1.4)}<rect x="84" y="114" width="32" height="3" rx="1.5" fill="#fff" opacity=".6"/>`,
      bottle: `${shadow}<rect x="86" y="22" width="28" height="26" rx="5" fill="${b}"/><rect x="92" y="46" width="16" height="16" fill="${a}"/><rect x="64" y="60" width="72" height="122" rx="22" fill="url(#${g})"/><rect x="72" y="96" width="56" height="54" rx="6" fill="#fff" opacity=".22"/>${lotus(100, 122, 1.4)}<rect x="70" y="68" width="10" height="100" rx="5" fill="url(#${h})"/>`,
      dropper: `${shadow}<ellipse cx="100" cy="36" rx="14" ry="18" fill="${b}"/><rect x="84" y="50" width="32" height="26" rx="4" fill="#2b2b2b" opacity=".75"/><rect x="70" y="76" width="60" height="106" rx="14" fill="url(#${g})"/><rect x="78" y="106" width="44" height="50" rx="5" fill="#fff" opacity=".24"/>${lotus(100, 130, 1.2)}<rect x="75" y="82" width="8" height="90" rx="4" fill="url(#${h})"/>`,
      box: `${shadow}<path d="M128 46l18-12v136l-18 12Z" fill="${b}" opacity=".85"/><path d="M58 46l18-12h70l-18 12Z" fill="${a}"/><rect x="58" y="46" width="70" height="136" fill="url(#${g})"/><rect x="66" y="92" width="54" height="50" fill="#fff" opacity=".2"/>${lotus(93, 116, 1.4)}<rect x="64" y="52" width="8" height="124" fill="url(#${h})"/>`,
      sachet: `${shadow}<path d="M56 30l7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 7-5 7 5 6-4v144l-6 4-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5Z" fill="url(#${g})"/><rect x="70" y="70" width="60" height="70" rx="30" fill="#fff" opacity=".2"/>${lotus(100, 104, 1.6)}<rect x="62" y="40" width="9" height="130" rx="4" fill="url(#${h})"/>`,
      bar: `${shadow}<rect x="40" y="96" width="120" height="76" rx="26" fill="${b}"/><rect x="40" y="88" width="120" height="76" rx="26" fill="url(#${g})"/><ellipse cx="100" cy="126" rx="38" ry="22" fill="#fff" opacity=".18"/>${lotus(100, 126, 1.4)}<rect x="52" y="94" width="70" height="10" rx="5" fill="url(#${h})"/>`
    };
    return `<svg viewBox="0 0 200 200" aria-hidden="true">${defs}${shapes[p.shape]}</svg>`;
  }
  const ZL = window.ZL = { art, rub, products: P, countries: C, totals, state };

  /* ---------- карточки ---------- */
  let filter = { country: 'all', need: 'all' };
  function control(p) {
    const q = state.cart[p.id] || 0;
    return q ? `<div class="zl-step" data-id="${p.id}"><button data-dec aria-label="Убрать одну">−</button><span>${q}</span><button data-inc aria-label="Добавить ещё">+</button></div>`
             : `<button class="zl-add" data-add="${p.id}"><span>В корзину</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>`;
  }
  function card(p, i) {
    return `<article class="zl-card" data-id="${p.id}" style="--i:${i}">
      <div class="zl-card__media" style="--c1:${p.c[0]};--c2:${p.c[1]}">
        <span class="zl-card__flag">${C[p.country]}</span>${p.badge ? `<span class="zl-card__badge">${p.badge}</span>` : ''}
        ${art(p)}
      </div>
      <div class="zl-card__body">
        <p class="zl-card__cat">${p.cat}</p>
        <h3 class="zl-card__title">${p.title}</h3>
        <p class="zl-card__desc">${p.desc}</p>
        <div class="zl-card__foot"><span class="zl-card__price">${rub(p.price)}</span><span class="zl-ctl">${control(p)}</span></div>
      </div></article>`;
  }
  function renderProducts() {
    $$('[data-products]').forEach(box => {
      const limit = +box.dataset.limit || 99;
      const list = P.filter(p => (filter.country === 'all' || p.country === filter.country) && (filter.need === 'all' || p.need === filter.need)).slice(0, limit);
      box.innerHTML = list.length ? list.map(card).join('') : `<p class="zl-empty-list">Здесь пока пусто — загляните в другой раздел.</p>`;
      ZL.onRender && ZL.onRender(box);
    });
  }
  function refreshControls() {
    $$('.zl-card').forEach(el => { const ctl = $('.zl-ctl', el); if (ctl) ctl.innerHTML = control(byId[el.dataset.id]); });
  }
  document.addEventListener('click', e => {
    const f = e.target.closest('[data-filter-country],[data-filter-need]');
    if (!f) return;
    const k = f.dataset.filterCountry !== undefined ? 'country' : 'need';
    filter[k] = f.dataset.filterCountry ?? f.dataset.filterNeed;
    $$(k === 'country' ? '[data-filter-country]' : '[data-filter-need]').forEach(b => b.classList.toggle('is-active', b === f));
    renderProducts();
    if (f.dataset.scroll) document.querySelector(f.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- корзина ---------- */
  function setQty(id, q, from) {
    const was = state.cart[id] || 0;
    state.cart[id] = Math.max(0, Math.min(99, q));
    if (!state.cart[id]) delete state.cart[id];
    save(); refreshControls(); renderCart();
    if (q > was && from) fly(from);
    if (q > was) bump();
  }
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add; setQty(id, (state.cart[id] || 0) + 1, add.closest('.zl-card')?.querySelector('svg') || add);
      toast(`«${byId[id].title}» в корзине`);
      return;
    }
    const step = e.target.closest('.zl-step');
    if (step) {
      const id = step.dataset.id;
      if (e.target.closest('[data-inc]')) setQty(id, (state.cart[id] || 0) + 1);
      if (e.target.closest('[data-dec]')) setQty(id, (state.cart[id] || 0) - 1);
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) setQty(rm.dataset.remove, 0);
  });

  function fly(from) {
    const target = $$('[data-cart-open]').find(b => b.offsetParent !== null);
    if (!target || reduce) return;
    const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
    const ghost = from.cloneNode(true);
    ghost.classList.add('zl-ghost');
    Object.assign(ghost.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * .55}px,${dy * .2 - 80}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(8deg)`, opacity: .4 }
    ], { duration: 820, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => ghost.remove();
  }
  function bump() {
    $$('[data-cart-open]').forEach(b => { b.classList.remove('zl-bump'); void b.offsetWidth; b.classList.add('zl-bump'); });
  }

  /* ---------- разметка корзины / оформления / оплаты ---------- */
  const shell = document.createElement('div');
  shell.innerHTML = `
  <div class="zl-overlay" data-close></div>
  <aside class="zl-drawer" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="zl-cart-title" aria-hidden="true">
    <header class="zl-drawer__head">
      <h2 id="zl-cart-title">Ваш заказ</h2>
      <button class="zl-x" data-close aria-label="Закрыть">✕</button>
    </header>
    <div class="zl-steps"><span class="is-on">1. Корзина</span><span>2. Данные</span><span>3. Оплата</span></div>
    <div class="zl-pane" data-pane="cart">
      <div class="zl-goal"><p data-goal></p><div class="zl-goal__bar"><i data-goal-bar></i></div></div>
      <ul class="zl-lines" data-lines></ul>
      <div class="zl-empty" data-empty>
        <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 52c-8-6-14-14-14-22 4 0 9 3 14 10 5-7 10-10 14-10 0 8-6 16-14 22Z"/><path d="M32 40c-3-7-3-14 0-20 3 6 3 13 0 20Z"/></svg>
        <p>Корзина пока пустая</p><button class="zl-btn zl-btn--ghost" data-close data-goto="#catalog">Выбрать товары</button>
      </div>
      <div class="zl-calc" data-calc>
        <fieldset class="zl-delivery"><legend>Как получить</legend>
          <label><input type="radio" name="zl-del" value="pickup"><span><b>Самовывоз — бесплатно</b><small>${S.pickup}</small></span></label>
          <label><input type="radio" name="zl-del" value="courier"><span><b>Курьер по городу — ${rub(S.courierPrice)}</b><small>Бесплатно при заказе от ${rub(S.freeDeliveryFrom)}</small></span></label>
        </fieldset>
        <form class="zl-promo" data-promo><input name="code" placeholder="Промокод" autocomplete="off" aria-label="Промокод"><button>Применить</button></form>
        <p class="zl-promo__hint" data-promo-hint>Попробуйте <b>LOTOS10</b> — скидка 10%</p>
        <dl class="zl-sum">
          <div><dt>Товары (<span data-count>0</span>)</dt><dd data-sub></dd></div>
          <div data-disc-row><dt>Скидка <span data-pct></span></dt><dd data-disc></dd></div>
          <div><dt>Доставка</dt><dd data-del></dd></div>
          <div class="zl-sum__total"><dt>Итого</dt><dd data-total></dd></div>
        </dl>
        <button class="zl-btn zl-btn--main" data-next="form">Оформить заказ</button>
      </div>
    </div>
    <form class="zl-pane" data-pane="form" hidden>
      <label class="zl-field"><span>Имя</span><input name="name" required autocomplete="name" placeholder="Как к вам обращаться"></label>
      <label class="zl-field"><span>Телефон</span><input name="phone" required type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__"></label>
      <label class="zl-field" data-addr hidden><span>Адрес доставки</span><input name="addr" autocomplete="street-address" placeholder="Улица, дом, квартира"></label>
      <label class="zl-field"><span>Комментарий</span><textarea name="note" rows="2" placeholder="Если нужно что-то уточнить"></textarea></label>
      <div class="zl-pickup-card" data-pickup-card><b>Пункт выдачи</b><span>${S.city}, ${S.pickup}</span><small>${S.pickupNote}</small></div>
      <dl class="zl-sum zl-sum--mini"><div class="zl-sum__total"><dt>К оплате</dt><dd data-total></dd></div></dl>
      <button class="zl-btn zl-btn--main" type="submit">Перейти к оплате</button>
      <button class="zl-btn zl-btn--link" type="button" data-next="cart">← Вернуться в корзину</button>
    </form>
    <div class="zl-pane" data-pane="pay" hidden>
      <div class="zl-pay">
        <p class="zl-pay__sum">К оплате <b data-total></b></p>
        <div class="zl-pay__tabs" role="tablist"><button class="is-active" data-pay="card" role="tab">Картой</button><button data-pay="sbp" role="tab">СБП</button></div>
        <div data-pay-card>
          <label class="zl-field"><span>Номер карты</span><input inputmode="numeric" placeholder="0000 0000 0000 0000" data-cc maxlength="19"></label>
          <div class="zl-row"><label class="zl-field"><span>Срок</span><input placeholder="ММ/ГГ" maxlength="5"></label><label class="zl-field"><span>CVC</span><input placeholder="•••" maxlength="3" type="password"></label></div>
        </div>
        <div data-pay-sbp hidden class="zl-sbp"><div class="zl-qr" aria-hidden="true"></div><p>Отсканируйте QR-код в приложении банка</p></div>
        <button class="zl-btn zl-btn--main" data-pay-go>Оплатить <span data-total></span></button>
        <p class="zl-secure"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5Z"/></svg>Демо-режим: деньги не списываются. На сайте здесь будет ЮKassa или Т-Банк.</p>
      </div>
    </div>
    <div class="zl-pane zl-done" data-pane="done" hidden>
      <div class="zl-done__icon" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>
      <h3>Заказ оплачен!</h3>
      <p data-done-text></p>
      <button class="zl-btn zl-btn--main" data-close>Отлично</button>
    </div>
  </aside>

  <div class="zl-sticky" data-sticky hidden>
    <button data-cart-open><span><b data-count>0</b> товара · <b data-total></b></span><span class="zl-sticky__go">Оформить →</span></button>
  </div>

  <div class="zl-toast" role="status" aria-live="polite"></div>

  <div class="zl-bot" data-bot>
    <button class="zl-bot__fab" data-bot-toggle aria-label="Открыть помощника">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27c-5-4-9-9-9-14 3 0 6 2 9 6 3-4 6-6 9-6 0 5-4 10-9 14Z"/><path d="M16 19c-2-4-2-9 0-13 2 4 2 9 0 13Z"/></svg>
      <span class="zl-bot__ping"></span>
    </button>
    <section class="zl-bot__panel" data-lenis-prevent aria-label="Помощник Лотос" aria-hidden="true">
      <header><div class="zl-bot__ava">ЗЛ</div><div><b>Помощник Лотос</b><small><i></i>онлайн · отвечает сразу</small></div><button data-bot-toggle aria-label="Свернуть">✕</button></header>
      <div class="zl-bot__log" data-bot-log></div>
      <div class="zl-bot__quick" data-bot-quick></div>
    </section>
  </div>`;
  document.body.appendChild(shell);

  const drawer = $('.zl-drawer');
  function openCart(pane = 'cart') {
    showPane(pane);
    document.body.classList.add('zl-cart-open'); drawer.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('.zl-x', drawer).focus(), 50);
  }
  function closeCart() { document.body.classList.remove('zl-cart-open'); drawer.setAttribute('aria-hidden', 'true'); }
  function showPane(name) {
    $$('[data-pane]', drawer).forEach(p => p.hidden = p.dataset.pane !== name);
    const idx = { cart: 0, form: 1, pay: 2, done: 3 }[name];
    $$('.zl-steps span', drawer).forEach((s, i) => s.classList.toggle('is-on', i <= idx));
    $('#zl-cart-title').textContent = name === 'done' ? 'Готово' : name === 'pay' ? 'Оплата' : name === 'form' ? 'Ваши данные' : 'Ваш заказ';
  }
  ZL.openCart = openCart;

  document.addEventListener('click', e => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openCart(); }
    const close = e.target.closest('[data-close]');
    if (close) {
      closeCart();
      if ($('[data-pane="done"]', drawer).hidden === false) { state.cart = {}; state.promo = ''; save(); refreshControls(); renderCart(); }
      if (close.dataset.goto) document.querySelector(close.dataset.goto)?.scrollIntoView({ behavior: 'smooth' });
    }
    const next = e.target.closest('[data-next]');
    if (next) { if (next.dataset.next === 'form' && !totals().count) return; showPane(next.dataset.next); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeMenu(); toggleBot(false); } });

  $$('input[name="zl-del"]').forEach(r => r.addEventListener('change', () => { state.delivery = r.value; save(); renderCart(); }));
  $('[data-promo]').addEventListener('submit', e => {
    e.preventDefault();
    const code = e.target.code.value.trim().toUpperCase();
    const hint = $('[data-promo-hint]');
    if (S.promo[code]) { state.promo = code; hint.textContent = `Промокод ${code} применён: −${S.promo[code]}%`; hint.className = 'zl-promo__hint is-ok'; }
    else { state.promo = ''; hint.textContent = 'Такого промокода нет'; hint.className = 'zl-promo__hint is-bad'; }
    save(); renderCart();
  });
  $('[data-pane="form"]').addEventListener('submit', e => { e.preventDefault(); showPane('pay'); });
  $$('[data-pay]').forEach(b => b.addEventListener('click', () => {
    $$('[data-pay]').forEach(x => x.classList.toggle('is-active', x === b));
    $('[data-pay-card]').hidden = b.dataset.pay !== 'card'; $('[data-pay-sbp]').hidden = b.dataset.pay !== 'sbp';
  }));
  $('[data-cc]').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  $('[data-pay-go]').addEventListener('click', e => {
    const btn = e.currentTarget; btn.classList.add('is-loading'); btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('is-loading'); btn.disabled = false;
      const f = $('[data-pane="form"]'), t = totals(), num = Math.floor(1000 + Math.random() * 9000);
      const name = f.name.value.trim().split(' ')[0] || 'Спасибо';
      $('[data-done-text]').textContent = state.delivery === 'courier'
        ? `${name}, заказ №${num} на ${rub(t.total)} оплачен. Курьер позвонит перед выездом.`
        : `${name}, заказ №${num} на ${rub(t.total)} оплачен. Заберите его: ${S.pickup}. Мы напишем, когда всё будет готово.`;
      showPane('done');
    }, 1600);
  });

  let shownTotal = 0;
  function renderCart() {
    const t = totals();
    $('[data-lines]').innerHTML = t.items.map(([id, q]) => {
      const p = byId[id];
      return `<li class="zl-line"><div class="zl-line__img" style="--c1:${p.c[0]};--c2:${p.c[1]}">${art(p)}</div>
        <div class="zl-line__info"><b>${p.title}</b><small>${C[p.country]} · ${rub(p.price)}</small>
          <div class="zl-step" data-id="${id}"><button data-dec aria-label="Убрать одну">−</button><span>${q}</span><button data-inc aria-label="Добавить ещё">+</button></div></div>
        <div class="zl-line__sum">${rub(p.price * q)}<button data-remove="${id}" aria-label="Удалить">Удалить</button></div></li>`;
    }).join('');
    $('[data-empty]').hidden = !!t.count; $('[data-calc]').hidden = !t.count;
    $$('input[name="zl-del"]').forEach(r => r.checked = r.value === state.delivery);
    $('[data-addr]').hidden = state.delivery !== 'courier'; $('[data-pickup-card]').hidden = state.delivery === 'courier';
    $('[data-addr] input').required = state.delivery === 'courier';
    $$('[data-count]').forEach(el => el.textContent = t.count);
    $$('[data-cart-count]').forEach(el => { el.textContent = t.count; el.classList.toggle('is-empty', !t.count); });
    $('[data-sub]').textContent = rub(t.subtotal);
    $('[data-disc-row]').hidden = !t.discount;
    $('[data-pct]').textContent = t.pct ? `−${t.pct}%` : '';
    $('[data-disc]').textContent = '−' + rub(t.discount);
    $('[data-del]').textContent = state.delivery === 'pickup' ? 'бесплатно' : t.delivery ? rub(t.delivery) : 'бесплатно';
    animateTotal(t.total);
    // цель: бесплатная доставка → скидка по сумме
    let goal, pct;
    if (state.delivery === 'courier' && t.after < S.freeDeliveryFrom) { goal = `До бесплатной доставки — <b>${rub(S.freeDeliveryFrom - t.after)}</b>`; pct = t.after / S.freeDeliveryFrom; }
    else if (t.subtotal < S.tierFrom) { goal = `Добавьте на <b>${rub(S.tierFrom - t.subtotal)}</b> — и получите скидку ${S.tierPercent}%`; pct = t.subtotal / S.tierFrom; }
    else { goal = `Скидка ${S.tierPercent}% уже ваша ✦`; pct = 1; }
    $('[data-goal]').innerHTML = goal; $('[data-goal-bar]').style.transform = `scaleX(${Math.min(1, pct)})`;
    $('[data-sticky]').hidden = !t.count;
    document.body.classList.toggle('zl-has-cart', !!t.count);
    ZL.onCart && ZL.onCart(t);
  }
  function animateTotal(to) {
    const from = shownTotal; shownTotal = to;
    const els = $$('[data-total]');
    if (reduce || from === to) { els.forEach(e => e.textContent = rub(to)); return; }
    const t0 = performance.now();
    (function tick(now) {
      const k = Math.min(1, (now - t0) / 450), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      els.forEach(e => e.textContent = rub(v));
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    const el = $('.zl-toast'); el.innerHTML = `<span>✓</span> ${msg} <button data-cart-open>Открыть</button>`;
    el.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ---------- меню (выпадает слева) ---------- */
  function closeMenu() { document.body.classList.remove('zl-menu-open'); $$('[data-menu-toggle]').forEach(b => b.setAttribute('aria-expanded', 'false')); }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-menu-toggle]');
    if (t) { const open = !document.body.classList.contains('zl-menu-open'); document.body.classList.toggle('zl-menu-open', open); t.setAttribute('aria-expanded', open); return; }
    if (document.body.classList.contains('zl-menu-open') && (!e.target.closest('[data-menu]') || e.target.closest('[data-menu] a'))) closeMenu();
  });

  /* ---------- бот ---------- */
  const bot = $('[data-bot]'), log = $('[data-bot-log]'), quick = $('[data-bot-quick]');
  let botStarted = false;
  function toggleBot(force) {
    const open = force ?? !bot.classList.contains('is-open');
    bot.classList.toggle('is-open', open); $('.zl-bot__panel').setAttribute('aria-hidden', !open);
    if (open && !botStarted) { botStarted = true; say('Здравствуйте! Я помощник «Золотого Лотоса» 🪷 Подскажу, где забрать заказ, как оплатить, и помогу подобрать товар.', MAIN); }
  }
  const MAIN = [['where', 'Где забрать заказ?'], ['pay', 'Как оплатить?'], ['pick', 'Подобрать товар'], ['human', 'Написать продавцу']];
  const ANS = {
    where: () => [`Пункт выдачи: <b>${S.city}, ${S.pickup}</b>.<br>${S.pickupNote}. Самовывоз бесплатный.`, MAIN],
    pay: () => ['Оплатить можно прямо на сайте: картой или по СБП. Положите товары в корзину — итоговая сумма посчитается сама, со скидками и доставкой.', [['cart', 'Открыть корзину'], ...MAIN.slice(2)]],
    pick: () => ['Что хотите подобрать?', Object.entries(N).map(([k, v]) => ['need:' + k, v])],
    human: () => [`Продавец ответит в Telegram или по телефону <b>${S.phone}</b>. Обычно отвечаем в течение часа.`, MAIN],
    cart: () => { toggleBot(false); openCart(); return null; }
  };
  function say(html, opts, extra = '') {
    const m = document.createElement('div'); m.className = 'zl-msg zl-msg--bot';
    m.innerHTML = `<i class="zl-typing"><b></b><b></b><b></b></i>`; log.appendChild(m); log.scrollTop = log.scrollHeight;
    quick.innerHTML = '';
    setTimeout(() => {
      m.innerHTML = html + extra; log.scrollTop = log.scrollHeight;
      quick.innerHTML = (opts || []).map(([k, l]) => `<button data-q="${k}">${l}</button>`).join('');
    }, reduce ? 0 : 650);
  }
  quick.addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const me = document.createElement('div'); me.className = 'zl-msg zl-msg--me'; me.textContent = b.textContent; log.appendChild(me);
    const k = b.dataset.q;
    if (k.startsWith('need:')) {
      const need = k.slice(5), list = P.filter(p => p.need === need).slice(0, 3);
      say(`Вот что чаще берут — «${N[need].toLowerCase()}»:`, MAIN, `<div class="zl-bot__picks">${list.map(p => `<div class="zl-bot__pick"><div style="--c1:${p.c[0]};--c2:${p.c[1]}">${art(p)}</div><span>${p.title}<small>${rub(p.price)}</small></span><button data-add="${p.id}" aria-label="В корзину">+</button></div>`).join('')}</div>`);
      return;
    }
    const r = ANS[k](); if (r) say(r[0], r[1]);
  });
  $$('[data-bot-toggle]').forEach(b => b.addEventListener('click', () => toggleBot()));
  setTimeout(() => bot.classList.add('is-hint'), 6000);

  /* ---------- общие подстановки ---------- */
  $$('[data-shop="pickup"]').forEach(el => el.textContent = S.pickup);
  $$('[data-shop="city"]').forEach(el => el.textContent = S.city);
  $$('[data-shop="note"]').forEach(el => el.textContent = S.pickupNote);
  $$('[data-shop="phone"]').forEach(el => el.textContent = S.phone);
  $$('[data-map]').forEach(el => {
    el.innerHTML = `<iframe title="Пункт выдачи на карте" loading="lazy" src="https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(S.mapQuery)}&z=16"></iframe>`;
  });
  $$('[data-bot-open]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); toggleBot(true); }));
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  renderProducts();
  renderCart();
  shownTotal = totals().total;
})();
