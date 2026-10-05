/* ====================================================
   找书
   ==================================================== */
async function goToFindBook(){
    showScreen('findBookScreen');
    const list = document.getElementById("findBookList");
    if (!booksLoaded){
        if (list) list.innerHTML = '<div class="book-tip">' + t("loadingBooks") + '</div>';
        await loadBooks();
    }
    renderFindBook();
}
function getContinentOf(country){
  for (const cont in continents){
    if (continents[cont].includes(country)) return cont;
  }
  return null;
}

function pickRandom(arr, n){
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function getMatchedBooks(){
  const selCont = getContinentOf(selectedCountry);

  // 1. 时代 + 国家 + 性别 + 文体（完全匹配）
  let r = BOOKS.filter(b =>
    b.era === selectedEra && b.country === selectedCountry &&
    b.gender === selectedGender && b.genre === selectedGenre);
  if (r.length) return { books: r, level: 1 };

  // 2. 放宽文体
  r = BOOKS.filter(b =>
    b.era === selectedEra && b.country === selectedCountry &&
    b.gender === selectedGender);
  if (r.length) return { books: r, level: 2 };

  // 3. 放宽性别
  r = BOOKS.filter(b =>
    b.era === selectedEra && b.country === selectedCountry);
  if (r.length) return { books: r, level: 3 };

  // 4. 国家放宽到大洲，保留性别 + 文体
  if (selCont){
    r = BOOKS.filter(b =>
      b.era === selectedEra && getContinentOf(b.country) === selCont &&
      b.gender === selectedGender && b.genre === selectedGenre);
    if (r.length) return { books: r, level: 4 };
  }

  // 5. 只按时代 + 性别 + 文体
  r = BOOKS.filter(b =>
    b.era === selectedEra && b.gender === selectedGender &&
    b.genre === selectedGenre);
  if (r.length) return { books: r, level: 5 };

  // 6. 只按时代（兜底）
  r = BOOKS.filter(b => b.era === selectedEra);
  return { books: r, level: 6 };
}

function findBooks(){
  const result = getMatchedBooks();
  return {
    books: pickRandom(result.books, 3),
    level: result.level,
    total: result.books.length
  };
}
function renderFindBook(){
  const container = document.getElementById("findBookList");
  const seeMoreWrap = document.getElementById("seeMoreWrap");
  if (!container) return;
  const result = findBooks();
  const books = result.books;

  container.innerHTML = "";
  if (seeMoreWrap) seeMoreWrap.style.display = "none";

  if (result.level >= 2){
    const tip = document.createElement("div");
    tip.className = "book-tip";
    tip.textContent = t("matchRelaxed");
    container.appendChild(tip);
  }

  if (books.length === 0){
    const empty = document.createElement("div");
    empty.className = "book-tip";
    empty.textContent = t("matchNone");
    container.appendChild(empty);
    return;
  }

  books.forEach(b => {
    const card = document.createElement("div");
    card.className = "book-card";
    const meta = [
      getCountryName(selectedEra, b.country),
      getGenderName(b.gender),
      getGenreName(b.genre)
    ].join(" · ");
    card.innerHTML =
      '<div class="book-card-title">《' + b.title + '》</div>' +
      '<div class="book-card-author">' + b.author + '</div>' +
      '<div class="book-card-meta">' + meta + '</div>';
    container.appendChild(card);
  });

  // 匹配总数 > 3 才显示"查看更多"
  if (seeMoreWrap && result.total > 3){
    seeMoreWrap.style.display = "block";
    const btn = document.getElementById("seeMoreBtn");
    if (btn){
      btn.textContent = currentLang === "en"
        ? "See More (" + result.total + ")"
        : "查看更多（共 " + result.total + " 本）";
    }
  }
}

function showMoreBooks(){
  const result = getMatchedBooks();
  const books = result.books;
  const body = document.getElementById("moreBooksBody");
  const title = document.getElementById("moreBooksTitle");
  const countEl = document.getElementById("moreBooksCount");
  const overlay = document.getElementById("moreBooksOverlay");
  if (!body || !overlay) return;

  body.innerHTML = "";
  if (title) title.textContent = getCountryName(selectedEra, selectedCountry) + " · " + getEraName(selectedEra);
  if (countEl){
    countEl.innerHTML = currentLang === "en"
      ? books.length + " books"
      : "共 <strong>" + books.length + "</strong> 本";
  }

  if (books.length === 0){
    body.innerHTML = '<div class="history-empty">' + t("matchNone") + '</div>';
    overlay.classList.remove("hidden");
    return;
  }

  // 按「文体 + 性别」分组
  const grouped = {};
  books.forEach(b => {
    const key = b.genre + "||" + b.gender;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  const genreOrder = ["小说","诗歌","戏剧","散文","书信","日记","寓言","史诗","传记文学","旅行文学"];
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [ga] = a.split("||");
    const [gb] = b.split("||");
    return genreOrder.indexOf(ga) - genreOrder.indexOf(gb);
  });

  sortedKeys.forEach(key => {
    const [genre, gender] = key.split("||");
    const groupBooks = grouped[key];

    const section = document.createElement("div");
    section.style.marginBottom = "22px";

    const heading = document.createElement("div");
    heading.style.cssText = "font-size:11px;letter-spacing:.32em;color:#8a6a3f;font-weight:500;margin:6px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(184,147,90,.25);";
    heading.textContent = getGenreName(genre) + " · " + getGenderName(gender) + "（" + groupBooks.length + "）";
    section.appendChild(heading);

    groupBooks.forEach(b => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.style.margin = "10px 0";
      card.style.padding = "16px 20px";
      card.style.maxWidth = "100%";
      const meta = [
        getCountryName(selectedEra, b.country),
        getGenreName(b.genre)
      ].join(" · ");
      card.innerHTML =
        '<div class="book-card-title" style="font-size:16px;">《' + b.title + '》</div>' +
        '<div class="book-card-author" style="font-size:13px;">' + b.author + '</div>' +
        '<div class="book-card-meta">' + meta + '</div>';
      section.appendChild(card);
    });

    body.appendChild(section);
  });

  overlay.classList.remove("hidden");
}

function closeMoreBooks(e){
  if (e && e.target && e.target.id !== "moreBooksOverlay") return;
  const overlay = document.getElementById("moreBooksOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function overlayClickMore(e){
  if (e.target && e.target.id === "moreBooksOverlay") closeMoreBooks();
}
