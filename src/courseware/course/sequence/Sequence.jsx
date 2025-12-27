/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  sendTrackEvent,
  sendTrackingLogEvent,
} from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import SequenceExamWrapper from '@edx/frontend-lib-special-exams';
import { useToggle } from '@openedx/paragon';

import PageLoading from '@src/generic/PageLoading';
import { useModel } from '@src/generic/model-store';
import { useSequenceBannerTextAlert, useSequenceEntranceExamAlert } from '@src/alerts/sequence-alerts/hooks';
import SequenceContainerSlot from '../../../plugin-slots/SequenceContainerSlot';

import { getCoursewareOutlineSidebarSettings } from '../../data/selectors';
// import CourseLicense from '../course-license';
import Sidebar from '../sidebar/Sidebar';
import NewSidebar from '../new-sidebar/Sidebar';
import {
  Trigger as CourseOutlineTrigger,
  Sidebar as CourseOutlineTray,
} from '../sidebar/sidebars/course-outline';
import messages from './messages';
import HiddenAfterDue from './hidden-after-due';
import { SequenceNavigation, UnitNavigation } from './sequence-navigation';
import SequenceContent from './SequenceContent';
import EmptyPlaceholder from '../../../_components/empty-placeholder/EmptyPlaceholder';

const Sequence = ({
  unitId,
  sequenceId,
  courseId,
  unitNavigationHandler,
  nextSequenceHandler,
  previousSequenceHandler,
}) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle();
  const {
    canAccessProctoredExams,
    // license,
    sectionIds,
  } = useModel('coursewareMeta', courseId);
  const {
    isStaff,
    originalUserIsStaff,
    isNewDiscussionSidebarViewEnabled,
  } = useModel('courseHomeMeta', courseId);
  const sequence = useModel('sequences', sequenceId);
  const unit = useModel('units', unitId);
  const sequenceStatus = useSelector(state => state.courseware.sequenceStatus);
  const sequenceMightBeUnit = useSelector(state => state.courseware.sequenceMightBeUnit);
  // const courseOutlineStatus = useSelector(getCourseOutlineStatus);
  const { enableNavigationSidebar: isEnabledOutlineSidebar } = useSelector(getCoursewareOutlineSidebarSettings);
  const handleNext = () => {
    const nextIndex = sequence.unitIds.indexOf(unitId) + 1;
    const newUnitId = sequence.unitIds[nextIndex];
    handleNavigate(newUnitId);

    if (nextIndex >= sequence.unitIds.length) {
      nextSequenceHandler();
    }
  };

  const handlePrevious = () => {
    const previousIndex = sequence.unitIds.indexOf(unitId) - 1;
    const newUnitId = sequence.unitIds[previousIndex];
    handleNavigate(newUnitId);

    if (previousIndex < 0) {
      previousSequenceHandler();
    }
  };

  const handleNavigate = (destinationUnitId) => {
    unitNavigationHandler(destinationUnitId);
  };

  const logEvent = (eventName, widgetPlacement, targetUnitId) => {
    // Note: tabs are tracked with a 1-indexed position
    // as opposed to a 0-index used throughout this MFE
    const currentIndex = sequence.unitIds.length > 0 ? sequence.unitIds.indexOf(unitId) : 0;
    const payload = {
      current_tab: currentIndex + 1,
      id: unitId,
      tab_count: sequence.unitIds.length,
      widget_placement: widgetPlacement,
    };
    if (targetUnitId) {
      const targetIndex = sequence.unitIds.indexOf(targetUnitId);
      payload.target_tab = targetIndex + 1;
    }
    sendTrackEvent(eventName, payload);
    sendTrackingLogEvent(eventName, payload);
  };

  useSequenceBannerTextAlert(sequenceId);
  useSequenceEntranceExamAlert(courseId, sequenceId, intl);

  useEffect(() => {
    function receiveMessage(event) {
      const { type } = event.data;
      if (type === 'entranceExam.passed') {
        // I know this seems (is) intense. It is implemented this way since we need to refetch the underlying
        // course blocks that were originally hidden because the Entrance Exam was not passed.
        global.location.reload();
      }
    }
    global.addEventListener('message', receiveMessage);
  }, []);

  const [unitHasLoaded, setUnitHasLoaded] = useState(false);
  const handleUnitLoaded = () => {
    setUnitHasLoaded(true);
  };

  // We want hide the unit navigation if we're in the middle of navigating to another unit
  // but not if other things about the unit change, like the bookmark status.
  // The array property of this useEffect ensures that we only hide the unit navigation
  // while navigating to another unit.
  useEffect(() => {
    if (unit) {
      setUnitHasLoaded(false);
    }
  }, [(unit || {}).id]);

  // If sequence might be a unit, we want to keep showing a spinner - the courseware container will redirect us when
  // it knows which sequence to actually go to.
  // console.log("sequenceStatus",sequenceStatus,sequenceId,unitId,isEnabledOutlineSidebar,unitHasLoaded);

  const loading = sequenceStatus === 'loading' || (sequenceStatus === 'failed' && sequenceMightBeUnit);

  if (sectionIds?.length === 0) {
    return <div className="center-align pt-135"><EmptyPlaceholder /></div>;
  }

  // if (sequenceStatus === 'loading') {
  //   return (
  //     <PageLoading
  //       srMessage={intl.formatMessage(messages.loadingSequence)}
  //     />
  //   );
  // }

  if ((!sequenceId || !unitId) && sequenceStatus !== 'loading') {
    return <div className="center-align pt-135"><EmptyPlaceholder /></div>;
  }

  if (sequenceStatus === 'loaded' && sequence.isHiddenAfterDue) {
    // Shouldn't even be here - these sequences are normally stripped out of the navigation.
    // But we are here, so render a notice instead of the normal content.
    return <HiddenAfterDue courseId={courseId} />;
  }

  if (!loading && !sequenceId) {
    return <div className="center-align pt-135"><EmptyPlaceholder /></div>;
  }

  const gated = sequence && sequence.gatedContent !== undefined && sequence.gatedContent.gated;

  const renderUnitNavigation = (isAtTop) => (
    <UnitNavigation
      sequenceId={sequenceId}
      unitId={unitId}
      isAtTop={isAtTop}
      onClickPrevious={() => {
        logEvent('edx.ui.lms.sequence.previous_selected', 'bottom');
        handlePrevious();
      }}
      onClickNext={() => {
        logEvent('edx.ui.lms.sequence.next_selected', 'bottom');
        handleNext();
      }}
    />
  );

  const defaultContent = (
    <>
      <div className="sequence-container d-inline-flex flex-row w-100 mb-0">
        <CourseOutlineTrigger />
        <CourseOutlineTray />
        {(sequenceStatus === 'loading' || sequenceStatus === 'loaded') && (
          <div className="w-100 p-3">
            {!isEnabledOutlineSidebar && sequenceStatus === 'loaded' && (
              <div className="sequence-navigation-container">
                <SequenceNavigation
                  sequenceId={sequenceId}
                  unitId={unitId}
                  nextHandler={() => {
                    logEvent('edx.ui.lms.sequence.next_selected', 'top');
                    handleNext();
                  }}
                  onNavigate={(destinationUnitId) => {
                    logEvent('edx.ui.lms.sequence.tab_selected', 'top', destinationUnitId);
                    handleNavigate(destinationUnitId);
                  }}
                  previousHandler={() => {
                    logEvent('edx.ui.lms.sequence.previous_selected', 'top');
                    handlePrevious();
                  }}
                  {...{
                    nextSequenceHandler,
                    handleNavigate,
                    isOpen,
                    open,
                    close,
                  }}
                />
              </div>
            )}

            <div className="unit-container card container-csm flex-grow-1 p-4 w-100 overflow-hidden">
              {/* {unitHasLoaded && renderUnitNavigation(false)} */}
              {sequenceStatus === 'loading' && (
              <PageLoading
                srMessage={intl.formatMessage(messages.loadingSequence)}
              />
              )}
              {sequenceStatus === 'loaded' && (
              <SequenceContent
                courseId={courseId}
                gated={gated}
                sequenceId={sequenceId}
                unitId={unitId}
                unitLoadedHandler={handleUnitLoaded}
                isEnabledOutlineSidebar={isEnabledOutlineSidebar}
                renderUnitNavigation={unitHasLoaded ? renderUnitNavigation : () => { }}
              />
              )}
            </div>
          </div>
        )}
        {sequenceStatus === 'loaded' && isNewDiscussionSidebarViewEnabled ? <NewSidebar /> : <Sidebar />}
      </div>
      {sequenceStatus === 'loaded' && <SequenceContainerSlot courseId={courseId} unitId={unitId} />}
    </>
  );

  // sequence status 'failed' and any other unexpected sequence status.
  if (sequenceStatus === 'failed') {
    return (
      <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
        {intl.formatMessage(messages.loadFailure)}
      </p>
    );
  }

  // if (sequenceStatus === 'loaded') {
  return (
    <>
      <div className="d-flex flex-column flex-grow-1">
        <SequenceExamWrapper
          sequence={sequence}
          courseId={courseId}
          isStaff={isStaff}
          originalUserIsStaff={originalUserIsStaff}
          canAccessProctoredExams={canAccessProctoredExams}
        >
          {defaultContent}
        </SequenceExamWrapper>
      </div>
      {/* <CourseLicense license={license || undefined} /> */}
    </>
  );
  // }
};

Sequence.propTypes = {
  unitId: PropTypes.string,
  sequenceId: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  unitNavigationHandler: PropTypes.func.isRequired,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,
};

Sequence.defaultProps = {
  sequenceId: null,
  unitId: null,
};

export default Sequence;
