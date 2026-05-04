/**
 * SQLite schema barrel export.
 * Re-exports from entity-based structure for backward compatibility.
 */

import {
  academicYearSqlite,
  classLevelSqlite,
  schoolSqlite,
  subjectSqlite,
  termSqlite,
  userSqlite,
} from "./entities";

export {
  academicYearSqlite as academicYear,
  classLevelSqlite as classLevel,
  schoolSqlite as school,
  subjectSqlite as subject,
  termSqlite as term,
  userSqlite as user,
} from "./entities";

export {
  type AcademicYear,
  type ClassLevel,
  type School,
  type Subject,
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
} as const;
