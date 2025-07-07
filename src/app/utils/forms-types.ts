import { FormControl } from "@angular/forms";

export type LoginForm = {
  email: FormControl<string>;
  password: FormControl<string>;
};

export type SignUpForm = {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

export type ResetPasswordForm = {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};
