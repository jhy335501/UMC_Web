import axios from 'axios';

export function getHttpErrorMessage(error: unknown): { message: string; status: number | null } {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    switch (status) {
      case 400:
        return { message: '잘못된 요청입니다. 입력값을 확인해주세요.', status };
      case 401:
        return { message: '로그인이 필요합니다.', status };
      case 403:
        return { message: '접근 권한이 없습니다.', status };
      case 404:
        return { message: '존재하지 않는 항목입니다.', status };
      case 500:
        return { message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', status };
      default:
        return { message: '알 수 없는 오류가 발생했습니다.', status };
    }
  }
  return { message: '네트워크 연결을 확인해주세요.', status: null };
}
