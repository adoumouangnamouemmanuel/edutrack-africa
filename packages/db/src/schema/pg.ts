/**
 * PostgreSQL schema barrel export.
 * Re-exports from entity-based structure for backward compatibility.
 */

import {
  academicYearPg,
  classLevelPg,
  familyMemberPg,
  parentPg,
  salaryPg,
  schoolPg,
  studentPg,
  subjectPg,
  teacherPg,
  termPg,
  userPg,
} from "./entities";

export {
  academicYearPg as academicYear,
  classLevelPg as classLevel,
  familyMemberPg as familyMember,
  parentPg as parent,
  salaryPg as salary,
  schoolPg as school,
  studentPg as student,
  subjectPg as subject,
  teacherPg as teacher,
  termPg as term,
  userPg as user,
} from "./entities";

export {
  type AcademicYear,
  type ClassLevel,
  type FamilyMember,
  type Parent,
  type Salary,
  type School,
  type Student,
  type Subject,
  type Teacher,
  type Term,
  type User,
} from "./entities";

export const pgSchema = {
  school: schoolPg,
  academicYear: academicYearPg,
  user: userPg,
  term: termPg,
  classLevel: classLevelPg,
  subject: subjectPg,
  student: studentPg,
  teacher: teacherPg,
  parent: parentPg,
  familyMember: familyMemberPg,
  salary: salaryPg,
} as const;
