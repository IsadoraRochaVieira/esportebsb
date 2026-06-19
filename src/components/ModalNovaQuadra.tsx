'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface ModalNovaQuadraProps {
  lat: number
  lng: number
  userId: string
  onFechar: () => void
  onSalvo: (quadraId: string) => void
}

export default function ModalNovaQuadra({ lat, lng, userId, onFechar, onSalvo }: ModalNovaQuadraProps) {
  const [form, setForm] = useState({ nome: '', endereco: '', bairro: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const supabase = createClient()

  async function salvar() {
    if (!form.nome.trim() || !form.endereco.trim()) { setErro('Nome e endereço são obrigatórios.'); return }
    setSalvando(true)
    const { data, error } = await supabase.from('quadras').insert({
      nome: form.nome, endereco: form.endereco,
      bairro: form.bairro || null, lat, lng, criado_por: userId,
    }).select().single()
    setSalvando(false)
    if (error || !data) { setErro('Erro ao salvar. Tente novamente.'); return }
    onSalvo(data.id)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-5 py-4 text-white rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-200 text-xs font-medium mb-0.5">📍 {lat.toFixed(4)}, {lng.toFixed(4)}</p>
              <h3 className="font-bold text-lg">Novo local esportivo</h3>
            </div>
            <button onClick={onFechar} className="text-emerald-200 hover:text-white text-xl">×</button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Nome do local *</label>
            <input type="text" placeholder="ex: Quadra da 911 Sul" value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Endereço *</label>
            <input type="text" placeholder="ex: SQS 911 Bloco A" value={form.endereco}
              onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Bairro / Região</label>
            <input type="text" placeholder="ex: Asa Sul" value={form.bairro}
              onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
          </div>

          {erro && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{erro}</p>}

          <button onClick={salvar} disabled={salvando}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50">
            {salvando ? 'Salvando...' : 'Cadastrar local → Adicionar jogo'}
          </button>
        </div>
      </div>
    </div>
  )
}
