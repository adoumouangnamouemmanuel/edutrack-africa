export type StudentGender = "male" | "female";
export type StudentStatus = "active" | "graduated" | "transferred" | "drop";
export type TeacherGender = "male" | "female";
export type TeacherStatus = "active" | "on_leave" | "terminated";
export type ParentRelation = "father" | "mother" | "guardian" | "tutor";
export type FamilyMemberRelation = "spouse" | "child" | "parent";
export type SalaryStatus = "paid" | "pending" | "partial";

export interface Student {
  id: string;
  user_id: string;
  school_id: string;
  student_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: StudentGender;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  nationality?: string | null;
  profile_photo_url?: string | null;
  status: StudentStatus;
  enrollment_date: string;
  created_at: string | number | Date;
  updated_at?: string | number | Date | null;
}

export interface Parent {
  id: string;
  student_id: string;
  relation: ParentRelation;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  occupation?: string | null;
  is_emergency_contact: boolean;
  created_at: string | number | Date;
}

export interface Teacher {
  id: string;
  user_id: string;
  school_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  gender?: TeacherGender | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  profile_photo_url?: string | null;
  hire_date?: string | null;
  years_of_experience?: number | null;
  qualification?: string | null;
  status: TeacherStatus;
  created_at: string | number | Date;
}

export interface FamilyMember {
  id: string;
  teacher_id: string;
  relation: FamilyMemberRelation;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  phone?: string | null;
  created_at: string | number | Date;
}

export interface Salary {
  id: string;
  teacher_id: string;
  amount: number;
  effective_date: string;
  payment_date?: string | null;
  payment_method?: string | null;
  status: SalaryStatus;
  notes?: string | null;
  created_at: string | number | Date;
}
