export class AuthDtoSignIn {
  nickname: string;
  password: string;
}

export class AuthDtoSignUp {
  name: string;
  surname: string;
  nickname: string;
  phone: number;
  email: string;
  password: string;
  birthday: Date;
  gender: string;
  country: string;
}
