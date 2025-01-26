export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  avatar: string;
}
// 注册接口返回的data类型
export interface RegisterResponseData {
  username: string;
  avatar: string;
  phone: string;
  name: string;
  signature: string;
  created_at: string;
}