import React from 'react';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@openedx/paragon';

// import CertificateStatus from './certificate-status/CertificateStatus';
import CourseCompletion from './course-completion/CourseCompletion';
// import CourseGrade from './grades/course-grade/CourseGrade';
// import DetailedGrades from './grades/detailed-grades/DetailedGrades';
// import GradeSummary from './grades/grade-summary/GradeSummary';
// import ProgressHeader from './ProgressHeader';
// import RelatedLinks from './related-links/RelatedLinks';

import { useModel } from '../../generic/model-store';

const ProgressTab = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    disableProgressGraph,
  } = useModel('progress', courseId);

  // const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';

  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    // Bail because we don't want to load <CertificateStatus/> twice, emitting 'visited' events both times.
    // This is a hacky solution, since the user can resize the screen and still get two visited events.
    // But I'm leaving a larger refactor as an exercise to a future reader.
    return null;
  }

  // const wideScreen = windowWidth >= breakpoints.large.minWidth;
  return (
    <>
      {/* <ProgressHeader /> */}
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-md-8 p-0">
          <div className="row w-100 m-0">
            {!disableProgressGraph && <div className="col-12 col-md-6 p-0 px-md-2"><CourseCompletion /></div>}
            {/* <div className="col-12 col-md-6"><ProgressTabCourseGradeSlot /></div> */}
            {/* <div className="col-12 col-md-12 p-0 px-md-2"><ProgressTabCertificateStatusMainBodySlot /></div> */}
            {/* <div className="col-12 col-md-12 p-0 px-md-2"><ProgressTabGradeBreakdownSlot /></div> */}
          </div>
        </div>

        {/* Side panel */}
        {/* <div className="col-12 col-md-4 p-0 px-md-2">
          <ProgressTabCertificateStatusSidePanelSlot /> */}
        {/* <ProgressTabRelatedLinksSlot /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default ProgressTab;
