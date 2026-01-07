import { setRequestLocale } from 'next-intl/server';

import { defaultLocale } from '@/config/locale';
import { getThemePage } from '@/core/theme';

export default async function EditorRootPage() {
  setRequestLocale(defaultLocale);
  const Page = await getThemePage('editor');
  return <Page />;
}
