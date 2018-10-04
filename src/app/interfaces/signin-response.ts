export interface SigninResponse {
  status: Number;
  code: string;
  message: string;
  data: {
    token: string,
    id: any,
  };
  origin: string;
  priority: Number;
}
