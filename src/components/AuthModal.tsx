'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface AuthModalProps {
  onFechar: () => void
  onSucesso?: () => void
}

export default function AuthModal({ onFechar, onSucesso }: AuthModalProps) {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const supabase = createClient()

  async function entrar() {
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
      if (error) { setErro('Erro ao criar conta. Tente outro e-mail.'); setCarregando(false); return }
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
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-6 text-white">
          <button onClick={onFechar} className="float-right text-blue-200 hover:text-white text-xl leading-none">×</button>
          <div className="text-2xl mb-1">⚽</div>
          <h2 className="text-xl font-bold">
            {modo === 'login' ? 'Bem-vinda de volta!' : 'Junte-se ao EsporteBSB'}
          </h2>
          <p className="text-blue-200 text-sm mt-0.5">
            {modo === 'login' ? 'Entre para ver e participar dos jogos' : 'Encontre seu esporte em Brasília'}
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

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Senha</label>
            <input type="password" placeholder="••••••••" value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && entrar()}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600">
              {erro}
            </div>
          )}

          <button onClick={entrar} disabled={carregando}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 mt-1">
            {carregando ? '...' : modo === 'login' ? 'Entrar' : 'Criar conta grátis'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {modo === 'login' ? 'Novo por aqui?' : 'Já tem conta?'}{' '}
            <button onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro('') }}
              className="text-blue-600 font-semibold hover:underline">
              {modo === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
