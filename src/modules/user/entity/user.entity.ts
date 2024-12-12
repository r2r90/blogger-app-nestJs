export interface User {
  id: string;
  login: string;
  password: string;
  email: string;
  created_at: string;
  confirmation_code: string;
  is_confirmed: boolean;
  expiration_date: string;
}
