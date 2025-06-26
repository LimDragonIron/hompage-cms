# Homepage CMS

Homepage CMS는 React, TypeScript, Vite를 기반으로 개발된 콘텐츠 관리 시스템입니다. 이 프로젝트는 관리자 대시보드에서 뉴스, 게임, 배너, 히어로 등의 콘텐츠를 생성, 수정, 삭제 및 관리할 수 있는 기능을 제공합니다.

## 주요 기술 스택

- **React**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 정적 타입을 지원하는 JavaScript의 상위 언어
- **Vite**: 빠른 개발 환경을 제공하는 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **React Query**: 서버 상태 관리 라이브러리
- **React Router**: 클라이언트 사이드 라우팅 라이브러리

## 주요 기능

1. **콘텐츠 관리**:
   - 뉴스, 게임, 배너, 히어로 등의 콘텐츠 생성, 수정, 삭제
   - 콘텐츠 순서 변경 및 정렬 기능
   - 임시 저장(드래프트) 기능 지원

2. **이미지 및 파일 관리**:
   - 이미지 업로드 및 미리보기
   - 파일 관리 및 연동

3. **자동 저장**:
   - 콘텐츠 작성 중 자동 임시 저장 기능

4. **플랫폼 링크 관리**:
   - 게임 콘텐츠에 플랫폼 및 링크 추가 기능

5. **사용자 인터페이스**:
   - Tailwind CSS를 활용한 반응형 디자인
   - 직관적인 관리자 대시보드 UI

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. ESLint 검사
```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── api/                # API 호출 관련 함수
├── components/         # UI 컴포넌트
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── types/              # TypeScript 타입 정의
├── lib/                # 유틸리티 함수
├── styles/             # 스타일 파일
├── main.tsx            # 애플리케이션 진입점
├── App.tsx             # 라우팅 및 레이아웃 설정
```

## ESLint 설정 확장

프로덕션 환경에서 타입 인식 규칙을 활성화하려면 ESLint 설정을 업데이트하세요:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

React-specific lint 규칙을 추가하려면 다음을 설치하세요:

```bash
npm install eslint-plugin-react-x eslint-plugin-react-dom
```

그리고 설정 파일에 추가하세요:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## 환경 변수

`.env` 파일에서 API URL을 설정할 수 있습니다:

```
VITE_API_URL=http://localhost:8000
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
```