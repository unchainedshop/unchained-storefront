/**
 * Public Page Display
 * Renders published pages from the page builder
 */

import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getPage } from "../../modules/page-builder/utils/pageStorage";
import PageRenderer from "../../modules/page-builder/components/Preview/PageRenderer";
import { getLocalizedString } from "../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../lib/cms.config";
import type {
  Page,
  LocalizedString,
  LocalizedSEOSettings,
} from "../../modules/page-builder/types";

interface PageDisplayProps {
  page: Page;
  locale: string;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ page, locale }) => {
  // Helper to resolve localized strings
  const t = (str: LocalizedString | string | undefined) =>
    getLocalizedString(str, locale);

  // Resolve SEO values
  const seo = page.seo as LocalizedSEOSettings | undefined;
  const seoTitle = seo?.title ? t(seo.title) : undefined;
  const seoDescription = seo?.description ? t(seo.description) : undefined;
  const seoKeywords = seo?.keywords ? t(seo.keywords) : undefined;
  const seoOgImage = seo?.ogImage ? t(seo.ogImage) : undefined;
  const pageTitle = t(page.title);

  return (
    <>
      <Head>
        <title>{seoTitle || pageTitle}</title>
        {seoDescription && <meta name="description" content={seoDescription} />}
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        {seoOgImage && (
          <>
            <meta property="og:image" content={seoOgImage} />
            <meta name="twitter:image" content={seoOgImage} />
          </>
        )}
        <meta property="og:title" content={seoTitle || pageTitle} />
        {seoDescription && (
          <meta property="og:description" content={seoDescription} />
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main>
        <PageRenderer page={page} locale={locale} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageDisplayProps> = async (
  context,
) => {
  const { slug } = context.params || {};

  if (!slug || typeof slug !== "string") {
    return { notFound: true };
  }

  const page = await getPage(slug);

  // Only show published pages on frontend
  if (!page || page.status !== "published") {
    return { notFound: true };
  }

  // Determine locale from Next.js context or fallback
  let locale = context.locale || cmsConfig.defaultLocale;

  // Validate locale is supported
  if (!cmsConfig.locales.includes(locale)) {
    locale = cmsConfig.defaultLocale;
  }

  return {
    props: {
      page,
      locale,
    },
  };
};

export default PageDisplay;
