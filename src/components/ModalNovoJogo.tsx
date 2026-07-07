'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ESPORTES, TIPOS, DIAS } from '@/lib/constants'

interface ModalNovoJogoProps {
  quadraId: string
  userId?: string
  onFechar: () => void
  onSalvo: () => void
}

export default function ModalNovoJogo({ quadraId, userId, onFechar, onSalvo }: ModalNovoJogoProps) {
  const [form, setForm] = useState({
    titulo: '',
    esporte: 'futsal',
    tipo: 'aberto',
    dia_semana: 'segunda',
    horario: '',
    vagas: '',
    descricao: '',
    custo_tipo: 'gratis',
    custo_valor: '',
    whatsapp_link: '',
    is_recorrente: true,
    data_evento: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const supabase = createClient()

  function campo(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function salvar() {
    if (!form.titulo.trim()) { setErro('Digite um título.'); return }
    setSalvando(true)
    const { error } = await supabase.from('jogos').insert({
      quadra_id: quadraId,
      criado_por: userId ?? null,
      titulo: form.titulo,
      esporte: form.esporte,
      tipo: form.tipo,
      dia_semana: form.is_recorrente ? form.dia_semana : null,
      horario: form.horario || null,
      vagas: form.vagas ? parseInt(form.vagas) : null,
      descricao: form.descricao || null,
      custo_tipo: form.custo_tipo,
      custo_valor: form.custo_tipo === 'pago' ? form.custo_valor : null,
      is_recorrente: form.is_recorrente,
      whatsapp_link: form.whatsapp_link.trim() || null,
      data_evento: !form.is_recorrente && form.data_evento ? form.data_evento : null,
    })
    setSalvando(false)
    if (error) { setErro('Erro ao salvar.'); return }
    onSalvo()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900">Novo Jogo / Grupo</h3>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl p-1">×</button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" placeholder="ex: Futsal feminino às 19h"
              value={form.titulo} onChange={(e) => campo('titulo', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Esporte</label>
              <select value={form.esporte} onChange={(e) => campo('esporte', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {ESPORTES.map((e) => <option key={e.value} value={e.value}>{e.emoji} {e.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Público</label>
              <select value={form.tipo} onChange={(e) => campo('tipo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Recorrência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
            <div className="flex gap-2">
              <button onClick={() => campo('is_recorrente', true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.is_recorrente ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                🔁 Semanal
              </button>
              <button onClick={() => campo('is_recorrente', false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${!form.is_recorrente ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                📅 Único
              </button>
            </div>
          </div>

          {form.is_recorrente ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia da semana</label>
                <select value={form.dia_semana} onChange={(e) => campo('dia_semana', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  {DIAS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input type="time" value={form.horario} onChange={(e) => campo('horario', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input type="date" value={form.data_evento} onChange={(e) => campo('data_evento', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input type="time" value={form.horario} onChange={(e) => campo('horario', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          )}

          {/* Custo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custo</label>
            <div className="flex gap-2 mb-2">
              <button onClick={() => campo('custo_tipo', 'gratis')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.custo_tipo === 'gratis' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                ✓ Gratuito
              </button>
              <button onClick={() => campo('custo_tipo', 'pago')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${form.custo_tipo === 'pago' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-300'}`}>
                💰 Pago
              </button>
            </div>
            {form.custo_tipo === 'pago' && (
              <input type="text" placeholder='ex: R$ 15 para dividir a quadra'
                value={form.custo_valor} onChange={(e) => campo('custo_valor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limite de vagas</label>
            <input type="number" min="1" placeholder="ex: 10" value={form.vagas}
              onChange={(e) => campo('vagas', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grupo do WhatsApp (opcional)</label>
            <input type="url" placeholder="https://chat.whatsapp.com/..."
              value={form.whatsapp_link} onChange={(e) => campo('whatsapp_link', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <p className="text-xs text-gray-400 mt-1">Quem se interessar entra direto no grupo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
            <textarea rows={2} placeholder="Nível, contato, o que levar..."
              value={form.descricao} onChange={(e) => campo('descricao', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <button onClick={salvar} disabled={salvando}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {salvando ? 'Salvando...' : 'Criar jogo'}
          </button>
        </div>
      </div>
    </div>
  )
}
