// Shared server-rendered FAQ block for every RPG tool page. Emits FAQPage +
// SoftwareApplication JSON-LD AND renders the same Q&A visibly, so the
// structured data mirrors on-page content (FAQ rich-result requirement). The
// Q&A come from each page's own constant — never model output — so stringifying
// into a <script> tag is XSS-safe. Server component (no "use client") so it can
// live inside server page.tsx files.
export interface Faq {
  q: string;
  a: string;
}

export function ToolFaq({ name, faqs }: { name: string; faqs: Faq[] }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <h2 style={{ marginTop: 28 }}>Frequently asked questions</h2>
      {faqs.map((f) => (
        <div key={f.q} style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
          <p className="lead" style={{ margin: 0 }}>
            {f.a}
          </p>
        </div>
      ))}
    </>
  );
}
