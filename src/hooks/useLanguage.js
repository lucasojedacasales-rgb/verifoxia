import { useState, createContext, useContext } from "react";

export const LANGUAGES = [
  { code: "es", name: "Español",    flag: "🇪🇸", nativeName: "Español"    },
  { code: "en", name: "English",    flag: "🇬🇧", nativeName: "English"    },
  { code: "fr", name: "Français",   flag: "🇫🇷", nativeName: "Français"   },
  { code: "pt", name: "Português",  flag: "🇧🇷", nativeName: "Português"  },
  { code: "de", name: "Deutsch",    flag: "🇩🇪", nativeName: "Deutsch"    },
  { code: "it", name: "Italiano",   flag: "🇮🇹", nativeName: "Italiano"   },
  { code: "ar", name: "العربية",    flag: "🇸🇦", nativeName: "العربية"    },
  { code: "zh", name: "中文",        flag: "🇨🇳", nativeName: "中文"        },
  { code: "ja", name: "日本語",       flag: "🇯🇵", nativeName: "日本語"      },
  { code: "ru", name: "Русский",    flag: "🇷🇺", nativeName: "Русский"    },
];

// All UI strings indexed by language code
export const TRANSLATIONS = {
  es: {
    search_placeholder: "Busca un producto... ej: iPhone 15 Pro",
    search_btn: "Analizar",
    compare_btn: "Comparar dos productos cara a cara",
    popular: "Populares:",
    analyzing: "Analizando",
    analyzing_sub: "Consultando Wikipedia, DuckDuckGo y generando análisis con IA...",
    search_other: "Busca otro producto...",
    create_alert: "Crear alerta de precio",
    intro_badge: "Comparación inteligente con IA",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Compara precios, reseñas y fiabilidad de cualquier producto. Nuestra IA te dice si conviene comprarlo ahora.",
    features: [
      { title: "Compara precios", desc: "Encuentra el mejor precio entre múltiples tiendas online" },
      { title: "Analiza reseñas", desc: "Evaluamos miles de opiniones para darte un resumen honesto" },
      { title: "Verifica fiabilidad", desc: "Comprobamos la reputación del vendedor y la calidad del producto" },
      { title: "Predictor de precio IA", desc: "Predice si el precio subirá o bajará y cuándo es mejor comprar" },
    ],
  },
  en: {
    search_placeholder: "Search a product... e.g. iPhone 15 Pro",
    search_btn: "Analyze",
    compare_btn: "Compare two products head to head",
    popular: "Popular:",
    analyzing: "Analyzing",
    analyzing_sub: "Querying Wikipedia, DuckDuckGo and generating AI analysis...",
    search_other: "Search another product...",
    create_alert: "Create price alert",
    intro_badge: "Smart AI-powered comparison",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Compare prices, reviews and reliability of any product. Our AI tells you if it's worth buying now.",
    features: [
      { title: "Compare prices", desc: "Find the best price across multiple online stores" },
      { title: "Analyze reviews", desc: "We evaluate thousands of opinions for an honest summary" },
      { title: "Verify reliability", desc: "We check seller reputation and product quality" },
      { title: "AI price predictor", desc: "Predicts if the price will rise or fall and when to buy" },
    ],
  },
  fr: {
    search_placeholder: "Recherchez un produit... ex: iPhone 15 Pro",
    search_btn: "Analyser",
    compare_btn: "Comparer deux produits face à face",
    popular: "Populaires :",
    analyzing: "Analyse en cours",
    analyzing_sub: "Interrogation de Wikipedia, DuckDuckGo et génération de l'analyse IA...",
    search_other: "Rechercher un autre produit...",
    create_alert: "Créer une alerte de prix",
    intro_badge: "Comparaison intelligente par IA",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Comparez prix, avis et fiabilité de n'importe quel produit. Notre IA vous dit s'il vaut la peine d'acheter maintenant.",
    features: [
      { title: "Comparer les prix", desc: "Trouvez le meilleur prix parmi plusieurs boutiques en ligne" },
      { title: "Analyser les avis", desc: "Nous évaluons des milliers d'opinions pour un résumé honnête" },
      { title: "Vérifier la fiabilité", desc: "Nous vérifions la réputation du vendeur et la qualité du produit" },
      { title: "Prédicteur de prix IA", desc: "Prédit si le prix va monter ou baisser et quand acheter" },
    ],
  },
  pt: {
    search_placeholder: "Pesquise um produto... ex: iPhone 15 Pro",
    search_btn: "Analisar",
    compare_btn: "Comparar dois produtos frente a frente",
    popular: "Populares:",
    analyzing: "Analisando",
    analyzing_sub: "Consultando Wikipedia, DuckDuckGo e gerando análise com IA...",
    search_other: "Pesquise outro produto...",
    create_alert: "Criar alerta de preço",
    intro_badge: "Comparação inteligente com IA",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Compare preços, avaliações e confiabilidade de qualquer produto. Nossa IA diz se vale a pena comprar agora.",
    features: [
      { title: "Comparar preços", desc: "Encontre o melhor preço em várias lojas online" },
      { title: "Analisar avaliações", desc: "Avaliamos milhares de opiniões para um resumo honesto" },
      { title: "Verificar confiabilidade", desc: "Verificamos a reputação do vendedor e a qualidade do produto" },
      { title: "Previsor de preço IA", desc: "Prevê se o preço vai subir ou cair e quando comprar" },
    ],
  },
  de: {
    search_placeholder: "Produkt suchen... z.B. iPhone 15 Pro",
    search_btn: "Analysieren",
    compare_btn: "Zwei Produkte direkt vergleichen",
    popular: "Beliebt:",
    analyzing: "Analysiere",
    analyzing_sub: "Abfrage von Wikipedia, DuckDuckGo und KI-Analyse wird erstellt...",
    search_other: "Anderes Produkt suchen...",
    create_alert: "Preisalarm erstellen",
    intro_badge: "Intelligenter KI-Vergleich",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Vergleiche Preise, Bewertungen und Zuverlässigkeit jedes Produkts. Unsere KI sagt dir, ob es sich jetzt lohnt zu kaufen.",
    features: [
      { title: "Preise vergleichen", desc: "Finde den besten Preis in mehreren Online-Shops" },
      { title: "Bewertungen analysieren", desc: "Wir werten tausende Meinungen für eine ehrliche Zusammenfassung aus" },
      { title: "Zuverlässigkeit prüfen", desc: "Wir prüfen den Ruf des Verkäufers und die Produktqualität" },
      { title: "KI-Preisvorhersage", desc: "Sagt voraus, ob der Preis steigt oder fällt und wann man kaufen sollte" },
    ],
  },
  it: {
    search_placeholder: "Cerca un prodotto... es: iPhone 15 Pro",
    search_btn: "Analizza",
    compare_btn: "Confronta due prodotti faccia a faccia",
    popular: "Popolari:",
    analyzing: "Analisi in corso",
    analyzing_sub: "Consultazione di Wikipedia, DuckDuckGo e generazione analisi IA...",
    search_other: "Cerca un altro prodotto...",
    create_alert: "Crea avviso di prezzo",
    intro_badge: "Confronto intelligente con IA",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Confronta prezzi, recensioni e affidabilità di qualsiasi prodotto. La nostra IA ti dice se conviene comprarlo ora.",
    features: [
      { title: "Confronta prezzi", desc: "Trova il miglior prezzo tra più negozi online" },
      { title: "Analizza recensioni", desc: "Valutiamo migliaia di opinioni per un riepilogo onesto" },
      { title: "Verifica affidabilità", desc: "Controlliamo la reputazione del venditore e la qualità del prodotto" },
      { title: "Predittore prezzi IA", desc: "Prevede se il prezzo salirà o scenderà e quando acquistare" },
    ],
  },
  ar: {
    search_placeholder: "ابحث عن منتج... مثال: iPhone 15 Pro",
    search_btn: "تحليل",
    compare_btn: "قارن بين منتجين وجهاً لوجه",
    popular: "الأكثر بحثاً:",
    analyzing: "جاري التحليل",
    analyzing_sub: "استشارة Wikipedia وDuckDuckGo وإنشاء تحليل بالذكاء الاصطناعي...",
    search_other: "ابحث عن منتج آخر...",
    create_alert: "إنشاء تنبيه سعر",
    intro_badge: "مقارنة ذكية بالذكاء الاصطناعي",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "قارن الأسعار والمراجعات وموثوقية أي منتج. يخبرك الذكاء الاصطناعي إذا كان يستحق الشراء الآن.",
    features: [
      { title: "قارن الأسعار", desc: "اعثر على أفضل سعر في متاجر متعددة عبر الإنترنت" },
      { title: "حلل المراجعات", desc: "نقيّم آلاف الآراء لتقديم ملخص صادق" },
      { title: "تحقق من الموثوقية", desc: "نتحقق من سمعة البائع وجودة المنتج" },
      { title: "متنبئ السعر بالذكاء الاصطناعي", desc: "يتنبأ بما إذا كان السعر سيرتفع أو ينخفض ومتى تشتري" },
    ],
  },
  zh: {
    search_placeholder: "搜索产品... 例：iPhone 15 Pro",
    search_btn: "分析",
    compare_btn: "并排比较两款产品",
    popular: "热门：",
    analyzing: "正在分析",
    analyzing_sub: "查询 Wikipedia、DuckDuckGo 并生成 AI 分析...",
    search_other: "搜索其他产品...",
    create_alert: "创建价格提醒",
    intro_badge: "AI 智能比较",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "比较任何产品的价格、评论和可靠性。我们的 AI 告诉您现在是否值得购买。",
    features: [
      { title: "比较价格", desc: "在多个网店中找到最优价格" },
      { title: "分析评论", desc: "我们评估数千条意见，提供诚实的摘要" },
      { title: "验证可靠性", desc: "我们检查卖家信誉和产品质量" },
      { title: "AI 价格预测", desc: "预测价格走势及最佳购买时机" },
    ],
  },
  ja: {
    search_placeholder: "製品を検索... 例：iPhone 15 Pro",
    search_btn: "分析する",
    compare_btn: "2つの製品を比較する",
    popular: "人気：",
    analyzing: "分析中",
    analyzing_sub: "Wikipedia、DuckDuckGoを照会してAI分析を生成中...",
    search_other: "別の製品を検索...",
    create_alert: "価格アラートを作成",
    intro_badge: "AIによるスマート比較",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "あらゆる製品の価格、レビュー、信頼性を比較。AIが今すぐ購入すべきかをお伝えします。",
    features: [
      { title: "価格を比較", desc: "複数のオンラインショップで最安値を見つける" },
      { title: "レビューを分析", desc: "数千の意見を評価して正直なまとめを提供" },
      { title: "信頼性を確認", desc: "販売者の評判と製品品質を確認" },
      { title: "AI価格予測", desc: "価格が上がるか下がるかを予測し最適な購入タイミングを提案" },
    ],
  },
  ru: {
    search_placeholder: "Найти товар... например: iPhone 15 Pro",
    search_btn: "Анализировать",
    compare_btn: "Сравнить два товара",
    popular: "Популярные:",
    analyzing: "Анализирую",
    analyzing_sub: "Запрос Wikipedia, DuckDuckGo и генерация анализа ИИ...",
    search_other: "Найти другой товар...",
    create_alert: "Создать оповещение о цене",
    intro_badge: "Умное сравнение с ИИ",
    hero_title_1: "Trustify",
    hero_title_2: "",
    hero_sub: "Сравнивайте цены, отзывы и надёжность любого товара. Наш ИИ скажет, стоит ли покупать сейчас.",
    features: [
      { title: "Сравнить цены", desc: "Найдите лучшую цену в нескольких интернет-магазинах" },
      { title: "Анализ отзывов", desc: "Оцениваем тысячи мнений для честного резюме" },
      { title: "Проверка надёжности", desc: "Проверяем репутацию продавца и качество товара" },
      { title: "Предсказание цены ИИ", desc: "Прогнозирует рост или падение цены и когда покупать" },
    ],
  },
};

export function useLanguage() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("trustify_lang");
    if (saved) return LANGUAGES.find(l => l.code === saved) || LANGUAGES[0];
    // Auto-detect from browser
    const browserLang = navigator.language?.slice(0, 2);
    return LANGUAGES.find(l => l.code === browserLang) || LANGUAGES[0];
  });

  const changeLanguage = (language) => {
    setLang(language);
    localStorage.setItem("trustify_lang", language.code);
  };

  const t = TRANSLATIONS[lang.code] || TRANSLATIONS["es"];

  return { lang, changeLanguage, languages: LANGUAGES, t };
}