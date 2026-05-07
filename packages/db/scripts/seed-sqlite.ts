import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { sqliteSchema } from "../src/schema";
import { ensureSqliteDirectory, resolveSqliteFilePath } from "./resolve-sqlite-path";

const filePath = resolveSqliteFilePath();
ensureSqliteDirectory(filePath);

const raw = new Database(filePath);
const db = drizzle(raw, { schema: sqliteSchema });

const existing = db.select().from(sqliteSchema.school).limit(1).all();

let schoolId: string;

// If school doesn't exist, create initial data
if (existing.length === 0) {
  const passwordHash = bcrypt.hashSync("ChangeMoi2026!", 12);

  const [schoolRow] = db
    .insert(sqliteSchema.school)
    .values({
      name: "Lycée Félix Éboué de N'Djamena",
      short_name: "LFEN",
      city: "N'Djamena",
      country: "TD",
      school_type: "public",
      motto: "Excellence et discipline",
    })
    .returning()
    .all();

  if (!schoolRow?.id) {
    raw.close();
    throw new Error("[db] Seed failed: school insert returned no row.");
  }

  schoolId = schoolRow.id;

  db.insert(sqliteSchema.academicYear)
    .values({
      school_id: schoolId,
      label: "2025–2026",
      start_date: "2025-09-01",
      end_date: "2026-06-30",
      is_current: true,
      grading_system: "trimesters",
    })
    .run();

  db.insert(sqliteSchema.user)
    .values({
      school_id: schoolId,
      username: "directeur.demo",
      password_hash: passwordHash,
      role: "school_master",
      is_active: true,
    })
    .run();

  // eslint-disable-next-line no-console
  console.log("[db] Initial data seeded (SQLite)");
} else {
  schoolId = existing[0]!.id;
}

const termsExist = db
  .select()
  .from(sqliteSchema.term)
  .where(eq(sqliteSchema.term.school_id, schoolId))
  .limit(1)
  .all();

if (termsExist.length === 0) {
  const academicYears = db
    .select()
    .from(sqliteSchema.academicYear)
    .where(eq(sqliteSchema.academicYear.school_id, schoolId))
    .all();

  const academicYearId = academicYears[0]?.id;
  if (!academicYearId) {
    raw.close();
    throw new Error("[db] Seed failed: academic year not found.");
  }

  db.insert(sqliteSchema.term)
    .values([
      {
        school_id: schoolId,
        academic_year_id: academicYearId,
        label: "Trimestre 1",
        start_date: "2025-09-01",
        end_date: "2025-11-30",
        is_current: true,
      },
      {
        school_id: schoolId,
        academic_year_id: academicYearId,
        label: "Trimestre 2",
        start_date: "2025-12-01",
        end_date: "2026-02-28",
        is_current: false,
      },
      {
        school_id: schoolId,
        academic_year_id: academicYearId,
        label: "Trimestre 3",
        start_date: "2026-03-01",
        end_date: "2026-06-30",
        is_current: false,
      },
    ])
    .run();
}

const classLevelsExist = db
  .select()
  .from(sqliteSchema.classLevel)
  .where(eq(sqliteSchema.classLevel.school_id, schoolId))
  .limit(1)
  .all();

if (classLevelsExist.length === 0) {
  db.insert(sqliteSchema.classLevel)
    .values([
      { school_id: schoolId, name: "Cours Préparatoire", short_name: "CP", order: 1 },
      { school_id: schoolId, name: "Cours Élémentaire 1", short_name: "CE1", order: 2 },
      { school_id: schoolId, name: "Cours Élémentaire 2", short_name: "CE2", order: 3 },
      { school_id: schoolId, name: "Cours Moyen 1", short_name: "CM1", order: 4 },
      { school_id: schoolId, name: "Cours Moyen 2", short_name: "CM2", order: 5 },
      { school_id: schoolId, name: "Sixième", short_name: "6ème", order: 6 },
      { school_id: schoolId, name: "Cinquième", short_name: "5ème", order: 7 },
      { school_id: schoolId, name: "Quatrième", short_name: "4ème", order: 8 },
      { school_id: schoolId, name: "Troisième", short_name: "3ème", order: 9 },
      { school_id: schoolId, name: "Seconde", short_name: "2nde", order: 10 },
      { school_id: schoolId, name: "Première", short_name: "1ère", order: 11 },
      { school_id: schoolId, name: "Terminale", short_name: "Tle", order: 12 },
    ])
    .run();
}

