import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ForCompany } from "@/components/resume/ForCompany";
import { SmoothScroll } from "@/components/resume/SmoothScroll";
import { companyBySlug } from "@/content/companies";

/**
 * One page per application, at /<slug>. The pitch and its ROI model are
 * written for a single employer, so they live here and never on the index.
 * An unknown slug is a 404 rather than an empty pitch.
 */
export const Route = createFileRoute("/$company")({
  // The loader validates the slug and returns nothing. A Company carries
  // roi.formula, a function, and loader data is serialized to the client, so
  // handing the object back here would fail SSR. It is a static module, so
  // the component reads it directly instead.
  loader: ({ params }) => {
    if (!companyBySlug(params.company)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Louis Park — for ${companyBySlug(params.company)?.companyName ?? ""}` },
      // per-company pages are written for one reader, not for search
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  const { company: slug } = Route.useParams();
  const company = companyBySlug(slug);
  // unreachable: the loader has already thrown notFound for an unknown slug
  if (!company) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SmoothScroll />

      <header className="flex items-center justify-between px-6 py-8 md:px-12 lg:px-16 xl:px-24">
        <Link to="/" className="font-display text-2xl">
          Louis Park
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs tracking-wide transition-colors hover:border-foreground"
        >
          Full resume
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      <main>
        <ForCompany company={company} index="01" />
      </main>
    </div>
  );
}
