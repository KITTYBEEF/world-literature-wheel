let currentLang = localStorage.getItem("wlt_lang") || "zh";

const UI = {
  zh: {
    homeTitle: "世界文学大转盘",
    homeSubtitle: "让随机性带你遇见陌生的文学世界",
    btnStart: "开始",
    btnHistory: "查看历史记录",
    eraTitle: "请抽取你即将到达的文学时间段",
    btnOk: "好",
    btnDraw: "抽取",
    btnDrawAgain: "重新抽取",
    btnNext: "下一步",
    btnBack: "返回上一步",
    btnSeeMore: "查看更多",
    btnClose: "关闭",
    btnFull: "查看完整结果",
    btnRestart: "重新开始",
    btnExitHistory: "退出",
    btnClear: "清空",
    btnBackHome: "返回主页",
    libraryNote: "书库持续校对中，如有错误欢迎",
    libraryLinkGithub: "在 GitHub 留言",
    libraryOr: "，或发邮件至",
    libraryLinkEmail: "kittybeef@foxmail.com",
    optOrCustom: "— 或者自选 —",
    notDrawn: "尚未抽取",
    drawing: "抽取中……",
    willArrive: "你即将到达：",
    continentTitle: "请选择你即将拜访的范围",
    contAll: "不 限",
    contRandom: "随 机 大 洲",
    contAsia: "亚 洲",
    contEurope: "欧 洲",
    contAfrica: "非 洲",
    contAmericas: "美 洲",
    contOceania: "大 洋 洲",
    hintAvailable: "此时代共 {n} 个国家可供抽取",
    countryTitle: "请抽取你即将要拜访的国家",
    prefixEra: "你选择的时代是：",
    prefixRange: "你选择的范围是：",
    prefixVisit: "你即将拜访：",
    rangeAll: "全世界",
    rangeRandom: "随机大洲",
    captionEarth: "此刻地球",
    genderTitle: "您将由哪一种性别的作家带入文学世界？",
    gFemale: "女性作家",
    gMale: "男性作家",
    prefixCountry: "你选择的国家是：",
    msgWillLead: "将由{name}带你进入文学世界",
    genreTitle: "请抽取你即将阅读的文学文体",
    prefixGender: "你选择的作家性别是：",
    prefixRead: "你即将阅读：",
    bookLabel: "文体",
    finalTitle: "你的文学旅程已经确定",
    finalEra: "时代：",
    finalCountry: "国家：",
    finalGender: "作家性别：",
    finalGenre: "文学文体：",
    finalQuote: "愿你在陌生的文学世界中，遇见意料之外的思想与灵魂",
    btnFindBook: "找书",
    btnShareCard: "保存分享卡",
    shareHint: "长按图片保存到相册，或右键另存为",
    loadingBooks: "加载书库中……",
        findBookTitle: "为你找到的书",
    matchRelaxed: "这个组合暂时没有精确匹配的书，以下是放宽条件后的推荐",
    matchNone: "这个组合暂时没有可推荐的书",
    historyTitle: "抽签历史",
    statsTitle: "最常抽到",
    statsEra: "时代",
    statsCountry: "国家",
    statsGender: "性别",
    statsGenre: "文体",
    historyEmpty: "尚无抽签记录<br>去抽一次吧",
    countRecords: "共 <strong>{n}</strong> 条",
    confirmClear: "确定清空所有抽签历史吗？",
    deleteTitle: "删除这条记录",
    closeTitle: "关闭",
    willArriveShort: "你即将到达："
  },
  en: {
    homeTitle: "World Literature Wheel",
    homeSubtitle: "Let randomness lead you to unfamiliar literary worlds",
    btnStart: "Begin",
    btnHistory: "View History",
    eraTitle: "Draw the literary era you will visit",
    btnOk: "OK",
    btnDraw: "Draw",
    btnDrawAgain: "Draw Again",
    btnNext: "Next",
    btnBack: "Back",
    btnSeeMore: "See More",
    btnClose: "Close",
    btnFull: "View Full Result",
    btnRestart: "Start Over",
    btnExitHistory: "Exit",
    btnClear: "Clear",
    btnBackHome: "Home",
    libraryNote: "Library still being proofread — if you spot an error, ",
    libraryLinkGithub: "leave a note on GitHub",
    libraryOr: ", or email ",
    libraryLinkEmail: "kittybeef@foxmail.com",
    optOrCustom: "— Or pick your own —",
    notDrawn: "Not drawn yet",
    drawing: "Drawing…",
    willArrive: "You will arrive at: ",
    continentTitle: "Choose the region you will visit",
    contAll: "Anywhere",
    contRandom: "Random",
    contAsia: "Asia",
    contEurope: "Europe",
    contAfrica: "Africa",
    contAmericas: "Americas",
    contOceania: "Oceania",
    hintAvailable: "{n} countries available in this era",
    countryTitle: "Draw the country you will visit",
    prefixEra: "Selected era: ",
    prefixRange: "Selected range: ",
    prefixVisit: "You will visit: ",
    rangeAll: "Whole World",
    rangeRandom: "Random Continent",
    captionEarth: "This Earth",
    genderTitle: "Which gender of writer will lead you into the literary world?",
    gFemale: "Female Writer",
    gMale: "Male Writer",
    prefixCountry: "Selected country: ",
    msgWillLead: "{name} will lead you into the literary world",
    genreTitle: "Draw the literary form you will read",
    prefixGender: "Selected writer gender: ",
    prefixRead: "You will read: ",
    bookLabel: "Form",
    finalTitle: "Your literary journey is set",
    finalEra: "Era: ",
    finalCountry: "Country: ",
    finalGender: "Writer: ",
    finalGenre: "Form: ",
       finalQuote: "May you encounter unexpected thoughts and souls in unfamiliar literary worlds",
    btnFindBook: "Find Books",
    btnShareCard: "Save Card",
    shareHint: "Long press to save, or right-click to save as",
    loadingBooks: "Loading library…",
       findBookTitle: "Books For You",
    matchRelaxed: "No exact match — showing closer picks by relaxing some filters",
    matchNone: "No recommendation for this combination yet",
    historyTitle: "Draw History",
    statsTitle: "MOST DRAWN",
    statsEra: "Era",
    statsCountry: "Country",
    statsGender: "Gender",
    statsGenre: "Form",
    historyEmpty: "No records yet<br>Try a draw",
    countRecords: "<strong>{n}</strong> records",
    confirmClear: "Clear all draw history?",
    deleteTitle: "Delete this record",
    closeTitle: "Close",
    willArriveShort: "You will arrive at: "
  }
};

