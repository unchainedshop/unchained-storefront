import { useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/router';
import type * as GQL from '../../apollo/generated';

const PageViewMutation = gql`
  mutation PageView($path: String!, $referrer: String) {
    pageView(path: $path, referrer: $referrer)
  }
`;

// Reports every page view to the engine, which records it for analytics.
const usePageViewTracking = () => {
  const router = useRouter();
  const [pageView] = useMutation<GQL.PageViewMutation, GQL.PageViewMutationVariables>(PageViewMutation);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const track = (path: string) => {
      const referrer = previousPath.current
        ? `${window.location.origin}${previousPath.current}`
        : document.referrer || null;
      previousPath.current = path;
      pageView({ variables: { path, referrer } }).catch(() => {
        // tracking must never break navigation
      });
    };

    if (router.isReady) track(router.asPath);
    router.events.on('routeChangeComplete', track);
    return () => router.events.off('routeChangeComplete', track);
  }, [router.isReady]);
};

export default usePageViewTracking;
