import { type AppType } from 'next/dist/shared/lib/utils';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { MainLayout } from '~/components/main-layout';

import '~/styles/globals.css';

export const AppContext = createContext<{
  hasVulns: boolean;
  setHasVulns: Dispatch<SetStateAction<boolean>>;
} | null>(null);

const MyApp: AppType = ({ Component, pageProps }) => {
  const [hasVulns, setHasVulns] = useState(false);

  return (
    <AppContext.Provider value={{ hasVulns, setHasVulns }}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppContext.Provider>
  );
};

export default MyApp;
