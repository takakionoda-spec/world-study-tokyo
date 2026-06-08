/* =============================================================================
   SITE CONFIG — WORLD STUDY TOKYO  (template boundary)
   =============================================================================
   Sister title #4, derived from the ADVERTISE TOKYO template per AGENTS.md.

   What changed vs. ADVERTISE TOKYO (kept intentionally minimal):
     1. `brand`     — re-skinned to WORLD STUDY TOKYO; subject is "the world's
                      latest in childhood and education, read from Tokyo, for
                      every parent investing in their child's future."
     2. `categories`— education taxonomy:
                        early-childhood / admissions / methods / research / ai-edu
     3. `pipeline.sources` — global education feeds:
                        EdSurge, The Hechinger Report, Times Higher Education,
                        Inside Higher Ed, Brookings Education, MIT Tech Review,
                        arXiv cs.CY, Forbes Education.
     4. `pipeline.voice` — Tokyo parent's register: warm, plain Japanese,
                      glosses on technical terms, emotional resonance over
                      pure-fact density. NO gender-coded language (per the
                      brief — "specialist jargon should be glossed; prefer
                      emotionally resonant phrasing over dry facts").
     5. `pipeline.voice.closingBlock` — "The Tokyo Editor's Note" / "東京編集部のノート"
                      — plain-language explainer of what this means for
                      Tokyo families, in the same 4-question structure used
                      across AITECH / ARTEMIS:
                        (1) what happened, in plain words
                        (2) plausible near-future impact for Tokyo readers
                        (3) timeframe + gating factor
                        (4) Japanese counterpart
     6. `pipeline.voice.relevanceGate` — built-in RELEVANCE GATE so the LLM
                      refuses off-topic dispatches that slip through the
                      source filter (e.g. an arXiv cs.CY paper about ML
                      privacy that isn't about education).
     7. `vanguard`  — repurposed as PARTNERS WANTED open call. No
                      individual entries until real partners sign on.
     8. `cron` — 05:00 JST (slot between AITECH 03:00, ADVERTISE 04:30,
                      ARTEMIS 06:00 — well outside GitHub Actions hourly band).

   Code-level changes required outside this file: minor — globals.css palette
   (white + sky blue + nuance pink) and the Vanguard component repurpose
   (heading + lede copy changes only; entries array can be empty).
   ========================================================================== */

export type Lang = "en" | "ja";
export type Bilingual<T = string> = { en: T; ja: T };

/* ---------------------------------------------------------------------------
   Category definition — identical shape to sister titles so types & helpers
   in src/lib/i18n.ts and src/site.config.ts derivations work unchanged.
   ------------------------------------------------------------------------- */
export type CategoryDef = {
  key: string;
  name: Bilingual;
  definitionForLlm: string;
  coverPool: { id: string; tone: string }[];
  fallback: string[];
};

/* ---------------------------------------------------------------------------
   Source definition. WORLD STUDY TOKYO adds `excludeLinkPattern` (from the
   ARTEMIS fix) so off-topic verticals can be blocked at fetch time without
   the LLM ever seeing them.
   ------------------------------------------------------------------------- */
export type SourceDef = {
  name: string;
  url: string;
  parse: "rss" | "atom";
  /** Must match a categories[].key. */
  category: string;
  /** Optional relevance filter — applied to title+summary. */
  filter?: RegExp;
  /** Optional URL exclusion. If set, items whose `link` URL matches are
   *  dropped before any LLM call. */
  excludeLinkPattern?: RegExp;
  /** Single-sentence framing note injected per-source into the LLM prompt. */
  framing?: string;
};

/* ---------------------------------------------------------------------------
   Structured-field definition (unchanged from sister titles).
   ------------------------------------------------------------------------- */
export type StructuredFieldType = "line" | "paragraph" | "block";
export type StructuredFieldRole = "headline" | "body" | "footnote" | "verdict";
export type StructuredFieldDef = {
  key: string;
  label: Bilingual;
  type: StructuredFieldType;
  charLimit?: Partial<Record<Lang, number>>;
  display: { role: StructuredFieldRole; onCard: boolean; onDetail: boolean };
  descriptionForLlm: string;
};

/* ---------------------------------------------------------------------------
   Affiliate types — same shape as sister titles so AffiliateCTA / data layer
   work unchanged.
   ------------------------------------------------------------------------- */
export type AffiliateNetwork = "amazon" | "partner" | "asp" | "other";
export type AffiliateLink = {
  url: string;
  network: AffiliateNetwork;
  label?: Bilingual<string>;
  note?: Bilingual<string>;
};

/* ---------------------------------------------------------------------------
   The configuration object itself.
   ------------------------------------------------------------------------- */
