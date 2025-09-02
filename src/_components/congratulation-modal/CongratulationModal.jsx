import React, { useEffect, useState } from 'react';
// import Confetti from "react-confetti";
import './CongratulationModal.scss';
// import { useIntl } from '@edx/frontend-platform/i18n';
import { ModalDialog } from '@openedx/paragon';
import { useLocation, useParams } from 'react-router-dom';
// import messages from './messages';
// import { NETWORKED_FRONTEND_URL } from '../../helper/constants';
import { CourseExit } from '../../courseware/course/course-exit';

const CourseCompleteModal = () => {
  // const intl = useIntl();
  const location = useLocation();
  const { courseId } = useParams();
  // ✅ read query params from URL
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const checkParams = () => {
      const params = new URLSearchParams(location.search);
      setIsOpen(params.get('course-completed') === 'true');
    };

    // Run once at mount
    checkParams();

    // Listen for browser navigation
    window.addEventListener('popstate', checkParams);

    return () => {
      window.removeEventListener('popstate', checkParams);
    };
  }, [location.search]);

  // const handleModalClose = () => {
  //   setIsOpen(false);

  //   window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  // };

  if (!isOpen || !courseId) { return null; }

  // const modalContent = (
  //   <div className="course-complete-inner">
  //     {/* <Confetti
  //       width={width}
  //       height={height}
  //       recycle={false}
  //       gravity={0.15}
  //       numberOfPieces={200}
  //       tweenDuration={2000}
  //     /> */}
  //     <div className="emoji">🎉</div>
  //     <h2 className="text-center congrats-text">
  //       {intl.formatMessage(messages.title)}
  //     </h2>
  //     <p className="text-center">
  //       {intl.formatMessage(messages.description)}
  //     </p>
  //     <Button variant="primary" className="CongratulationModal_Button" onClick={handleModalClose}>
  //       {intl.formatMessage(messages.button)}
  //     </Button>
  //   </div>
  // );

  const body = <CourseExit />;

  return (
    <ModalDialog
      dialogClassName="modal-lti"
      onClose={() => {}}
      size="md"
      isOpen
      hasCloseButton={false}
    >
      <ModalDialog.Body className="congrats-modal-body">
        {body}
      </ModalDialog.Body>
    </ModalDialog>
  );
};

export default CourseCompleteModal;
