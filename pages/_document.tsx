import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class UnchainedDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="scroll-smooth">
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
<!--

 _____ _____ _____ _____ _____ _____ _____ _____ ____
|  |  |   | |     |  |  |  _  |     |   | |   __|    \\
|  |  | | | |   --|     |     |-   -| | | |   __|  |  |
|_____|_|___|_____|__|__|__|__|_____|_|___|_____|____/


- Technology & Engineering by Unchained Commerce GmbH - https://unchained.shop

-->

  `,
          }}
        />
        <link
          rel="shortcut icon"
          href="https://unchained.shop/_next/static/media/logo.41b5589a.svg"
        />
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var t=localStorage.theme;if(t==='"dark"'||t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
            }}
          />
        </Head>

        <body>
          <div id="app-portal" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default UnchainedDocument;
