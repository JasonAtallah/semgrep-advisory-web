import { type AppType } from 'next/dist/shared/lib/utils';
import { createContext } from 'react';
import { MainLayout } from '~/components/main-layout';

import '~/styles/globals.css';

const initialState = { hasVulnerabilites: false };
export const AppContext = createContext(initialState);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AppContext.Provider value={initialState}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppContext.Provider>
  );
};

export default MyApp;
