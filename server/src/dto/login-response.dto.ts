export class LoginResponseDto {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar_url: string | null;
  };
}