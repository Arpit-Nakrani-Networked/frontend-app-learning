import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@openedx/paragon';
// import { ChevronRight as ChevronRightIcon } from '@openedx/paragon/icons';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { getCourseOutline, getSequenceId } from '@src/courseware/data/selectors';
import { useEffect, useState } from 'react';
import CompletionIcon from './CompletionIcon';
import SidebarUnit from './SidebarUnit';
// import { UNIT_ICON_TYPES } from './UnitIcon';

const NewSidebarSection = ({
  intl, section, courseId, activeUnitId, isLastUnCompleted,
}) => {
  const {
    // id,
    complete,
    title,
    sequenceIds,
    completionStat,
  } = section;

  const { sequences = {}, units = {} } = useSelector(getCourseOutline);
  const activeSequenceId = useSelector(getSequenceId);
  const isActiveSection = sequenceIds.includes(activeSequenceId);
  const [open, setOpen] = useState(isActiveSection);
  const [unitIds, setUnitIds] = useState([]);
  const [unitMapping, setUnitMapping] = useState({});

  useEffect(() => {
    const mapping = {};
    const ids = [];

    sequenceIds.forEach((sequenceId) => {
      const sequenceData = sequences[sequenceId];
      if (!sequenceData) { return; }

      const unitIdsInSequence = sequenceData.unitIds || [];
      unitIdsInSequence.forEach((unitId) => {
        if (!mapping[unitId]) {
          mapping[unitId] = {
            unitId,
            sequenceId,
            type: sequenceData.type,
          };
          ids.push(unitId);
        }
      });
    });

    setUnitMapping(mapping);
    setUnitIds(ids);
  }, [sequenceIds, sequences]);

  // console.log('new-sequence-unitIds', unitIds, unitMapping);

  const isCompleted = complete || (completionStat && completionStat.completed === completionStat.total);

  const sectionTitle = (
    <>
      <div className="col-auto p-0">
        <CompletionIcon completionStat={completionStat} />
      </div>
      <div className="col-10 p-0 flex-grow-1 text-dark-500 text-left text-break">
        {title}
        <span className="sr-only">
          , {intl.formatMessage(complete
          ? courseOutlineMessages.completedSection
          : courseOutlineMessages.incompleteSection)}
        </span>
      </div>
    </>
  );

  return (
    <li className="p-0">
      <Collapsible
        className={classNames('border-top-0 border-left-0 border-right-0 border-bottom rounded-0 border-black-500', { 'active-section': isActiveSection, 'bg-white-500': isCompleted, 'bg-info-100': !isCompleted && isActiveSection && !open })}
        styling="card-lg text-break rounded-0 border-0"
        style={{ borderRadius: '0px !important', borderTop: '0px !important' }}
        title={sectionTitle}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <ol className={classNames('list-unstyled border-left-0 border-right-0 border-bottom-0 border-black-500', { 'bg-white-500': isCompleted, 'border-top-0': !open, 'border-top': open })}>
          {unitIds.map((unitId, index) => {
            const mapping = unitMapping[unitId];
            if (!mapping) { return null; }

            const lastIndex = index === unitIds.length - 1;

            let isAllCompletedExcludeLast = false;

            if (lastIndex && isLastUnCompleted) {
              // Exclude the last section
              const sectionsExcludeLast = unitIds.slice(0, -1) || [];

              // Case 1: if only one section exists
              if (unitIds.length === 1) {
                isAllCompletedExcludeLast = true;
              } else {
                // Case 2: if more than one, check all except last
                const allCompletedExcludeLast = sectionsExcludeLast.every(
                  sid => unitMapping[sid]?.complete,
                );
                isAllCompletedExcludeLast = allCompletedExcludeLast;
              }
            }

            return (
              <SidebarUnit
                key={unitId}
                id={unitId}
                courseId={courseId}
                sequenceId={mapping.sequenceId}
                unit={units[unitId]}
                isActive={activeUnitId === unitId}
                activeUnitId={activeUnitId}
                isFirst={index === 0}
                isAllCompletedExcludeLast={isAllCompletedExcludeLast}
                // isLocked={mapping.type === UNIT_ICON_TYPES.lock}
              />
            );
          })}
        </ol>
      </Collapsible>
    </li>
  );
};

NewSidebarSection.propTypes = {
  intl: intlShape.isRequired,
  section: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    sequenceIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  isLastUnCompleted: PropTypes.bool.isRequired,
};

export default injectIntl(NewSidebarSection);
