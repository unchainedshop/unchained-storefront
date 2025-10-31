import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client/react';

import IntlWrapper from '../modules/i18n/components/IntlWrapper';
import { useApollo } from '../modules/apollo/apolloClient';
import Layout from '../modules/layout/components/Layout';
import getMessages from '../modules/i18n/utils/getMessages';
import { AppContextWrapper } from '../modules/common/components/AppContextWrapper';

import '../styles/globals.css';
import PushNotificationWrapper from '../modules/context/push-notification/PushNotificationWrapper';

const UnchainedApp = ({ Component, pageProps, router }) => {
  const apollo = useApollo(pageProps, { locale: router.locale });
  const messages = getMessages(router.locale);

  // Check if the current page has hero section based on route
  const hasHeroSection = router.pathname === '/';

  return (
    <IntlWrapper locale={router.locale} messages={messages} key="intl-provider">
      <AppContextWrapper>
        <ApolloProvider client={apollo}>
          <PushNotificationWrapper>
            <Toaster />
            <Layout hasHeroSection={hasHeroSection}>
              <Component {...pageProps} />
            </Layout>
          </PushNotificationWrapper>
        </ApolloProvider>
      </AppContextWrapper>
    </IntlWrapper>
  );
};

export default UnchainedApp;