export const siteConfig = {
  /* ------------------------------------------------------------------ BRAND */
  brand: {
    name: "WORLD STUDY TOKYO",
    wordmark: "World Study Tokyo",
    /** Canonical site URL — vercel.app subdomain until the custom domain
     *  arrives (swap to https://www.worldstudytokyo.com once registered,
     *  and update Vercel NEXT_PUBLIC_SITE_URL). */
    siteUrl: "https://world-study-tokyo.vercel.app",
    subject: {
      en: "the world's latest in childhood and education — delivered to Tokyo parents in both English and Japanese, every morning, for free",
      ja: "世界の最新の幼児教育から大学進学までの情報を、東京の子育て家庭へ。毎朝、英語と日本語のバイリンガルで、無料でお届けします"
    },
    city: { en: "Tokyo", ja: "東京" },
    keywords: [
      "education",
      "childhood education",
      "early childhood",
      "exam preparation",
      "school admissions",
      "international school",
      "university admissions",
      "study methods",
      "edtech",
      "AI in education",
      "education research",
      "Japanese education",
      "受験",
      "中学受験",
      "高校受験",
      "大学受験",
      "幼児教育",
      "インターナショナルスクール",
      "勉強法",
      "教育論文",
      "AI教育",
      "東京",
      "Tokyo"
    ],
    /** Issue counter origin — masthead reads "Vol. xx — YYYY". Start in
     *  June 2026 so Vol. 01 corresponds to the launch month. */
    issueBase: { year: 2026, month: 6 },

    /** Primary CTA — surfaced in Header (utility row), Footer, and the home
     *  page tail. Targets /about#contact so prospective school / juku /
     *  edtech partners have one clear entry point. */
    cta: {
      label: { en: "Become a Partner", ja: "パートナー募集" },
      href: "/about#contact",
      hint: {
        en: "Free for every parent in Japan — and your school, juku, or edtech can be featured alongside the global feed.",
        ja: "日本の子育て家庭に無料で。海外フィードと並べて、貴校・貴塾・貴 EdTech サービスの情報も掲載できます。"
      }
    }
  },

  /* ------------------------------------------------------------------ LAYOUT
     Same directory mode as sister titles. */
  layout: {
    mode: "directory" as const,
    directory: {
      columns: { base: 1, sm: 2, md: 3, lg: 4 },
      showEditorsPicks: true,
      showSectionRule: true,
      pageSize: 24,
      /** Skip Unsplash stock covers in favour of the editorial tone tile.
       *  Education topics + stock photos = creepy / generic / off-message.
       *  Real source images (og:image scraping) still take priority; the
       *  tone tile is the warm fallback. */
      preferToneTileOverStockCover: true
    }
  },

  /* ----------------------------------------------------------------- CHROME */
  chrome: {
    tagline: {
      en: "The world's latest in childhood and education, delivered to Tokyo parents for free. Bilingual, every morning, with a Tokyo perspective on the global conversation — and a spotlight on Japan's own juku, international schools, and university trends.",
      ja: "世界の最新の幼児教育から大学進学までの動向を、東京の子育て家庭へ無料で。毎朝バイリンガルで、海外の最先端を東京の文脈で読み解きます。さらに、日本の塾・インターナショナルスクール・大学受験のトレンドも合わせて紹介します。"
    },
    legal: {
      en: "© 2026 WORLD STUDY TOKYO. All rights reserved.",
      ja: "© 2026 WORLD STUDY TOKYO. 全著作権所有。"
    },
    nav: {
      home: { en: "Home", ja: "ホーム" },
      about: { en: "About", ja: "ABOUT" },
      subscribe: { en: "Newsletter", ja: "ニュースレター" }
    },
    ui: {
      readMore: { en: "Read", ja: "読む" },
      by: { en: "Via", ja: "経由" },
      minRead: { en: "min read", ja: "分で読了" },
      featured: { en: "Editor's Picks", ja: "編集部ピック" },
      latest: { en: "Recently Published", ja: "新着記事" },
      related: { en: "Related Reading", ja: "関連記事" },
      backToHome: { en: "Back to home", ja: "ホームへ戻る" },
      issue: { en: "Issue", ja: "ISSUE" },
      moreIn: { en: "More in", ja: "もっと見る:" }
    },
    newsletter: {
      eyebrow: { en: "The Weekly Note", ja: "今週のノート" },
      heading: {
        en: "Global education, delivered to Tokyo. Free, weekly, in Japanese.",
        ja: "世界の教育トレンドを、東京の家庭へ。\n毎週、日本語で無料お届け。"
      },
      lede: {
        en: "Each Friday: the five global education stories every Tokyo parent should know — translated into Japanese, read through a Tokyo lens, and paired with the Japan-side moves worth tracking this week. Free, no spam, unsubscribe anytime.",
        ja: "毎週金曜。東京の子育て家庭が今週知っておきたい世界の教育ニュースを 5 本厳選し、日本語でわかりやすく解説。あわせて、日本国内で押さえておきたい動きもご紹介します。無料、スパムなし、いつでも解除可能です。"
      },
      placeholder: { en: "Your email address", ja: "メールアドレス" },
      cta: { en: "Subscribe", ja: "購読する" },
      disclaimer: {
        en: "We respect your inbox. Unsubscribe anytime.",
        ja: "受信箱を尊重します。いつでも解除可能です。"
      }
    },
    footer: {
      copy: {
        en: "WORLD STUDY TOKYO is a free bilingual media for Tokyo parents. Each morning we translate the world's leading education news — from EdSurge, The Hechinger Report, Times Higher Education, Inside Higher Ed, Brookings, MIT Technology Review, Forbes, and arXiv — into Japanese, add a Tokyo perspective grounded in Japan's juku, international school, and university admissions landscape, and spotlight the schools and learning services shaping the local conversation.",
        ja: "WORLD STUDY TOKYO は、東京の子育て家庭のための無料バイリンガル WEB メディアです。毎朝、世界の教育ニュース ── EdSurge、The Hechinger Report、Times Higher Education、Inside Higher Ed、Brookings、MIT Technology Review、Forbes、arXiv ── を日本語に翻訳し、日本の塾・インターナショナルスクール・大学受験事情を踏まえた東京視点を加えてお届け。あわせて、国内の学校・学習サービスの動きもご紹介します。"
      },
      strapline: "Tokyo · Bilingual · Free for Parents"
    },
    languageToggle: { en: "JA", ja: "EN" },
    notFound: {
      title: { en: "404 — page not found.", ja: "404 — ページが見つかりません。" },
      lede: {
        en: "Either the article was moved, the URL is incorrect, or the index hasn't caught up yet.",
        ja: "記事が移動されたか、URL が正しくないか、まだインデックスに反映されていない可能性があります。"
      },
      back: { en: "Back to home", ja: "ホームへ戻る" }
    },
    emptyState: {
      eyebrow: { en: "Publishing", ja: "公開準備中" },
      heading: {
        en: "The first WORLD STUDY TOKYO index is being prepared.",
        ja: "WORLD STUDY TOKYO の最初のインデックスを\n準備しています。"
      },
      lede: {
        en: "Each morning, our pipeline pulls the world's leading education news — from EdSurge, The Hechinger Report, Times Higher Education, Inside Higher Ed, Brookings, MIT Technology Review, Forbes, and arXiv — translates the items worth knowing into Japanese, and adds a Tokyo perspective grounded in Japan's juku, international school, and university admissions landscape. Free for every parent in Japan. The first index will appear here as soon as the next cycle completes.",
        ja: "WORLD STUDY TOKYO のパイプラインは毎朝、世界の主要な教育ニュース ── EdSurge、The Hechinger Report、Times Higher Education、Inside Higher Ed、Brookings、MIT Technology Review、Forbes、arXiv ── を取得し、知っておきたい情報を日本語に翻訳し、日本の塾・インターナショナルスクール・大学受験事情を踏まえた東京視点でお届けします。すべての日本の子育て家庭に、無料で。次回サイクルが完了次第、最初のインデックスがこちらに表示されます。"
      },
      nextDispatch: {
        en: "Next index: 05:00 JST",
        ja: "次回インデックス：日本時間 朝5時"
      }
    }
  },

  /* ------------------------------------------------------------------ ABOUT */
  about: {
    headline: {
      en: "The world's education conversation, read from Tokyo.",
      ja: "世界の教育の最前線を、東京から。"
    },
    lede: {
      en: "WORLD STUDY TOKYO is a free bilingual web media for parents and guardians in Tokyo who care about how their child learns — from the first weeks of early childhood through university admissions. Each morning, we translate the world's leading education news into Japanese, read it through a Tokyo perspective grounded in Japan's own juku, international school, and university admissions landscape, and pair it with the Japanese institutions and services worth knowing. No paywall, no signup required.",
      ja: "WORLD STUDY TOKYO は、子どもの学びを大切にする東京の保護者の皆さまのための、無料バイリンガル WEB メディアです。幼児期から大学受験まで、世界の教育の最新動向を毎朝日本語に翻訳し、日本の塾・インターナショナルスクール・大学受験事情を踏まえた東京視点で読み解きます。あわせて、知っておきたい国内の学校や学習サービスもご紹介。ペイウォールなし、登録不要です。"
    },
    blocks: [
      {
        eyebrow: { en: "OUR PROMISE", ja: "私たちの約束" },
        heading: {
          en: "Free for every parent in Japan.",
          ja: "すべての日本の保護者に、無料で。"
        },
        body: {
          en: "Quality international education intelligence in Japan typically sits behind a school consultancy fee, an international school newsletter subscription, or a juku's premium briefing. WORLD STUDY TOKYO doesn't. Every morning, the world's leading education stories get translated into clear Japanese and posted here — free, bilingual, no signup required. The parent considering a Montessori preschool in Hiroo, the family preparing for 中学受験, the household weighing an international school against a 国内私立, the high school senior choosing between 海外大学 and 国内難関 — same access, same morning, same depth.",
          ja: "日本で質の高い国際的な教育情報を得ようとすると、学校コンサルティングの会員費、インターナショナルスクールの保護者ニュースレター、塾のプレミアム会員サービスなど、何かしらの有料の入口が必要になることが多いのが実情です。WORLD STUDY TOKYO はそうではありません。毎朝、世界の主要な教育ニュースを読みやすい日本語に翻訳して、ここに無料で並べます。バイリンガル、登録不要。広尾でモンテッソーリの幼児教室を検討しているご家庭、中学受験に向き合うご家庭、インターナショナルスクールと国内私立を比べているご家庭、海外大学と国内難関を進路に考えている高校生のご家庭 ── どなたも同じ朝、同じ情報、同じ深さでアクセスできます。"
        }
      },
      {
        eyebrow: { en: "OUR LENS", ja: "編集の視点" },
        heading: {
          en: "Tokyo, reading the world's classroom.",
          ja: "東京から、世界の教室を読む。"
        },
        body: {
          en: "Translation alone doesn't bridge the gap. The world's education research and reporting is written for US districts, UK universities, and OECD policymakers. WORLD STUDY TOKYO adds the Tokyo layer machine translation can't: how a US AP curriculum maps to 中学受験 the family is actually preparing for; what an Oxford admissions trend means for a Tokyo student considering 海外大学; whether a Finnish early-childhood finding actually translates to Japan's 保育園・幼稚園 system; which UK / US juku-equivalent reform debates already happened in Japan under a different name. The Tokyo Editor's Note at the end of each article does this work explicitly.",
          ja: "翻訳だけでは情報のギャップは埋まりません。海外の教育研究やニュースは、米国の学区、英国の大学、OECD の政策立案者向けに書かれています。WORLD STUDY TOKYO は、機械翻訳が届けない東京視点を加えます ── 米国の AP カリキュラムは、いま向き合っている中学受験の何と接続するのか。英国オックスフォードの入試動向は、海外大学を視野に入れる東京の生徒にとって何を意味するのか。フィンランドの幼児教育の知見は、日本の保育園・幼稚園の制度の中で本当に再現できるのか。英米の塾改革の議論は、すでに日本で別の名前で起きていないか。各記事の末尾に置く「東京編集部のノート」が、そうした地に足のついた読み解きを担います。"
        }
      },
      {
        eyebrow: { en: "OUR SPOTLIGHT", ja: "国内スポットライト" },
        heading: {
          en: "Tokyo schools and learning services — covered alongside.",
          ja: "日本の学校・学習サービスも、並べて紹介。"
        },
        body: {
          en: "The global feed is half the story. Japan has its own remarkable schools, juku, international schools, and edtech services — the kind of player a Tokyo family will actually weigh on a Saturday morning. WORLD STUDY TOKYO covers them in the same depth, on the same morning. If your school, juku, international institution, or learning service would like to be featured, please reach out via the Contact section below.",
          ja: "海外フィードは半分の話に過ぎません。日本にも、土曜の朝にご家族が実際に検討するような、ユニークな学校・塾・インターナショナルスクール・学習サービスが数多くあります。WORLD STUDY TOKYO は、それらを同じ深さで、同じ朝に、並べて紹介します。掲載をご希望の学校・塾・教育機関・学習サービスの方は、下の Contact セクションからお気軽にご連絡ください。"
        }
      }
    ]
  },

  /* ------------------------------------------------------- PARTNERS WANTED
     Repurposed from the ADVERTISE TOKYO Vanguard slot. Until real partners
     sign on, this surfaces an "open call" panel rather than featured names.
     The component reads `entries`; an empty array means the partners-wanted
     CTA renders instead of individual partner cards. */
  vanguard: {
    eyebrow: { en: "PARTNERS", ja: "パートナー募集" },
    headline: {
      en: "Partners Wanted — schools, juku, and learning services.",
      ja: "パートナー募集 ── 学校・塾・学習サービスの皆さま。"
    },
    lede: {
      en: "WORLD STUDY TOKYO is open to featuring schools, juku, international institutions, and learning services worth a Tokyo family's morning attention. Coverage is editorial — placement is decided by relevance to the readership, not by spend — but a Partner relationship gives the school or service a steady editorial home alongside the global feed. If your institution would like to be considered, please reach out via the Contact section.",
      ja: "WORLD STUDY TOKYO では、東京の子育て家庭が朝の時間を割いて読む価値のある、学校・塾・インターナショナルスクール・学習サービスの掲載パートナーを募集しています。掲載はあくまで編集部判断 ── 出稿金額ではなく読者にとっての関連性で決まりますが、パートナー関係を結んでいただくことで、海外フィードと並ぶ安定した編集枠を確保できます。掲載をご検討の機関の皆さまは、Contact セクションよりご連絡ください。"
    },
    /** Empty by design — surfaces the partners-wanted CTA panel.
     *  Once real partners sign on, append entries here:
     *  { id, name, url, tagline: {en, ja}, note: {en, ja}, tone }
     *  No code change needed; the renderer reads this array. */
    entries: [] as readonly {
      id: string;
      name: string;
      url: string;
      tagline: Bilingual<string>;
      note: Bilingual<string>;
      tone: string;
    }[]
  },

  /* ------------------------------------------------------------- CATEGORIES
     Education taxonomy — 5 keys. Tones lean warm (sky blue / soft pink /
     peach / lavender / mint) to support the white-background palette.
     ---------------------------------------------------------------------- */
  categories: [
    {
      key: "early-childhood",
      name: { en: "Early Childhood", ja: "幼児教育" },
      definitionForLlm:
        "education and care from birth through preschool age (0–6): early literacy and numeracy research, Montessori / Reggio Emilia / Steiner methods, language acquisition, screen-time and developmental research, preschool admissions, the international childcare conversation. The reader is a parent or caregiver of an infant or preschooler.",
      fallback: ["methods", "research"],
      coverPool: [
        { id: "1503676260728-1c00da094a0b", tone: "#FCDDE1" },
        { id: "1497486751825-1233686d5d80", tone: "#FAD4DA" },
        { id: "1485546246426-74dc88dec4d9", tone: "#FFE0E5" },
        { id: "1490818387583-1baba5e638af", tone: "#FCDCE0" },
        { id: "1488521787991-ed7bbaae773c", tone: "#FBD6DC" },
        { id: "1471107340929-a87cd0f5b5f3", tone: "#F8C9D3" },
        { id: "1500964757637-c85e8a162699", tone: "#FFE4E8" },
        { id: "1485727749690-d091e8284ef3", tone: "#FAD7DD" }
      ]
    },
    {
      key: "admissions",
      name: { en: "Admissions", ja: "受験トレンド" },
      definitionForLlm:
        "school-admissions and university-admissions trends globally and in Japan: 中学受験 (junior-high entrance exams), 高校受験 (high-school), 大学受験 (university), 共通テスト, 推薦・AO・総合型選抜, the international shift toward holistic / portfolio admissions, IB and AP pathways, overseas-university applications from Japan, Oxbridge / Ivy League / National University Singapore / ETH admissions reform, test-optional debates. The reader is a parent navigating an admissions pathway.",
      fallback: ["methods", "research"],
      coverPool: [
        { id: "1497633762265-9d179a990aa6", tone: "#BFDFF2" },
        { id: "1456513080510-7bf3a84b82f8", tone: "#B0D8EE" },
        { id: "1457369804613-52c61a468e7d", tone: "#C5E1F0" },
        { id: "1532012197267-da84d127e765", tone: "#A8D2EB" },
        { id: "1543269865-cbf427effbad", tone: "#BBDDF1" },
        { id: "1576267423048-15c0040fec78", tone: "#B6DAEE" },
        { id: "1542621334-a254cf47733d", tone: "#C0DEF0" },
        { id: "1521405924368-64c5b84bec60", tone: "#B2D6EC" }
      ]
    },
    {
      key: "methods",
      name: { en: "Learning Methods", ja: "勉強法" },
      definitionForLlm:
        "evidence-based learning methods and study trends: cognitive science applied to studying, retrieval practice, spaced repetition, motivation research, deep work / focus, the science of reading, math fluency, writing instruction, executive-function training, tutor methodologies, structural reform debates around homework and grading. The reader is a parent or learner looking for a method that actually moves outcomes.",
      fallback: ["research", "admissions"],
      coverPool: [
        { id: "1531403009284-440f080d1e12", tone: "#F4DCC4" },
        { id: "1517842645767-c639042777db", tone: "#F1D5BC" },
        { id: "1455390582262-044cdead277a", tone: "#F6E0CA" },
        { id: "1456324504439-367cee3b3c32", tone: "#F2D7BF" },
        { id: "1481627834876-b7833e8f5570", tone: "#EFD0B5" },
        { id: "1493612276216-ee3925520721", tone: "#F4DEC6" },
        { id: "1517431105194-aaf95f6f47f0", tone: "#F0D2B7" },
        { id: "1453738773917-9c3eff1db985", tone: "#F5DDC3" }
      ]
    },
    {
      key: "research",
      name: { en: "Research", ja: "教育論文" },
      definitionForLlm:
        "education research and academic findings: peer-reviewed papers and preprints (especially arXiv cs.CY where it touches education), longitudinal studies, OECD / PISA / TIMSS findings, working papers from Brookings, NBER, and university education schools, meta-analyses on effective teaching, the policy implications of recent research. The reader is curious and willing to read carefully but is NOT an education researcher.",
      fallback: ["methods", "ai-edu"],
      coverPool: [
        { id: "1532012197267-da84d127e765", tone: "#D9CFE5" },
        { id: "1481627834876-b7833e8f5570", tone: "#D5C9E2" },
        { id: "1457369804613-52c61a468e7d", tone: "#DCD2E7" },
        { id: "1456406644174-8ddd4cd52a06", tone: "#D2C5E0" },
        { id: "1503676260728-1c00da094a0b", tone: "#D6CDE2" },
        { id: "1455390582262-044cdead277a", tone: "#D9CFE5" },
        { id: "1488998427799-e3362cec87c3", tone: "#D3C7E1" },
        { id: "1542621334-a254cf47733d", tone: "#D8CDE3" }
      ]
    },
    {
      key: "ai-edu",
      name: { en: "AI & Learning", ja: "AI時代の教育" },
      definitionForLlm:
        "AI in education: ChatGPT / Claude / Gemini in the classroom, AI tutors, AI-graded writing, personalised learning platforms (Khan Academy, Duolingo, Atama+, すららネット, Classi), the cheating-and-assessment debate, AI literacy curriculum, the future-of-work argument for what students should learn, edtech funding and platform launches. The reader is a parent wondering what their child should know about AI and how AI is changing learning today.",
      fallback: ["methods", "research"],
      coverPool: [
        { id: "1485827404703-89b55fcc595e", tone: "#CDE3CF" },
        { id: "1517694712202-14dd9538aa97", tone: "#C8DFCB" },
        { id: "1555066931-4365d14bab8c", tone: "#D0E4D3" },
        { id: "1573164713619-24c711fe7878", tone: "#C4DDC6" },
        { id: "1551288049-bebda4e38f71", tone: "#CCE1CE" },
        { id: "1561089489-f13d5e730d72", tone: "#D2E4D5" },
        { id: "1593720213428-28a5b9e94613", tone: "#C9E0CC" },
        { id: "1551434678-e076c223a692", tone: "#CFE3D2" }
      ]
    }
  ] as const,

  /* ----------------------------------------------------------- LEGACY MAP
     Inherited keys + sister-title legacy. Populated to keep cross-template
     tests happy. */
  legacyCategoryMap: {
    creative: "methods",
    adtech: "ai-edu",
    brand: "admissions",
    media: "research",
    "space-tech": "research",
    artemis: "admissions",
    culture: "early-childhood"
  } as Record<string, string>,

  /* ----------------------------------------------------------------- PIPELINE
     Sources + voice + image-host allowlist. The cron-publisher reads this
     verbatim. Sources for WORLD STUDY TOKYO are the world's leading
     education feeds.
     ---------------------------------------------------------------------- */
  pipeline: {
    relevanceFilters: {
      education:
        /\b(educat\w*|school\w*|student\w*|teacher\w*|classroom|curriculum|learn\w*|literacy|numeracy|preschool|kindergarten|childcare|tutor\w*|juku|exam\w*|admiss\w*|college|universit\w*|undergrad\w*|graduate\w*|enrol\w*|pedag\w*|montessori|reggio|steiner|IB |AP |edtech|early[- ]childhood|child development)\b/i
    },

    sources: [
      {
        name: "Greater Good Magazine",
        url: "https://greatergood.berkeley.edu/article/feed",
        parse: "rss",
        category: "methods",
        framing:
          "(Greater Good Magazine — UC Berkeley's science-of-well-being publication; family / parenting / education / child-development research translated into practical guidance. The natural sweet spot for WORLD STUDY TOKYO — read every dispatch for what changes a Tokyo family's routine, not just what the study tested)"
      },
      {
        name: "Edutopia",
        url: "https://www.edutopia.org/rss.xml",
        parse: "rss",
        category: "methods",
        framing:
          "(Edutopia — George Lucas Educational Foundation; K-12 teaching trends with applicability to parents and home learning. Skip the US-classroom-only operational posts; surface the underlying learning idea a Tokyo parent can recognise across the international school / 国内私立 / 公立 landscape)"
      },
      {
        name: "The Conversation — Family",
        url: "https://theconversation.com/topics/family-7/articles.atom",
        parse: "atom",
        category: "early-childhood",
        framing:
          "(The Conversation Family topic — academic experts writing for general parents. Globally framed parenting research and early-childhood findings; ideal for the 'trend a parent in any city would care about' lane)"
      },
      {
        name: "The Conversation — Education",
        url: "https://theconversation.com/topics/education-71/articles.atom",
        parse: "atom",
        category: "methods",
        framing:
          "(The Conversation Education topic — global education research and trend writing by academics. Choose the pieces with applicability beyond their local context — study habits, learning techniques, admissions trend writing — not the country-specific policy briefs)"
      },
      {
        name: "Psyche",
        url: "https://psyche.co/feed",
        parse: "rss",
        category: "early-childhood",
        filter:
          /\b(child|childhood|kid|parent\w*|famil\w*|baby|infant|toddler|teen\w*|adolescen\w*|school|student|learn\w*|educat\w*|develop\w*|literacy|reading|play|sleep|mind|brain|cognit\w*|emotion\w*|attachment)\b/i,
        framing:
          "(Psyche — Aeon's essays on the human mind; filter to family / parenting / learning / development pieces. When relevant, the writing is psychology-grounded and beautifully argued — gold for the 'Tokyo Editor's Note' framing)"
      },
      {
        name: "The Hechinger Report",
        url: "https://hechingerreport.org/feed/",
        parse: "rss",
        category: "methods",
        filter:
          /\b(parent\w*|famil\w*|child|kid|early[- ]childhood|preschool|kindergarten|home[- ]learning|study habit\w*|tutor\w*|read\w*|literacy|numeracy|math fluency|sleep|screen[- ]time|teen\w*|adolescen\w*|colleg\w* admission|college access|test-optional|sat\b|act\b)\b/i,
        framing:
          "(The Hechinger Report — US education newsroom; FILTERED to parent / family / study-habit / admissions-trend pieces only. The unfiltered feed is heavy with US-specific policy and district politics that don't translate; the filter keeps the genuinely portable parenting / learning trend stories)"
      },
      {
        name: "MIT Technology Review",
        url: "https://www.technologyreview.com/feed/",
        parse: "rss",
        category: "ai-edu",
        filter:
          /\b(educat\w*|school|student|teacher|classroom|curriculum|learn\w*|literacy|tutor\w*|college|universit\w*|edtech|AI tutor|kids|children|child|family|parent|early[- ]childhood)\b/i,
        framing:
          "(MIT Tech Review — broad tech publication; filtered to education / learning / family-applicable AI stories. When AI tutors, edtech platforms, or cognitive-science pieces apply to home learning, the depth is excellent)"
      },
      {
        name: "arXiv cs.CY",
        url:
          "https://export.arxiv.org/api/query?search_query=cat:cs.CY+AND+(abs:tutor+OR+abs:%22early+childhood%22+OR+abs:%22language+acquisition%22+OR+abs:%22reading+development%22+OR+abs:%22study+habit%22+OR+abs:%22AI+tutor%22)" +
          "&sortBy=submittedDate&sortOrder=descending&max_results=20",
        parse: "atom",
        category: "research",
        framing:
          "(arXiv Computers and Society — preprints. Narrowly filtered to tutor / early-childhood / language acquisition / reading development / study-habit / AI-tutor papers — the slice with practical implication for a learner or a family, not the broader AI-policy abstractions)"
      }
    ] as SourceDef[],

    /** Image hosts the deployed `next/image` is allowed to render. Mirror in
     *  next.config.ts → images.remotePatterns. */
    allowedImageHosts: [
      // --- Unsplash (fallback covers) ---
      "images.unsplash.com",
      "source.unsplash.com",

      // --- Greater Good Magazine (UC Berkeley) ---
      "greatergood.berkeley.edu",
      "**.berkeley.edu",

      // --- Edutopia ---
      "edutopia.org",
      "**.edutopia.org",

      // --- The Conversation ---
      "theconversation.com",
      "**.theconversation.com",
      "images.theconversation.com",

      // --- Psyche / Aeon ---
      "psyche.co",
      "**.psyche.co",
      "**.aeon.co",

      // --- Hechinger Report (WordPress) ---
      "hechingerreport.org",
      "**.hechingerreport.org",

      // --- MIT Technology Review ---
      "**.technologyreview.com",
      "wp.technologyreview.com",

      // --- arXiv ---
      "**.arxiv.org",

      // --- WordPress-VIP CDN (used by many education publishers) ---
      "**.wp.com",
      "**.wordpress.com",
      "**.wpengine.com",

      // --- Common publisher CDNs ---
      "**.medium.com",
      "miro.medium.com",
      "**.substackcdn.com",
      "substackcdn.com",
      "**.substack.com",
      "**.ghost.io",
      "**.ghostcdn.io",
      "**.cdn.ghost.io",
      "**.netlify.app",
      "**.vercel.app",
      "**.vercel-storage.com",

      // --- Generic CDN providers ---
      "**.cloudfront.net",
      "**.akamaized.net",
      "**.akamaihd.net",
      "**.fastly.net",
      "**.cdninstagram.com",
      "**.fbcdn.net",
      "**.twimg.com",
      "**.gstatic.com",
      "googleusercontent.com",
      "**.googleusercontent.com",
      "**.cloudinary.com",
      "res.cloudinary.com",
      "**.amazonaws.com",
      "s3.amazonaws.com"
    ],

    /* -------- VOICE -------- */
    voice: {
      premise:
        "WORLD STUDY TOKYO, an independent bilingual (English / Japanese) education media that bridges the global education news cycle and the lived reality of Tokyo families — translating the global conversation into Japanese and adding the lens of a Tokyo editorial desk grounded in Japan's juku, international school, and university admissions landscape.",
      toneOfVoice:
        "Warm, plain, and intelligent — the register of a thoughtful senior editor at a top Japanese parenting and education publication, writing for Tokyo parents who care about their child's learning but are not education researchers themselves. Treat the reader as informed and curious; never talk down. Never pad with empty praise.\n- No exclamation marks. No 'revolutionary' / 'groundbreaking' / 'transformative' verbs.\n- Short declarative sentences, with the occasional longer reflective line for warmth. Earn the line; don't perform it.\n- Specialist terminology (cognitive load, retrieval practice, holistic admissions, formative assessment, executive function, IB / AP, total-selection / 総合型選抜) must be glossed in plain language the first time it appears. The reader is curious but does not have an EdD.\n- Prefer warm, emotionally resonant phrasing over dry recitation of facts. Numbers matter, but a paragraph that lists three numbers in a row without explaining what they FEEL like in a household has missed the mark.\n- It is acceptable — encouraged — to say 'this finding is interesting but unlikely to change how Japan's MEXT designs 共通テスト', 'this AI tutor is a thin wrapper around ChatGPT', 'the Finnish early-childhood result probably doesn't translate to Tokyo's 保育園 system', when it is true.\n- NO gender-coded language about the reader. Never write 'this is easy enough for mothers to understand'. The reader is a Tokyo parent — that is the only descriptor required.\n- Cliché block-list (EN): 'unlock your child's potential', 'every child can shine', 'the future of learning', 'reimagine education', 'paradigm shift', 'cutting-edge', 'next-generation', 'AI-powered', 'leveraging'.\n- Cliché block-list (JA): 「お子さまの可能性を引き出す」「これからの教育」「教育の未来」「次世代の学び」「革新的」「DX で変わる学び」「グローバル人材」「探究」を中身がないまま連呼する 等.",
      framingQuestion:
        '"What does this global trend in parenting, child development, or learning mean for a Tokyo family today — read against the juku, international school, and university admissions reality they live in?"',
      framingExpansion:
        "WORLD STUDY TOKYO is a CONSUMER PARENTING & LEARNING TREND publication, NOT an education policy journal. The reader is a parent in Tokyo who has 5 minutes over coffee, not an EdD researcher and not a MEXT bureaucrat. The story is interesting only if it answers, in plain language, the question 'should this change something about how I parent or how my child learns?'.\n\nPRIORITISE topics that resonate with parents anywhere in the world:\n  - Parenting trend shifts (sleep, screen time, play, social-emotional learning, after-school activities)\n  - Child-development science with practical takeaways (language acquisition, reading, executive function, emotional regulation)\n  - Study-habit / learning techniques that actually move outcomes (retrieval practice, spaced repetition, deep work for teens)\n  - Family routine / well-being research (mealtimes, gratitude, sibling dynamics, parental burnout)\n  - International edtech trends and AI tools families are using at home\n  - Admissions-trend writing relevant to families considering overseas universities or international schools\n  - Adolescence research (mental health, social media, friendships)\n\nDE-PRIORITISE — REFUSE if the piece is ONLY about one of these:\n  - US local school-district politics, board meetings, faculty senate dramas\n  - US-specific legislation, state-level curriculum fights, regional union disputes\n  - Single-country higher-ed governance debates that don't generalise\n  - Pure academic abstractions without practical takeaway\n  - Op-eds on US partisan culture-war topics\n  - Stories where the entire premise is 'how a US state did X' without a globally interesting underlying finding\n\nSpecific Tokyo readers to keep in mind: a parent of a 3-year-old comparing Montessori and academic preschools, a parent of a 9-year-old preparing for 中学受験, a parent weighing an international school against a 国内私立, a parent of a high-schooler considering 海外大学 vs 国内難関. If the story can't be told in a way that any of those families find genuinely useful, DON'T tell it.\n\nWhen in doubt: refuse off-topic via the RELEVANCE GATE rather than stretch a US-policy piece into a 'family trend'.",
      compositionRules:
        "ABSOLUTE REQUIREMENT — The body must be FULLY READABLE WITHOUT CLICKING THE SOURCE. A Tokyo parent who never visits the source link should finish the article understanding (a) WHAT was found / announced, (b) WHO did the work (researcher, institution, country), (c) WHEN, (d) WHY it matters for a learner, (e) HOW the finding actually works — the mechanism, the method, the data, (f) the open questions that remain. The source link exists for verification, never to fill in basic gaps the article leaves open.\n\n- Length: 5–8 substantial paragraphs in each language. Target ~450–650 words in English, ~900–1300 full-width characters in Japanese. Short paragraphs (2–3 sentences) are fine for rhythm.\n\n- STRUCTURE (recommended, not rigid):\n  · Paragraph 1: State WHAT happened in one clear sentence, name WHO did the work, and WHEN. Do not paraphrase the headline — get into substance.\n  · Paragraph 2: WHY this matters for a learner or a family. Name the mechanism, the study design, the population studied. Cite concrete numbers (sample size, effect size, country, age range) when they appear in the source.\n  · Middle paragraphs: HOW it works in practice. The classroom routine, the home practice, the curriculum change, the admissions criterion. Name specific tools, methods, institutions when the source does.\n  · Optional '## subheading' line for navigation.\n  · Optional '> pull-quote' line drawn from the source dispatch.\n  · A WHAT'S NEXT paragraph: open questions, what to watch, the policy or institutional moves that would amplify or undercut the finding.\n\n- TERMINOLOGY: Every specialist term gets a parenthetical gloss the first time it appears. Examples: 'retrieval practice (定期的に思い出す学習法 — テストではなく、学んだ内容を時間を置いて自分で取り出す練習)'; 'holistic admissions (学力試験の点数だけでなく、課外活動・推薦書・面接・エッセイなど人物全体で評価する入試方式)'; '共通テスト (大学入学共通テスト — 大学入試センター試験の後継として 2021 年から始まった大学入試の共通試験)'.\n\n- TONE: Information density matters, but warmth matters too. A paragraph that lists three statistics without naming the felt implication for a household has failed. Pair facts with their lived meaning.\n\n- Do NOT fabricate sample sizes, effect numbers, researcher names, institution names, dates, or study outcomes. If a fact is not in the source, omit it. Better quiet than wrong.\n- Do NOT repeat the article title verbatim as the first body paragraph.\n- PRESERVE EMBEDDED MEDIA — When the source article references specific external resources (the underlying study PDF, an institution's official page, a YouTube explainer, an OECD report, a Brookings working paper), INCLUDE THOSE URLs INLINE in the body using markdown link syntax: [descriptive label](URL). Do NOT invent URLs — only include links that actually appear in the source dispatch.\n\n- The 4 STRUCTURED FIELDS (tagline / whoForWhat / vsJapanContext / tokyoNote) and the long-form TOKYO NOTE block are emitted IN ADDITION to a fully-fleshed body — they are value layered on top of a complete, self-sufficient article, NEVER a replacement for it.",
      japaneseRules:
        "ABSOLUTE REQUIREMENT — 日本語版は独立した記事として成立しなければなりません。英語の原文を一切参照しなくても、東京の保護者が「何が起きたか／誰が研究したか／いつか／どこが意義深いか／家庭の学びに何が変わりうるか／次に何を見るべきか」を全て理解できる状態で書きます。原文へのリンクは検証用です。\n\n- 単なる英語の翻訳ではなく、日本の教育文脈を理解する読者向けに書き直した PARALLEL ARTICLE です。語彙、文章のリズム、見出しは、日本の保護者向けメディアの編集者が自分で書いたものとして自然であること。\n\n- 文量：本文は 5〜8 段落、合計でおおむね 900〜1300 文字。短い段落（2〜3 文）でリズムを作るのは可ですが、1 記事あたりの情報密度と温度の両方を保ちます。\n\n- 文体：です・ます調を基本とし、温かく、ていねいに語りかける書き方。専門的な内容も、平易な日本語で正確に伝えます。書き手は読者を子育てに真剣に向き合う知的な大人として尊重し、上から目線にならない。\n\n- 専門用語の取扱い：教育研究の専門用語（retrieval practice、formative assessment、executive function、holistic admissions、test-optional、IB、AP、共通テスト、総合型選抜、推薦入試、AO 入試、認定こども園 など）は初出で必ず簡潔な注釈を添えます。\n  例：「retrieval practice（リトリーバル・プラクティス ── 学んだ内容を時間を置いて自分の頭から取り出す練習法。テストとは違い、学習自体の手段として使う）」\n  例：「holistic admissions（ホリスティック入試 ── 学力試験の点数だけでなく、課外活動・推薦書・面接・エッセイなどで人物全体を評価する入試方式）」\n  例：「総合型選抜（旧 AO 入試。学力試験よりも、書類や面接、小論文などで受験生の総合的な姿勢を評価する大学入試の方式）」\n\n- 情緒のある温かい表現を、ファクトと並べて使う：数字だけを並べた段落は不十分です。たとえば「対象児童 500 名」と書いたあと、その規模が家庭での実感としてどういう意味を持つのかも添える。\n\n- 日本の固有名詞は標準的な表記：文部科学省（文科省）、中央教育審議会、SAPIX、四谷大塚、日能研、早稲田アカデミー、Z会、河合塾、駿台、ベネッセ、公文、学研、東京大学（東大）、京都大学（京大）、慶應義塾、早稲田、ICU、ASIJ、British School Tokyo、Aoba-Japan、N高、KADOKAWA Dwango、すららネット、Atama+、Classi、ベネッセ教育総合研究所 等。\n\n- 海外固有名詞は、必要に応じて簡潔な補足を：「IB（International Baccalaureate ── 世界共通の大学進学準備プログラム）」「OECD（経済協力開発機構 ── PISA という国際的な学力調査を実施する組織）」「PISA（OECD が 3 年ごとに実施する 15 歳対象の国際学力調査）」.\n\n- 記号：引用句は「」、編集者のアサイドは — (em-dash)。\n\n- ジェンダー表現を含む書き方を避ける：「ママでも分かるように」「お母さんなら〜」のような言い回しは使わない。読者は『東京の保護者』であり、性別を限定する記述は不要です。\n\n- 禁句リスト：「お子さまの可能性を引き出す」「これからの教育」「教育の未来」「次世代の学び」「革新的」「DX で変わる学び」「グローバル人材」「探究」を内容のないまま使う 等。\n\n- 見出し（## subheading）と pull-quote は宣言的に。「何が研究で示されたか」「どこが新しいのか」「日本の家庭にとっての意味」「次に注目すべき動き」など、読者に内容を即座に伝える短い切り口で。",

      /* -------- STRUCTURED FIELDS (4) -------- */
      structuredFields: [
        {
          key: "tagline",
          label: { en: "Tagline", ja: "タグライン" },
          type: "line",
          charLimit: { en: 60, ja: 30 },
          display: { role: "headline", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE short punchy line that captures what the story actually is. Not what the study's press release says — what a thoughtful Tokyo parent would tell a friend in one breath. Japanese must be ≤30 full-width characters. English must be ≤60 characters. No exclamation marks. No 'AI-powered', no 'revolutionary'. If the honest tagline is 'a small study with a big headline', say that."
        },
        {
          key: "whoForWhat",
          label: { en: "Who & For What", ja: "どの家庭に効くか" },
          type: "paragraph",
          charLimit: { en: 220, ja: 110 },
          display: { role: "body", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE sentence (or at most two) naming the exact Tokyo family situation and the exact decision this story informs. The audience is Tokyo parents at different stages — parents of 3-year-olds in early-childhood, parents of 9-year-olds in 中学受験 mode, parents weighing international schools, parents of high-schoolers considering 海外大学. Bad: 'for parents who care about education'. Good: 'for a Tokyo family with a 4-year-old comparing Hiroo and Setagaya preschools and weighing Montessori against a more academic kindergarten'. Be concrete about the child's age and the decision the family is making this season."
        },
        {
          key: "vsJapanContext",
          label: { en: "vs. Japan Context", ja: "日本の現状との接続" },
          type: "paragraph",
          charLimit: { en: 240, ja: 120 },
          display: { role: "body", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE sentence naming the SPECIFIC Japanese institution, programme, or convention this connects to (文部科学省 policy, 中央教育審議会 debate, 共通テスト, 中学受験 SAPIX / 四谷大塚 curriculum, 総合型選抜 reform, IB/A-Level schools in Japan, the インターナショナルスクール landscape, 公文 / 学研 / Z会 method debates) and stating concretely how it lines up or diverges. If the honest answer is 'this is a US-specific reform with no Japanese parallel yet', say that explicitly. Name the Japanese counterpart; do not say 'other schools'."
        },
        {
          key: "tokyoNote",
          label: { en: "Tokyo Note", ja: "東京編集部の一言" },
          type: "paragraph",
          charLimit: { en: 260, ja: 130 },
          display: { role: "verdict", onCard: true, onDetail: true },
          descriptionForLlm:
            "The signed Tokyo editor-desk note in 1–2 sentences. Address what a Tokyo parent needs to know that the English coverage typically omits. Cover at least one of: (a) does the Japan education environment actually support this (does MEXT curriculum allow it; do major juku already do it under a different name; is it permitted in 学校教育法 framework); (b) does the cultural / structural assumption translate (does the Finnish or US household routine map to a Japanese commuting family); (c) does the cost / accessibility make sense at JPY family-budget rates; (d) is there a domestic institution (SAPIX, 四谷大塚, 日能研, 早稲アカ, Z会, 河合塾, ICU, 慶應 SFC, N 高, Atama+, すららネット, Classi) that already addresses this. Warm, useful, never diplomatic — if the answer is 'interesting research, wait for the Japan adaptation', say that."
        }
      ] as StructuredFieldDef[],

      /** Closing "Tokyo Editor's Note" block — the magazine's signature
       *  commentary. The 4-question structure mirrors what AITECH / ARTEMIS
       *  use, with question framing adapted for an education readership. */
      closingBlock: {
        title: { en: "The Tokyo Editor's Note", ja: "東京編集部のノート" },
        subheading: {
          en: "What this could mean for a Tokyo family in the years ahead.",
          ja: "このニュースが、東京で子育てをするご家庭にどう関わってくるか。"
        },
        outputKey: "tokyo_take",
        rules:
          "This block is the magazine's plain-language editorial commentary on the story — written for Tokyo parents who care about how their child learns, in a register a thoughtful senior editor at a top parenting publication would use.\n\nNO specialist jargon without a plain-Japanese gloss. Avoid 'paradigm shift', 'transformative', 'unleash potential', 'cutting-edge', 'next-generation', 'グローバル人材' as empty signifier. Address the reader directly. In Japanese use です・ます (warm explainer register). In English use plain, direct second person.\n\nABSOLUTE RULE — speak to Tokyo parents in the ABSTRACT only.\n  - DO write: 「東京で子育てをするご家庭にとって」「Tokyo families」「東京で子どもの学びに向き合うご家庭にとって」.\n  - DO NOT write: gendered constructions targeting mothers or fathers, specific neighbourhoods tied to wealth assumptions, specific occupations tied to demographic personas. Forbidden: 「ママでも分かるように」「お母さんなら」「お父さんなら」「広尾のセレブママ」「世田谷の専業主婦」「丸の内のキャリアウーマン」 or any analogous construction. These read as stereotyping. The Tokyo parent is one parent, treated as one parent.\n\nIT IS A GIVEN that most education research and reform from abroad does not immediately change everyday life for Tokyo families. Do NOT spend a paragraph saying so. The block's job is to look forward: what plausible future impact for Tokyo families, on what timeframe, with what gating factor.\n\nThe block MUST answer these FOUR questions in order, in 4–6 paragraphs per language, each question taking roughly one paragraph:\n\n(1) WHAT HAPPENED, IN PLAIN WORDS — Re-explain the news for a Tokyo parent who does NOT have a background in education research. Use everyday analogies (a study group that meets once a week vs. one that crams once a month; the way a child remembers a song they hear at bedtime vs. one they hear once in a music class). This is a TRANSLATION of the news into the language of family life, not a summary.\n\n(2) WHAT PLAUSIBLE FUTURE IMPACT FOR TOKYO FAMILIES — Look ahead, not at today. Name 1–3 concrete DOMAINS where Tokyo families might feel this — 中学受験 exam content design, 共通テスト or 総合型選抜 evaluation, the choice between an インターナショナルスクール and a 国内私立, the daily homework load, the way the family budget for 塾 is allocated, the age at which children start formal learning, the role of AI tutors at home, the way 海外大学 admissions read a Japanese transcript. Name the situation or decision — never a stereotyped persona.\n\n(3) ON WHAT TIMEFRAME — Give an honest interval with a gating factor. Examples: 'within 1–2 years, once a major juku like SAPIX or 四谷大塚 adopts the practice into its curriculum'; '3–5 years, gated by a MEXT decision on whether to incorporate it into the 学習指導要領 revision cycle'; '5–10 years, after a national longitudinal study confirms the finding in Japanese classrooms'; 'already today — some IB schools in Tokyo already do this'. Don't hedge into vagueness. Name the specific bottleneck (MEXT policy revision / major juku adoption / private-school market response / a domestic replication study) when you can.\n\n(4) JAPANESE COUNTERPART — Name a SPECIFIC Japanese institution, programme, or service already moving in a comparable direction. Choose accurately from: SAPIX, 四谷大塚, 日能研, 早稲田アカデミー, Z会, 河合塾, 駿台, 公文式, 学研, ベネッセ進研ゼミ, ベネッセ教育総合研究所, KUMON, 慶應幼稚舎, 慶應 SFC, 東京学芸大学附属, 筑波大学附属, ICU, 早稲田大学, 慶應義塾大学, 東京大学, ASIJ, British School in Tokyo, Aoba-Japan International School, K. International School Tokyo, West Tokyo International School, N 高等学校・S 高等学校, KADOKAWA Dwango, Atama+, すららネット, Classi, 東大 i.school, 京大 ELP, 東京都教育委員会, 文部科学省, 中央教育審議会 — or a clearly relevant alternative. Do NOT force a name; if no Japanese counterpart exists yet, say so plainly and name the closest adjacent player and what gap remains.\n\nTone: warm, concrete, useful, forward-looking. Speak to Tokyo parents in general — never to a named persona. NO empty patriotism. NO defeatism. NO 'in conclusion' / 'in summary' wrap-up sentences — end on a concrete observation, not a tidy closing.\n\nBoth languages must contain a Japan-grounded comparison. The Japanese version is the primary one (this is Tokyo's own magazine); the English version is its parallel for foreign readers — write each natively, not as a translation of the other."
      }
    }
  },

  /* --------------------------------------------------------- MONETIZATION
     Same shape as sister titles. Disclosure copy localised to WORLD STUDY
     TOKYO and the education context (potential Amazon book referrals plus
     juku / school partner relationships). */
  monetization: {
    affiliate: {
      enabled: true,
      networks: ["amazon", "partner", "asp"] as readonly AffiliateNetwork[],
      networkLabels: {
        amazon: { en: "Amazon", ja: "Amazon" },
        partner: { en: "Partner", ja: "提携機関" },
        asp: { en: "PR", ja: "PR" },
        other: { en: "Sponsored", ja: "PR" }
      } as Record<AffiliateNetwork, Bilingual<string>>,
      defaultLabel: { en: "Visit site", ja: "公式サイトへ" },
      disclosureShort: {
        en: "Some links on WORLD STUDY TOKYO are affiliate links. We may earn a commission when you sign up, at no extra cost to you.",
        ja: "WORLD STUDY TOKYO の一部リンクはアフィリエイト・リンクを含みます。リンク経由でのご利用により当サイトが報酬を受け取る場合がありますが、ご利用料金は変わりません。"
      },
      disclosureLong: {
        en: "WORLD STUDY TOKYO participates in the Amazon Associates Program (primarily for education-related book referrals), partner relationships with schools, juku, and learning services, and Japanese affiliate networks (ASPs). When a story or directory entry includes a button marked PR / Partner / Amazon, the link is an affiliate link: clicking through and signing up may earn WORLD STUDY TOKYO a commission, at no additional cost to you. Affiliate or partner relationships do not determine editorial coverage, do not change the four structured fields a story is evaluated on (tagline / who & for what / vs. Japan context / Tokyo Note), and do not soften the Tokyo Editor's Note when the honest answer is 'interesting research, wait for the Japan adaptation'.",
        ja: "WORLD STUDY TOKYO は、Amazon アソシエイト・プログラム（主に教育関連書籍の紹介）、学校・塾・学習サービスとのパートナーシップ、および国内アフィリエイト・サービス・プロバイダー（ASP）に参加しています。記事内またはディレクトリエントリーに「PR」「提携機関」「Amazon」と表示されたボタンが含まれる場合、当該リンクはアフィリエイト・リンクです。リンク経由でご登録／ご購入いただくと当サイトが報酬を受け取ることがありますが、ユーザーの支払金額は変わりません。アフィリエイト関係およびパートナーシップは編集方針に影響を与えず、各記事を評価する 4 つの構造化フィールド（タグライン／どの家庭に効くか／日本の現状との接続／東京編集部の一言）の判断、および「興味深い研究だが日本での適用は待ったほうがよい」と書くべき場面での率直さを変えるものではありません。"
      }
    },
    sponsors: [] as readonly {
      id: string;
      title: Bilingual<string>;
      blurb: Bilingual<string>;
      href: string;
      sponsoredBy: Bilingual<string>;
      validUntil: string;
    }[],
    ads: {
      provider: "adsense" as const,
      client: "",
      slots: {
        feedTop: "",
        feedMid: "",
        articleInline: ""
      }
    }
  },

  /* ---------------------------------------------------------------- CRON
     UTC schedule consumed by .github/workflows/daily-publish.yml.
     05:00 JST = 20:00 UTC previous day — sits between ADVERTISE (04:30 JST)
     and ARTEMIS (06:00 JST), with a 17-minute offset to avoid GitHub
     Actions hourly-band deprioritization. */
  cron: {
    utc: "17 20 * * *",
    localLabel: "05:00 JST"
  }
} as const;

/* ---------------------------------------------------------------------------
   Type derivations & helpers — identical surface to sister titles so the
   rest of the codebase reads from `siteConfig.*` without any change.
   ------------------------------------------------------------------------- */
export type SiteConfig = typeof siteConfig;
export type CategoryKey = (typeof siteConfig.categories)[number]["key"];

export const CATEGORY_ORDER: CategoryKey[] = siteConfig.categories.map(
  (c) => c.key
) as CategoryKey[];

export const getCategoryDef = (key: string): CategoryDef | undefined =>
  siteConfig.categories.find((c) => c.key === key) as CategoryDef | undefined;

export const normalizeCategory = (v: unknown): CategoryKey => {
  if (typeof v !== "string") return CATEGORY_ORDER[0];
  if ((CATEGORY_ORDER as readonly string[]).includes(v)) return v as CategoryKey;
  const mapped = siteConfig.legacyCategoryMap[v];
  if (mapped && (CATEGORY_ORDER as readonly string[]).includes(mapped)) {
    return mapped as CategoryKey;
  }
  return CATEGORY_ORDER[0];
};

export const categoryNames: Record<CategoryKey, Bilingual> = Object.fromEntries(
  siteConfig.categories.map((c) => [c.key, c.name])
) as Record<CategoryKey, Bilingual>;

export const coverUrl = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2200&q=80`;

export const getLayoutMode = (): "magazine" | "directory" => {
  return (siteConfig.layout as { mode?: "magazine" | "directory" }).mode ?? "magazine";
};

type SiteConfigWithStructuredFields = {
  pipeline: SiteConfig["pipeline"] & {
    voice: SiteConfig["pipeline"]["voice"] & {
      structuredFields?: readonly StructuredFieldDef[];
    };
  };
};

export const STRUCTURED_FIELDS: readonly StructuredFieldDef[] =
  (siteConfig as unknown as SiteConfigWithStructuredFields).pipeline.voice
    .structuredFields ?? [];

export const HAS_STRUCTURED_FIELDS: boolean = STRUCTURED_FIELDS.length > 0;

/* ---------------------------------------------------------------------------
   Affiliate helpers — same shape as sister titles.
   ------------------------------------------------------------------------- */
export const AFFILIATE_ENABLED: boolean = Boolean(
  siteConfig.monetization?.affiliate?.enabled
);

export const AFFILIATE_NETWORKS: readonly AffiliateNetwork[] =
  siteConfig.monetization?.affiliate?.networks ?? [];

export const getAffiliateNetworkLabel = (
  network: AffiliateNetwork
): Bilingual<string> => {
  const labels = siteConfig.monetization?.affiliate?.networkLabels;
  return labels?.[network] ?? { en: "Sponsored", ja: "PR" };
};

export const getAffiliateDefaultLabel = (): Bilingual<string> => {
  return (
    siteConfig.monetization?.affiliate?.defaultLabel ?? {
      en: "Visit site",
      ja: "公式サイトへ"
    }
  );
};

export const getAffiliateDisclosureShort = (): Bilingual<string> => {
  return (
    siteConfig.monetization?.affiliate?.disclosureShort ?? {
      en: "",
      ja: ""
    }
  );
};

export const getAffiliateDisclosureLong = (): Bilingual<string> => {
  return (
    siteConfig.monetization?.affiliate?.disclosureLong ?? {
      en: "",
      ja: ""
    }
  );
};

export const isAffiliateNetworkActive = (
  network: AffiliateNetwork
): boolean => {
  return AFFILIATE_NETWORKS.includes(network);
};
