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

  if (!isOpen || !courseId) { return null; }

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