function t(key){
  const dict = UI[currentLang] || UI.zh;
  return dict[key] !== undefined ? dict[key] : (UI.zh[key] || key);
}

/* 时代名称映射 */
const ERA_EN = {
  "史前": "Prehistory",
  "早期文明": "Early Civilizations",
  "古典时代": "Classical Age",
  "后古典时代": "Post-Classical Age",
  "近代早期": "Early Modern",
  "工业与帝国": "Industry & Empire",
  "全球冲突": "Global Conflict",
  "当代": "Contemporary"
};

function getEraName(era){
  return currentLang === "en" ? (ERA_EN[era] || era) : era;
}

/* 国家名英文映射 */
const COUNTRY_EN = {
  "中国":"China","日本":"Japan","韩国":"South Korea","朝鲜":"North Korea","蒙古":"Mongolia",
  "越南":"Vietnam","泰国":"Thailand","缅甸":"Myanmar","柬埔寨":"Cambodia","老挝":"Laos",
  "马来西亚":"Malaysia","新加坡":"Singapore","印度尼西亚":"Indonesia","菲律宾":"Philippines",
  "印度":"India","巴基斯坦":"Pakistan","孟加拉国":"Bangladesh","斯里兰卡":"Sri Lanka","尼泊尔":"Nepal",
  "哈萨克斯坦":"Kazakhstan","乌兹别克斯坦":"Uzbekistan","阿富汗":"Afghanistan",
  "伊朗":"Iran","伊拉克":"Iraq","以色列":"Israel","黎巴嫩":"Lebanon","叙利亚":"Syria",
  "沙特阿拉伯":"Saudi Arabia","也门":"Yemen","约旦":"Jordan","格鲁吉亚":"Georgia","亚美尼亚":"Armenia",
  "英国":"United Kingdom","爱尔兰":"Ireland","法国":"France","德国":"Germany","意大利":"Italy",
  "西班牙":"Spain","葡萄牙":"Portugal","荷兰":"Netherlands","比利时":"Belgium","瑞士":"Switzerland",
  "奥地利":"Austria","波兰":"Poland","捷克":"Czechia","斯洛伐克":"Slovakia","匈牙利":"Hungary",
  "罗马尼亚":"Romania","保加利亚":"Bulgaria","希腊":"Greece","克罗地亚":"Croatia","塞尔维亚":"Serbia",
  "斯洛文尼亚":"Slovenia","阿尔巴尼亚":"Albania","乌克兰":"Ukraine","白俄罗斯":"Belarus",
  "立陶宛":"Lithuania","拉脱维亚":"Latvia","爱沙尼亚":"Estonia","芬兰":"Finland",
  "瑞典":"Sweden","挪威":"Norway","丹麦":"Denmark","冰岛":"Iceland","俄罗斯":"Russia",
  "埃及":"Egypt","摩洛哥":"Morocco","阿尔及利亚":"Algeria","突尼斯":"Tunisia","利比亚":"Libya",
  "苏丹":"Sudan","埃塞俄比亚":"Ethiopia","肯尼亚":"Kenya","坦桑尼亚":"Tanzania","乌干达":"Uganda",
  "尼日利亚":"Nigeria","加纳":"Ghana","塞内加尔":"Senegal","科特迪瓦":"Ivory Coast","喀麦隆":"Cameroon",
  "南非":"South Africa","津巴布韦":"Zimbabwe","莫桑比克":"Mozambique","安哥拉":"Angola","马达加斯加":"Madagascar",
  "美国":"United States","加拿大":"Canada","墨西哥":"Mexico","古巴":"Cuba","牙买加":"Jamaica",
  "危地马拉":"Guatemala","哥斯达黎加":"Costa Rica","巴拿马":"Panama",
  "哥伦比亚":"Colombia","委内瑞拉":"Venezuela","厄瓜多尔":"Ecuador","秘鲁":"Peru","玻利维亚":"Bolivia",
  "智利":"Chile","阿根廷":"Argentina","乌拉圭":"Uruguay","巴拉圭":"Paraguay","巴西":"Brazil",
  "澳大利亚":"Australia","新西兰":"New Zealand","索马里":"Somalia"
};

