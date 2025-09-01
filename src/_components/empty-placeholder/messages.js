import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.sequence.course-outline.empty-placeholder.title',
    defaultMessage: 'No Course Outline Yet',
  },
  description: {
    id: 'learn.sequence.no.content',
    defaultMessage: 'There is no content here.',
    description: 'Message shown when there is no content to show a user inside a learning sequence.',
  },
  button: {
    id: 'learn.sequence.course-outline.empty-placeholder.button.new-section',
    defaultMessage: 'New section',
  },
  tooltip: {
    id: 'learn.sequence.course-outline.empty-placeholder.button.tooltip',
    defaultMessage: 'Click to add a new section',
  },
});

export default messages;
