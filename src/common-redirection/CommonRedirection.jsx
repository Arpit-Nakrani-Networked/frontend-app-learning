import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import CookieManager from '../helper/cookieManager';
import { getParamfromUrl, HttpMethod, HttpWrapper } from '../helper/httpWrapper';
import PageLoading from '../generic/PageLoading';

const CommonRedirection = () => {
  // Loader should be visible immediately on mount
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const getCurrentCommunityId = (userId) => {
    const currentUserId = userId
      || (localStorage.getItem('user')
        && JSON.parse(localStorage.getItem('user'))?.userId);

    return (
      getParamfromUrl(window.location.search, 'communityId')
      || (currentUserId
        && CookieManager.getCookie(`selected_community_${currentUserId}`))
      || ''
    );
  };

  const redirectToPage = (url) => {
    if (!url) {
      setLoading(false);
      return;
    }

    // Keep loader visible until redirect
    setTimeout(() => {
      if (url.includes('authoring')) {
        if (window.location.hostname.includes('local')) {
          window.location.href = `http://${window.location.hostname}:2001${url}`;
        } else {
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    }, 100); // slight delay to ensure loader renders
  };

  const signinRedirection = (tokenId, communityid) => {
    let communityId = getCurrentCommunityId() || communityid;
    setLoading(true); // Ensure loader is visible during API call
    HttpWrapper.call(HttpMethod.GET, '/auth/openedx-login/data', { tokenId, communityId }, {})
      .then((res) => {
        const {
          user,
          community,
          sessionToken,
          openedx = {},
        } = res;

        localStorage.setItem('user', JSON.stringify(user));
        CookieManager.setSessionToken(sessionToken);
        CookieManager.setTokenId(res.tokendId || tokenId);

        if (res?.communityDetails?.communityId) {
          communityId = res?.communityDetails?.communityId || getCurrentCommunityId(res.user.userId);
        }

        if (!openedx.cookies) {
          throw new Error('Courses Cookies not found');
        }

        CookieManager.setOpenedxCookies(openedx.cookies);
        CookieManager.setCommunityToken(community.token);
        if (communityId || res?.communityDetails?.communityId) {
          CookieManager.setCookie(
            `selected_community_${res.user.userId}`,
            communityId || res?.communityDetails?.communityId,
            CookieManager.calculateDomain(),
          );
        }

        localStorage.setItem('selected_community', communityId);

        const nextPage = getParamfromUrl(window.location.search, 'nextPage');
        let url = `/learning/course/${courseId}`;

        switch (nextPage) {
          case 'add-lesson':
          case 'edit-lesson':
            url = `/authoring/course/${courseId}`;
            break;
          case 'student-overview':
            url = `/authoring/course/${courseId}/settings/student-overview`;
            break;
          case 'score-board':
            url = `/authoring/course/${courseId}/settings/score-board`;
            break;
          case 'grading':
            url = `/authoring/course/${courseId}/settings/grading`;
            break;
          case 'resume-course':
          case 'start-course':
            url = `/learning/course/${courseId}`;
            break;
          default:
            url = `/learning/course/${courseId}/home`;
        }

        // Loader remains until redirect
        redirectToPage(url);
      })
      .catch(() => {
        setLoading(false);
        window.location.href = `/learning/course/${courseId}/not-found`;
      });
  };

  useEffect(() => {
    setLoading(true); // Show loader immediately on mount
    const signInToken = getParamfromUrl(window.location.search, 'token');
    const communityId = getParamfromUrl(window.location.search, 'communityId');

    if (signInToken && communityId) {
      signinRedirection(signInToken, communityId);
    } else {
      setLoading(false);
      window.location.href = `/learning/course/${courseId}/not-found`;
    }
  }, [courseId, navigate]);

  if (loading) {
    return <PageLoading />;
  }

  return null;
};

export default CommonRedirection;
