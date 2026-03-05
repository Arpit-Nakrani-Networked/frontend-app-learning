import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useModel } from '../generic/model-store';
// import { NETWORKED_FRONTEND_URL } from '../helper/constants';
import { HttpMethod, HttpWrapper } from '../helper/httpWrapper';
import { setNetworkedUserData, setNetworkedCommunityData } from '../course-home/data/slice';
import './css/CourseHeader.scss';
import Favicon from '../_components/favicon/Favicon';

const CourseCommunityHeader = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { courseId, sequenceId, unitId } = useParams();

  // Get data from Redux store
  const networkedUserData = useSelector(state => state.courseHome.networkedUserData);
  const networkedCommunityData = useSelector(state => state.courseHome.networkedCommunityData);

  const [isLoading, setIsLoading] = useState(false);

  // Use Redux data or fallback to defaults
  const communityImage = networkedCommunityData?.image;
  const communityName = networkedCommunityData?.name;
  const userProfile = networkedUserData?.image;
  const username = networkedUserData?.name;

  const getDefaultCommunityImage = () => {
    const getInitials = (name) => {
      if (!name) { return '-'; }
      return name.trim().substring(0, 2).toUpperCase();
    };

    return communityImage ? (
      <img src={communityImage} alt="Course" className="course-image" />
    ) : (
      <div className="imageFrame-asm community-image-wrapper">
        <div className="textImage text-center">{getInitials(communityName)}</div>
      </div>
    );
  };

  const getDefaultUserImage = () => {
    const getInitials = (name) => {
      if (!name) { return '-'; }
      return name.trim().substring(0, 2).toUpperCase();
    };

    return userProfile ? (
      <img src={userProfile} alt="Course" className="course-image" />
    ) : (
      <div className="imageFrame-asm profile-image-wrapper">
        <div className="textImage text-center">{getInitials(username)}</div>
      </div>
    );
  };

  // const handleBackClick = () => {
  //   if (sequenceId || unitId) {
  //     navigate(`/course/${courseId}/home`);
  //   } else {
  //     window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  //   }
  // };

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const res = await HttpWrapper.call(
        HttpMethod.GET,
        '/global/open-edx/header-meta',
        {},
        undefined,
      );

      const communityData = res?.community || {};
      const userData = res?.user || {};

      // Update Redux store only
      dispatch(setNetworkedCommunityData(communityData));
      dispatch(setNetworkedUserData(userData));
    } catch (error) {
      // On error, set empty data
      dispatch(setNetworkedCommunityData({}));
      dispatch(setNetworkedUserData({}));
      // console.error('❌ Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return !isLoading && (
    <div className="container-fluid community-header hide-after-360">
      <Favicon communityImage={communityImage} />
      <div className="course-content">
        <div className="course-info">
          {getDefaultCommunityImage()}
          <span className="course-title">{communityName}</span>
        </div>
        <div className="course-actions">
          {/* <button type="button" className="back-button" onClick={handleBackClick}>
            &lt; Back to Course
          </button> */}
          {getDefaultUserImage()}
        </div>
      </div>
    </div>
  );
};

export default CourseCommunityHeader;
