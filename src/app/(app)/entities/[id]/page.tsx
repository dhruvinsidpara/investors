import { notFound } from "next/navigation";
import { entities } from "@/lib/data";
import EntityDetail from "./EntityDetail";

export function generateStaticParams() {
  return entities.map((e) => ({ id: e.id }));
}

export default async function EntityDetailPage({ params }: PageProps<"/entities/[id]">) {
  const { id } = await params;
  const entity = entities.find((e) => e.id === id);
  if (!entity) notFound();
  return <EntityDetail entity={entity} />;
}
