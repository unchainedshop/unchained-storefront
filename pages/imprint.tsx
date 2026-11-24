import { IdentificationIcon } from '@heroicons/react/24/outline';
import ContentPage from '../modules/common/components/ContentPage';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const Imprint = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({ id: 'imprint', defaultMessage: 'Imprint' })}
      />
      <ContentPage
        eyebrow={intl.formatMessage({ id: 'content_eyebrow_legal', defaultMessage: 'Legal' })}
        title="Imprint: The Legal Formalities"
        icon={IdentificationIcon}
      >

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            According to various international laws that we may or may not fully
            understand, we are required to provide you with some information
            about who we are, where we are, and what we&apos;re supposedly
            doing. Consider this your official heads-up about our existence.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Company Information
          </h2>
          <div className="bg-muted rounded-lg p-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-foreground">
                  Company Name:
                </span>
                <span className="ml-2 text-muted-foreground">
                  Definitely Real Commerce Solutions Ltd. (Probably)
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Address:
                </span>
                <span className="ml-2 text-muted-foreground">
                  123 Fictional Street, Imaginary District, 12345 Nowhere City,
                  The Internet
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Registration Number:
                </span>
                <span className="ml-2 text-muted-foreground">
                  CHE-404.NOT.FOUND (registered in the land of make-believe)
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Management & Representation
          </h2>
          <p className="text-muted-foreground">
            This company is managed by a board of directors consisting entirely
            of people who are excellent at making decisions they don&apos;t
            understand about things they&apos;ve never seen. Our CEO is rumored
            to be either a very sophisticated chatbot or three cats in a
            business suit. The CFO is definitely a golden retriever with an MBA
            from an unaccredited online university.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Contact Information
          </h2>
          <div className="bg-muted rounded-lg p-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-foreground">
                  Email:
                </span>
                <span className="ml-2 text-muted-foreground">
                  hello@pretend-commerce.example (responses not guaranteed)
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Phone:
                </span>
                <span className="ml-2 text-muted-foreground">
                  +41 123 456 7890 (currently being answered by a very confused
                  intern)
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Business Hours:
                </span>
                <span className="ml-2 text-muted-foreground">
                  Monday-Friday, 9:00-17:00 (Swiss time, but we&apos;re often
                  running late)
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            VAT Information
          </h2>
          <p className="text-muted-foreground">
            VAT-ID: CHE-123.456.789 MWST (this number may or may not correspond
            to anything real, but it looks official). We are registered for VAT
            purposes in Switzerland, assuming Switzerland knows we exist, which
            is questionable at best.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Professional Liability Insurance
          </h2>
          <p className="text-muted-foreground">
            We are insured by the &quot;Fictional Insurance Company for
            Imaginary Businesses,&quot; policy number 404-NOT-FOUND. Coverage
            includes protection against acts of digital vandalism, spontaneous
            website combustion, and angry customers who realize our business
            might not actually exist.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Regulatory Information
          </h2>
          <p className="text-muted-foreground">
            This website is subject to Swiss law, international internet
            regulations, and the laws of physics (though we&apos;re working on
            exemptions for the latter). Any disputes arising from the use of
            this website will be resolved through interpretive dance or a
            strongly worded letter, whichever seems more appropriate at the
            time.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Editorial Responsibility
          </h2>
          <p className="text-muted-foreground">
            The content on this website is the responsibility of our editorial
            team, which consists of one overworked intern, a magic 8-ball, and
            occasionally input from the office cat. We strive for accuracy but
            make no promises. If you find factual errors, please let us
            know&mdash;we&apos;ll add them to our collection.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Dispute Resolution
          </h2>
          <p className="text-muted-foreground">
            In case of disputes, we prefer resolution through peaceful means
            such as rock-paper-scissors, thumb wrestling, or asking our office
            cat to choose between two options. If these methods fail, we
            reluctantly agree to use more conventional legal processes, though
            we reserve the right to be confused by them.
          </p>

          <p className="text-sm text-subtle-foreground italic mt-8">
            *This imprint contains all the legal information required by law,
            plus several things that definitely aren&apos;t. Use at your own
            risk and sense of humor.*
          </p>
        </div>
      </ContentPage>
    </>
  );
};

export default Imprint;
