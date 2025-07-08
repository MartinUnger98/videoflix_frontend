export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  user_id: number;
}

export interface ActivateRequest {
  uid: string;
  token: string;
}

export interface ActivateResponse {
  message: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  detail: string;
}

export interface ResetPasswordRequest {
  uidb64: string;
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
