import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useModel } from '../generic/model-store';
import MenuIcon from '../assets/images/mobile-menu-icon.svg';
import SolidSvgComponent from '../_components/SolidSvgComponent';

const CourseTitleHeader = ({ slice }) => {
  const { courseId: courseIdFromUrl, unitId, sequenceId } = useParams();

  const { title } = useModel(slice, courseIdFromUrl);

  return (
    <div className="container-fluid main-course-header">
      {courseIdFromUrl && Boolean(sequenceId || unitId) && <SolidSvgComponent url={MenuIcon} width={36} height={36} defaultClass="mr-1" isIconColor id="mobile-sidebar-toggle" />}
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
