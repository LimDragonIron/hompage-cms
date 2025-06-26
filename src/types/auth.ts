// 로그인 입력 DTO
export interface SignInDto {
    email: string;
    password: string;
  }
  
  // 서버에서 내려주는 사용자 정보 타입 (예시, 필요시 수정)
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
  
  // 로그인 성공 시 반환 타입
export interface SignInResult {
    user: User;
    accessToken: string;
    refreshToken: string;
}