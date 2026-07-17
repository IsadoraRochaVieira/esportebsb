'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface AuthModalProps {
  onFechar: () => void
  onSucesso?: () => void
  modoInicial?: 'login' | 'cadastro'
}

export default function AuthModal({ onFechar, onSucesso, modoInicial = 'login' }: AuthModalProps) {
  const [modo, setModo] = useState<'login' | 'cadastro' | 'recuperar'>(modoInicial)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  const supabase = createClient()

  async function recuperarSenha() {
    if (!email) { setErro('Digite seu e-mail.'); return }
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    setCarregando(false)
    if (error) { setErro('Não foi possível enviar o e-mail. Confira o endereço.'); return }
    setAviso(`Enviamos um link de recuperação para ${email}. Confira sua caixa de entrada (e o spam).`)
  }

  async function entrar() {
    if (modo === 'recuperar') { recuperarSenha(); return }
    if (!email || !senha) { setErro('Preencha e-mail e senha.'); return }
    setCarregando(true)
    setErro('')

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) { setErro('E-mail ou senha incorretos.'); setCarregando(false); return }
    } else {
      if (!nome.trim()) { setErro('Digite seu nome.'); setCarregando(false); return }
      if (senha.length < 6) { setErro('Senha precisa ter ao menos 6 caracteres.'); setCarregando(false); return }
      const { data, error } = await supabase.auth.signUp({ email, password: senha })
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setErro('Este e-mail já tem uma conta. Clique em "Entrar" abaixo.')
        } else {
          setErro('Erro ao criar conta: ' + error.message)
        }
        setCarregando(false); return
      }
      if (data.user) {
        await supabase.from('perfis').upsert({ id: data.user.id, nome: nome.trim() })
      }
    }

    setCarregando(false)
    onSucesso?.()
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
        {/* Header colorido */}
        <div className="px-6 py-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #030507 0%, #06251a 60%, #03202e 100%)' }}>
          {/* brilho neon, como na página inicial */}
          <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,255,135,0.22) 0%, transparent 70%)', filter: 'blur(28px)' }} />
          <button onClick={onFechar} className="float-right text-white/50 hover:text-white text-xl leading-none relative z-10">×</button>
          <div className="text-2xl mb-1 relative z-10">⚽</div>
          <h2 className="text-xl font-bold relative z-10">
            {modo === 'login' ? 'Bem-vinda de volta!' : modo === 'recuperar' ? 'Recuperar senha' : 'Junte-se ao Esporte Brasília'}
          </h2>
          <p className="text-white/50 text-sm mt-0.5 relative z-10">
            {modo === 'login' ? 'Entre para ver e participar dos jogos' : modo === 'recuperar' ? 'Enviaremos um link para seu e-mail' : 'Encontre seu esporte em Brasília'}
          </p>
        </div>

        <div className="p-6 space-y-3">
          {modo === 'cadastro' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Nome</label>
              <input type="text" placeholder="Seu nome completo" value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">E-mail</label>
            <input type="email" placeholder="seu@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {modo !== 'recuperar' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Senha</label>
              <input type="password" placeholder="••••••••" value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && entrar()}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
              {modo === 'login' && (
                <button onClick={() => { setModo('recuperar'); setErro(''); setAviso('') }}
                  className="text-xs text-blue-600 hover:underline mt-1.5">
                  Esqueci minha senha
                </button>
              )}
            </div>
          )}

          {aviso && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-emerald-700">
              {aviso}
            </div>
          )}

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600">
              {erro}
            </div>
          )}

          <button onClick={entrar} disabled={carregando}
            className="w-full text-white py-3 rounded-xl font-semibold transition shadow-sm disabled:opacity-50 mt-1"
            style={{ background: 'var(--neon)' }}>
            {carregando ? '...' : modo === 'login' ? 'Entrar' : modo === 'recuperar' ? 'Enviar link de recuperação' : 'Criar conta grátis'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {modo === 'login' ? 'Novo por aqui?' : modo === 'recuperar' ? 'Lembrou a senha?' : 'Já tem conta?'}{' '}
            <button onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); setAviso('') }}
              className="text-blue-600 font-semibold hover:underline">
              {modo === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
