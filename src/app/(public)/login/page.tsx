'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('jacksonsantos');
  const [password, setPassword] = useState('dogao@2025');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data?.access_token && data?.user) {
          login(data.access_token, data.user);
          router.replace('/');
        } else {
          setError('Token não retornado pelo backend.');
        }
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-600 px-4">
      <div className="w-full max-w-md bg-white/80 shadow-xl rounded-xl p-8 border border-border flex flex-col gap-6 animate-fadeIn">
        <div className="flex flex-col items-center gap-2">
          {/* Logo opcional */}
          <img src="/assets/images/dogao-do-pastor.svg" alt="Logo" className="h-24 mb-2" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Gestor de Entregas</h1>
          <span className="text-muted-foreground text-base">Acesso entregadores Dogão do Pastor</span>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
          <Input
            autoFocus
            placeholder="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="bg-destructive text-white text-sm px-3 py-2 rounded" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="text-xs text-center text-muted-foreground mt-2">
          © 2025 Dogão do Pastor. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
