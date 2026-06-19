'use client'

import { useState, useEffect } from 'react'
import { createClient, type Quadra, type Jogo } from '@/lib/supabase'
import { ESPORTES, DIAS, TIPOS } from '@/lib/constants'
import ModalNovoJogo from './ModalNovoJogo'

interface PainelQuadraProps {
  quadra: Quadra
  onFechar: () => void
  userId?: string
}

export default function PainelQuadra({ quadra, onFechar, userId }: PainelQuadraProps) {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [participacoes, setParticipacoes] = useState<Set<string>>(new Set())
  const [modalJogo, setModalJogo] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  async function carregarJogos() {
    setLoading(true)
    const { data } = await supabase
      .from('jogos')
      .select('*')
      .eq('quadra_id', quadra.id)
      .order('dia_semana')

    setJogos(data ?? [])

    if (userId && data) {
      const ids = data.map((j: Jogo) => j.id)
      const { data: parts } = await supabase
        .from('participantes')
        .select('jogo_id')
        .eq('user_id', userId)
        .in('jogo_id', ids)

      setParticipacoes(new Set(parts?.map((p: any) => p.jogo_id) ?? []))
    }
    setLoading(false)
  }

  useEffect(() => {
    carregarJogos()
  }, [quadra.id])

  async function toggleParticipacao(jogoId: string) {
    if (!userId) return
    const jaParticipa = participacoes.has(jogoId)

    if (jaParticipa) {
      await supabase.from('participantes').delete().eq('jogo_id', jogoId).eq('user_id', userId)
      setParticipacoes((prev) => { const s = new Set(prev); s.delete(jogoId); return s })
    } else {
      await supabase.from('participantes').insert({ jogo_id: jogoId, user_id: userId })
      setParticipacoes((prev) => new Set([...prev, jogoId]))
    }
  }

  const esporteLabel = (esporte: string) => ESPORTES.find((e) => e.value === esporte)
  const diaLabel = (dia: string) => DIAS.find((d) => d.value === dia)?.label ?? dia
  const tipoLabel = (tipo: string) => TIPOS.find((t) => t.value === tipo)?.label ?? tipo

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-start justify-between p-4 border-b">
        <div>
          <h2 className="font-bold text-lg text-gray-900">{quadra.nome}</h2>
          <p className="text-sm text-gray-500">{quadra.endereco}</p>
          {quadra.bairro && <p className="text-xs text-gray-400">{quadra.bairro}</p>}
        </div>
        <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Jogos & Grupos</h3>
          {userId && (
            <button
              onClick={() => setModalJogo(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              + Novo jogo
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-400">Carregando...</p>}

        {!loading && jogos.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhum jogo cadastrado ainda.<br />
            {userId ? 'Seja o primeiro a criar um!' : 'Faça login para criar um jogo.'}
          </p>
        )}

        <div className="space-y-3">
          {jogos.map((jogo) => {
            const esp = esporteLabel(jogo.esporte)
            const participa = participacoes.has(jogo.id)
            return (
              <div key={jogo.id} className="border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{esp?.emoji}</span>
                      <span className="font-semibold text-gray-800">{jogo.titulo}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{esp?.label}</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{tipoLabel(jogo.tipo)}</span>
                      {jogo.dia_semana && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{diaLabel(jogo.dia_semana)}</span>
                      )}
                      {jogo.horario && (
                        <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{jogo.horario.slice(0, 5)}</span>
                      )}
                    </div>
                    {jogo.descricao && <p className="text-xs text-gray-500">{jogo.descricao}</p>}
                    {jogo.vagas && <p className="text-xs text-gray-400 mt-1">Vagas: {jogo.vagas}</p>}
                  </div>
                  {userId && (
                    <button
                      onClick={() => toggleParticipacao(jogo.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                        participa
                          ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {participa ? '✓ Confirmado' : 'Entrar'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modalJogo && (
        <ModalNovoJogo
          quadraId={quadra.id}
          userId={userId!}
          onFechar={() => setModalJogo(false)}
          onSalvo={() => { setModalJogo(false); carregarJogos() }}
        />
      )}
    </div>
  )
}
