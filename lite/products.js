/* Каталог «Золотой Лотос» — демо-данные. Заказчица заменит своими товарами.
   cat / sub — категория и подкатегория (списки ниже, в LT_CATS).
   with — id товаров, которые показываем в блоке «С этим берут». Заполняется вручную. */
window.LT_CATS = [
  { id: 'face',   title: 'Уход за лицом', subs: { masks: 'Маски', serum: 'Сыворотки', cream: 'Кремы', clean: 'Очищение' } },
  { id: 'body',   title: 'Тело и баня',   subs: { soap: 'Мыло', oil: 'Масла', scrub: 'Скрабы', towel: 'Полотенца и мочалки' } },
  { id: 'hair',   title: 'Волосы',        subs: { shampoo: 'Шампуни', hmask: 'Маски и масла' } },
  { id: 'health', title: 'Здоровье',      subs: { balm: 'Бальзамы', patch: 'Пластыри', inhal: 'Ингаляторы' } },
  { id: 'tea',    title: 'Чай и травы',   subs: { tea: 'Чай', herbs: 'Травяные сборы' } }
];

window.LT_COUNTRIES = { th: 'Таиланд', cn: 'Китай', kr: 'Корея' };

window.LT_PRODUCTS = [
  { id: 'p1',  cat: 'face',   sub: 'masks',   country: 'kr', shape: 'sachet',  c: ['#cfe6f0', '#6aa6c4'], title: 'Тканевая маска с муцином улитки', desc: 'Увлажняет за 15 минут. Подходит для сухой и уставшей кожи.', vol: '1 шт.', price: 120, badge: 'Хит', with: ['p2', 'p4', 'p13'] },
  { id: 'p2',  cat: 'face',   sub: 'serum',   country: 'kr', shape: 'dropper', c: ['#dcecc9', '#7fae5f'], title: 'Сыворотка с центеллой', desc: 'Успокаивает покраснения и мелкие воспаления. Лёгкая, быстро впитывается.', vol: '30 мл', price: 1290, with: ['p3', 'p4', 'p1'] },
  { id: 'p3',  cat: 'face',   sub: 'cream',   country: 'kr', shape: 'tube',    c: ['#fde7b0', '#e1a93d'], title: 'Солнцезащитный крем SPF 50', desc: 'Без белых следов, можно под макияж. Для лица и шеи.', vol: '50 мл', price: 990, with: ['p2', 'p4'] },
  { id: 'p4',  cat: 'face',   sub: 'clean',   country: 'kr', shape: 'tube',    c: ['#f2dfe6', '#c27d97'], title: 'Пенка для умывания с рисом', desc: 'Мягко очищает, не стягивает кожу. Утром и вечером.', vol: '150 мл', price: 650, with: ['p2', 'p1', 'p17'] },
  { id: 'p5',  cat: 'face',   sub: 'cream',   country: 'cn', shape: 'jar',     c: ['#f0c6b8', '#c4806d'], title: 'Жемчужный крем', desc: 'Выравнивает тон, даёт коже ровное сияние.', vol: '50 г', price: 980, badge: 'Новинка', with: ['p4', 'p1'] },

  { id: 'p6',  cat: 'body',   sub: 'soap',    country: 'th', shape: 'bar',     c: ['#c78ac9', '#7d3f8c'], title: 'Мыло с мангостином', desc: 'Ручная работа. Очищает и не сушит кожу.', vol: '100 г', price: 250, badge: 'Хит', with: ['p9', 'p8', 'p7'] },
  { id: 'p7',  cat: 'body',   sub: 'oil',     country: 'th', shape: 'bottle',  c: ['#f3ead7', '#cdb88a'], title: 'Кокосовое масло', desc: 'Холодный отжим. Для тела, волос и массажа.', vol: '250 мл', price: 590, with: ['p8', 'p11', 'p9'] },
  { id: 'p8',  cat: 'body',   sub: 'scrub',   country: 'th', shape: 'jar',     c: ['#e8cfa2', '#a9773a'], title: 'Скраб с тамариндом', desc: 'Убирает сухость, кожа становится гладкой.', vol: '250 г', price: 450, with: ['p9', 'p7', 'p6'] },
  { id: 'p9',  cat: 'body',   sub: 'towel',   country: 'th', shape: 'towel',   c: ['#f4eee6', '#c9b79c'], title: 'Полотенце из бамбука', desc: 'Мягкое, хорошо впитывает воду, быстро сохнет. 70×140 см.', vol: '1 шт.', price: 890, with: ['p6', 'p10', 'p8'] },
  { id: 'p10', cat: 'body',   sub: 'towel',   country: 'kr', shape: 'towel',   c: ['#f6d7cf', '#d48a78'], title: 'Корейская мочалка-варежка', desc: 'Та самая «итальянка». Отшелушивает в бане и в душе.', vol: '1 шт.', price: 190, with: ['p6', 'p9'] },

  { id: 'p11', cat: 'hair',   sub: 'shampoo', country: 'kr', shape: 'bottle',  c: ['#e7d2f0', '#9a6db3'], title: 'Шампунь с чёрным рисом', desc: 'Укрепляет корни, волосы меньше выпадают.', vol: '400 мл', price: 870, with: ['p12', 'p7'] },
  { id: 'p12', cat: 'hair',   sub: 'hmask',   country: 'th', shape: 'jar',     c: ['#d8e8d0', '#6f9a5c'], title: 'Маска для волос с алоэ', desc: 'Для сухих и окрашенных волос. Держать 5 минут.', vol: '300 мл', price: 540, with: ['p11', 'p7'] },

  { id: 'p13', cat: 'health', sub: 'balm',    country: 'th', shape: 'jar',     c: ['#e9b949', '#b9781c'], title: 'Золотой бальзам', desc: 'Согревает мышцы после нагрузки. Ментол, камфора, плай.', vol: '50 г', price: 390, badge: 'Хит', with: ['p14', 'p15'] },
  { id: 'p14', cat: 'health', sub: 'patch',   country: 'cn', shape: 'sachet',  c: ['#e3a35b', '#a65f1e'], title: 'Пластырь для суставов', desc: 'Тепло и травы для спины, колен и шеи.', vol: '10 шт.', price: 450, with: ['p13', 'p16'] },
  { id: 'p15', cat: 'health', sub: 'inhal',   country: 'th', shape: 'tube',    c: ['#8fc7a5', '#3f8a63'], title: 'Травяной ингалятор', desc: 'Помогает дышать свободно при насморке и в дороге.', vol: '2 мл', price: 150, with: ['p13', 'p17'] },
  { id: 'p16', cat: 'health', sub: 'patch',   country: 'cn', shape: 'sachet',  c: ['#6f8f7a', '#33503f'], title: 'Пластыри для стоп', desc: 'Наклеить на ночь — утром ноги легче.', vol: '10 шт.', price: 520, with: ['p14', 'p18'] },

  { id: 'p17', cat: 'tea',    sub: 'tea',     country: 'cn', shape: 'box',     c: ['#d6533f', '#8d2318'], title: 'Чай с женьшенем', desc: 'Бодрит без кофеина. 20 пакетиков.', vol: '40 г', price: 690, badge: 'Новинка', with: ['p18', 'p15'] },
  { id: 'p18', cat: 'tea',    sub: 'herbs',   country: 'th', shape: 'box',     c: ['#7f6bb0', '#3f2f6e'], title: 'Синий чай Анчан', desc: 'Цветы клитории. Заваривается синим, с лимоном — розовым.', vol: '50 г', price: 480, with: ['p17', 'p13'] }
];

window.LT_SHOP = {
  name: 'Золотой Лотос',
  city: 'Южно-Сахалинск',
  pickup: 'пр. Мира, 229, рынок «Янтарь», место 2А',
  pickupNote: 'Буферная зона, напротив павильона с газетами',
  mapUrl: 'https://yandex.ru/maps/?text=%D0%AE%D0%B6%D0%BD%D0%BE-%D0%A1%D0%B0%D1%85%D0%B0%D0%BB%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%9C%D0%B8%D1%80%D0%B0%2C%20229',
  hours: 'Ежедневно 10:00–18:00',            // заменить на реальные часы
  phone: '+7 (900) 000-00-00',               // заменить
  whatsapp: '79000000000',                   // номер без +, для ссылки wa.me
  telegram: 'zolotoy_lotos',                 // ник без @
  vk: 'zolotoy_lotos',
  privacyUrl: '../privacy/',                 // политика конфиденциальности
  consentUrl: '../soglasie/'                 // согласие на обработку персональных данных
};
