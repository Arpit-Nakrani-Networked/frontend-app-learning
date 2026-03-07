import React from 'react';
import { FormattedDate } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import './DateSummary.scss';
import SolidSvgComponent from '../../_components/SolidSvgComponent';
import dateIcon from '../../assets/images/dateIcon.svg';

const DateSummary = ({
  dateBlock,
  userTimezone,
  isEnrolled,
}) => {
  // const {
  //   courseId,
  // } = useSelector(state => state.courseHome);
  // const {
  //   org,
  // } = useModel('courseHomeMeta', courseId);

  // const linkedTitle = dateBlock.link && isLearnerAssignment(dateBlock);
  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  // const logVerifiedUpgradeClick = () => {
  //   sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
  //     org_key: org,
  //     courserun_key: courseId,
  //     linkCategory: '(none)',
  //     linkName: 'course_home_dates',
  //     linkType: 'link',
  //     pageName: 'course_home',
  //   });
  // };

  return (
    <li className="p-0 mb-3 small text-dark-500">
      <div className="row">
        {/* <FontAwesomeIcon icon={faCalendarAlt} className="ml-3 mr-1" fixedWidth /> */}
        <SolidSvgComponent url={dateIcon} width={20} height={20} defaultClass="ml-3 mr-1" isIconColor />
        <div className="ml-1">
          {isEnrolled ? (
            <FormattedDate
              value={dateBlock}
              day="numeric"
              month="short"
              weekday="short"
              year="numeric"
              {...timezoneFormatArgs}
            />
          ) : '-'}
        </div>
      </div>
      {/* <div className="row ml-4 pr-2">
        <div className="date-summary-text">
          {linkedTitle && (
            <div className="font-weight-bold mt-2">
              <a href={dateBlock.link}>{dateBlock.title}</a>
            </div>
          )}
          {!linkedTitle && (
            <div className="font-weight-bold mt-2">{dateBlock.title}</div>
          )}
        </div>
        {dateBlock.description && (
          <div className="date-summary-text mt-1">{dateBlock.description}</div>
        )}
        {!linkedTitle && dateBlock.link && (
          <a
            href={dateBlock.link}
            onClick={dateBlock.dateType === 'verified-upgrade-deadline' ? logVerifiedUpgradeClick : () => {}}
            className="description-link"
          >
            {dateBlock.linkText}
          </a>
        )}
      </div> */}
    </li>
  );
};

DateSummary.propTypes = {
  dateBlock: PropTypes.shape({
    date: PropTypes.string.isRequired,
    dateType: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    linkText: PropTypes.string,
    title: PropTypes.string.isRequired,
    learnerHasAccess: PropTypes.bool,
  }).isRequired,
  userTimezone: PropTypes.string,
  isEnrolled: PropTypes.bool,
};

DateSummary.defaultProps = {
  userTimezone: null,
};

export default DateSummary;