/* 时代 + 国家：显示的历史名称（英文版） */
const ERA_COUNTRY_DISPLAY_EN = {
  "史前": { "伊拉克":"Mesopotamia","埃及":"Nile Valley","土耳其":"Anatolia","墨西哥":"Mesoamerica","秘鲁":"Andes","以色列":"Canaan" },
  "早期文明": { "中国":"Shang-Zhou China","印度":"Indus Valley","希腊":"Aegean Civilization","意大利":"Early Rome","伊拉克":"Sumer","伊朗":"Elam","土耳其":"Hittites","埃及":"Ancient Egypt","以色列":"Canaan","亚美尼亚":"Hayasa-Azzi","阿富汗":"Bactria","墨西哥":"Olmec","秘鲁":"Early Andes" },  
  "古典时代": { "中国":"Qin-Han China","印度":"Maurya–Gupta","希腊":"Ancient Greece","意大利":"Rome","伊朗":"Ancient Persia","以色列":"Judea","埃及":"Ptolemaic Egypt","伊拉克":"Mesopotamia","土耳其":"Anatolia","西班牙":"Roman Hispania","法国":"Gaul","英国":"Britannia","日本":"Yayoi–Kofun","韩国":"Three Kingdoms","越南":"Jiaozhi","阿富汗":"Kushan","斯里兰卡":"Sinhala","亚美尼亚":"Ancient Armenia","格鲁吉亚":"Caucasian Iberia" },
    "后古典时代": { "中国":"Tang–Song–Yuan–Ming (China)","日本":"Heian–Muromachi (Japan)","韩国":"Goryeo–Joseon (Korea)","朝鲜":"Goryeo–Joseon (North Korea)","蒙古":"Mongol Empire (Mongolia)","越南":"Lê–Trần–Hậu Lê (Vietnam)","泰国":"Sukhothai–Ayutthaya (Thailand)","缅甸":"Pagan–Ava (Myanmar)","老挝":"Lan Xang (Laos)","柬埔寨":"Angkor (Cambodia)","马来西亚":"Srivijaya–Malacca (Malaysia)","印度尼西亚":"Srivijaya–Majapahit (Indonesia)","菲律宾":"Tondo–Sulu (Philippines)","印度":"Gupta–Delhi Sultanate (India)","斯里兰卡":"Sinhala Kingdom (Sri Lanka)","尼泊尔":"Malla Dynasty (Nepal)","阿富汗":"Ghaznavid–Timurid (Afghanistan)","伊朗":"Persia (Sasanian–Safavid, Iran)","伊拉克":"Abbasid Caliphate (Iraq)","土耳其":"Seljuk–Ottoman (Turkey)","叙利亚":"Umayyad–Mamluk (Syria)","以色列":"Jewish–Crusader (Israel)","黎巴嫩":"Crusader States (Lebanon)","约旦":"Ayyubid–Mamluk (Jordan)","沙特阿拉伯":"Arabian Peninsula (Saudi Arabia)","也门":"Rasulid Dynasty (Yemen)","格鲁吉亚":"Kingdom of Georgia (Georgia)","亚美尼亚":"Cilician Armenia (Armenia)","埃及":"Fatimid–Mamluk (Egypt)","西班牙":"Al-Andalus (Spain)","意大利":"Italian City-States (Italy)","德国":"Holy Roman Empire (Germany)","墨西哥":"Maya–Aztec (Mexico)","秘鲁":"Inca (Peru)","危地马拉":"Maya (K'iche'–Kaqchikel, Guatemala)","哥斯达黎加":"Intermediate Area (Chibcha, Costa Rica)","巴拿马":"Intermediate Area (Guna–Ngäbe, Panama)","哥伦比亚":"Muisca (Colombia)","委内瑞拉":"Carib–Warao (Venezuela)","厄瓜多尔":"Cara–Quitu–Shuar (Ecuador)","玻利维亚":"Aymara–Qullasuyu (Bolivia)","智利":"Mapuche–Rapa Nui (Chile)","阿根廷":"Patagonia–Tierra del Fuego (Argentina)","乌拉圭":"Charrúa (Uruguay)","巴拉圭":"Guaraní (Paraguay)","巴西":"Tupi–Guaraní (Brazil)","澳大利亚":"Aboriginal Dreaming (Australia)","新西兰":"Māori (New Zealand)","埃塞俄比亚":"Aksum–Solomonid (Ethiopia)","尼日利亚":"Nok–Ife (Nigeria)" },
"近代早期": { "中国":"Ming–Qing","日本":"Edo","韩国":"Joseon","越南":"Lê–Trịnh–Nguyễn","印度":"Mughal Empire","印度尼西亚":"Islamic Sultanates","菲律宾":"Spanish Philippines","伊朗":"Safavid Persia","土耳其":"Ottoman Empire","以色列":"Ottoman Palestine","黎巴嫩":"Ottoman Lebanon","埃及":"Ottoman Egypt","摩洛哥":"Saadi–Alaouite","埃塞俄比亚":"Solomonic Dynasty","南非":"Dutch Cape Colony","意大利":"Italian States","西班牙":"Habsburg Spain","葡萄牙":"Portuguese Empire","法国":"Ancien Régime","英国":"Tudor–Stuart","爱尔兰":"Gaelic Ireland","德国":"Holy Roman Empire","荷兰":"Dutch Republic","比利时":"Spanish–Austrian Netherlands","瑞士":"Old Swiss Confederacy","奥地利":"Habsburg Monarchy","波兰":"Polish–Lithuanian Commonwealth","捷克":"Habsburg Bohemia","匈牙利":"Habsburg Hungary","俄罗斯":"Tsardom of Russia","乌克兰":"Cossack Hetmanate","瑞典":"Swedish Empire","丹麦":"Denmark–Norway","挪威":"Denmark–Norway","芬兰":"Swedish Finland","冰岛":"Danish Iceland","希腊":"Ottoman Greece","美国":"Colonial–Early Republic","加拿大":"New France","墨西哥":"New Spain","古巴":"Spanish Cuba","巴西":"Colonial Brazil","秘鲁":"Viceroyalty of Peru","哥伦比亚":"New Granada","阿根廷":"Río de la Plata","智利":"Colonial Chile" },
"工业与帝国": { "英国":"British Empire","爱尔兰":"British Empire (Ireland)","法国":"French Third Republic","德国":"German Empire","意大利":"Kingdom of Italy","西班牙":"Bourbon Restoration Spain","葡萄牙":"Kingdom of Portugal","荷兰":"Kingdom of the Netherlands","比利时":"Kingdom of Belgium","瑞士":"Swiss Confederation","奥地利":"Austria-Hungary","波兰":"Partitioned Poland","捷克":"Austria-Hungary (Bohemia)","斯洛伐克":"Austria-Hungary (Slovakia)","匈牙利":"Austria-Hungary (Kingdom of Hungary)","罗马尼亚":"Kingdom of Romania","希腊":"Kingdom of Greece","保加利亚":"Kingdom of Bulgaria","塞尔维亚":"Kingdom of Serbia","克罗地亚":"Austria-Hungary (Croatia)","斯洛文尼亚":"Austria-Hungary (Slovenia)","阿尔巴尼亚":"Ottoman Albania","俄罗斯":"Russian Empire","乌克兰":"Russian Empire (Ukraine)","瑞典":"Union of Sweden and Norway","挪威":"Kingdom of Norway","丹麦":"Kingdom of Denmark","芬兰":"Russian Empire (Grand Duchy of Finland)","冰岛":"Danish Iceland","美国":"United States","加拿大":"Dominion of Canada","墨西哥":"United Mexican States","古巴":"Spanish Cuba to Republic of Cuba","巴西":"Empire of Brazil to Republic of Brazil","阿根廷":"Argentine Republic","智利":"Republic of Chile","哥伦比亚":"Republic of Colombia","秘鲁":"Republic of Peru","乌拉圭":"Oriental Republic of Uruguay","中国":"Qing Dynasty","日本":"Meiji Japan","韩国":"Korean Empire","印度":"British India","越南":"French Indochina","菲律宾":"American Philippines","印度尼西亚":"Dutch East Indies","斯里兰卡":"British Ceylon","伊朗":"Qajar Persia","土耳其":"Ottoman Empire","以色列":"Ottoman Palestine","黎巴嫩":"Ottoman Lebanon","埃及":"British-Occupied Egypt","摩洛哥":"Sultanate of Morocco","埃塞俄比亚":"Ethiopian Empire","南非":"Union of South Africa","肯尼亚":"British East Africa","尼日利亚":"British Nigeria","澳大利亚":"Commonwealth of Australia","新西兰":"Dominion of New Zealand" },
"全球冲突": { "英国":"United Kingdom","爱尔兰":"Ireland","法国":"French Republic","德国":"Germany","意大利":"Italian Republic","西班牙":"Spanish State","葡萄牙":"Portuguese Republic","荷兰":"Kingdom of the Netherlands","比利时":"Kingdom of Belgium","瑞士":"Swiss Confederation","奥地利":"Republic of Austria","波兰":"Polish People's Republic","捷克":"Czechoslovakia","斯洛伐克":"Czechoslovakia","匈牙利":"Hungarian People's Republic","罗马尼亚":"Socialist Republic of Romania","保加利亚":"People's Republic of Bulgaria","希腊":"Greek Republic","斯洛文尼亚":"Yugoslavia","克罗地亚":"Yugoslavia","塞尔维亚":"Yugoslavia","阿尔巴尼亚":"People's Socialist Republic of Albania","俄罗斯":"Soviet Union","乌克兰":"Soviet Union (Ukraine)","白俄罗斯":"Soviet Union (Belarus)","立陶宛":"Soviet Union (Lithuania)","拉脱维亚":"Soviet Union (Latvia)","爱沙尼亚":"Soviet Union (Estonia)","瑞典":"Kingdom of Sweden","挪威":"Kingdom of Norway","丹麦":"Kingdom of Denmark","芬兰":"Republic of Finland","冰岛":"Republic of Iceland","中国":"Republic of China · People's Republic of China","日本":"Empire of Japan · State of Japan","朝鲜":"Democratic People's Republic of Korea","韩国":"Republic of Korea","蒙古":"Mongolian People's Republic","越南":"Vietnam","菲律宾":"Republic of the Philippines","印度尼西亚":"Republic of Indonesia","泰国":"Kingdom of Thailand","缅甸":"Union of Burma","柬埔寨":"Cambodia","老挝":"Laos","马来西亚":"Federation of Malaysia","新加坡":"Republic of Singapore","斯里兰卡":"Ceylon · Sri Lanka","印度":"Republic of India","巴基斯坦":"Islamic Republic of Pakistan","孟加拉国":"People's Republic of Bangladesh","尼泊尔":"Kingdom of Nepal","阿富汗":"Kingdom of Afghanistan · Democratic Republic of Afghanistan","伊朗":"Pahlavi Iran","伊拉克":"Republic of Iraq","土耳其":"Republic of Turkey","以色列":"State of Israel","黎巴嫩":"Republic of Lebanon","叙利亚":"Syrian Republic","约旦":"Hashemite Kingdom of Jordan","沙特阿拉伯":"Kingdom of Saudi Arabia","也门":"Republic of Yemen","哈萨克斯坦":"Soviet Union (Kazakhstan)","埃及":"Republic of Egypt","摩洛哥":"Kingdom of Morocco","阿尔及利亚":"People's Democratic Republic of Algeria","突尼斯":"Republic of Tunisia","利比亚":"Libyan Arab Jamahiriya","苏丹":"Republic of the Sudan","埃塞俄比亚":"People's Democratic Republic of Ethiopia","肯尼亚":"Republic of Kenya","坦桑尼亚":"United Republic of Tanzania","乌干达":"Republic of Uganda","尼日利亚":"Federal Republic of Nigeria","加纳":"Republic of Ghana","塞内加尔":"Republic of Senegal","科特迪瓦":"Republic of Côte d'Ivoire","喀麦隆":"Republic of Cameroon","南非":"Union of South Africa · Republic of South Africa","津巴布韦":"Rhodesia · Zimbabwe","莫桑比克":"People's Republic of Mozambique","安哥拉":"People's Republic of Angola","马达加斯加":"Democratic Republic of Madagascar","索马里":"Somali Democratic Republic","美国":"United States of America","加拿大":"Dominion of Canada · Canada","墨西哥":"United Mexican States","危地马拉":"Republic of Guatemala","哥斯达黎加":"Republic of Costa Rica","巴拿马":"Republic of Panama","古巴":"Republic of Cuba","牙买加":"Jamaica","哥伦比亚":"Republic of Colombia","委内瑞拉":"Republic of Venezuela","厄瓜多尔":"Republic of Ecuador","秘鲁":"Republic of Peru","玻利维亚":"Republic of Bolivia","巴拉圭":"Republic of Paraguay","智利":"Republic of Chile","阿根廷":"Argentine Republic","乌拉圭":"Oriental Republic of Uruguay","巴西":"United States of Brazil · Federative Republic of Brazil","澳大利亚":"Commonwealth of Australia","新西兰":"New Zealand" }
};

