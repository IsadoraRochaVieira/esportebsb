'use client'

import { ESPORTES, TIPOS, DIAS } from '@/lib/constants'
import { Linkify } from '@/lib/linkify'
import type { Jogo } from '@/lib/supabase'

interface CardEventoProps {
  jogo: Jogo
  userId?: string
  participando: boolean
  onParticipar: () => void
  onCancelar: () => void
  onClick: () => void
}

export default function CardEvento({ jogo, userId, participando, onParticipar, onCancelar, onClick }: CardEventoProps) {
  const esp = ESPORTES.find((e) => e.value === jogo.esporte) ?? ESPORTES[ESPORTES.length - 1]
  const tipo = TIPOS.find((t) => t.value === jogo.tipo)
  const dia = DIAS.find((d) => d.value === jogo.dia_semana)

  const totalConfirmados = jogo.participantes?.length ?? 0
  const vagas = jogo.vagas ?? 0
  const vagasLivres = vagas > 0 ? Math.max(0, vagas - totalConfirmados) : null
  const pct = vagas > 0 ? Math.min(100, (totalConfirmados / vagas) * 100) : 0
  const lotado = vagas > 0 && vagasLivres === 0

  const quando = jogo.is_recorrente && dia
    ? `${dia.short}${jogo.horario ? ` · ${jogo.horario.slice(0, 5)}` : ''}`
    : jogo.data_evento
    ? `${new Date(jogo.data_evento + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}${jogo.horario ? ` · ${jogo.horario.slice(0, 5)}` : ''}`
    : jogo.horario?.slice(0, 5) ?? ''

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer animate-slide-up group"
      style={{ borderLeft: `4px solid ${esp.cor}` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl flex-shrink-0">{esp.emoji}</span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{jogo.titulo}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                📍 {jogo.quadra?.nome ?? jogo.quadra?.endereco ?? ''}
                {jogo.quadra?.bairro ? ` · ${jogo.quadra.bairro}` : ''}
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tipo?.cor}`}>
            {tipo?.emoji} {tipo?.label}
          </span>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quando && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
              🗓 {quando}{jogo.is_recorrente ? ' (semanal)' : ''}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
            jogo.custo_tipo === 'pago'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}>
            {jogo.custo_tipo === 'pago' ? `💰 ${jogo.custo_valor ?? 'Pago'}` : '✓ Gratuito'}
          </span>
        </div>

        {/* Vagas */}
        {vagas > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">{totalConfirmados} de {vagas} confirmados</span>
              <span className={`font-semibold ${lotado ? 'text-red-500' : vagasLivres! <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {lotado ? 'Lotado' : `${vagasLivres} vaga${vagasLivres !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : esp.cor,
                }}
              />
            </div>
          </div>
        )}

        {/* Descrição */}
        {jogo.descricao && (
          <p className="text-xs text-slate-400 mb-3"><Linkify text={jogo.descricao} /></p>
        )}

        {/* WhatsApp */}
        {jogo.whatsapp_link && (
          <a href={jogo.whatsapp_link} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full mb-2 py-2 rounded-xl text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition">
            💬 Grupo do WhatsApp
          </a>
        )}

        {/* Botão */}
        {userId && (
          <button
            onClick={(e) => { e.stopPropagation(); participando ? onCancelar() : onParticipar() }}
            disabled={!participando && lotado}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
              participando
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                : lotado
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'text-white shadow-sm hover:shadow hover:opacity-90'
            }`}
            style={!participando && !lotado ? { background: esp.cor } : {}}
          >
            {participando ? '✓ Confirmado — toque para cancelar' : lotado ? 'Sem vagas disponíveis' : 'Quero participar'}
          </button>
        )}

        {!userId && (
          <p className="text-xs text-center text-slate-400 pt-1">Faça login para participar</p>
        )}
      </div>
    </div>
  )
}
