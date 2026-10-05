// 书库懒加载：用户点「找书」时才下载
let BOOKS = [];
let booksLoaded = false;

function loadBooks(){
    return new Promise((resolve) => {
        if (booksLoaded){ resolve(); return; }

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

        let loaded = 0;
        function tryFinish(){
            loaded++;
            if (loaded < files.length) return;

            BOOKS = [
                ...(window.BOOKS_PREHISTORY      || []),
                ...(window.BOOKS_EARLY_CIV       || []),
                ...(window.BOOKS_CLASSICAL       || []),
                ...(window.BOOKS_POST_CLASSICAL  || []),
                ...(window.BOOKS_EARLY_MODERN    || []),
                ...(window.BOOKS_INDUSTRY_EMPIRE || []),
                ...(window.BOOKS_GLOBAL_CONFLICT || []),
                ...(window.BOOKS_CONTEMPORARY    || [])
            ];
            BOOKS.forEach(b => {
                if (b.gender === "男") b.gender = "男性作家";
                if (b.gender === "女") b.gender = "女性作家";
            });
            booksLoaded = true;
            console.log("[书库] 共加载 " + BOOKS.length + " 条");
            resolve();
        }

        files.forEach(src => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = tryFinish;
            s.onerror = tryFinish;
            document.head.appendChild(s);
        });
    });
}
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
let chosenContinent = "不限";
let pickedContinentThisDraw = "";
let eraTimer = null, countryTimer = null, genderTimer = null, genreTimer = null;
let eraRotation = 0;
let eraSpinState = null;
let currentJourneySaved = false;

const HISTORY_KEY = "world_literature_wheel_history_v1";
const HISTORY_MAX = 100;
