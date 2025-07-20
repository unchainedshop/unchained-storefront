import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const Privacy = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({
          id: 'privacy',
          defaultMessage: 'Privacy Policy',
        })}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-8">
          Privacy Policy: The Art of Knowing Nothing
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            This privacy policy explains how we collect, use, and protect your
            personal information, assuming we figure out how to do any of those
            things properly. We take your privacy seriously, which is why
            we&apos;ve written this document that nobody will read to explain
            policies that we&apos;re still making up as we go along.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Information We Collect (Accidentally)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We collect various types of information about you, including but not
            limited to: your name, email address, shopping preferences, browsing
            habits, favorite color, childhood fears, and the name of your first
            pet. We also accidentally collect information about what you had for
            breakfast, though we&apos;re not sure why our system does that or
            how to make it stop. Sometimes we collect information we didn&apos;t
            even know we were collecting, which surprises us as much as it
            probably surprises you.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            How We Use Your Information
          </h2>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              We use your information to:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Provide you with our services (when they work)</li>
              <li>
                Send you marketing emails until you unsubscribe (and sometimes
                after)
              </li>
              <li>Improve our website by guessing what you might want</li>
              <li>
                Comply with legal requirements we may or may not understand
              </li>
              <li>
                Feed our office cat (this might not be related to your data, but
                the cat insists)
              </li>
              <li>
                Create targeted advertising that&apos;s so off-target it&apos;s
                almost impressive
              </li>
              <li>
                Generate reports that nobody reads but make us feel productive
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Data Sharing (The Awkward Part)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We promise not to sell your data to anyone unless they offer us a
            really good deal. We may share your information with third parties
            including our payment processors, shipping partners, the government
            (if they ask nicely), and occasionally with our competitors by
            accident when we send emails to the wrong mailing list. We also
            share aggregated, anonymized data with researchers studying the
            declining attention spans of internet users.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Cookies and Tracking (The Digital Breadcrumbs)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Our website uses cookies, not the delicious kind but the digital
            ones that follow you around the internet. These cookies help us
            remember who you are, what you like, and where you&apos;ve been on
            our site. We also use tracking pixels, which are like digital
            Post-it notes that stick to your browser. Some of these cookies are
            essential, others are just nosy. You can disable cookies in your
            browser, but then our website might forget who you are and treat you
            like a stranger at a party.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Data Security (Our Noble Attempt)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We protect your data using industry-standard security measures,
            which is business speak for &quot;we installed some software and
            hope it works.&quot; Our security measures include encryption,
            firewalls, secure servers, and a very aggressive security guard
            (actually just the office cat, but it&apos;s surprisingly
            effective). While we cannot guarantee absolute security, we can
            guarantee that we&apos;ll be just as surprised as you if something
            goes wrong.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Your Rights (The Fine Print)
          </h2>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Under various privacy laws, you have the right to:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Access your personal data (once we find it)</li>
              <li>
                Correct inaccurate information (assuming we can figure out
                what&apos;s wrong)
              </li>
              <li>
                Delete your data (the &quot;right to be forgotten,&quot; though
                we might forget to forget)
              </li>
              <li>Object to processing (we might object to your objection)</li>
              <li>
                Data portability (we&apos;ll pack your data in a nice digital
                suitcase)
              </li>
              <li>Withdraw consent (though we might cry a little)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            International Data Transfers
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Your data may be transferred to and processed in countries other
            than your own, including countries with different privacy laws or no
            privacy laws at all. We ensure these transfers comply with
            applicable regulations by crossing our fingers and hoping for the
            best. If your data ends up somewhere unexpected, consider it a free
            digital vacation.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We may update this privacy policy from time to time, usually when
            someone points out something we forgot or when new laws require us
            to pretend we understand them. We&apos;ll notify you of significant
            changes by email, website banner, or interpretive dance, depending
            on our mood and budget. Continued use of our services after changes
            means you accept the new policy, even if you didn&apos;t read it.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            Contact Us (If You Dare)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you have questions about this privacy policy, want to exercise
            your rights, or just want to chat about data protection over coffee,
            you can contact us at privacy@definitely-real-commerce.example. We
            promise to respond within a reasonable time, which we define as
            &quot;eventually, maybe.&quot;
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-8">
            *This privacy policy was written by someone who clearly spent too
            much time thinking about data protection and not enough time
            thinking about readability. Your privacy matters to us, even if our
            policy suggests otherwise.*
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            Last updated: Sometime recently, or maybe not. Time is a construct
            anyway.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
