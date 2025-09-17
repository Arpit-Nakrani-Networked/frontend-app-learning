import PropTypes from 'prop-types';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

// import { BookmarkButton } from '@src/courseware/course/bookmark';
// import messages from '@src/courseware/course/sequence/messages';
// import { useIntl } from '@edx/frontend-platform/i18n';

const UnitTitleSlot = ({
  unitId,
  unit,
  isEnabledOutlineSidebar,
  renderUnitNavigation,
}) => (
  <PluginSlot
    id="org.openedx.frontend.learning.unit_title.v1"
    idAliases={['unit_title_slot']}
    pluginProps={{
      unitId,
      unit,
      isEnabledOutlineSidebar,
      renderUnitNavigation,
    }}
  >
    <div className="d-flex justify-content-between">
      <div className="mb-0 w-100">
        <h3 className="h3" title={unit.title}>{unit.title}</h3>
      </div>
      {/* <div className='mr-3'>
        <BookmarkButton
        unitId={unit.id}
        isBookmarked={unit.bookmarked}
        isProcessing={isProcessing}
      />
      </div> */}
      {isEnabledOutlineSidebar && renderUnitNavigation(true)}
    </div>
    {/* <p className="sr-only">{formatMessage(messages.headerPlaceholder)}</p> */}
  </PluginSlot>
);

UnitTitleSlot.propTypes = {
  // courseId: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
  // unitTitle: PropTypes.string.isRequired,
  renderUnitNavigation: PropTypes.func.isRequired,
  isEnabledOutlineSidebar: PropTypes.bool.isRequired,
  unit: PropTypes.shape({
    complete: PropTypes.bool,
    icon: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default UnitTitleSlot;
