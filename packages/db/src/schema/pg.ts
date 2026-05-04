/**
 * PostgreSQL schema barrel export.
 * Re-exports from entity-based structure for backward compatibility.
 */

import {
  academicYearPg,
  classLevelPg,
  schoolPg,
  subjectPg,
  termPg,
  userPg,
} from "./entities";

export {
  academicYearPg as academicYear,
  classLevelPg as classLevel,
  schoolPg as school,
  subjectPg as subject,
  termPg as term,
  userPg as user,
} from "./entities";

export {
  type AcademicYear,
  type ClassLevel,
  type School,
  type Subject,
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
} as const;
