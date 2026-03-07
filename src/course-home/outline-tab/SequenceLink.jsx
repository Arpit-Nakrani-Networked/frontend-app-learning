import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { Icon } from '@openedx/paragon';
// import { Block } from '@openedx/paragon/icons';
import EffortEstimate from '../../shared/effort-estimate';
import { useModel } from '../../generic/model-store';
import messages from './messages';

const SequenceLink = ({
  id,
  intl,
  courseId,
  // first,
  sequence,
  hiddenURL = false,
}) => {
  const {
    complete,
    description,
    due,
    showLink,
    title,
    // hideFromTOC,
  } = sequence;
  const {
    userTimezone,
  } = useModel('outline', courseId);
  const navigate = useNavigate();

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const coursewareUrl = <Link to={`/course/${courseId}/${id}`} className="_intialism">{title}</Link>;
  const displayTitle = showLink && !hiddenURL ? coursewareUrl : title;

  const dueDateMessage = (
    <FormattedMessage
      id="learning.outline.sequence-due-date-set"
      defaultMessage="{description} due {assignmentDue}"
      description="Used below an assignment title"
      values={{
        assignmentDue: (
          <FormattedTime
            key={`${id}-due`}
            day="numeric"
            month="short"
            year="numeric"
            timeZoneName="short"
            value={due}
            {...timezoneFormatArgs}
          />
        ),
        description: description || '',
      }}
    />
  );

  const noDueDateMessage = (
    <FormattedMessage
      id="learning.outline.sequence-due-date-not-set"
      defaultMessage="{description}"
      description="Used below an assignment title"
      values={{
        assignmentDue: (
          <FormattedTime
            key={`${id}-due`}
            day="numeric"
            month="short"
            year="numeric"
            timeZoneName="short"
            value={due}
            {...timezoneFormatArgs}
          />
        ),
        description: description || '',
      }}
    />
  );

  return (
    <li>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,
      jsx-a11y/no-static-element-interactions, react/jsx-no-bind */}
      <div
        className={classNames('subsection-outline', { completed: complete })}
        style={showLink && !hiddenURL ? { cursor: 'pointer' } : undefined}
        onClick={() => {
          if (showLink && !hiddenURL) {
            navigate(`/course/${courseId}/${id}`);
          }
        }}
      >
        <div className="row w-100 m-0 py-1">
          <div className="col-auto p-0 d-flex align-items-center justify-content-center">
            {complete ? (
              <FontAwesomeIcon
                icon={fasCheckCircle}
                fixedWidth
                className="float-left v2-text-black-600"
                style={{
                  height: '20px',
                  width: '20px',
                }}
                aria-hidden={complete}
                title={intl.formatMessage(messages.completedAssignment)}
              />
            ) : (
              <FontAwesomeIcon
                icon={farCheckCircle}
                fixedWidth
                className="float-left text-gray-400"
                style={{
                  height: '20px',
                  width: '20px',
                  color: '#00000099 !important',
                }}
                aria-hidden={complete}
                title={intl.formatMessage(messages.incompleteAssignment)}
              />
            )}
          </div>
          <div className="col-10 p-0 ml-3 text-break d-flex align-items-center">
            <span className="_truncate align-middle subsection-title _intialism">{displayTitle}</span>
            <span className="sr-only">
              , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
            </span>
            <EffortEstimate className="ml-3 align-middle text-nowrap" block={sequence} />
          </div>
        </div>
        {/* {hideFromTOC && (
          <div className="row w-100 my-2 mx-4 pl-3">
            <span className="small d-flex">
              <Icon className="mr-2" src={Block} data-testid="hide-from-toc-sequence-link-icon" />
              <span data-testid="hide-from-toc-sequence-link-text">
                {intl.formatMessage(messages.hiddenSequenceLink)}
              </span>
            </span>
          </div>
        )} */}
        <div className="row w-100 m-0 ml-3 pl-3">
          <small className="text-body pl-2">
            {due ? dueDateMessage : noDueDateMessage}
          </small>
        </div>
      </div>
    </li>
  );
};

SequenceLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  // first: PropTypes.bool.isRequired,
  sequence: PropTypes.shape().isRequired,
  hiddenURL: PropTypes.bool,
};

export default injectIntl(SequenceLink);
