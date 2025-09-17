import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useModel } from '../generic/model-store';

const CourseTitleHeader = ({ slice }) => {
  const { courseId: courseIdFromUrl } = useParams();

  const { title } = useModel(slice, courseIdFromUrl);

  return (
    <div className="container-fluid main-course-header">
      <h1 className="h2" title={title} data-course-id={courseIdFromUrl}>
        {title}
      </h1>
    </div>
  );
};

CourseTitleHeader.propTypes = {
  slice: PropTypes.string.isRequired,
};

export default CourseTitleHeader;
