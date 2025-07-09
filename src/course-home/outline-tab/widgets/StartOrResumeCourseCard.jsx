import React from 'react';
import { Button, Card } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const StartOrResumeCourseCard = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const course = useModel('courseHomeMeta', courseId);
  const { org,
    title } = course;
  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const outline = useModel('outline', courseId);
  const { resumeCourse: {
    hasVisitedCourse,
    url: resumeCourseUrl,
  }, } = outline;
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

  if(needEnroll){
    return null;
  }

  return (
    <Card className="mb-3 raised-card card p-4 d-flex flex-row justify-content-between align-items-center" data-testid="start-resume-card">
      <h2 className='card-header-custom mr-3 mb-0'>{hasVisitedCourse ? `${title} - ${intl.formatMessage(messages.resumeBlurb)}` : `${intl.formatMessage(messages.welcomeTo)} ${title}`}</h2>
      <Button
        variant="brand"
        className='btn-filled'
        href={resumeCourseUrl}
        onClick={() => logResumeCourseClick()}
      >
        {hasVisitedCourse ? intl.formatMessage(messages.resume) : intl.formatMessage(messages.start)}
      </Button>
    </Card>
  );
};

StartOrResumeCourseCard.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartOrResumeCourseCard);
