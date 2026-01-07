import { setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  canonicalUrl: '/editor',
});

export default async function EditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const Page = await getThemePage('editor');

  return <Page />;
}
