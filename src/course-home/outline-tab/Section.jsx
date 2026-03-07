import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton, Icon } from '@openedx/paragon';
import { KeyboardArrowDown as faPlus, KeyboardArrowUp as faMinus, DisabledVisible } from '@openedx/paragon/icons';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SequenceLink from './SequenceLink';
import { useModel } from '../../generic/model-store';

import genericMessages from '../../generic/messages';
import messages from './messages';

const Section = ({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
  hiddenURL = false,
}) => {
  const {
    complete,
    sequenceIds,
    title,
    hideFromTOC,
  } = section;
  const {
    courseBlocks: {
      sequences,
    },
  } = useModel('outline', courseId);

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionTitle = (
    <div className="d-flex w-100 m-0 overflow-hidden">
      <div className="col-auto p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left v2-text-black-600"
            style={{
              height: '20px',
              width: '20px',
            }}
            aria-hidden="true"
            title={intl.formatMessage(messages.completedSection)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left text-gray-400"
            style={{
              height: '20px',
              width: '20px',
              color: '#00000099 !important',
            }}
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteSection)}
          />
        )}
      </div>
      <div className="col-11 pl-3 p-0 font-weight-bold text-dark-500 d-flex align-items-center">
        <span className="align-middle p-0 section-title" title={title}>{title}</span>
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
      </div>
      {hideFromTOC && (
        <div className="row">
          {hideFromTOC && (
            <span className="small d-flex align-content-end">
              <Icon className="mr-2" src={DisabledVisible} data-testid="hide-from-toc-section-icon" />
              <span data-testid="hide-from-toc-section-text">
                {intl.formatMessage(messages.hiddenSection)}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <li>
      <Collapsible
        className={`mb-3 section-outline ${complete ? 'completed' : ''}`}
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        iconWhenClosed={(
          <IconButton
            alt={intl.formatMessage(messages.openSection)}
            iconAs={faPlus}
            onClick={() => { setOpen(true); }}
            size="md"
          />
        )}
        iconWhenOpen={(
          <IconButton
            alt={intl.formatMessage(genericMessages.close)}
            iconAs={faMinus}
            onClick={() => { setOpen(false); }}
            size="md"
          />
        )}
      >
        <ol className="list-unstyled">
          {sequenceIds.map((sequenceId, index) => (
            <SequenceLink
              key={sequenceId}
              id={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              first={index === 0}
              hiddenURL={hiddenURL}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
};

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
  hiddenURL: PropTypes.bool,
};

export default injectIntl(Section);
