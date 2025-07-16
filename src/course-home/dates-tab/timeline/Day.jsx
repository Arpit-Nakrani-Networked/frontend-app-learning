import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import {
  FormattedDate,
  FormattedTime,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { Tooltip, OverlayTrigger } from '@openedx/paragon';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useModel } from '../../../generic/model-store';

import { getBadgeListAndColor } from './badgelist';
import { isLearnerAssignment } from '../utils';

const Day = ({
  date,
  first,
  intl,
  items,
  last,
}) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const {
    userTimezone,
  } = useModel('courseHomeMeta', courseId);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const { badges, isActive } = getBadgeListAndColor(date, intl, null, items);

  return (
    <li className="dates-day pb-4" data-testid="dates-day">
      {/* Top Line */}
      {!first && <div className="dates-line-top border-1 border-left border-gray-900 bg-gray-900" />}

      {/* Dot */}
      <div className={classNames('dates-dot w-auto h-auto bg-white py-2')}>
        {isActive ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0003 27.3346C6.63633 27.3346 0.666992 21.3653 0.666992 14.0013C0.666992 6.6373 6.63633 0.667969 14.0003 0.667969C21.3643 0.667969 27.3337 6.6373 27.3337 14.0013C27.3337 21.3653 21.3643 27.3346 14.0003 27.3346ZM14.0003 24.668C16.8293 24.668 19.5424 23.5442 21.5428 21.5438C23.5432 19.5434 24.667 16.8303 24.667 14.0013C24.667 11.1723 23.5432 8.45922 21.5428 6.45883C19.5424 4.45844 16.8293 3.33464 14.0003 3.33464C11.1713 3.33464 8.45824 4.45844 6.45785 6.45883C4.45747 8.45922 3.33366 11.1723 3.33366 14.0013C3.33366 16.8303 4.45747 19.5434 6.45785 21.5438C8.45824 23.5442 11.1713 24.668 14.0003 24.668ZM14.0003 18.0013C12.9395 18.0013 11.922 17.5799 11.1719 16.8297C10.4218 16.0796 10.0003 15.0622 10.0003 14.0013C10.0003 12.9404 10.4218 11.923 11.1719 11.1729C11.922 10.4227 12.9395 10.0013 14.0003 10.0013C15.0612 10.0013 16.0786 10.4227 16.8288 11.1729C17.5789 11.923 18.0003 12.9404 18.0003 14.0013C18.0003 15.0622 17.5789 16.0796 16.8288 16.8297C16.0786 17.5799 15.0612 18.0013 14.0003 18.0013Z" fill="#0566FA" />
          </svg>
        )
          : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.0003 27.3346C6.63633 27.3346 0.666992 21.3653 0.666992 14.0013C0.666992 6.6373 6.63633 0.667969 14.0003 0.667969C21.3643 0.667969 27.3337 6.6373 27.3337 14.0013C27.3337 21.3653 21.3643 27.3346 14.0003 27.3346ZM12.671 19.3346L22.0977 9.90664L20.2123 8.0213L12.671 15.564L8.89899 11.792L7.01366 13.6773L12.671 19.3346Z" fill="black" fill-opacity="0.6" />
            </svg>
          )}
      </div>

      {/* Bottom Line */}
      {!last && <div className="dates-line-bottom border-1 border-left border-gray-900 bg-gray-900" />}

      {/* Content */}
      <div className="d-inline-block ml-5 pl-2 pt-2 mt-1">
        <div className="row w-100 m-0 mb-1 align-items-center font-weight-medium v2-text-black-400 text-base" data-testid="dates-header">
          <FormattedDate
            value={date}
            day="numeric"
            month="short"
            weekday="short"
            year="numeric"
            {...timezoneFormatArgs}
          />
          {badges}
        </div>
        {items.map((item) => {
          const { badges: itemBadges } = getBadgeListAndColor(date, intl, item, items);

          const showDueDateTime = item.dateType === 'assignment-due-date';
          const showLink = item.link && isLearnerAssignment(item);
          const title = showLink ? (<u><a href={item.link} className="text-reset">{item.title}</a></u>) : item.title;
          const available = item.learnerHasAccess && (item.link || !isLearnerAssignment(item));
          const textColor = available ? '' : 'text-gray-500';

          return (
            <div key={item.title + item.date} className={classNames(textColor, 'small pb-1')} data-testid="dates-item">
              <div>
                <span className="small">
                  <span className="">{item.assignmentType && `${item.assignmentType}: `}{title}</span>
                  {showDueDateTime && (
                    <span>
                      <span className="mx-1">due</span>
                      <FormattedTime
                        value={date}
                        timeZoneName="short"
                        {...timezoneFormatArgs}
                      />
                    </span>
                  )}
                </span>
                {itemBadges}
                {item.extraInfo && (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>{item.extraInfo}</Tooltip>
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="fa-xs ml-1 text-gray-700" data-testid="dates-extra-info" />
                  </OverlayTrigger>
                )}
              </div>
              {/* {item.description && <div className="small mb-2">{item.description}</div>} */}
            </div>
          );
        })}
      </div>
    </li>
  );
};

Day.propTypes = {
  date: PropTypes.objectOf(Date).isRequired,
  first: PropTypes.bool,
  intl: intlShape.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    dateType: PropTypes.string,
    description: PropTypes.string,
    dueNext: PropTypes.bool,
    learnerHasAccess: PropTypes.bool,
    link: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  last: PropTypes.bool,
};

Day.defaultProps = {
  first: false,
  last: false,
};

export default injectIntl(Day);
