import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { sendTrackEvent, sendTrackingLogEvent } from '@edx/frontend-platform/analytics';

import { checkBlockCompletion } from '@src/courseware/data';
import { getCourseOutline } from '@src/courseware/data/selectors';
import SolidSvgComponent from '@src/_components/SolidSvgComponent';
import unCheckIcon from '@src/assets/images/checkbox-unchecked-active.svg';
import checkIcon from '@src/assets/images/checkbox-checked.svg';
import lessonIcon from '@src/assets/images/lessonIcon.svg';
// import { UNIT_ICON_TYPES } from './UnitIcon';
import { useEffect } from 'react';
import messages from '../messages';

const SidebarUnit = ({
  id,
  intl,
  courseId,
  sequenceId,
  isFirst,
  unit,
  isActive,
  // isLocked,
  activeUnitId,
  isAllCompletedExcludeLast,
}) => {
  const {
    complete,
    title,
    // icon = UNIT_ICON_TYPES.other,
  } = unit;
  const dispatch = useDispatch();
  const { sequences = {} } = useSelector(getCourseOutline);

  const logEvent = (eventName, widgetPlacement) => {
    const findSequenceByUnitId = (unitId) => Object.values(sequences).find(seq => seq.unitIds.includes(unitId));
    const activeSequence = findSequenceByUnitId(activeUnitId);
    const targetSequence = findSequenceByUnitId(id);
    const payload = {
      id: activeUnitId,
      current_tab: activeSequence.unitIds.indexOf(activeUnitId) + 1,
      tab_count: activeSequence.unitIds.length,
      target_id: id,
      target_tab: targetSequence.unitIds.indexOf(id) + 1,
      widget_placement: widgetPlacement,
    };

    if (activeSequence.id !== targetSequence.id) {
      payload.target_tab_count = targetSequence.unitIds.length;
    }

    sendTrackEvent(eventName, payload);
    sendTrackingLogEvent(eventName, payload);
  };

  const handleClick = () => {
    logEvent('edx.ui.lms.sequence.tab_selected', 'left');
    dispatch(checkBlockCompletion(courseId, sequenceId, activeUnitId));
  };

  useEffect(() => {
    let intervalId;

    if (!complete && isAllCompletedExcludeLast) {
      intervalId = setInterval(() => {
        dispatch(checkBlockCompletion(courseId, sequenceId, activeUnitId));
      }, 2000); // every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // cleanup on unmount or deps change
      }
    };
  }, [complete, courseId, sequenceId, activeUnitId, dispatch, isAllCompletedExcludeLast]);

  // const iconType = isLocked ? UNIT_ICON_TYPES.lock : icon;

  const getIcon = () => {
    if (complete) {
      return <SolidSvgComponent url={checkIcon} width={20} height={20} defaultClass="mr-1" isIconColor />;
    } if (isActive) {
      return <SolidSvgComponent url={unCheckIcon} width={20} height={20} defaultClass="mr-1" isIconColor />;
    }
    return <SolidSvgComponent url={lessonIcon} width={20} height={20} defaultClass="mr-1" isIconColor />;
  };

  return (
    <li className={classNames({ active: isActive, '': !isFirst, 'bg-white-500': complete })}>
      <Link
        to={`/course/${courseId}/${sequenceId}/${id}`}
        className="row w-100 m-0 d-flex align-items-center text-gray-700"
        onClick={handleClick}
      >
        <div className="col-auto p-0">
          {getIcon()}
        </div>
        <div className="col-10 p-0 ml-3 text-break text-sm v2-text-black-400">
          <span className="align-middle">
            {title}
          </span>
          <span className="sr-only">
            , {intl.formatMessage(complete ? messages.completedUnit : messages.incompleteUnit)}
          </span>
        </div>
      </Link>
    </li>
  );
};

SidebarUnit.propTypes = {
  intl: intlShape.isRequired,
  id: PropTypes.string.isRequired,
  isFirst: PropTypes.bool.isRequired,
  unit: PropTypes.shape({
    complete: PropTypes.bool,
    icon: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  // isLocked: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  isAllCompletedExcludeLast: PropTypes.bool.isRequired,
};

export default injectIntl(SidebarUnit);
