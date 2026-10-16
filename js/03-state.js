// 书库加载状态
let BOOKS = [];
let booksLoaded = false;
let booksLoadingPromise = null;

// 加载书库：后台预加载和用户主动进入共用同一个任务
function loadBooks() {
    // 已经加载完成，不再重复加载
    if (booksLoaded) {
        return Promise.resolve();
    }

    // 正在加载中，直接等待现有任务
    if (booksLoadingPromise) {
        return booksLoadingPromise;
    }

    booksLoadingPromise = (async () => {
        const files = [
            'data/books/prehistory.js',
            'data/books/early-civ.js',
            'data/books/classical.js',
            'data/books/post-classical.js',
            'data/books/early-modern.js',
            'data/books/industry-empire.js',
            'data/books/global-conflict.js',
            'data/books/contemporary.js'
        ];

        // 1. 并行加载静态书库
        await Promise.all(
            files.map(src => new Promise(resolve => {
                const script = document.createElement('script');
                script.src = src;

                script.onload = resolve;

                script.onerror = () => {
                    console.error('[书库] 静态书库加载失败：', src);
                    resolve();
                };

                document.head.appendChild(script);
            }))
        );

        // 2. 合并静态书籍
        const staticBooks = [
            ...(window.BOOKS_PREHISTORY || []),
            ...(window.BOOKS_EARLY_CIV || []),
            ...(window.BOOKS_CLASSICAL || []),
            ...(window.BOOKS_POST_CLASSICAL || []),
            ...(window.BOOKS_EARLY_MODERN || []),
            ...(window.BOOKS_INDUSTRY_EMPIRE || []),
            ...(window.BOOKS_GLOBAL_CONFLICT || []),
            ...(window.BOOKS_CONTEMPORARY || [])
        ];

        // 3. 获取管理员审核通过的投稿
        let approvedBooks = [];

        try {
            const response = await fetch(
                'https://book-suggest.kittybeef.workers.dev/approved-books'
            );

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            const result = await response.json();

            if (result.ok && Array.isArray(result.books)) {
                approvedBooks = result.books;

                console.log(
                    '[投稿书库] 已获取审核通过的投稿：',
                    approvedBooks.length,
                    '条'
                );
            } else {
                console.warn('[投稿书库] 接口返回的数据格式不符合预期。');
            }
        } catch (error) {
            console.error('[投稿书库] 获取审核通过的投稿失败：', error);
        }

        // 4. 合并并去重
        const allBooks = [...staticBooks, ...approvedBooks];
        const seen = new Set();

        BOOKS = allBooks.filter(book => {
            const key = (
                String(book.title || '').trim() +
                '||' +
                String(book.author || '').trim()
            ).toLowerCase();

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });

        // 5. 统一作者性别字段
        BOOKS.forEach(book => {
            if (book.gender === '男') book.gender = '男性作者';
            if (book.gender === '女') book.gender = '女性作者';
        });

        booksLoaded = true;

        console.log('[书库] 静态书籍：', staticBooks.length);
        console.log('[书库] 审核通过投稿：', approvedBooks.length);
        console.log('[书库] 去重后总计：', BOOKS.length);
    })();

    return booksLoadingPromise;
}

// 首屏加载完成后，在后台启动书库预加载
window.addEventListener('load', () => {
    const startPreload = () => {
        loadBooks().catch(error => {
            console.error('[书库] 后台预加载失败：', error);
            booksLoadingPromise = null;
        });
    };

    // 优先在浏览器空闲时加载；不支持时延迟启动
    if ('requestIdleCallback' in window) {
        requestIdleCallback(startPreload, { timeout: 3000 });
    } else {
        setTimeout(startPreload, 1500);
    }
}, { once: true });
const eraGlobeThemes = {
  "史前":       { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#a8d63f" },
  "早期文明":   { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "古典时代":   { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "后古典时代": { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "近代早期":   { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "工业与帝国": { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "全球冲突":   { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" },
  "当代":       { sea1:"#6bc3ff", sea2:"#1a73d6", land:"#9ed53d" }
};

/* ====================================================
   状态
   ==================================================== */
let selectedEra = "", selectedCountry = "", selectedGender = "", selectedGenre = "";
let searchPinnedBooks = [];
let chosenContinent = "不限";
let pickedContinentThisDraw = "";
let eraTimer = null, countryTimer = null, genderTimer = null, genreTimer = null;
let eraRotation = 0;
let eraSpinState = null;
let currentJourneySaved = false;

const HISTORY_KEY = "world_literature_wheel_history_v1";
const HISTORY_MAX = 100;
