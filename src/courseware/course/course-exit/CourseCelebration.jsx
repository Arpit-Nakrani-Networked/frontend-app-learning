import React, { useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

import {
  injectIntl, intlShape,
} from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import {
  // Alert,
  breakpoints,
  Button,
  // Hyperlink,
  useWindowSize,
} from '@openedx/paragon';
// import { CheckCircle } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import CelebrationMobile from './assets/celebration_456x328.gif';
import CelebrationDesktop from './assets/celebration_750x540.gif';
// import certificate from '../../../generic/assets/edX_certificate.png';
// import certificateLocked from '../../../generic/assets/edX_locked_certificate.png';
// import { FormattedPricing } from '../../../generic/upgrade-button';
import messages from './messages';
import { useModel } from '../../../generic/model-store';
// import { requestCert } from '../../../course-home/data/thunks';
// import ProgramCompletion from './ProgramCompletion';
// import DashboardFootnote from './DashboardFootnote';
// import UpgradeFootnote from './UpgradeFootnote';
// import SocialIcons from '../../social-share/SocialIcons';
import { logVisit } from './utils';
// import { DashboardLink, IdVerificationSupportLink, ProfileLink } from '../../../shared/links';
// import CourseRecommendations from './CourseRecommendations';
import { NETWORKED_FRONTEND_URL } from '../../../helper/constants';

// const LINKEDIN_BLUE = '#2867B2';

const CourseCelebration = ({ intl }) => {
  const wideScreen = useWindowSize().width >= breakpoints.medium.minWidth;
  const { courseId } = useSelector(state => state.courseware);
  // const dispatch = useDispatch();
  const {
    // certificateData,
    // end,
    // linkedinAddToProfileUrl,
    // marketingUrl,
    // offer,
    // relatedPrograms,
    title,
    // verifyIdentityUrl,
    // verificationStatus,
  } = useModel('coursewareMeta', courseId);

  const {
    org,
  } = useModel('courseHomeMeta', courseId);

  const { administrator } = getAuthenticatedUser();

  const visitEvent = 'celebration_generic';

  const handleModalClose = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  };

  useEffect(() => logVisit(org, courseId, administrator, visitEvent), [org, courseId, administrator, visitEvent]);

  return (
    <>
      <Helmet>
        <title>{`${intl.formatMessage(messages.congratulationsHeader)} | ${title} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
      <div className="row w-100 mx-0 px-5 py-4">
        <div className="col-12 mt-3 mb-4 px-0 px-md-5 text-center">
          {!wideScreen && (
            <img
              src={CelebrationMobile}
              alt={`${intl.formatMessage(messages.congratulationsImage)}`}
              className="img-fluid"
            />
          )}
          {wideScreen && (
            <img
              src={CelebrationDesktop}
              alt={`${intl.formatMessage(messages.congratulationsImage)}`}
              className="img-fluid"
              style={{ width: '36rem' }}
            />
          )}
        </div>
        <div className="col-12 p-0 h2 text-center _text-2xl _text-black">
          {intl.formatMessage(messages.congratulationsHeader)}
        </div>
        <div className="col-12 p-0 font-weight-normal text-center _text-lg _text-gray">
          <p className="m-0 text-center _text-lg _text-gray px-5">{intl.formatMessage(messages.completedCourseHeader)}</p>
          {/* {marketingUrl && ` ${intl.formatMessage(messages.shareMessage)}`} */}
          {/* <SocialIcons
            analyticsId="edx.ui.lms.course_exit.social_share.clicked"
            className="mt-2"
            courseId={courseId}
            emailSubject={messages.socialMessage}
            socialMessage={messages.socialMessage}
          /> */}

          <Button variant="primary" className="CongratulationModal_Button" onClick={handleModalClose}>
            {intl.formatMessage(messages.backToCourse)}
          </Button>
        </div>
        {/* <div className="col-12 px-0 px-md-5">
          {certHeader && (
          <Alert variant="success" icon={CheckCircle}>
            <div className="row w-100 m-0">
              <div className="col order-1 order-md-0 pl-0 pr-0 pr-md-5">
                <div className="h4">{certHeader}</div>
                {message}
                <div className="mt-2">
                  {buttonPrefix}
                  {buttonLocation && (
                    <Button
                      variant={buttonVariant}
                      href={buttonLocation}
                      className="w-xs-100 w-md-auto"
                      onClick={() => logClick(org, courseId, administrator, buttonEvent)}
                    >
                      {buttonText}
                    </Button>
                  )}
                  {buttonSuffix}
                </div>
              </div>
              {certStatus !== 'unverified' && (
                <div className="col-12 order-0 col-md-3 order-md-1 w-100 mb-3 p-0 text-center">
                  <img
                    src={certificateImage}
                    alt={`${intl.formatMessage(messages.certificateImage)}`}
                    className="w-100"
                    style={{ maxWidth: '13rem' }}
                  />
                </div>
              )}
            </div>
          </Alert>
          )}
          {relatedPrograms && relatedPrograms.map(program => (
            <ProgramCompletion
              key={program.uuid}
              progress={program.progress}
              title={program.title}
              type={program.slug}
              url={program.url}
            />
          ))}
          {footnote}
          <CourseRecommendations variant={visitEvent} />
        </div> */}
      </div>
    </>
  );
};

CourseCelebration.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseCelebration);
