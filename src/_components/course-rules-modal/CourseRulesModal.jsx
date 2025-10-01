import React from 'react';
import './CourseRulesModal.scss';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ModalDialog } from '@openedx/paragon';
import { useParams } from 'react-router-dom';
import messages from './messages';

const CourseRulesModal = ({ children, isOpen, onClose }) => {
  const intl = useIntl();
  const { courseId } = useParams();

  if (!isOpen || !courseId) { return null; }

  const body = (
    <div
      className="row w-100 mx-0"
    >
      <div style={{ marginTop: 'auto' }}>
        <div className="col-12 p-0 h2 _text-2xl _text-black mb-3">
          {intl.formatMessage(messages.courseRulesHeader, { defaultMessage: 'Course Rules' })}
        </div>
        <div className="col-12 p-0 font-weight-normal _text-lg _text-gray">
          <ul className="rules-list">
            <li>{intl.formatMessage(messages.questionsMandatory, { defaultMessage: 'You must attempt all questions.' })}</li>
            <li>{intl.formatMessage(messages.videosMandatory, { defaultMessage: 'You must watch all course videos.' })}</li>
            <li>{intl.formatMessage(messages.completionCriteria, { defaultMessage: 'Both are mandatory to complete each lesson and the course.' })}</li>
          </ul>

          <div className="text-center mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalDialog
      dialogClassName="modal-lti"
      onClose={onClose}
      size="md"
      isOpen
    >
      <ModalDialog.Body className="courserules-modal-body">
        {body}
      </ModalDialog.Body>
    </ModalDialog>
  );
};

CourseRulesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default CourseRulesModal;
