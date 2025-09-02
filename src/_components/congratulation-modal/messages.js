import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.sequence.course-complete.modal.title',
    defaultMessage: 'Congratulations, Course is completed',
    description: 'Heading shown in the course completion celebration modal.',
  },
  description: {
    id: 'learn.sequence.course-complete.modal.description',
    defaultMessage: "You've successfully completed the course. Your dedication and hard work have paid off. Keep learning and growing!",
    description: 'Message shown in the course completion celebration modal.',
  },
  button: {
    id: 'learn.sequence.course-complete.modal.button.back-to-course',
    defaultMessage: 'Back to Course',
    description: 'Button text to return the learner back to the course after completion.',
  },
  tooltip: {
    id: 'learn.sequence.course-complete.modal.button.tooltip',
    defaultMessage: 'Click to go back to the course',
    description: 'Tooltip shown when hovering over the back to course button.',
  },
});

export default messages;
