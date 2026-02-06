import PropTypes from 'prop-types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useModel } from '@src/generic/model-store';
import { usePluginsCallback } from '@src/generic/plugin-store';

// import BookmarkButton from '../../bookmark/BookmarkButton';
import messages from '../messages';
import ContentIFrame from './ContentIFrame';
// import UnitSuspense from './UnitSuspense';
import { modelKeys, views } from './constants';
import { useExamAccess, useShouldDisplayHonorCode } from './hooks';
import { getIFrameUrl } from './urls';
import UnitTitleSlot from '../../../../plugin-slots/UnitTitleSlot';

const Unit = ({
  courseId,
  format,
  onLoaded,
  id,
  isEnabledOutlineSidebar,
  renderUnitNavigation = () => {},
}) => {
  const { formatMessage } = useIntl();
  const [searchParams] = useSearchParams();
  const { authenticatedUser } = React.useContext(AppContext);
  const examAccess = useExamAccess({ id });
  const shouldDisplayHonorCode = useShouldDisplayHonorCode({ courseId, id });
  const unit = useModel(modelKeys.units, id);
  // const isProcessing = unit.bookmarkedUpdateState === 'loading';
  const view = authenticatedUser ? views.student : views.public;

  const getUrl = usePluginsCallback('getIFrameUrl', () => getIFrameUrl({
    id,
    view,
    format,
    examAccess,
    jumpToId: searchParams.get('jumpToId'),
  }));

  const iframeUrl = getUrl();

  // In React repo - add this to the component that contains #unit-iframe
  React.useEffect(() => {
    const handleFullscreenToggle = (event) => {
      // Optional: validate origin for security
      // if (event.origin !== 'https://your-lms-domain.com') return;

      if (event.data.type === 'UNIT_FULLSCREEN_TOGGLE') {
        const unitIframe = document.getElementById('unit-iframe');

        if (!unitIframe) {
          // eslint-disable-next-line no-console
          console.warn('[React] #unit-iframe not found');
          return;
        }

        // Toggle fullscreen state
        const isCurrentlyFullscreen = unitIframe.dataset.fullscreen === 'true';

        if (!isCurrentlyFullscreen) {
          // Enter fullscreen
          unitIframe.dataset.origStyle = unitIframe.getAttribute('style') || '';
          unitIframe.dataset.fullscreen = 'true';

          unitIframe.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          `;
          // eslint-disable-next-line no-console
          console.log('[React] Fullscreen applied to #unit-iframe');
        } else {
          // Exit fullscreen
          unitIframe.setAttribute('style', unitIframe.dataset.origStyle || '');
          delete unitIframe.dataset.origStyle;
          delete unitIframe.dataset.fullscreen;
          // eslint-disable-next-line no-console
          console.log('[React] Fullscreen removed from #unit-iframe');
        }
      }
    };

    window.addEventListener('message', handleFullscreenToggle);

    return () => {
      window.removeEventListener('message', handleFullscreenToggle);
    };
  }, []);

  return (
    <div className="unit">
      <div className="mb-0">
        {/* <h3 className="h3">{unit.title}</h3> */}
        <UnitTitleSlot
          courseId={courseId}
          unit={unit}
          unitId={id}
          unitTitle={unit.title}
          isEnabledOutlineSidebar={isEnabledOutlineSidebar}
          renderUnitNavigation={renderUnitNavigation}
        />
      </div>
      {/* <h2 className="sr-only">{formatMessage(messages.headerPlaceholder)}</h2>
      <BookmarkButton
        unitId={unit.id}
        isBookmarked={unit.bookmarked}
        isProcessing={isProcessing}
      /> */}
      {/* <UnitSuspense {...{ courseId, id }} /> */}
      <ContentIFrame
        elementId="unit-iframe"
        id={id}
        iframeUrl={iframeUrl}
        loadingMessage={formatMessage(messages.loadingSequence)}
        onLoaded={onLoaded}
        shouldShowContent={!shouldDisplayHonorCode && !examAccess.blockAccess}
        title={unit.title}
        courseId={courseId}
      />
    </div>
  );
};

Unit.propTypes = {
  isEnabledOutlineSidebar: PropTypes.bool.isRequired,
  renderUnitNavigation: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  onLoaded: PropTypes.func,
};

Unit.defaultProps = {
  format: null,
  onLoaded: undefined,
};

export default Unit;
