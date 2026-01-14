/**
 * Public Page Display
 * Renders published pages from the page builder
 */

import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getPage } from '../../modules/page-builder/utils/pageStorage';
import PageRenderer from '../../modules/page-builder/components/Preview/PageRenderer';
import type { Page } from '../../modules/page-builder/types';

interface PageDisplayProps {
  page: Page;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ page }) => {
  return (
    <>
      <Head>
        <title>{page.seo?.title || page.title}</title>
        {page.seo?.description && (
          <meta name="description" content={page.seo.description} />
        )}
        {page.seo?.keywords && (
          <meta name="keywords" content={page.seo.keywords} />
        )}
        {page.seo?.ogImage && (
          <>
            <meta property="og:image" content={page.seo.ogImage} />
            <meta name="twitter:image" content={page.seo.ogImage} />
          </>
        )}
        <meta property="og:title" content={page.seo?.title || page.title} />
        {page.seo?.description && (
          <meta property="og:description" content={page.seo.description} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main>
        <PageRenderer page={page} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageDisplayProps> = async (context) => {
  const { slug } = context.params || {};

  if (!slug || typeof slug !== 'string') {
    return { notFound: true };
  }

  const page = await getPage(slug);

  // Only show published pages on frontend
  if (!page || page.status !== 'published') {
    return { notFound: true };
  }

  return {
    props: {
      page,
    },
  };
};

export default PageDisplay;
