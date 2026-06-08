"use client";

import { Container } from "@/components/GridSystem";
import { PageAura } from "@/components/PageAura";
import { useLanguage } from "@/context/LanguageContext";
import Newsletter from "@/components/Newsletter";
import {
  AFFILIATE_ENABLED,
  getAffiliateDisclosureLong,
  siteConfig
} from "@/site.config";

export default function AboutPage() {
  const { lang, dict } = useLanguage();
  const about = siteConfig.about;
  const disclosureLong = AFFILIATE_ENABLED
    ? getAffiliateDisclosureLong()[lang]
    : "";

  return (
    <>
      {/* Per-page aura — Neon Green × Cyan, "autonomous agents" mood */}
      <PageAura tone="green" />

      <Container className="pt-12 lg:pt-16 pb-12">
        <p className="eyebrow text-neon-acid">{dict.nav.about}</p>
        <h1 className="mt-6 font-sans font-semibold text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.022em] max-w-5xl text-ink">
          {about.headline[lang]}
        </h1>
        <p className="mt-8 max-w-[68ch] text-lg text-ink-700 leading-relaxed">
          {about.lede[lang]}
        </p>
        <div className="silver-rule mt-12" />
      </Container>

      <Container className="pb-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16">
          {about.blocks.map((block, i) => (
            <article
              key={i}
              className="lg:col-span-12 glass p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4"
            >
              <div className="lg:col-span-3">
                <p className="eyebrow text-neon-acid">{block.eyebrow[lang]}</p>
              </div>
              <div className="lg:col-span-9">
                <h2 className="font-sans font-semibold text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.012em] text-ink max-w-3xl">
                  {block.heading[lang]}
                </h2>
                <p className="mt-6 max-w-[68ch] text-base text-ink-700 leading-relaxed">
                  {block.body[lang]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Contact section — anchored at #contact so brand.cta.href
          (/about#contact) lands here. The mailto address is a placeholder
          until the worldstudytokyo.com domain is registered. */}
      <Container className="pb-section">
        <article
          id="contact"
          className="glass p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4 scroll-mt-32"
        >
          <div className="lg:col-span-3">
            <p className="eyebrow">
              {lang === "ja" ? "CONTACT" : "CONTACT"}
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2
              className="font-display font-semibold leading-[1.15] tracking-[-0.008em] max-w-3xl"
              style={{
                color: "var(--color-ink-900)",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
              }}
            >
              {lang === "ja"
                ? "貴校・貴塾・貴サービスの情報も、同じ朝に。"
                : "Get your school, juku, or service into the feed."}
            </h2>
            <p
              className="mt-6 max-w-[68ch] text-base leading-relaxed"
              style={{ color: "var(--color-ink-700)" }}
            >
              {lang === "ja"
                ? "新クラスの開講、新カリキュラムの導入、入試方式の変更、AI 学習機能の追加、ご家庭向けセミナーのご案内 — 東京の保護者が知っておきたい内容であれば、編集部までご連絡ください。海外フィードと同じ深さで、同じ朝に紹介します。掲載は編集判断のもとで行います。"
                : "Launched a new programme, introduced a new curriculum, changed your admissions format, added an AI tutor, or planning a parents' seminar? If a Tokyo family should know about it, please get in touch with the editorial desk. We'll cover it with the same depth and on the same morning as the global feed. Coverage is editorially judged."}
            </p>
            <a
              href="mailto:editorial@worldstudytokyo.com?subject=WORLD%20STUDY%20TOKYO%20%E3%81%AB%E6%8E%B2%E8%BC%89%E3%81%AE%E3%81%94%E7%9B%B8%E8%AB%87"
              className="btn-neon mt-8 inline-flex"
            >
              {lang === "ja" ? "編集部にメールする" : "Email the editorial desk"}
            </a>
            <p
              className="mt-5 font-mono text-[0.75rem] tracking-[0.16em] uppercase"
              style={{ color: "var(--color-ink-500)" }}
            >
              editorial@worldstudytokyo.com
            </p>
            <p
              className="mt-3 max-w-[60ch] text-xs leading-relaxed"
              style={{ color: "var(--color-ink-500)" }}
            >
              {lang === "ja"
                ? "毎週金曜のニュースレターでも、学校・塾・教育サービスのスポットライト枠を設けています。下のニュースレターからご購読いただくか、上記メールで直接ご相談ください。"
                : "We also reserve a partner-spotlight slot in Friday's newsletter. Subscribe below, or reach out directly using the email above."}
            </p>
          </div>
        </article>
      </Container>

      {/* Affiliate disclosure block — anchored at #affiliate so the
          Footer's "Learn more" link lands here. Renders nothing when the
          monetization layer is disabled site-wide. */}
      {disclosureLong ? (
        <Container className="pb-section">
          <article
            id="affiliate"
            className="glass p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4 scroll-mt-32"
          >
            <div className="lg:col-span-3">
              <p className="eyebrow text-neon-acid">
                {lang === "ja" ? "アフィリエイト開示" : "Affiliate Disclosure"}
              </p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-sans font-semibold text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.012em] text-ink max-w-3xl">
                {lang === "ja"
                  ? "PR と編集判断は別の引き出しに置く。"
                  : "Commercial links live in a separate drawer from editorial judgement."}
              </h2>
              <p className="mt-6 max-w-[68ch] text-base text-ink-700 leading-relaxed">
                {disclosureLong}
              </p>
            </div>
          </article>
        </Container>
      ) : null}

      <Container>
        <Newsletter />
      </Container>
    </>
  );
}