const subjectsExist = db
  .select()
  .from(sqliteSchema.subject)
  .where(eq(sqliteSchema.subject.school_id, schoolId))
  .limit(1)
  .all();

if (subjectsExist.length === 0) {
  db.insert(sqliteSchema.subject)
    .values([
      {
        school_id: schoolId,
        name: "Mathématiques",
        code: "MATH",
        description: "Enseignement des mathématiques",
      },
      {
        school_id: schoolId,
        name: "Français",
        code: "FR",
        description: "Langue et littérature française",
      },
      {
        school_id: schoolId,
        name: "Anglais",
        code: "EN",
        description: "Langue et littérature anglaise",
      },
      {
        school_id: schoolId,
        name: "Physique-Chimie",
        code: "PC",
        description: "Physique et chimie",
      },
      {
        school_id: schoolId,
        name: "Sciences de la Vie et de la Terre",
        code: "SVT",
        description: "Biologie et sciences de la vie",
      },
      {
        school_id: schoolId,
        name: "Histoire",
        code: "HIST",
        description: "Histoire du monde et du Tchad",
      },
      {
        school_id: schoolId,
        name: "Géographie",
        code: "GEO",
        description: "Géographie et environnement",
      },
      {
        school_id: schoolId,
        name: "Éducation Physique et Sportive",
        code: "EPS",
        description: "Sports et activités physiques",
      },
      {
        school_id: schoolId,
        name: "Philosophie",
        code: "PHILO",
        description: "Initiation à la philosophie",
      },
      {
        school_id: schoolId,
        name: "Informatique",
        code: "INFO",
        description: "Technologie et informatique",
      },
    ])
    .run();
}

// Check if Week 4 data already seeded
const studentsExist = db
  .select()
  .from(sqliteSchema.student)
  .where(eq(sqliteSchema.student.school_id, schoolId))
  .limit(1)
  .all();

