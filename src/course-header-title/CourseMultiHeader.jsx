import PropTypes from 'prop-types';
import CourseCommunityHeader from './CourseCommunityHeader';
import CourseTitleHeader from './CourseTitleHeader';

const CourseMultiHeader = ({ slice }) => (
  <>
    <CourseCommunityHeader />
    <CourseTitleHeader slice={slice} />
  </>
);

CourseMultiHeader.propTypes = {
  slice: PropTypes.string.isRequired,
};

export default CourseMultiHeader;
