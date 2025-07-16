import { useModel } from '@src/generic/model-store';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import React from 'react';
import { useParams } from 'react-router';
import DetailedGrades from '../../course-home/progress-tab/grades/detailed-grades/DetailedGrades';
import GradeSummary from '../../course-home/progress-tab/grades/grade-summary/GradeSummary';
// import {  } from '../../data/';

const ProgressTabGradeBreakdownSlot = () => {
  const courseId = useParams();
  const { gradesFeatureIsFullyLocked } = useModel('progress', courseId);
  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';
  return (
    <PluginSlot
      id="org.openedx.frontend.learning.progress_tab_grade_breakdown.v1"
      idAliases={['progress_tab_grade_breakdown_slot']}
    >
      <div
        className={`grades my-4 raised-card card ${applyLockedOverlay}`}
        aria-hidden={gradesFeatureIsFullyLocked}
      >
        <GradeSummary />
      </div>
      <div
        className={`grades my-4 raised-card card ${applyLockedOverlay}`}
        aria-hidden={gradesFeatureIsFullyLocked}
      >
        <DetailedGrades />
      </div>
    </PluginSlot>
  );
};

ProgressTabGradeBreakdownSlot.propTypes = {};

export default ProgressTabGradeBreakdownSlot;
