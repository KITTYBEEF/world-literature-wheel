/* ====================================================
   找书
   ==================================================== */
/* ====================================================
   自动生成“找到这本书”的链接面板
   ==================================================== */
function createBookLinksHTML(book) {
  // 用书名 + 作者拼搜索词，自动处理中文和特殊符号
  const query = encodeURIComponent(book.title + ' ' + book.author);
  
  // 检查你有没有手动配专属链接
  let manualHTML = '';
  if (book.links) {
    if (book.links.official) manualHTML += '<a href="' + book.links.official + '" target="_blank" rel="noopener" class="book-link-btn manual">🏛️ 出版社页面</a>';
    if (book.links.reading)  manualHTML += '<a href="' + book.links.reading + '" target="_blank" rel="noopener" class="book-link-btn manual">📖 在线阅读</a>';
    if (book.links.audio)    manualHTML += '<a href="' + book.links.audio + '" target="_blank" rel="noopener" class="book-link-btn manual">🎧 有声书</a>';
  }
  
  // 智能博物馆链接：如果分类是“古代文献”或“神话”，自动生成博物馆搜索按钮
  if (book.genre === "古代文献" || book.genre === "神话") {
    const museumQuery = encodeURIComponent(book.title + ' 博物馆 馆藏');
    manualHTML += '<a href="https://www.google.com/search?q=' + museumQuery + '" target="_blank" rel="noopener" class="book-link-btn manual">🏛️ 博物馆馆藏</a>';
  }
  
  const manualSection = manualHTML ? 
    '<div class="book-links-group">' +
      '<span class="book-links-label">✨ 专属链接</span>' +
      '<div class="book-links-row">' + manualHTML + '</div>' +
    '</div>' : '';
    
  return (
    '<div class="book-links-panel">' +
      '<div class="book-links-header">📖 找到这本书</div>' +
      '<div class="book-links-tip">想继续了解这本书？你可以从下面的入口寻找它。部分书籍可能只能通过图书馆、出版社或二手书渠道找到。</div>' +
      manualSection +
      '<div class="book-links-group">' +
        '<span class="book-links-label">🔎 搜索</span>' +
        '<div class="book-links-row">' +
          '<a href="https://books.google.com/books?q=' + query + '" target="_blank" rel="noopener" class="book-link-btn">📚 Google Books</a>' +
          '<a href="https://search.worldcat.org/search?q=' + query + '" target="_blank" rel="noopener" class="book-link-btn">🌐 WorldCat</a>' +
          '<a href="https://archive.org/search?query=' + query + '" target="_blank" rel="noopener" class="book-link-btn">🏛️ Internet Archive</a>' +
        '</div>' +
      '</div>' +
      '<div class="book-links-group">' +
        '<span class="book-links-label">🌐 其他</span>' +
        '<div class="book-links-row">' +
          '<a href="https://www.google.com/search?q=' + query + '" target="_blank" rel="noopener" class="book-link-btn">🔍 Google 搜索</a>' +
          '<a href="https://search.douban.com/book/subject_search?search_text=' + query + '" target="_blank" rel="noopener" class="book-link-btn">🟢 豆瓣</a>' +
          '<a href="https://weread.qq.com/web/search/books?keyword=' + query + '" target="_blank" rel="noopener" class="book-link-btn">📱 微信读书</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}
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

  // 搜索模式：只显示匹配的书
  const hasSearch = searchPinnedBooks && searchPinnedBooks.length > 0;
  const pinnedBooks = hasSearch ? searchPinnedBooks : [];
    if (!hasSearch && result.level >= 2){
    const tip = document.createElement("div");
    tip.className = "book-tip";
    tip.textContent = t("matchRelaxed");
    container.appendChild(tip);
  }

  if (books.length === 0 && pinnedBooks.length === 0){
    const empty = document.createElement("div");
    empty.className = "book-tip";
    empty.textContent = t("matchNone");
    container.appendChild(empty);
    return;
  }

  // 搜索模式 → 只显示匹配的书；正常抽签模式 → 显示同类随机书
  const seen = new Set();
  const allToRender = [];
  if (hasSearch){
    pinnedBooks.forEach(b => {
      const key = (b.title || "") + "||" + (b.author || "");
      if (seen.has(key)) return;
      seen.add(key);
      allToRender.push(b);
    });
  } else {
    books.forEach(b => {
      const key = (b.title || "") + "||" + (b.author || "");
      if (seen.has(key)) return;
      seen.add(key);
      allToRender.push(b);
    });
  }

  // 渲染
  allToRender.forEach(b => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.style.cursor = "pointer";

    const meta = [
      getCountryName(selectedEra, b.country),
      getGenderName(b.gender),
      getGenreName(b.genre)
    ].join(" · ");

    const linksHTML = createBookLinksHTML(b);

    let titleHTML = '<div class="book-card-title">《' + b.title + '》</div>';
    if (b.originalTitle) {
        titleHTML += '<div class="book-card-original-title">' + b.originalTitle + '</div>';
    }
    let authorHTML = '<div class="book-card-author">' + b.author + '</div>';
    if (b.originalAuthor) {
        authorHTML = '<div class="book-card-author">' + b.author + ' <span class="book-card-original-author">' + b.originalAuthor + '</span></div>';
    }
    card.innerHTML =
      titleHTML +
      authorHTML +
      '<div class="book-card-meta">' + meta + '</div>' +
      '<span class="book-card-arrow">▼</span>' +
      linksHTML;

    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      const panel = card.querySelector('.book-links-panel');
      if (panel) {
        panel.classList.toggle('open');
        card.classList.toggle('expanded');
      }
    });

    container.appendChild(card);
  });

  // 匹配总数 > 3 才显示"查看更多"（置顶书也算进去）
  const totalCount = allToRender.length;
  if (seeMoreWrap && totalCount > 3){
    seeMoreWrap.style.display = "block";
    const btn = document.getElementById("seeMoreBtn");
    if (btn){
      btn.textContent = currentLang === "en"
        ? "See More (" + totalCount + ")"
        : "查看更多（共 " + totalCount + " 本）";
    }
  }
}
function showMoreBooks(){
  const body = document.getElementById("moreBooksBody");
  const title = document.getElementById("moreBooksTitle");
  const countEl = document.getElementById("moreBooksCount");
  const overlay = document.getElementById("moreBooksOverlay");
  if (!body || !overlay) return;

  // 是否处于搜索模式
  const hasSearch = searchPinnedBooks && searchPinnedBooks.length > 0;

  let books;
  if (hasSearch){
    books = searchPinnedBooks.slice();
  } else {
    const result = getMatchedBooks();
    books = result.books;
  }

  body.innerHTML = "";
  if (title){
    title.textContent = hasSearch
      ? (currentLang === "en" ? "Search Results" : "搜索结果")
      : (getCountryName(selectedEra, selectedCountry) + " · " + getEraName(selectedEra));
  }
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
      card.style.cursor = "pointer";

      const meta = [
        getCountryName(selectedEra, b.country),
        getGenreName(b.genre)
      ].join(" · ");

      const linksHTML = createBookLinksHTML(b);

      let titleHTML = '<div class="book-card-title" style="font-size:16px;">《' + b.title + '》</div>';
      if (b.originalTitle) {
          titleHTML += '<div class="book-card-original-title" style="font-size:12px;">' + b.originalTitle + '</div>';
      }
      let authorHTML = '<div class="book-card-author" style="font-size:13px;">' + b.author + '</div>';
      if (b.originalAuthor) {
          authorHTML = '<div class="book-card-author" style="font-size:13px;">' + b.author + ' <span class="book-card-original-author">' + b.originalAuthor + '</span></div>';
      }
      card.innerHTML =
        titleHTML +
        authorHTML +
        '<div class="book-card-meta">' + meta + '</div>' +
        '<span class="book-card-arrow">▼</span>' +
        linksHTML;

      card.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        const panel = card.querySelector('.book-links-panel');
        if (panel) {
          panel.classList.toggle('open');
          card.classList.toggle('expanded');
        }
      });

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

