import {
  academicYearPg,
  academicYearSqlite,
  classLevelPg,
  classLevelSqlite,
  familyMemberPg,
  familyMemberSqlite,
  parentPg,
  parentSqlite,
  salaryPg,
  salarySqlite,
  schoolPg,
  schoolSqlite,
  studentPg,
  studentSqlite,
  subjectPg,
  subjectSqlite,
  teacherPg,
  teacherSqlite,
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
  student: studentSqlite,
  teacher: teacherSqlite,
  parent: parentSqlite,
  familyMember: familyMemberSqlite,
  salary: salarySqlite,
} as const;

// PostgreSQL Schema
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

// Backwards compatibility aliases
export {
  academicYearSqlite as academicYear,
  academicYearPg as academicYearPg,
  familyMemberSqlite as familyMember,
  familyMemberPg as familyMemberPg,
  parentSqlite as parent,
  parentPg as parentPg,
  salarySqlite as salary,
  salaryPg as salaryPg,
  schoolSqlite as school,
  schoolPg as schoolPg,
  studentSqlite as student,
  studentPg as studentPg,
  teacherSqlite as teacher,
  teacherPg as teacherPg,
  userSqlite as user,
  userPg as userPg,
};

// Re-export types
export type {
  AcademicYear,
  ClassLevel,
  FamilyMember,
  Parent,
  Salary,
  School,
  Student,
  Subject,
  Teacher,
  Term,
  User,
} from "./schema/entities";
