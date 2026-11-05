import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mapsUrl, searchServices } from "@/lib/site/search";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return searchServices.map(({ slug }) => ({ slug }));
}

async function getService(params: Props["params"]) {
  const { slug } = await params;
  const service = searchServices.find((item) => item.slug === slug);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name, description, slug } = await getService(params);
  const title = `${name} в Ростове-на-Дону | LANA KNYAZEVA`;
  const url = `/uslugi/${slug}`;
  const images = ["/promo-cosmetology.jpg"];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images, type: "website", locale: "ru_RU", siteName: "LANA KNYAZEVA" },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params);
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16 sm:py-24">
      <Link href="/#services" className="text-primary underline">Все услуги косметологии</Link>
      <h1 className="mt-8 font-serif-display text-4xl sm:text-5xl">{service.name} в Ростове-на-Дону</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">{service.description}</p>
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif-display text-2xl">Как записаться</h2>
        <p className="mt-4">В форме записи выберите «{service.bookingLabel}».</p>
        <a className="mt-5 inline-block rounded-sm bg-gold-gradient px-6 py-3 text-background" href="https://n2289117.yclients.ru/">
          Выбрать время в YCLIENTS
        </a>
        <p className="mt-6">Ростов-на-Дону, Социалистическая улица, 140</p>
        <a className="mt-2 inline-block text-primary underline" href={mapsUrl}>Открыть карточку в Яндекс Картах</a>
      </section>
    </main>
  );
}
