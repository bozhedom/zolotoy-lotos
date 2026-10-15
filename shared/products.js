/* Демо-товары. Заказчица заменит своими карточками (в Тильде — каталог/Store). */
window.ZL_PRODUCTS = [
  { id: 'p1',  country: 'th', need: 'body',   shape: 'jar',     c: ['#e9b949', '#b9781c'], title: 'Травяной бальзам', cat: 'Бальзамы', desc: 'Согревает мышцы после нагрузки. Ментол, камфора, плай.', price: 390, badge: 'Хит' },
  { id: 'p2',  country: 'th', need: 'hair',   shape: 'bottle',  c: ['#f3ead7', '#cdb88a'], title: 'Кокосовое масло', cat: 'Масла', desc: 'Холодный отжим. Для волос, кожи и массажа.', price: 590 },
  { id: 'p3',  country: 'th', need: 'immune', shape: 'tube',    c: ['#8fc7a5', '#3f8a63'], title: 'Травяной ингалятор', cat: 'Здоровье', desc: 'Помогает дышать свободно при насморке и в дороге.', price: 150 },
  { id: 'p4',  country: 'th', need: 'face',   shape: 'bar',     c: ['#c78ac9', '#7d3f8c'], title: 'Мыло с мангостином', cat: 'Уход', desc: 'Ручная работа. Мягко очищает, не сушит кожу.', price: 250 },
  { id: 'p5',  country: 'cn', need: 'immune', shape: 'box',     c: ['#d6533f', '#8d2318'], title: 'Чай с женьшенем', cat: 'Чай', desc: 'Бодрит без кофеина. 20 пакетиков.', price: 690, badge: 'Новинка' },
  { id: 'p6',  country: 'cn', need: 'body',   shape: 'sachet',  c: ['#e3a35b', '#a65f1e'], title: 'Пластырь для суставов', cat: 'Здоровье', desc: 'Тепло и травы для спины, колен и шеи. 10 шт.', price: 450, badge: 'Хит' },
  { id: 'p7',  country: 'cn', need: 'body',   shape: 'sachet',  c: ['#6f8f7a', '#33503f'], title: 'Детокс-пластыри для стоп', cat: 'Здоровье', desc: 'Наклеить на ночь — утром ноги легче. 10 шт.', price: 520 },
  { id: 'p8',  country: 'cn', need: 'face',   shape: 'jar',     c: ['#f0c6b8', '#c4806d'], title: 'Жемчужный крем', cat: 'Уход', desc: 'Выравнивает тон, даёт сияние коже.', price: 980 },
  { id: 'p9',  country: 'kr', need: 'face',   shape: 'sachet',  c: ['#bfe0ef', '#5d9dbd'], title: 'Тканевая маска с муцином улитки', cat: 'Маски', desc: '15 минут — и кожа увлажнена на весь день.', price: 120 },
  { id: 'p10', country: 'kr', need: 'face',   shape: 'dropper', c: ['#d8ecc9', '#7fae5f'], title: 'Сыворотка с центеллой', cat: 'Сыворотки', desc: 'Успокаивает покраснения и мелкие воспаления.', price: 1290, badge: 'Хит' },
  { id: 'p11', country: 'kr', need: 'face',   shape: 'tube',    c: ['#fde7b0', '#e1a93d'], title: 'Солнцезащитный крем SPF 50', cat: 'Защита', desc: 'Лёгкий, без белых следов. Под макияж.', price: 990 },
  { id: 'p12', country: 'kr', need: 'hair',   shape: 'bottle',  c: ['#e7d2f0', '#9a6db3'], title: 'Шампунь с чёрным рисом', cat: 'Волосы', desc: 'Укрепляет корни, волосы меньше выпадают.', price: 870 }
];

window.ZL_COUNTRIES = { th: 'Таиланд', cn: 'Китай', kr: 'Корея' };
window.ZL_NEEDS = { face: 'Для лица', body: 'Тело и суставы', immune: 'Иммунитет', hair: 'Для волос' };

window.ZL_SHOP = {
  name: 'Золотой Лотос',
  city: 'Южно-Сахалинск',
  pickup: 'пр. Мира, 229, ТЦ «Янтарь», место 2А',
  pickupNote: 'Буферная зона, напротив павильона с газетами',
  mapQuery: 'Южно-Сахалинск, проспект Мира, 229',
  phone: '+7 (900) 000-00-00',
  telegram: '#',
  freeDeliveryFrom: 3000,
  courierPrice: 300,
  tierFrom: 5000,
  tierPercent: 5,
  promo: { LOTOS10: 10 }
};
