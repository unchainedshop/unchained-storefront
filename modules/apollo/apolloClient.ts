import { useMemo } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { LocalState } from '@apollo/client/local-state';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import typePolicies from './typepolicies';
import possibleTypes from '../../possibleTypes.json';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

const uri =
  typeof window === 'undefined'
    ? process.env.UNCHAINED_ENDPOINT || 'http://localhost:4010/graphql'
    : `${window.origin}/graphql`;

const httpLink = new HttpLink({
  uri,
  credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
});

function createApolloClient({ locale }) {
  const middlewareLink = new ApolloLink((operation, forward) => {
    const headers = {};
    if (locale) {
      headers['accept-language'] = locale;
    }
    operation.setContext({ headers });
    return forward(operation);
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([middlewareLink, httpLink]),
    cache: new InMemoryCache({
      possibleTypes,
      typePolicies,
    }),
  });
}

export function initializeApollo(
  initialState = null,
  { locale } = { locale: null },
) {
  const tempApolloClient =
    apolloClient ??
    createApolloClient({
      locale,
    });

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = tempApolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });

    // Restore the cache with the merged data
    tempApolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return tempApolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = tempApolloClient;

  return tempApolloClient;
}

export function addApolloState(client, pageProps) {
  const newProps = { ...pageProps };
  if (newProps?.props) {
    newProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return newProps;
}

export function useApollo(pageProps, options) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, options),
    [state, options],
  );
  return store;
}
