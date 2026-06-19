'use client'

import { useState, useEffect } from 'react'
import { createClient, type Perfil } from '@/lib/supabase'
import { ESPORTES, GENEROS } from '@/lib/constants'

interface ModalPerfilProps {
  userId: string
  userEmail?: string
  onFechar: () => void
  onSair: () => void
}

export default function ModalPerfil({ userId, userEmail, onFechar, onSair }: ModalPerfilProps) {
  const [form, setForm] = useState<Partial<Perfil>>({ nome: '', genero: 'nao_informado', esportes: [] })
  const [salvando, setSalvando] = useState(false)
  const [msg, setMsg] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('perfis').select('*').eq('id', userId).single().then(({ data }) => {
      if (data) setForm(data)
    })
  }, [userId])

  function toggleEsporte(val: string) {
    setForm((f) => {
      const lista = f.esportes ?? []
      return { ...f, esportes: lista.includes(val) ? lista.filter((e) => e !== val) : [...lista, val] }
    })
  }

  async function salvar() {
    setSalvando(true)
    await supabase.from('perfis').upsert({ id: userId, nome: form.nome, genero: form.genero, esportes: form.esportes })
    setSalvando(false)
    setMsg('Salvo com sucesso!')
    setTimeout(onFechar, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl mb-2">👤</div>
              <p className="font-bold text-lg">{form.nome || 'Meu Perfil'}</p>
              {userEmail && <p className="text-slate-300 text-xs">{userEmail}</p>}
            </div>
            <button onClick={onFechar} className="text-slate-300 hover:text-white text-2xl leading-none self-start">×</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Nome</label>
            <input type="text" placeholder="Seu nome" value={form.nome ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Gênero</label>
            <div className="flex gap-2 flex-wrap">
              {GENEROS.map((g) => (
                <button key={g.value} onClick={() => setForm((f) => ({ ...f, genero: g.value as any }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${form.genero === g.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Esportes que curto</label>
            <div className="flex flex-wrap gap-2">
              {ESPORTES.map((e) => {
                const sel = (form.esportes ?? []).includes(e.value)
                return (
                  <button key={e.value} onClick={() => toggleEsporte(e.value)}
                    style={sel ? { background: e.cor, borderColor: e.cor, color: 'white' } : {}}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${!sel ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-400' : ''}`}>
                    {e.emoji} {e.label}
                  </button>
                )
              })}
            </div>
          </div>

          {msg && <p className="text-sm text-emerald-600 font-semibold text-center">{msg}</p>}

          <button onClick={salvar} disabled={salvando}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {salvando ? 'Salvando...' : 'Salvar perfil'}
          </button>

          <button onClick={onSair}
            className="w-full text-slate-400 hover:text-red-500 text-sm py-1 transition">
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
