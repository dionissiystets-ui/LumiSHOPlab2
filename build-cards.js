// Генерує картки товарів з data/products.json і вставляє їх у index.html
// між маркерами <!-- cards:start --> і <!-- cards:end -->.
const fs = require("fs");

const DATA = "data/products.json";
const PAGE = "index.html";
const START = "<!-- cards:start -->";
const END = "<!-- cards:end -->";
const REQUIRED = ["id", "title", "price", "image", "description", "link"];

function fail(message) {
  console.error(`Помилка: ${message}`);
  process.exit(1);
}

function readProducts(path) {
  let raw;
  try {
    raw = fs.readFileSync(path, "utf8");
  } catch (e) {
    fail(`не знайдено файл ${path}`);
  }

  let products;
  try {
    products = JSON.parse(raw);
  } catch (e) {
    fail(`файл ${path} пошкоджений (${e.message})`);
  }

  if (!Array.isArray(products) || products.length === 0) {
    fail(`${path} має містити непорожній масив товарів`);
  }
  products.forEach((p, i) => {
    const missing = REQUIRED.filter((key) => p === null || typeof p !== "object" || !(key in p));
    if (missing.length) {
      fail(`у товарі №${i + 1} немає полів: ${missing.join(", ")}`);
    }
  });
  return products;
}

// Екранування, щоб лапки й < > в даних не ламали розмітку
function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const money = (n) => `$${Number(n).toFixed(2)}`;

function renderCard(product) {
  const old = product.oldPrice ? ` <s>${money(product.oldPrice)}</s>` : "";
  return (
    `      <article class="card"><div class="card__img">` +
    `<img src="${esc(product.image)}" alt="${esc(product.description)}">` +
    `<button class="add" aria-label="Add ${esc(product.description)}">+</button></div>` +
    `<h3><a href="${esc(product.link)}">${esc(product.title)}</a></h3>` +
    `<p class="price">${money(product.price)}${old}</p></article>`
  );
}

function inject(html, markup) {
  const from = html.indexOf(START);
  const to = html.indexOf(END);
  if (from === -1 || to === -1 || to < from) {
    fail(`у ${PAGE} не знайдено маркери ${START} і ${END}`);
  }
  return html.slice(0, from + START.length) + "\n" + markup + "\n      " + html.slice(to);
}

const products = readProducts(DATA);
const markup = products.map(renderCard).join("\n");

let html;
try {
  html = fs.readFileSync(PAGE, "utf8");
} catch (e) {
  fail(`не знайдено файл ${PAGE}`);
}

fs.writeFileSync(PAGE, inject(html, markup));
console.log(`Згенеровано карток: ${products.length}`);
