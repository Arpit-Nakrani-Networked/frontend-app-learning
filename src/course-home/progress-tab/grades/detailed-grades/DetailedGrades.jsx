import React from 'react';
import { useSelector } from 'react-redux';

// import { sendTrackEvent } from '@edx/frontend-platform/analytics';
// import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Blocked } from '@openedx/paragon/icons';
import { Icon } from '@openedx/paragon';
import { useModel } from '../../../../generic/model-store';

import DetailedGradesTable from './DetailedGradesTable';

import messages from '../messages';

const DetailedGrades = ({ intl }) => {
  // const { administrator } = getAuthenticatedUser();
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  // const {
  //   // org,
  //   tabs,
  // } = useModel('courseHomeMeta', courseId);
  const {
    // gradesFeatureIsFullyLocked,
    gradesFeatureIsPartiallyLocked,
    sectionScores,
  } = useModel('progress', courseId);

  const hasSectionScores = sectionScores.length > 0;

  // const logOutlineLinkClick = () => {
  //   sendTrackEvent('edx.ui.lms.course_progress.detailed_grades.course_outline_link.clicked', {
  //     org_key: org,
  //     courserun_key: courseId,
  //     is_staff: administrator,
  //   });
  // };

  // const overviewTab = tabs.find(tab => tab.slug === 'outline');
  // const overviewTabUrl = overviewTab && overviewTab.url;

  // const outlineLink = overviewTabUrl && (
  //   <Hyperlink
  //     variant="muted"
  //     isInline
  //     destination={overviewTabUrl}
  //     onClick={logOutlineLinkClick}
  //     tabIndex={gradesFeatureIsFullyLocked ? '-1' : '0'}
  //   >
  //     {intl.formatMessage(messages.courseOutline)}
  //   </Hyperlink>
  // );

  return (
    <section className="text-dark-700">
      <div className="pt-4 px-4">
        <h3 className="h4 card-header-custom">{intl.formatMessage(messages.detailedGrades)}</h3>
        <ul className="micro mb-3 pl-3 text-gray-700">
          <li>
            <b>{intl.formatMessage(messages.practiceScoreLabel)} </b>
            {intl.formatMessage(messages.practiceScoreInfoText)}
          </li>
          <li>
            <b>{intl.formatMessage(messages.gradedScoreLabel)} </b>
            {intl.formatMessage(messages.gradedScoreInfoText)}
          </li>
        </ul>
      </div>
      {gradesFeatureIsPartiallyLocked && (
        <div className="mb-3 small ml-0 d-inline">
          <Icon className="mr-1 mt-1 d-inline-flex" style={{ height: '1rem', width: '1rem' }} src={Blocked} data-testid="blocked-icon" />
          {intl.formatMessage(messages.gradeSummaryLimitedAccessExplanation)}
        </div>
      )}
      {hasSectionScores && (
        <DetailedGradesTable />
      )}
      {!hasSectionScores && (
        <p className="small">{intl.formatMessage(messages.detailedGradesEmpty)}</p>
      )}
      {/* {overviewTabUrl && !showUngradedAssignments() && (
        <p className="x-small m-0 px-4 pb-3">
          {intl.formatMessage(messages.ungradedAlert, { outlineLink })}
        </p>
      )} */}
    </section>
  );
};

DetailedGrades.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailedGrades);
