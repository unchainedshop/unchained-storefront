import Head from 'next/head';
import { useRouter } from 'next/router';

const MetaTags = ({
  imageUrl = 'https://unchained.shop/img/unchained-commerce-snake.svg',
  title,
  description = '',
}) => {
  const { asPath } = useRouter();
  const locales = ['en', 'de']; // Hardcoded supported locales

  return (
    <Head>
      <title>{title || ' '}</title>
      {locales.map((lang) => (
        <link
          key={`${lang}${asPath}`}
          rel="alternate"
          hrefLang={lang}
          href={`/${lang}${asPath}`}
        />
      ))}
      <meta
        name="keywords"
        content="Unchained, Commerce, e-commerce, headless, unchained, shop, marketplace"
      />
      <meta name="robots" content="all" />
      <meta name="description" content={description || title} />
      <meta content="Unchained Commerce" property="og:site_name" />
      <meta content="website" property="og:type" />
      <meta property="og:type" content="article" key="type" />
      <meta property="og:title" content={title} key="title" />
      <meta
        property="og:description"
        content={description || title}
        key="description"
      />
      <meta property="og:image" content={imageUrl} key="image" />
      <meta name="twitter:title" content={title} key="twitter-title" />
      <meta
        name="twitter:description"
        content={description || title}
        key="twitter-description"
      />
      <meta name="twitter:image" content={imageUrl} key="twitter-image" />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter-card"
      />
      <meta
        content="https://twitter.com/unchained_shop"
        property="og:see_also"
      />
      <meta name="twitter:site" content="@unchained_shop" />
      <meta name="twitter:creator" content="@unchained_shop" />
      <meta content="en_EN" property="og:locale" />
    </Head>
  );
};

export default MetaTags;
