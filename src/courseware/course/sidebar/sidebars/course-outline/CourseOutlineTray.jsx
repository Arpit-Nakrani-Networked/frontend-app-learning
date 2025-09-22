import { useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
// import { Button, useToggle, IconButton } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
// import {
//   MenuOpen as MenuOpenIcon,
//   ChevronLeft as ChevronLeftIcon,
// } from '@openedx/paragon/icons';

// import { useModel } from '@src/generic/model-store';
import { LOADING, LOADED } from '@src/constants';
import PageLoading from '@src/generic/PageLoading';
import {
  // getSequenceId,
  getCourseOutline,
  getCourseOutlineStatus,
  getCourseOutlineShouldUpdate,
} from '../../../../data/selectors';
import { getCourseOutlineStructure } from '../../../../data/thunks';
// import SidebarSection from './components/SidebarSection';
// import SidebarSequence from './components/SidebarSequen;
// import SidebarSequence from './components/SidebarSequence';
import { ID } from './constants';
import { useCourseOutlineSidebar } from './hooks';
import messages from './messages';
import NewSidebarSection from './components/NewSidebarSection';

const CourseOutlineTray = ({ intl }) => {
  // const [selectedSection, setSelectedSection] = useState(null);
  // const [isDisplaySequenceLevel, setDisplaySequenceLevel, setDisplaySectionLevel] = useToggle(true);

  const dispatch = useDispatch();
  // const activeSequenceId = useSelector(getSequenceId);
  const { sections = {} } = useSelector(getCourseOutline);
  const courseOutlineStatus = useSelector(getCourseOutlineStatus);
  const courseOutlineShouldUpdate = useSelector(getCourseOutlineShouldUpdate);

  const {
    courseId,
    unitId,
    isEnabledSidebar,
    currentSidebar,
    // handleToggleCollapse,
    isActiveEntranceExam,
    shouldDisplayFullScreen,
  } = useCourseOutlineSidebar();

  // const {
  //   sectionId: activeSectionId,
  // } = useModel('sequences', activeSequenceId);

  const sectionsIds = Object.keys(sections);
  // const sequenceIds = sections[selectedSection || activeSectionId]?.sequenceIds || [];
  // const backButtonTitle = sections[selectedSection || activeSectionId]?.title;
  // const sequenceTitle = 'Course Outline';

  // const handleBackToSectionLevel = () => {
  //   setDisplaySectionLevel();
  //   setSelectedSection(null);
  // };

  // const handleSelectSection = (id) => {
  //   setDisplaySequenceLevel();
  //   setSelectedSection(id);
  // };

  // useEffect(()=>{
  //   if(sectionsIds.length > 0) {
  //     handleSelectSection(sectionsIds[0]);
  //   }
  // },[sectionsIds])

  // const sidebarHeading = (
  //   <div className="sticky d-flex justify-content-between align-self-start align-items-center">
  //     {isDisplaySequenceLevel && backButtonTitle ? (
  //       <span onClick={handleBackToSectionLevel} className="outline-sidebar-heading mb-0 h4 text-dark-500">
  //         {sequenceTitle}
  //       </span>
  //     ) : (
  //       <span className="outline-sidebar-heading mb-0 h4 text-dark-500">
  //         {intl.formatMessage(messages.courseOutlineTitle)}
  //       </span>
  //     )}
  //     <IconButton
  //       alt={intl.formatMessage(messages.toggleCourseOutlineTrigger)}
  //       className="outline-sidebar-toggle-btn flex-shrink-0 text-dark bg-light-200"
  //       iconAs={MenuOpenIcon}
  //       onClick={handleToggleCollapse}
  //     />
  //   </div>
  // );

  useEffect(() => {
    if ((isEnabledSidebar && courseOutlineStatus !== LOADED) || courseOutlineShouldUpdate) {
      dispatch(getCourseOutlineStructure(courseId));
    }
  }, [courseId, isEnabledSidebar, courseOutlineShouldUpdate]);

  if (!isEnabledSidebar || isActiveEntranceExam || currentSidebar !== ID) {
    return null;
  }

  if (courseOutlineStatus === LOADING) {
    return (
      <div className={classNames('outline-sidebar-wrapper card card-square', {
        'flex-shrink-0 mr-4 h-fit': !shouldDisplayFullScreen,
        'bg-white m-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
      })}
      >
        <section className="outline-sidebar w-100 p-4">
          {/* {sidebarHeading} */}
          <PageLoading
            srMessage={intl.formatMessage(messages.loading)}
          />
        </section>
      </div>
    );
  }

  if (courseOutlineStatus === LOADED && sectionsIds?.length === 0) { return null; }

  return (
    <div className={classNames('outline-sidebar-wrapper card card-square', {
      'flex-shrink-0 h-fit': !shouldDisplayFullScreen,
      'm-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
    })}
    >
      <section className="outline-sidebar w-100">
        {/* {sidebarHeading} */}
        <ol id="outline-sidebar-outline" className="list-unstyled">
          {/* {isDisplaySequenceLevel
            ? sequenceIds.map((sequenceId) => (
              <SidebarSequence
                key={sequenceId}
                courseId={courseId}
                sequence={sequences[sequenceId]}
                defaultOpen={sequenceId === activeSequenceId}
                activeUnitId={unitId}
              />
            ))
            : sectionsIds.map((sectionId) => (
              <SidebarSection
                key={sectionId}
                courseId={courseId}
                section={sections[sectionId]}
                handleSelectSection={handleSelectSection}
              />
              ))} */}

          {sectionsIds.map((sectionId, index) => {
            const lastIndex = index === sectionsIds.length - 1;

            let isAllCompletedExcludeLast = false;

            if (lastIndex) {
              // Exclude the last section
              const sectionsExcludeLast = sectionsIds.slice(0, -1) || [];

              // Case 1: if only one section exists
              if (sectionsIds.length === 1) {
                isAllCompletedExcludeLast = true;
              } else {
                // Case 2: if more than one, check all except last
                const allCompletedExcludeLast = sectionsExcludeLast.every(
                  sid => sections[sid]?.complete,
                );
                isAllCompletedExcludeLast = allCompletedExcludeLast;
              }
            }
            return (
              <NewSidebarSection
                key={sectionId}
                courseId={courseId}
                section={sections[sectionId]}
                activeUnitId={unitId}
                isLastUnCompleted={isAllCompletedExcludeLast}
              />
            );
          })}

        </ol>
      </section>
    </div>
  );
};

CourseOutlineTray.propTypes = {
  intl: intlShape.isRequired,
};

CourseOutlineTray.ID = ID;

export default injectIntl(CourseOutlineTray);
