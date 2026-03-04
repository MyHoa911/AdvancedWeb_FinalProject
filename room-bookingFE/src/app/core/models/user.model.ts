export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'student';
  isActive: boolean;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  studentCode: string;
  fullName: string;
  faculty: string;
  major: string;
  phone: string;
  quotaPerWeek: number;
  avatarUrl: string;
  createdAt?: string | Date;
}

export interface UserWithProfile {
  user: User;
  profile: StudentProfile | null;
}
