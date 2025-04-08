import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { ConfigProvider } from 'antd';
import { selectLangState } from '@/redux/translation/selectors';

const importlangfile = async () => {
  return await import('./antdLocale');
};

export default function Localization({ children }) {
  const { langCode } = useSelector(selectLangState);

  const [locale, setLocal] = useState();

  useEffect(() => {
    const antdLocale = importlangfile();
    const lang = antdLocale[langCode];
    setLocal(lang);
  }, [langCode]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: '#0050c8',
          colorLink: '#1640D6',
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