const ERA_META_EN = {
  "史前":       { years:"c. 3,000,000 BCE – 3500 BCE", desc:"Human origins, hunter-gatherers, agricultural revolution" },
  "早期文明":   { years:"3500 BCE – 1200 BCE",         desc:"Sumer, Egypt, Indus Valley, Shang, Olmec independently develop writing and cities" },
  "古典时代":   { years:"1200 BCE – 500 CE",           desc:"Greece and Rome, Persia, Maurya, Qin-Han, Maya; Axial Age thought" },
  "后古典时代": { years:"500 – 1500 CE",               desc:"Islamic Golden Age, Tang-Song-Yuan-Ming, Medieval Europe, Maya/Aztec/Inca" },
  "近代早期":   { years:"1500 – 1800",                 desc:"Age of Discovery, colonization, Renaissance, Scientific Revolution, Ming-Qing" },
  "工业与帝国": { years:"1800 – 1914",                 desc:"Industrial Revolution, imperialism, nation-states; Europe dominates" },
  "全球冲突":   { years:"1914 – 1991",                 desc:"WWI, WWII, Cold War, decolonization; old empires collapse" },
  "当代":       { years:"1991 – Present",              desc:"Globalization, internet, information age; literature becomes multicultural" }
};

/* 性别/文体英文映射 */
const GENDER_EN = { "女性作家":"Female Writer", "男性作家":"Male Writer" };
const GENRE_EN = {
  "小说":"Novel","诗歌":"Poetry","戏剧":"Drama","散文":"Prose","书信":"Letters",
  "日记":"Diary","寓言":"Fable","史诗":"Epic","传记文学":"Biography","旅行文学":"Travel Writing"
};

function getCountryName(era, country){
  if (currentLang === "en"){
    const disp = ERA_COUNTRY_DISPLAY_EN[era];
    if (disp && disp[country]) return disp[country];
    return COUNTRY_EN[country] || country;
  }
  const disp = eraCountryDisplay[era];
  if (disp && disp[country]) return disp[country];
  return country;
}
function getGenderName(g){
  if (currentLang === "en") return GENDER_EN[g] || g;
  return g;
}
function getGenreName(g){
  if (currentLang === "en") return GENRE_EN[g] || g;
  return g;
}
