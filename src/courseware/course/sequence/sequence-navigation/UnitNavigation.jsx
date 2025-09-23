import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  injectIntl, intlShape, isRtl, getLocale,
} from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';

import { GetCourseExitNavigation } from '../../course-exit';

import UnitNavigationEffortEstimate from './UnitNavigationEffortEstimate';
import { useSequenceNavigationMetadata } from './hooks';
import messages from './messages';

const UnitNavigation = ({
  intl,
  sequenceId,
  unitId,
  onClickPrevious,
  onClickNext,
  isAtTop,
}) => {
  const {
    isFirstUnit, isLastUnit, nextLink, previousLink,
  } = useSequenceNavigationMetadata(sequenceId, unitId);
  const { courseId, courseOutline } = useSelector(state => state.courseware);

  const { sections = {} } = courseOutline;

  const renderPreviousButton = () => {
    const disabled = isFirstUnit;
    const prevArrow = isRtl(getLocale()) ? faChevronRight : faChevronLeft;
    return isFirstUnit ? null : (
      <Button
        variant="outline-secondary"
        className="h-fit previous-button mr-sm-2 d-flex align-items-center justify-content-center px-3"
        disabled={disabled}
        onClick={onClickPrevious}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : previousLink}
      >
        <FontAwesomeIcon icon={prevArrow} className="mr-2" size="sm" />
        {intl.formatMessage(messages.previousButton)}
      </Button>
    );
  };

  const renderNextButton = () => {
    const isAllComepleted = Object.keys(sections).length > 0
      ? Object.values(sections).filter(val => !val?.complete)?.length === 0
      : false;
    const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);
    const buttonText = (isLastUnit && exitText) ? exitText : intl.formatMessage(messages.nextButton);
    const disabled = Boolean(isLastUnit && (!isAllComepleted || !exitActive));
    const nextArrow = isRtl(getLocale()) ? faChevronLeft : faChevronRight;

    return (
      <Button
        variant="outline-primary"
        className="h-fit next-button d-flex align-items-center justify-content-center px-3"
        onClick={onClickNext}
        disabled={disabled}
        as={disabled ? undefined : Link}
        to={disabled ? undefined : nextLink}
      >
        <UnitNavigationEffortEstimate sequenceId={sequenceId} unitId={unitId}>
          {buttonText}
        </UnitNavigationEffortEstimate>
        <FontAwesomeIcon icon={nextArrow} className="ml-2" size="sm" />
      </Button>
    );
  };

  return (
    <div className={classNames('unit-navigation d-flex', { 'top-unit-navigation': isAtTop })}>
      {renderPreviousButton()}
      {renderNextButton()}
    </div>
  );
};

UnitNavigation.propTypes = {
  intl: intlShape.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  isAtTop: PropTypes.bool,
};

UnitNavigation.defaultProps = {
  unitId: null,
  isAtTop: false,
};

export default injectIntl(UnitNavigation);
