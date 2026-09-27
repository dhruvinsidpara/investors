import { notFound } from "next/navigation";
import { properties } from "@/lib/data";
import PropertyDetail from "./PropertyDetail";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();
  return <PropertyDetail property={property} />;
}
