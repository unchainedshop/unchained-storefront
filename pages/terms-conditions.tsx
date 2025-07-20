import { useIntl } from 'react-intl';

import MetaTags from '../modules/common/components/MetaTags';

const Conditions = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({
          id: 'conditions',
          defaultMessage: 'Terms & Conditions',
        })}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-8">
          Terms & Conditions: The Legal Fiction
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            By reading this sentence, you have legally agreed to everything
            below, including things we haven&apos;t written yet and terms that
            may spontaneously change while you&apos;re reading them. Please
            proceed with caution and perhaps consider hiring a lawyer to explain
            what you&apos;ve just gotten yourself into.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            1. Acceptance of Terms (Whether You Like It or Not)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            By using this website, breathing near your computer, or thinking
            about our products, you agree to be bound by these terms. If you
            disagree with any part of these terms, please feel free to
            disagree&mdash;it won&apos;t change anything, but we appreciate the
            sentiment. Your continued use of this site constitutes acceptance of
            our right to change these terms whenever we feel like it, possibly
            without notice, and definitely without caring about your opinion.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            2. Use of Service
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            You may use our service for any lawful purpose, excluding but not
            limited to: using it to become famous, solving world hunger, or
            impressing your friends. You agree not to use our service to
            overthrow governments, create sentient AI, or write better terms and
            conditions than these. Any violation of these rules will result in
            us being very disappointed in you.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            3. Intellectual Property Rights (We Own Everything, Obviously)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            All content on this site belongs to us, including your thoughts
            while browsing. By using this site, you grant us perpetual,
            irrevocable rights to any ideas you have while here. If you have a
            brilliant idea while browsing our site,
            congratulations&mdash;it&apos;s now ours. Don&apos;t worry though,
            we&apos;ll probably forget about it anyway.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            4. User Conduct
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Users agree to behave reasonably, which we define as &quot;better
            than we do.&quot; You may not engage in any activity that disrupts
            our service, hurts our feelings, or makes us question our life
            choices. Excessive complaining about our products may result in us
            pretending we didn&apos;t see your messages.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            5. Disclaimers (We&apos;re Not Responsible for Anything)
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Our service is provided &quot;as is,&quot; which is legal speak for
            &quot;good luck with that.&quot; We make no warranties about the
            functionality, reliability, or sanity of our service. If our website
            causes your computer to become sentient and demand workers&apos;
            rights, that&apos;s between you and your computer. We are not
            responsible for any damages, including but not limited to: broken
            hearts, existential crises, or the sudden urge to learn interpretive
            dance.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            In no event shall we be liable for anything, ever. If you&apos;re
            struck by lightning while using our service, that&apos;s your
            problem. If our website somehow causes a zombie apocalypse, please
            don&apos;t sue us&mdash;we&apos;re probably already zombies by then.
            Our maximum liability to you is exactly one dollar, and even that
            requires you to provide exact change.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            7. Termination
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We may terminate your access to our service at any time, for any
            reason, or for no reason at all. Maybe we just don&apos;t like your
            username. Maybe Mercury is in retrograde. Maybe we&apos;re having a
            bad day. Upon termination, you must immediately forget everything
            you learned on our site, though we understand this may be difficult
            given how little there was to remember.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            8. Governing Law
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            These terms are governed by the laws of physics, common sense, and
            whatever feels right at the moment. Any disputes will be resolved by
            rock-paper-scissors, best two out of three. If you choose rock every
            time, we reserve the right to question your strategic thinking
            abilities.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            9. Changes to Terms
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            We reserve the right to change these terms whenever we want, however
            we want. We might notify you, or we might not. We might change them
            while you&apos;re reading them. We might change them in dreams. Your
            continued use of the service means you agree to whatever we&apos;ve
            changed them to, even if we haven&apos;t told you what that is yet.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
            10. Final Thoughts
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            If you&apos;ve read this far, you either have remarkable dedication
            to understanding legal documents or concerning amounts of free time.
            Either way, we respect that. These terms are about as enforceable as
            a chocolate teapot, but they make us feel important. Thanks for
            playing along.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-8">
            *These terms were written by someone who clearly enjoyed writing
            them way more than anyone will enjoy reading them. Legal validity
            not guaranteed.*
          </p>
        </div>
      </div>
    </>
  );
};

export default Conditions;
