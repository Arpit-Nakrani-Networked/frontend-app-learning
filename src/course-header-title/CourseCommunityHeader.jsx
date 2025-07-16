// import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { useModel } from '../generic/model-store';
import { NETWORKED_FRONTEND_URL } from '../helper/constants';
import { HttpMethod, HttpWrapper } from '../helper/httpWrapper';

const DEFAULT_COMMUNITY_IMAGE = 'https://wellness.mcmaster.ca/app/uploads/2020/01/23-SWNL_Photo-Hearders_72_4.jpg';
const DEFAULT_COMMUNITY_NAME = 'How women lead';
const DEFAULT_USER_PROFILE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s';

const CourseCommunityHeader = () => {
  const navigate = useNavigate();
  const { courseId, sequenceId, unitId } = useParams();
  // const {
  //     courseId,
  // } = useSelector(state => state.courseHome);
  // State initialized from localStorage or fallback default
  const [isLoading, setIsLoading] = useState(
    false,
  );
  const [communityImage, setCommunityImage] = useState(
    localStorage.getItem('communityImage') || DEFAULT_COMMUNITY_IMAGE,
  );
  const [communityName, setCommunityName] = useState(
    localStorage.getItem('communityName') || DEFAULT_COMMUNITY_NAME,
  );
  const [userProfile, setUserProfile] = useState(
    localStorage.getItem('userProfile') || DEFAULT_USER_PROFILE,
  );

  const handleBackClick = () => {
    if (sequenceId || unitId) {
      navigate(`/course/${courseId}/home`);
    } else {
      window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
    }
  };

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const user = await HttpWrapper.call(
        HttpMethod.GET,
        '/global/open-edx/header-meta',
        {},
        undefined,
      );

      const newCommunityName = user?.community?.name || DEFAULT_COMMUNITY_NAME;
      const newCommunityImage = user?.community?.image?.url || DEFAULT_COMMUNITY_IMAGE;
      const newUserProfile = user?.user?.image?.url || DEFAULT_USER_PROFILE;

      // Update localStorage
      localStorage.setItem('communityName', newCommunityName);
      localStorage.setItem('communityImage', newCommunityImage);
      localStorage.setItem('userProfile', newUserProfile);

      // Update state
      setCommunityName(newCommunityName);
      setCommunityImage(newCommunityImage);
      setUserProfile(newUserProfile);
    } catch (error) {
      // console.error('❌ Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return !isLoading && (
    <div className="container-fluid community-header">
      <div className="course-content">
        <div className="course-info">
          <img src={communityImage} alt="Course" className="course-image" />
          <span className="course-title">{communityName}</span>
        </div>
        <div className="course-actions">
          <button type="button" className="back-button" onClick={handleBackClick}>
            &lt; Back to Course
          </button>
          <img src={userProfile} alt="User" className="user-avatar" />
        </div>
      </div>
    </div>
  );
};

export default CourseCommunityHeader;