/* ====================================================
   推荐一本书：网站内投稿表单
   投稿进入数据库后，等待管理员审核
   ==================================================== */

const BOOK_SUGGEST_API =
  "https://book-suggest.kittybeef.workers.dev/submit";

function ensureBookSuggestionModal() {
  if (document.getElementById("bookSuggestionModal")) return;

  const modal = document.createElement("div");
  modal.id = "bookSuggestionModal";
  modal.className = "hidden";

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "bookSuggestionTitle");

  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(20,18,16,.62);
    align-items: center;
    justify-content: center;
    padding: 18px;
  `;

  modal.innerHTML = `
    <div style="
      background:#fffdf8;
      color:#352b22;
      width:min(620px,100%);
      max-height:90vh;
      overflow:auto;
      border-radius:18px;
      padding:24px;
      box-shadow:0 18px 60px rgba(0,0,0,.25);
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:12px;
      ">
        <h2 id="bookSuggestionTitle" style="margin:0;">
          📝 推荐一本书
        </h2>

        <button
          type="button"
          id="closeBookSuggestion"
          aria-label="关闭投稿窗口"
          style="font-size:26px;border:0;background:transparent;cursor:pointer;"
        >×</button>
      </div>

      <p style="line-height:1.7;color:#756657;">
        分享你喜欢的作品吧！
        投稿需要经过管理员审核，不会立即加入正式书库。
        带 * 的项目为必填。
      </p>

      <form id="bookSuggestionForm"
        style="display:grid;gap:12px;">

        <label>
          书名 *
          <input name="title" required maxlength="200"
            style="display:block;width:100%;box-sizing:border-box;padding:10px;">
          <div id="bookSuggestionSearchResult" style="margin-top:8px;font-size:13px;line-height:1.7;"></div>
        </label>
          作者 *
          <input name="author" required maxlength="200"
            style="display:block;width:100%;box-sizing:border-box;padding:10px;">
        </label>

        <label>
          原文书名（选填）
          <input name="original_title" maxlength="200"
            style="display:block;width:100%;box-sizing:border-box;padding:10px;">
        </label>

        <label>
          时代 *
          <select name="era" required
            style="display:block;width:100%;padding:10px;">
            <option value="">请选择时代</option>
            <option>史前</option>
            <option>早期文明</option>
            <option>古典时代</option>
            <option>后古典时代</option>
            <option>近代早期</option>
            <option>工业与帝国</option>
            <option>全球冲突</option>
            <option>当代</option>
          </select>
        </label>

        <label>
          国家 / 地区 *
          <input name="country" required maxlength="100"
            style="display:block;width:100%;box-sizing:border-box;padding:10px;">
        </label>

        <label>
          作者性别 *
          <select name="gender" required
            style="display:block;width:100%;padding:10px;">
            <option value="">请选择</option>
            <option value="男性作者">男性作者</option>
            <option value="女性作者">女性作者</option>
            <option value="作者未详">作者未详</option>
          </select>
        </label>

        <label>
          文体 *
          <select name="genre" required
            style="display:block;width:100%;padding:10px;">
            <option value="">请选择文体</option>
            <option>小说</option>
            <option>诗歌</option>
            <option>戏剧</option>
            <option>散文</option>
            <option>书信</option>
            <option>日记</option>
            <option>寓言</option>
            <option>史诗</option>
            <option>传记文学</option>
            <option>旅行文学</option>
            <option>神话</option>
            <option>古代文献</option>
            <option>赋</option>
            <option>词</option>
            <option>文学理论</option>
          </select>
        </label>

        <label>
          在线阅读链接（选填）
          <input name="reading_link" type="url" maxlength="1000"
            placeholder="https://..."
            style="display:block;width:100%;box-sizing:border-box;padding:10px;">
        </label>

        <label>
          推荐理由（选填）
          <textarea name="reason" rows="4" maxlength="2000"
            placeholder="为什么推荐这本书？"
            style="display:block;width:100%;box-sizing:border-box;padding:10px;"></textarea>
        </label>

        <div id="bookSuggestionMessage"
          role="status" aria-live="polite"></div>

        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button type="button" id="cancelBookSuggestion">
            取消
          </button>

          <button type="submit" id="submitBookSuggestion">
            提交审核
          </button>
        </div>

      </form>
    </div>
  `;

  document.body.appendChild(modal);

  function closeModal() {
    modal.classList.add("hidden");
  }

  document.getElementById("closeBookSuggestion")
    .addEventListener("click", closeModal);

  document.getElementById("cancelBookSuggestion")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.getElementById("bookSuggestionForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const form = e.currentTarget;
      const button = document.getElementById("submitBookSuggestion");
      const message = document.getElementById("bookSuggestionMessage");

      const payload = Object.fromEntries(
        new FormData(form).entries()
      );

      for (const key of Object.keys(payload)) {
        payload[key] = String(payload[key] || "").trim();
      }

      payload.source = window.location.origin;

      if (payload.reading_link &&
          !/^https?:\/\//i.test(payload.reading_link)) {
        message.textContent = "阅读链接必须以 http:// 或 https:// 开头。";
        return;
      }

      button.disabled = true;
      button.textContent = "正在提交…";
      message.textContent = "正在提交，请稍候。";

      try {
        const response = await fetch(BOOK_SUGGEST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
          throw new Error(
            result.message || "投稿失败，请稍后重试。"
          );
        }

        message.textContent =
          "投稿成功！已进入待审核列表。投稿编号：" +
          result.id;

        message.style.color = "#267347";

        form.reset();
        button.textContent = "提交成功";

      } catch (error) {
        message.textContent =
          error.message || "网络暂时不可用，请稍后重试。";

        message.style.color = "#a33";
        button.disabled = false;
        button.textContent = "重新提交";
      }
    });
}

function openBookSuggestion() {
  ensureBookSuggestionModal();

  const modal = document.getElementById("bookSuggestionModal");
  modal.classList.remove("hidden");

  const message = document.getElementById("bookSuggestionMessage");
  if (message) message.textContent = "";

  const button = document.getElementById("submitBookSuggestion");
  if (button) {
    button.disabled = false;
    button.textContent = "提交审核";
  }

  const titleInput = modal.querySelector('input[name="title"]');
  if (titleInput) titleInput.focus();
    // 书名实时搜索：在书库里查重
  const searchResultEl = document.getElementById("bookSuggestionSearchResult");
  if (titleInput && searchResultEl){
    function runSearch(k){
      const exact = BOOKS.filter(b => b.title === k);
      const fuzzy = BOOKS.filter(b => b.title && b.title.includes(k) && b.title !== k);
      const matched = [...exact, ...fuzzy].slice(0, 6);
      if (matched.length === 0){
        searchResultEl.style.color = "#267347";
        searchResultEl.textContent = "✅ 书库里没有找到同名或相似的书，可以放心投稿";
        return;
      }
      searchResultEl.style.color = "#a35a00";
      let html = "⚠️ 书库里已有相似的书，投稿前请先核对：<br>";
      matched.forEach(b => {
        html += "· 《" + b.title + "》" + (b.author ? " — " + b.author : "") + "（" + b.era + " · " + b.country + "）<br>";
      });
      searchResultEl.innerHTML = html;
    }

    titleInput.oninput = function(){
      const kw = titleInput.value.trim();
      if (!kw){
        searchResultEl.innerHTML = "";
        return;
      }
      if (!booksLoaded){
        searchResultEl.style.color = "#8a6a3f";
        searchResultEl.textContent = "书库加载中……";
        loadBooks().then(function(){ runSearch(kw); });
      } else {
        runSearch(kw);
      }
    };
  }
}