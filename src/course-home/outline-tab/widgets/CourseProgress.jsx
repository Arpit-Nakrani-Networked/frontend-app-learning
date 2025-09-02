import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

// import DateSummary from '../DateSummary';
import messages from '../messages';
import { useModel } from '../../../generic/model-store';

const CourseProgress = ({ intl }) => {
  const { courseId } = useSelector(state => state.courseHome);
  const {
    datesWidget: { courseDateBlocks },
  } = useModel('outline', courseId);

  const {
    completionSummary: {
      completeCount = 0,
      incompleteCount = 0,
      lockedCount = 0,
    } = {}, // fallback to empty object if completionSummary is undefined
  } = useModel('progress', courseId) || {}; // fallback if useModel returns null/undefined

  const numTotalUnits = completeCount + incompleteCount + lockedCount;

  const completePercentage = numTotalUnits > 0 ? Math.round((completeCount / numTotalUnits) * 100) : 0;

  // const lockedPercentage = numTotalUnits > 0 ? Math.round((lockedCount / numTotalUnits) * 100) : 0;

  // const incompletePercentage = numTotalUnits > 0 ? 100 - completePercentage - lockedPercentage : 0;

  if (courseDateBlocks.length === 0) {
    return null;
  }

  // ✅ Example progress value (replace with real logic from your model/store)
  const progressPercent = completePercentage; // TODO: calculate dynamically
  const totalprogressPercent = 100; // TODO: calculate dynamically

  return (
    <section className="mb-4 card p-4">
      <div id="courseHome-dates">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 card-header-custom">
            {intl.formatMessage(messages.courseCompleted)}
          </h2>
        </div>

        {/* Progress row */}
        <div className="d-flex justify-content-between mb-1">
          <span>{progressPercent}%</span>
          <span>{totalprogressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="progress border-blue-500" style={{ height: '8px', borderRadius: '4px' }}>
          <div
            className="progress-bar bg-blue-500"
            role="progressbar"
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Progress: ${progressPercent}%`}
          />
        </div>
      </div>
    </section>
  );
};

CourseProgress.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseProgress);
