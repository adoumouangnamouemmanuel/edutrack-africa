export interface Term {
  id: string;
  school_id: string;
  academic_year_id: string;
  label: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  created_at: string | number;
}

export interface ClassLevel {
  id: string;
  school_id: string;
  name: string;
  short_name?: string | null;
  order?: number | string | null;
  created_at: string | number;
}

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  created_at: string | number;
}
