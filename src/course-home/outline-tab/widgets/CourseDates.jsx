import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import DateSummary from '../DateSummary';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseDates = ({
  intl,
}) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    userTimezone,
    enrolledDate,
    isEnrolled: isEnrolledOrNot,
  } = useModel('courseHomeMeta', courseId);
  const {
    datesWidget: {
      datesTabLink,
    },
    // resumeCourse,
  } = useModel('outline', courseId);

  const isEnrolled = isEnrolledOrNot;

  if (!isEnrolledOrNot) {
    return null;
  }

  return (
    <section className="mb-4 card px-4 pt-3 pb-4">
      <div id="courseHome-dates">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 card-header-custom">{intl.formatMessage(messages.dates)}</h2>
          {isEnrolled && (
          <a id="dates-tab-link" className="ml-4 small btn-blue" href={datesTabLink}>
            {intl.formatMessage(messages.allDates)}
          </a>
          )}
        </div>

        <ol className="list-unstyled">
          {/* {courseDateBlocks.map((courseDateBlock) => ( */}
          <DateSummary
            key={enrolledDate}
            dateBlock={enrolledDate}
            userTimezone={userTimezone}
            isEnrolled={isEnrolled}
          />
          {/* ))} */}
        </ol>
      </div>
    </section>
  );
};

CourseDates.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseDates);
