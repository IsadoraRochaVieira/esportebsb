'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function enviarFoto(file: File) {
    if (file.size > 4 * 1024 * 1024) { setMsg('Foto muito grande (máx. 4MB).'); return }
    setEnviandoFoto(true)
    setMsg('')
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (error) {
      setMsg(error.message.includes('Bucket not found')
        ? 'O armazenamento de fotos ainda não foi configurado.'
        : 'Não foi possível enviar a foto. Tente novamente.')
      setEnviandoFoto(false)
      return
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${data.publicUrl}?v=${Date.now()}`
    await supabase.from('perfis').upsert({ id: userId, avatar_url: url })
    setForm((f) => ({ ...f, avatar_url: url }))
    setEnviandoFoto(false)
  }

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
              <button onClick={() => fileRef.current?.click()} disabled={enviandoFoto}
                className="relative w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl mb-2 overflow-hidden group cursor-pointer border-2 border-white/30 hover:border-white/60 transition"
                title="Trocar foto de perfil">
                {form.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
                <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-semibold transition">
                  {enviandoFoto ? '...' : '📷'}
                </span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) enviarFoto(f) }} />
              <p className="font-bold text-lg">{form.nome || 'Meu Perfil'}</p>
              {userEmail && <p className="text-slate-300 text-xs">{userEmail}</p>}
              <p className="text-slate-400 text-[11px] mt-0.5">Toque na foto para trocar</p>
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
