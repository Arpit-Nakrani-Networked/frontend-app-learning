import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseRulesHeader: {
    id: 'course.rules.header',
    defaultMessage: 'Course Rules',
  },
  questionsMandatory: {
    id: 'course.rules.questionsMandatory',
    defaultMessage: 'You must attempt all questions.',
  },
  videosMandatory: {
    id: 'course.rules.videosMandatory',
    defaultMessage: 'You must watch all course videos.',
  },
  completionCriteria: {
    id: 'course.rules.completionCriteria',
    defaultMessage: 'Both are mandatory to complete each lesson and the course.',
  },
  gotIt: {
    id: 'course.rules.gotIt',
    defaultMessage: 'Start Course',
  },
});

export default messages;
