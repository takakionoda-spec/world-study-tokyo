"use client";

/* =============================================================================
   /vanguard — PARTNERS WANTED (open call) + featured partners (when present)
   -----------------------------------------------------------------------------
   WORLD STUDY TOKYO reuses the sister-title `/vanguard` route as its partner
   gateway. Until real partners sign on, this page surfaces a "Partners
   Wanted" open call. Once `siteConfig.vanguard.entries` contains entries,
   they render as cards above the open-call CTA.

   The route is kept at /vanguard for cross-template URL stability; the
   visible labels read "PARTNERS" so readers see this as a partner directory.
   ========================================================================== */

import { Container } from "@/components/GridSystem";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/site.config";

type PartnerEntry = {
  id: string;
  name: string;
  url: string;
  tagline: { en: string; ja: string };
  note: { en: string; ja: string };
  tone: string;
};

export default function PartnersPage() {
  const { lang } = useLanguage();
  const vg = (siteConfig as typeof siteConfig & {
    vanguard?: {
      eyebrow: { en: string; ja: string };
      headline: { en: string; ja: string };
      lede: { en: string; ja: string };
      entries: readonly PartnerEntry[];
    };
  }).vanguard;

  if (!vg) return null;

  const entries = vg.entries;
  const hasEntries = entries.length > 0;

  return (
    <>
      <Container className="pt-12 lg:pt-16 pb-12">
        <p className="eyebrow">{vg.eyebrow[lang]}</p>
        <h1
          className="mt-6 font-display font-semibold leading-[1.05] tracking-[-0.015em] max-w-5xl"
          style={{
            color: "var(--color-ink)",
            fontSize: "clamp(2.2rem, 5.4vw, 4.5rem)"
          }}
        >
          {vg.headline[lang]}
        </h1>
        <p
          className="mt-8 max-w-[68ch] text-lg leading-relaxed"
          style={{ color: "var(--color-ink-700)" }}
        >
          {vg.lede[lang]}
        </p>
        <div className="silver-rule mt-12" />
      </Container>

      {/* Featured partners — only rendered when entries exist. */}
      {hasEntries ? (
        <Container className="pb-section">
          <div className="grid grid-cols-1 gap-y-10 lg:gap-y-14">
            {entries.map((entry, i) => (
              <article
                key={entry.id}
                className="glass p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6"
              >
                <div className="lg:col-span-4">
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${entry.tone}, var(--color-paper-soft))`
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <span
                        className="font-display font-semibold text-[1.6rem] lg:text-[2rem] tracking-[0.02em] leading-none"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {entry.name}
                      </span>
                      <span
                        className="mt-4 font-mono text-[0.625rem] tracking-[0.32em] uppercase"
                        style={{ color: "var(--color-ink-500)" }}
                      >
                        Partner No. {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-mono text-[0.625rem] tracking-[0.32em] uppercase"
                      style={{ color: "var(--color-accent-deep)" }}
                    >
                      Editor&apos;s Selection
                    </span>
                    <span aria-hidden style={{ color: "var(--color-ink-400)" }}>
                      ·
                    </span>
                    <span
                      className="font-mono text-[0.625rem] tracking-[0.22em] uppercase"
                      style={{ color: "var(--color-ink-500)" }}
                    >
                      {new URL(entry.url).hostname.replace(/^www\./, "")}
                    </span>
                  </div>
                  <h2
                    className="font-display font-semibold leading-[1.2] tracking-[-0.005em] max-w-2xl"
                    style={{
                      color: "var(--color-ink-900)",
                      fontSize: "clamp(1.4rem, 2.5vw, 2rem)"
                    }}
                  >
                    {entry.tagline[lang]}
                  </h2>
                  <p
                    className="mt-6 max-w-[68ch] text-base leading-relaxed"
                    style={{ color: "var(--color-ink-700)" }}
                  >
                    {entry.note[lang]}
                  </p>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener"
                    className="btn-neon mt-8 inline-flex"
                  >
                    {lang === "ja" ? "公式サイトへ" : "Visit site"}
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      ) : null}

      {/* Open-call CTA — always rendered, central when no partners are listed. */}
      <Container className="pb-section">
        <div className="glass p-10 lg:p-14 text-center max-w-3xl mx-auto">
          <p className="eyebrow">
            {lang === "ja" ? "パートナー募集中" : "Now accepting partners"}
          </p>
          <h2
            className="mt-5 font-display font-semibold leading-[1.2] tracking-[-0.005em] max-w-2xl mx-auto"
            style={{
              color: "var(--color-ink-900)",
              fontSize: "clamp(1.5rem, 3vw, 2.4rem)"
            }}
          >
            {lang === "ja"
              ? "学校・塾・教育サービスの皆さまへ。"
              : "Schools, juku, and learning services — get in touch."}
          </h2>
          <p
            className="mt-6 max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: "var(--color-ink-700)" }}
          >
            {lang === "ja"
              ? "WORLD STUDY TOKYO では、東京の子育て家庭が朝の時間を割いて読む価値のある、学校・塾・インターナショナルスクール・学習サービスの掲載パートナーを募集しています。掲載は出稿金額ではなく、編集部が読者にとっての関連性で判断します。詳細は Contact セクションよりお問い合わせください。"
              : "WORLD STUDY TOKYO is open to featuring schools, juku, international institutions, and learning services worth a Tokyo family's morning attention. Coverage is decided by editorial relevance, not by spend — but a Partner relationship offers a steady editorial home alongside the global feed. Reach out via the Contact section."}
          </p>
          <a href="/about#contact" className="btn-neon mt-8 inline-flex">
            {lang === "ja" ? "編集部に問い合わせる" : "Contact the editorial desk"}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </Container>
    </>
  );
}
