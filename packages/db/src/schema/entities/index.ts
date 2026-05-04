// ============================================================================
// SQLite Schema Exports
// ============================================================================
export { schoolSqlite } from "./school";
export { academicYearSqlite } from "./academic-year";
export { userSqlite } from "./user";
export { termSqlite } from "./term";
export { classLevelSqlite } from "./class-level";
export { subjectSqlite } from "./subject";

// ============================================================================
// PostgreSQL Schema Exports
// ============================================================================
export { schoolPg } from "./school";
export { academicYearPg } from "./academic-year";
export { userPg } from "./user";
export { termPg } from "./term";
export { classLevelPg } from "./class-level";
export { subjectPg } from "./subject";

// ============================================================================
// Shared Interfaces
// ============================================================================
export type { School } from "./school";
export type { AcademicYear } from "./academic-year";
export type { User } from "./user";
export type { Term } from "./term";
export type { ClassLevel } from "./class-level";
export type { Subject } from "./subject";