if (studentsExist.length === 0) {
  const passwordHash = bcrypt.hashSync("Password123!", 12);

  // Create student users
  const studentUser1 = db
    .insert(sqliteSchema.user)
    .values({
      school_id: schoolId,
      username: "etudiant.demo1",
      password_hash: passwordHash,
      role: "student",
      is_active: true,
    })
    .returning()
    .all()[0];

  const studentUser2 = db
    .insert(sqliteSchema.user)
    .values({
      school_id: schoolId,
      username: "etudiant.demo2",
      password_hash: passwordHash,
      role: "student",
      is_active: true,
    })
    .returning()
    .all()[0];

  // Create teacher users
  const teacherUser1 = db
    .insert(sqliteSchema.user)
    .values({
      school_id: schoolId,
      username: "enseignant.demo1",
      password_hash: passwordHash,
      role: "teacher",
      is_active: true,
    })
    .returning()
    .all()[0];

  const teacherUser2 = db
    .insert(sqliteSchema.user)
    .values({
      school_id: schoolId,
      username: "enseignant.demo2",
      password_hash: passwordHash,
      role: "teacher",
      is_active: true,
    })
    .returning()
    .all()[0];

  // Seed Students
  const [student1, student2] = db
    .insert(sqliteSchema.student)
    .values([
      {
        user_id: studentUser1.id,
        school_id: schoolId,
        student_code: "STU001",
        first_name: "Ahmed",
        last_name: "Adoum",
        date_of_birth: "2010-05-15",
        gender: "male",
        address: "N'Djamena, Quartier du 8",
        phone: "+235 61 23 45 67",
        email: "ahmed.adoum@school.edu",
        nationality: "Tchadienne",
        status: "active",
        enrollment_date: "2025-09-01",
      },
      {
        user_id: studentUser2.id,
        school_id: schoolId,
        student_code: "STU002",
        first_name: "Fatima",
        last_name: "Hassan",
        date_of_birth: "2011-03-22",
        gender: "female",
        address: "N'Djamena, Quartier du 8",
        phone: "+235 61 34 56 78",
        email: "fatima.hassan@school.edu",
        nationality: "Tchadienne",
        status: "active",
        enrollment_date: "2025-09-01",
      },
    ])
    .returning()
    .all();

  // Seed Teachers
  const [teacher1, teacher2] = db
    .insert(sqliteSchema.teacher)
    .values([
      {
        user_id: teacherUser1.id,
        school_id: schoolId,
        employee_code: "EMP001",
        first_name: "Monsieur",
        last_name: "Mahamat",
        date_of_birth: "1985-06-10",
        gender: "male",
        address: "N'Djamena, Quartier résidentiel",
        phone: "+235 62 12 34 56",
        email: "mahamat.prof@school.edu",
        hire_date: "2020-09-01",
        years_of_experience: 5,
        qualification: "Master en Mathématiques",
        status: "active",
      },
      {
        user_id: teacherUser2.id,
        school_id: schoolId,
        employee_code: "EMP002",
        first_name: "Madame",
        last_name: "Aissatou",
        date_of_birth: "1988-09-20",
        gender: "female",
        address: "N'Djamena, Quartier résidentiel",
        phone: "+235 62 23 45 67",
        email: "aissatou.prof@school.edu",
        hire_date: "2019-09-01",
        years_of_experience: 6,
        qualification: "Master en Français",
        status: "active",
      },
    ])
    .returning()
    .all();

  // Seed Parents (for Student 1)
  db.insert(sqliteSchema.parent)
    .values([
      {
        student_id: student1.id,
        relation: "father",
        first_name: "Adoum",
        last_name: "Gali",
        phone: "+235 61 11 11 11",
        email: "adoum.gali@email.com",
        occupation: "Ingénieur",
        is_emergency_contact: true,
      },
      {
        student_id: student1.id,
        relation: "mother",
        first_name: "Hawa",
        last_name: "Ali",
        phone: "+235 61 22 22 22",
        email: "hawa.ali@email.com",
        occupation: "Infirmière",
        is_emergency_contact: false,
      },
    ])
    .run();

  // Seed Parents (for Student 2)
  db.insert(sqliteSchema.parent)
    .values([
      {
        student_id: student2.id,
        relation: "father",
        first_name: "Hassan",
        last_name: "Idriss",
        phone: "+235 61 33 33 33",
        email: "hassan.idriss@email.com",
        occupation: "Médecin",
        is_emergency_contact: true,
      },
      {
        student_id: student2.id,
        relation: "mother",
        first_name: "Miriam",
        last_name: "Moussa",
        phone: "+235 61 44 44 44",
        email: "miriam.moussa@email.com",
        occupation: "Enseignante",
        is_emergency_contact: false,
      },
    ])
    .run();

  // Seed Family Members (for Teacher 1)
  db.insert(sqliteSchema.familyMember)
    .values([
      {
        teacher_id: teacher1.id,
        relation: "spouse",
        first_name: "Khadija",
        last_name: "Mahamat",
        date_of_birth: "1987-03-15",
        phone: "+235 62 11 22 33",
      },
      {
        teacher_id: teacher1.id,
        relation: "child",
        first_name: "Omar",
        last_name: "Mahamat",
        date_of_birth: "2015-07-08",
      },
    ])
    .run();

  // Seed Family Members (for Teacher 2)
  db.insert(sqliteSchema.familyMember)
    .values([
      {
        teacher_id: teacher2.id,
        relation: "spouse",
        first_name: "Ibrahim",
        last_name: "Aissatou",
        date_of_birth: "1985-11-20",
        phone: "+235 62 22 33 44",
      },
      {
        teacher_id: teacher2.id,
        relation: "child",
        first_name: "Zainab",
        last_name: "Aissatou",
        date_of_birth: "2017-02-14",
      },
    ])
    .run();

  // Seed Salaries (for Teachers)
  db.insert(sqliteSchema.salary)
    .values([
      {
        teacher_id: teacher1.id,
        amount: 50000000, // 500,000 CFA (in cents/hundredths: 50000000 = 500,000.00)
        effective_date: "2025-09-01",
        payment_date: "2025-09-30",
        payment_method: "bank_transfer",
        status: "paid",
      },
      {
        teacher_id: teacher2.id,
        amount: 52000000, // 520,000 CFA
        effective_date: "2025-09-01",
        payment_date: "2025-09-30",
        payment_method: "bank_transfer",
        status: "paid",
      },
    ])
    .run();

  // eslint-disable-next-line no-console
  console.log(
    `[db] Week 4 data seeded (SQLite) → students, teachers, parents, family members, salaries`,
  );
}

// eslint-disable-next-line no-console
console.log(
  `[db] Seed complete (SQLite) → Week 3 & 4 data seeded for school id ${schoolId}`,
);
raw.close();
