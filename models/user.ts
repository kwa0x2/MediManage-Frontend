export interface User {
  user_id?: string;
  user_name: string;
  user_surname: string;
  user_identity_number: string;
  user_email: string;
  user_phone: string;
  user_password: string;
  user_role: UserRoleType;
  user_hospital_id?: number;
}

export enum UserRoleType {
  Staff = "Staff",
  Worker = "Worker",
}
