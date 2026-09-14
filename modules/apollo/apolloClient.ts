import { useMemo } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import typePolicies from './typepolicies';
import possibleTypes from '../../possibleTypes.json';

const uri =
  typeof window === 'undefined'
    ? process.env.UNCHAINED_ENDPOINT || 'http://localhost:4010/graphql'
    : `${window.origin}/graphql`;

let apolloClient;

function createApolloClient(locale) {
  const localeLink = new ApolloLink((operation, forward) => {
    if (locale) operation.setContext({ headers: { 'accept-language': locale } });
    return forward(operation);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      localeLink,
      new HttpLink({ uri, credentials: 'same-origin' }),
    ]),
    cache: new InMemoryCache({ possibleTypes, typePolicies }),
  });
}

// A fresh client on the server; a singleton on the client (locale is fixed per
// page load since the language switch triggers a full reload).
export function initializeApollo(locale = null) {
  if (typeof window === 'undefined') return createApolloClient(locale);
  return (apolloClient ??= createApolloClient(locale));
}

export function useApollo(locale) {
  return useMemo(() => initializeApollo(locale), [locale]);
}
