/**
 * SQLite schema barrel export.
 * Re-exports from entity-based structure for backward compatibility.
 */

import {
  academicYearSqlite,
  classLevelSqlite,
  familyMemberSqlite,
  parentSqlite,
  salarySqlite,
  schoolSqlite,
  studentSqlite,
  subjectSqlite,
  teacherSqlite,
  termSqlite,
  userSqlite,
} from "./entities";

export {
  academicYearSqlite as academicYear,
  classLevelSqlite as classLevel,
  familyMemberSqlite as familyMember,
  parentSqlite as parent,
  salarySqlite as salary,
  schoolSqlite as school,
  studentSqlite as student,
  subjectSqlite as subject,
  teacherSqlite as teacher,
  termSqlite as term,
  userSqlite as user,
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

export const sqliteSchema = {
  school: schoolSqlite,
  academicYear: academicYearSqlite,
  user: userSqlite,
  term: termSqlite,
  classLevel: classLevelSqlite,
  subject: subjectSqlite,
  student: studentSqlite,
  teacher: teacherSqlite,
  parent: parentSqlite,
  familyMember: familyMemberSqlite,
  salary: salarySqlite,
} as const;
