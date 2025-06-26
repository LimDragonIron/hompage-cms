import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { signIn } from '@/api/auth';

const EMAIL_KEY = 'rememberedEmail';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);

  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem(EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      // 로그인 성공 시 아이디 저장 여부에 따라 저장/삭제
      if (rememberEmail) {
        localStorage.setItem(EMAIL_KEY, email);
      } else {
        localStorage.removeItem(EMAIL_KEY);
      }
      setLoggedIn(true);
      navigate('/', { replace: true });
    },
    onError: (error: any) => {
      alert(error.message ?? '로그인 실패');
    },
  });

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h1 className="text-xl font-bold mb-6">로그인</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex items-center space-x-2">
              <input
                id="rememberEmail"
                type="checkbox"
                checked={rememberEmail}
                onChange={e => setRememberEmail(e.target.checked)}
              />
              <label htmlFor="rememberEmail" className="text-sm select-none">
                아이디 저장
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}