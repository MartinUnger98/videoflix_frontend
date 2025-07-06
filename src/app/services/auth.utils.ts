export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  user_id: number;
}
