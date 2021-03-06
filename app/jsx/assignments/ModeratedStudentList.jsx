/** @jsx React.DOM */

define([
  'underscore',
  'react',
  './actions/ModerationActions',
  './constants'
], function (_, React, ModerationActions, Constants) {

  // CONSTANTS
  var PG_ONE_INDEX = 0;
  var PG_TWO_INDEX = 1;
  var PG_THREE_INDEX = 2;

  return React.createClass({
    displayName: 'ModeratedStudentList',

    propTypes: {
      studentList: React.PropTypes.object.isRequired,
      assignment: React.PropTypes.object.isRequired,
      handleCheckbox: React.PropTypes.func.isRequired,
      includeModerationSetColumns: React.PropTypes.bool,
      urls: React.PropTypes.object.isRequired,
      onSelectProvisionalGrade: React.PropTypes.func.isRequired
    },

    renderStudentMark (student, markIndex) {
      if (student.provisional_grades && student.provisional_grades[markIndex]) {
        if (this.props.includeModerationSetColumns) {
          return (
            <div className='ModeratedAssignmentList__Mark'>
              <input
                type='radio'
                name={`mark_${student.id}`}
                disabled={this.props.assignment.published}
                onChange={this.props.onSelectProvisionalGrade.bind(this, student.id, student.provisional_grades[markIndex].provisional_grade_id)}
              />
                <a target='_blank' href={student.provisional_grades[markIndex].speedgrader_url}>{student.provisional_grades[markIndex].score}</a>
            </div>
          );
        } else {
          return (
            <div className='AssignmentList__Mark'>
              <a  target='_blank' href={student.provisional_grades[markIndex].speedgrader_url}>{student.provisional_grades[markIndex].score}</a>
            </div>
          );
        }
      } else {
        return (
          <div className='ModeratedAssignmentList__Mark'>
            <a target='_blank' href={this.generateSpeedgraderUrl(this.props.urls.assignment_speedgrader_url, student)}>Speed Grader</a>
          </div>
        );
      }
    },

    generateSpeedgraderUrl (baseSpeedgraderUrl, student) {
      return (`${baseSpeedgraderUrl}&student_id=${student.id}`);
    },

    renderFinalGrade (student) {
      if (student.selected_provisional_grade_id) {
        var grade = _.find(student.provisional_grades, (pg) => {
          return pg.provisional_grade_id === student.selected_provisional_grade_id;
        });
        return (
          <span className='AssignmentList_Grade'>
            {grade.score}
          </span>
        );
      } else {
        return (
          <span className='AssignmentList_Grade'>
            -
          </span>
        );
      }
    },
    render () {
      return (
        <ul className='ModeratedAssignmentList'>
          {
            this.props.studentList.students.map((student) => {
              if (this.props.includeModerationSetColumns) {
                return (
                  <li className='ModeratedAssignmentList__Item'>
                    <div className='ModeratedAssignmentList__StudentInfo'>
                      <input
                        checked={student.on_moderation_stage || student.in_moderation_set || student.isChecked}
                        disabled={student.in_moderation_set || this.props.assignment.published}
                        type='checkbox'
                        onChange={this.props.handleCheckbox.bind(this, student)}
                      />
                      <img className='img-circle AssignmentList_StudentPhoto' src={student.avatar_image_url} />
                      <span>{student.display_name}</span>
                    </div>
                    {this.renderStudentMark(student, PG_ONE_INDEX)}
                    {this.renderStudentMark(student, PG_TWO_INDEX)}
                    {this.renderStudentMark(student, PG_THREE_INDEX)}
                    {this.renderFinalGrade(student)}
                  </li>
                 );
              } else {
                return (
                  <li className='AssignmentList__Item'>
                    <div className='AssignmentList__StudentInfo'>
                      <input
                        checked={student.on_moderation_stage || student.in_moderation_set || student.isChecked}
                        disabled={student.in_moderation_set || this.props.assignment.published}
                        type='checkbox'
                        onChange={this.props.handleCheckbox.bind(this, student)}
                      />
                      <img className='img-circle AssignmentList_StudentPhoto' src={student.avatar_image_url} />
                      <span>{student.display_name}</span>
                    </div>
                    {this.renderStudentMark(student, PG_ONE_INDEX)}
                  </li>
                );
              }
            })
          }
        </ul>
      );
    }
  });

});
