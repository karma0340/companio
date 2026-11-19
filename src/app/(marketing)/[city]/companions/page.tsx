import CityCompanionsPage, { generateMetadata as baseMetadata, generateStaticParams as baseParams } from "@/app/(marketing)/city/[slug]/page";

export function generateStaticParams() {
  return baseParams().map((p: { slug: string }) => ({ city: p.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }) {
  return baseMetadata({ params: { slug: params.city } });
}

export default function Page({ params }: { params: { city: string } }) {
  return <CityCompanionsPage params={{ slug: params.city }} />;
}
