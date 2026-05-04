import {
  academicYearPg,
  academicYearSqlite,
  classLevelPg,
  classLevelSqlite,
  schoolPg,
  schoolSqlite,
  subjectPg,
  subjectSqlite,
  termPg,
  termSqlite,
  userPg,
  userSqlite,
} from "./schema/entities";

// SQLite Schema
export const sqliteSchema = {
  school: schoolSqlite,
  academicYear: academicYearSqlite,
  user: userSqlite,
  term: termSqlite,
  classLevel: classLevelSqlite,
  subject: subjectSqlite,
} as const;

// PostgreSQL Schema
export const pgSchema = {
  school: schoolPg,
  academicYear: academicYearPg,
  user: userPg,
  term: termPg,
  classLevel: classLevelPg,
  subject: subjectPg,
} as const;

// Backwards compatibility aliases
export {
  academicYearSqlite as academicYear,
  academicYearPg as academicYearPg,
  schoolSqlite as school,
  schoolPg as schoolPg,
  userSqlite as user,
  userPg as userPg,
};

// Re-export types
export type {
  AcademicYear,
  ClassLevel,
  School,
  Subject,
  Term,
  User,
} from "./schema/entities";
