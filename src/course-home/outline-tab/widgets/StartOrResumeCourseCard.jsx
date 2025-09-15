import React from 'react';
import { Button, Card } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const StartOrResumeCourseCard = ({ intl }) => {
  const username = JSON.parse(localStorage.getItem('user') || '{}')?.name || '-';
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const course = useModel('courseHomeMeta', courseId);
  const {
    org,
    // title,
  } = course;
  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const outline = useModel('outline', courseId);
  const {
    resumeCourse: {
      hasVisitedCourse,
      url: resumeCourseUrl,
    },
  } = outline;

  const {
    completionSummary: {
      completeCount = 0,
      incompleteCount = 0,
      lockedCount = 0,
    } = {}, // fallback to empty object if completionSummary is undefined
  } = useModel('progress', courseId) || {}; // fallback if useModel returns null/undefined

  const numTotalUnits = completeCount + incompleteCount + lockedCount;

  const completePercentage = numTotalUnits > 0 ? Math.round((completeCount / numTotalUnits) * 100) : 0;
  // ✅ Example progress value (replace with real logic from your model/store)
  const progressPercent = completePercentage; // TODO: calculate dynamically
  const isCompleted = progressPercent >= 100; // TODO: calculate dynamically

  const enrolledUser = course && course.isEnrolled !== undefined && course.isEnrolled;
  const needEnroll = !enrolledUser && outline && outline.enrollAlert ? outline.enrollAlert.canEnroll : false;

  if (!resumeCourseUrl) {
    return null;
  }

  const logResumeCourseClick = () => {
    sendTrackingLogEvent('edx.course.home.resume_course.clicked', {
      ...eventProperties,
      event_type: hasVisitedCourse ? 'resume' : 'start',
      url: resumeCourseUrl,
    });
  };

  if (needEnroll) {
    return null;
  }

  let buttonLabel;
  if (hasVisitedCourse) {
    buttonLabel = isCompleted
      ? intl.formatMessage(messages.completed)
      : intl.formatMessage(messages.resume);
  } else {
    buttonLabel = intl.formatMessage(messages.start);
  }

  return (
    <Card className="mb-4 raised-card card p-4 d-flex flex-row justify-content-between align-items-center" data-testid="start-resume-card">
      <h2 className="card-header-custom mr-3 mb-0 welcome-text">{intl.formatMessage(messages.welcomeUser, { name: username })}</h2>
      <Button
        variant="brand"
        className="btn-filled"
        href={resumeCourseUrl}
        onClick={() => logResumeCourseClick()}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
};

StartOrResumeCourseCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartOrResumeCourseCard);
