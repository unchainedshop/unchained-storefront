import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import ContentPage from '../modules/common/components/ContentPage';
import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const AboutPage = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({ id: 'about', defaultMessage: 'About us' })}
      />

      <ContentPage
        eyebrow={intl.formatMessage({ id: 'content_eyebrow_company', defaultMessage: 'Company' })}
        title="About Us: The Story Nobody Asked For"
        icon={BuildingStorefrontIcon}
      >

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to our comprehensive exposition on the multifaceted nature
            of our organizational existence, wherein we endeavor to elucidate
            the quintessential characteristics that fundamentally define our
            corporate identity without actually revealing anything substantive
            about who we are, what we do, or why we exist in the first place.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Mission (Or Something Like That)
          </h2>
          <p className="text-muted-foreground">
            We are passionately committed to leveraging synergistic paradigms
            while optimizing cross-platform solutions through innovative
            methodologies that transcend traditional boundaries of conventional
            thinking, thereby creating unprecedented value propositions for
            stakeholders across various demographic segments, all while
            maintaining our unwavering dedication to excellence in everything we
            pretend to understand.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Vision Statement
          </h2>
          <p className="text-muted-foreground">
            To be the leading provider of comprehensive solutions that nobody
            really needs but everyone thinks they want, while simultaneously
            disrupting industries we&apos;ve never worked in and revolutionizing
            processes we don&apos;t fully comprehend, all in pursuit of
            achieving sustainable growth metrics that sound impressive in
            quarterly reports but mean absolutely nothing to actual human
            beings.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Core Values
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong>Transparency:</strong> We believe in being completely open
              about how little we actually know about what we&apos;re doing.
            </li>
            <li>
              <strong>Innovation:</strong> Constantly finding new ways to make
              simple things unnecessarily complicated.
            </li>
            <li>
              <strong>Customer-Centricity:</strong> Putting customers at the
              center of everything, especially our confusion.
            </li>
            <li>
              <strong>Integrity:</strong> Honestly admitting that we make this
              stuff up as we go along.
            </li>
            <li>
              <strong>Excellence:</strong> Striving to be excellently mediocre
              in all our endeavors.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Team of Imaginary Experts
          </h2>
          <p className="text-muted-foreground">
            Our diverse team consists of visionary thought leaders, strategic
            innovators, and dynamic change agents who collectively possess over
            200 years of experience in fields that may or may not be relevant to
            what we&apos;re supposedly doing. Each team member brings a unique
            perspective shaped by their extensive background in industries we
            can&apos;t specifically name due to confidentiality agreements that
            probably don&apos;t exist.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Revolutionary Approach
          </h2>
          <p className="text-muted-foreground">
            Through our proprietary methodology that combines cutting-edge
            technology with time-tested strategies, we deliver results that
            exceed expectations by carefully managing those expectations to be
            as low as possible. Our approach is both holistic and systematic,
            comprehensive yet focused, innovative while traditional, and
            simultaneously simple and complex depending on what sounds better in
            any given conversation.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground">
            Because we wrote this page and you read it all the way down here,
            which demonstrates either remarkable dedication or concerning
            amounts of free time. Either way, we respect that. Plus, we&apos;re
            probably the only company honest enough to admit that most
            &quot;About Us&quot; pages are just elaborate word salads designed
            to make organizations sound more important than they actually are.
          </p>

          <p className="text-sm text-subtle-foreground italic mt-8">
            *This page contains approximately 387 words that successfully convey
            nothing meaningful about our actual business, proving that corporate
            communication is truly an art form.*
          </p>
        </div>
      </ContentPage>
    </>
  );
};

export default AboutPage;
