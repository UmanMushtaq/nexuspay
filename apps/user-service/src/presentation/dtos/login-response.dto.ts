export class LoginResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}