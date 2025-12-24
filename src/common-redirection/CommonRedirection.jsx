import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import CookieManager from '../helper/cookieManager';
import { getParamfromUrl, HttpMethod, HttpWrapper } from '../helper/httpWrapper';
import PageLoading from '../generic/PageLoading';

const CommonRedirection = () => {
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
    if (!url) { return; }

    if (url.includes('authoring')) {
      if (window.location.hostname.includes('local')) {
        window.location.href = `http://${window.location.hostname}:2001${url}`;
      } else {
        window.location.href = url;
      }
    } else {
      navigate(url);
    }
  };

  const signinRedirection = (tokenId, communityid) => {
    let communityId = getCurrentCommunityId() || communityid;

    HttpWrapper.call(HttpMethod.GET, '/auth/login/data', { tokenId }, {})
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

        if (!communityId) {
          communityId = getCurrentCommunityId(res.user.userId);
        }

        if (!openedx.cookies) {
          throw new Error('Courses Cookies not found');
        }

        CookieManager.setOpenedxCookies(openedx.cookies);

        if (!communityId || communityId === res?.communityDetails?.communityId) {
          CookieManager.setCommunityToken(community.token);
        } else {
          CookieManager.removeCommunityToken();
          CookieManager.setCookie(
            `selected_community_${res.user.userId}`,
            communityId,
            CookieManager.calculateDomain(),
          );
        }

        localStorage.setItem('selected_community', communityId);

        const nextPage = getParamfromUrl(window.location.search, 'nextPage');
        let url = `/course/${courseId}`;

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
            url = `/course/${courseId}`;
            break;
          default:
            url = `/course/${courseId}/home`;
        }

        redirectToPage(url);
      })
      .catch(() => {
        navigate(`/course/${courseId}/not-found`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const signInToken = getParamfromUrl(window.location.search, 'token');
    const communityId = getParamfromUrl(window.location.search, 'communityId');

    if (signInToken && communityId) {
      signinRedirection(signInToken, communityId);
    } else {
      navigate(`/course/${courseId}/not-found`);
    }
  }, [courseId, navigate]);

  if (loading) {
    return <PageLoading />;
  }

  return null;
};

export default CommonRedirection;
