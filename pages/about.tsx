import { useIntl } from "react-intl";

import MetaTags from "../modules/common/components/MetaTags";
import Footer from "../modules/layout/components/Footer";

const AboutPage = () => {
  const intl = useIntl();

  return (
    <>
      <MetaTags
        title={intl.formatMessage({ id: "about", defaultMessage: "About" })}
      />

      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h1>
              {intl.formatMessage({ id: "about", defaultMessage: "About" })}
            </h1>
            <p>
              {intl.formatMessage({
                id: "about_detail",
                defaultMessage: "About blablabla ...",
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
