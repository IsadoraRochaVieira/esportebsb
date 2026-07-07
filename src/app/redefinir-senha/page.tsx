'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [sessaoPronta, setSessaoPronta] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // O link do e-mail loga o usuário automaticamente (evento PASSWORD_RECOVERY)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessaoPronta(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setSessaoPronta(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function salvar() {
    setErro('')
    if (senha.length < 6) { setErro('A senha precisa ter ao menos 6 caracteres.'); return }
    if (senha !== confirma) { setErro('As senhas não são iguais.'); return }
    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setSalvando(false)
    if (error) { setErro('Não foi possível salvar. O link pode ter expirado — peça um novo.'); return }
    setOk(true)
    setTimeout(() => { window.location.href = '/' }, 2500)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-6 text-white">
          <div className="text-2xl mb-1">🔑</div>
          <h2 className="text-xl font-bold">Nova senha</h2>
          <p className="text-blue-200 text-sm mt-0.5">Escolha uma nova senha para sua conta</p>
        </div>

        <div className="p-6 space-y-3">
          {ok ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 text-center">
              ✓ Senha alterada com sucesso!<br />Redirecionando para o app...
            </div>
          ) : !sessaoPronta ? (
            <div className="text-sm text-slate-500 text-center py-4">
              Verificando o link de recuperação...
              <p className="text-xs text-slate-400 mt-2">
                Se essa mensagem não sumir, o link pode ter expirado.{' '}
                <a href="/" className="text-blue-600 hover:underline">Voltar e pedir um novo</a>
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Nova senha</label>
                <input type="password" placeholder="••••••••" value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Confirmar senha</label>
                <input type="password" placeholder="••••••••" value={confirma}
                  onChange={(e) => setConfirma(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && salvar()}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600">{erro}</div>
              )}

              <button onClick={salvar} disabled={salvando}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 mt-1">
                {salvando ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
