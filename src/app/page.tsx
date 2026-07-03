'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Toaster, toast } from 'sonner'
import { createClient, type Quadra, type Jogo } from '@/lib/supabase'
import { ESPORTES } from '@/lib/constants'
import CardEvento from '@/components/CardEvento'
import ModalNovaQuadra from '@/components/ModalNovaQuadra'
import ModalNovoJogo from '@/components/ModalNovoJogo'
import ModalPerfil from '@/components/ModalPerfil'
import AuthModal from '@/components/AuthModal'
import LandingPage from '@/components/LandingPage'

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false })

export default function Home() {
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [filtroEsporte, setFiltroEsporte] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [userId, setUserId] = useState<string | undefined>()
  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [participacoes, setParticipacoes] = useState<Set<string>>(new Set())
  const [modoPin, setModoPin] = useState(false)
  const [novoPin, setNovoPin] = useState<{ lat: number; lng: number } | null>(null)
  const [quadraParaJogo, setQuadraParaJogo] = useState<Quadra | null>(null)
  const [criarJogoNaQuadra, setCriarJogoNaQuadra] = useState<Quadra | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authModo, setAuthModo] = useState<'login' | 'cadastro'>('login')
  const [showPerfil, setShowPerfil] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
  const [vista, setVista] = useState<'lista' | 'mapa'>(isMobile ? 'mapa' : 'lista')
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [showSobre, setShowSobre] = useState(false)
  const [showLanding, setShowLanding] = useState(true)

  const supabase = createClient()

  async function carregarDados() {
    const { data } = await supabase
      .from('quadras')
      .select('*, jogos(*, participantes(user_id, status))')
    const todasQuadras: Quadra[] = data ?? []
    setQuadras(todasQuadras)
    const todosJogos: Jogo[] = todasQuadras.flatMap((q) =>
      (q.jogos ?? []).map((j: any) => ({ ...j, quadra: q }))
    )
    setJogos(todosJogos)
    setCarregando(false)
  }

  async function carregarParticipacoes(uid: string) {
    const { data } = await supabase.from('participantes').select('jogo_id').eq('user_id', uid)
    setParticipacoes(new Set(data?.map((p: any) => p.jogo_id) ?? []))
  }

  useEffect(() => {
    carregarDados()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setUserEmail(data.user.email ?? undefined)
        carregarParticipacoes(data.user.id)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id)
      setUserEmail(session?.user?.email ?? undefined)
      if (session?.user) carregarParticipacoes(session.user.id)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function participar(jogoId: string) {
    if (!userId) { setShowAuth(true); return }
    const { error } = await supabase.from('participantes').insert({ jogo_id: jogoId, user_id: userId })
    if (error) { toast.error('Não foi possível confirmar presença.'); return }
    setParticipacoes((p) => new Set([...p, jogoId]))
    carregarDados()
    toast.success('Presença confirmada! 🎉')
  }

  async function cancelar(jogoId: string) {
    if (!userId) return
    await supabase.from('participantes').delete().eq('jogo_id', jogoId).eq('user_id', userId)
    setParticipacoes((p) => { const s = new Set(p); s.delete(jogoId); return s })
    carregarDados()
    toast('Participação cancelada.')
  }

  async function sair() {
    await supabase.auth.signOut()
    setUserId(undefined)
    setUserEmail(undefined)
    setParticipacoes(new Set())
    setShowPerfil(false)
    toast('Até logo! 👋')
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (!modoPin) return
    setNovoPin({ lat, lng })
    setModoPin(false)
  }, [modoPin])

  const jogosFiltrados = jogos.filter((j) => {
    if (filtroEsporte && j.esporte !== filtroEsporte) return false
    if (filtroTipo && j.tipo !== filtroTipo) return false
    if (busca) {
      const q = busca.toLowerCase()
      if (!j.titulo.toLowerCase().includes(q) &&
          !j.quadra?.nome?.toLowerCase().includes(q) &&
          !j.quadra?.bairro?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const meusJogos = jogosFiltrados.filter((j) => participacoes.has(j.id))
  const outrosJogos = jogosFiltrados.filter((j) => !participacoes.has(j.id))

  function ativarModoPin() {
    setModoPin(true)
    setVista('mapa')
    toast('Clique no mapa para marcar o local', { icon: '📍' })
  }

  if (showLanding) {
    return (
      <LandingPage
        onEntrar={() => setShowLanding(false)}
        onCriarConta={() => { setShowLanding(false); setAuthModo('cadastro'); setShowAuth(true) }}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f1f5f9' }}>
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-1 cursor-pointer" onClick={() => setShowSobre(true)}>
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">⚽</div>
            <span className="font-bold text-slate-900 text-base hidden sm:block">Esporte Brasília</span>
          </div>

          {/* Busca */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar esporte, bairro..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-slate-100 border border-transparent rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Toggle vista */}
          <div className="flex bg-slate-100 rounded-xl p-0.5">
            <button onClick={() => setVista('lista')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${vista === 'lista' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              Lista
            </button>
            <button onClick={() => setVista('mapa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${vista === 'mapa' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              Mapa
            </button>
          </div>

          {/* Ações */}
          <button onClick={ativarModoPin}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl font-semibold transition shadow-sm ${modoPin ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            <span>{modoPin ? '📍' : '+'}</span>
            <span className="hidden sm:block">{modoPin ? 'Clique no mapa' : 'Novo local'}</span>
          </button>

          {userId ? (
            <button onClick={() => setShowPerfil(true)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition font-bold text-sm">
              👤
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { setAuthModo('login'); setShowAuth(true) }}
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition whitespace-nowrap hidden sm:block">
                Entrar
              </button>
              <button onClick={() => { setAuthModo('cadastro'); setShowAuth(true) }}
                className="text-sm font-semibold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition whitespace-nowrap">
                Criar conta
              </button>
            </div>
          )}
        </div>

        {/* Filtros de esporte */}
        <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto">
          <button onClick={() => { setFiltroEsporte(''); setFiltroTipo('') }}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${!filtroEsporte && !filtroTipo ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Todos
          </button>
          {ESPORTES.map((e) => (
            <button key={e.value} onClick={() => setFiltroEsporte(filtroEsporte === e.value ? '' : e.value)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition"
              style={filtroEsporte === e.value ? { background: e.cor, color: 'white' } : { background: '#f1f5f9', color: '#475569' }}>
              {e.emoji} {e.label}
            </button>
          ))}
          <div className="w-px bg-slate-200 flex-shrink-0 mx-1" />
          {[
            { v: 'feminino', l: '♀ Feminino', bg: '#fce7f3', text: '#9d174d', active: '#db2777' },
            { v: 'misto', l: '⚥ Misto', bg: '#ede9fe', text: '#5b21b6', active: '#7c3aed' },
            { v: 'aberto', l: '🔓 Aberto', bg: '#dbeafe', text: '#1e40af', active: '#2563eb' },
          ].map((t) => (
            <button key={t.v} onClick={() => setFiltroTipo(filtroTipo === t.v ? '' : t.v)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition"
              style={filtroTipo === t.v ? { background: t.active, color: 'white' } : { background: t.bg, color: t.text }}>
              {t.l}
            </button>
          ))}
        </div>
      </header>

      {/* Corpo */}
      <div className="flex-1 flex overflow-hidden">

        {/* Painel lista */}
        <div className={`${vista === 'lista' ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[400px] flex-shrink-0 overflow-hidden border-r border-slate-200`}>

          {/* Barra de status */}
          <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {carregando ? 'Carregando...' : `${jogosFiltrados.length} jogo${jogosFiltrados.length !== 1 ? 's' : ''} encontrado${jogosFiltrados.length !== 1 ? 's' : ''}`}
            </span>
            {!userId && (
              <button onClick={() => setShowAuth(true)} className="text-xs text-blue-600 font-semibold hover:underline">
                Entre para participar →
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Meus jogos */}
            {meusJogos.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">✓ Meus jogos confirmados</p>
                <div className="space-y-2">
                  {meusJogos.map((j) => (
                    <CardEvento key={j.id} jogo={j} userId={userId} participando={true}
                      onParticipar={() => participar(j.id)} onCancelar={() => cancelar(j.id)}
                      onClick={() => { setVista('mapa') }} />
                  ))}
                </div>
              </div>
            )}

            {/* Outros jogos */}
            {outrosJogos.length > 0 && (
              <div>
                {meusJogos.length > 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2 mt-3">Jogos disponíveis</p>}
                <div className="space-y-2">
                  {outrosJogos.map((j) => (
                    <CardEvento key={j.id} jogo={j} userId={userId} participando={false}
                      onParticipar={() => participar(j.id)} onCancelar={() => cancelar(j.id)}
                      onClick={() => { setVista('mapa') }} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {jogosFiltrados.length === 0 && !carregando && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🏟</div>
                <p className="font-semibold text-slate-600 mb-1">Nenhum jogo encontrado</p>
                <p className="text-sm text-slate-400 mb-4">
                  {busca ? `Nada para "${busca}"` : 'Seja o primeiro a criar um jogo nessa área!'}
                </p>
                <button onClick={ativarModoPin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                  + Adicionar local
                </button>
              </div>
            )}

            {carregando && (
              <div className="space-y-3 mt-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-slate-100" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className={`${vista === 'mapa' ? 'flex' : 'hidden'} lg:flex flex-1 relative`}>
          {/* Banner modo pin */}
          {modoPin && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-up">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-bold text-sm">Toque no mapa para marcar o local</p>
                <p className="text-xs text-orange-100">Onde fica a quadra/parque?</p>
              </div>
              <button onClick={() => setModoPin(false)} className="ml-2 text-orange-200 hover:text-white text-lg">×</button>
            </div>
          )}
          <Mapa quadras={quadras} filtroEsporte={filtroEsporte}
            onQuadraSelecionada={(q) => { setQuadraParaJogo(q) }}
            onMapClick={handleMapClick}
            modoPin={modoPin}
            visible={vista === 'mapa'} />

          {/* Painel lateral do local selecionado */}
          {quadraParaJogo && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-10 flex flex-col animate-slide-up overflow-hidden">
              {/* Header do local */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg leading-tight">{quadraParaJogo.nome}</p>
                    <p className="text-slate-300 text-sm mt-0.5 truncate">{quadraParaJogo.endereco}{quadraParaJogo.bairro ? ` · ${quadraParaJogo.bairro}` : ''}</p>
                  </div>
                  <button onClick={() => setQuadraParaJogo(null)} className="text-slate-400 hover:text-white text-2xl leading-none ml-3 flex-shrink-0">×</button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    📍 Local esportivo
                  </span>
                  <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    {(quadraParaJogo.jogos?.length ?? 0)} jogo{(quadraParaJogo.jogos?.length ?? 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Lista de jogos */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(quadraParaJogo.jogos?.length ?? 0) === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2">🏟</div>
                    <p className="text-slate-500 text-sm">Nenhum jogo cadastrado aqui ainda.</p>
                    <p className="text-slate-400 text-xs mt-1">Seja o primeiro!</p>
                  </div>
                ) : (
                  quadraParaJogo.jogos!.map((j: any) => {
                    const esp = ESPORTES.find((e) => e.value === j.esporte) ?? ESPORTES[ESPORTES.length - 1]
                    const vagas = (j.vagas ?? 0) - (j.participantes?.length ?? 0)
                    const participando = participacoes.has(j.id)
                    return (
                      <div key={j.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: esp.bg }}>
                            {esp.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm leading-tight">{j.titulo}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{esp.label} · {j.tipo === 'feminino' ? '♀ Feminino' : j.tipo === 'misto' ? '⚥ Misto' : '🔓 Aberto'}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                              <span>📅 {j.dia_semana ?? j.data_evento}</span>
                              <span>🕐 {j.horario}</span>
                              <span style={{ color: esp.cor }} className="font-semibold">{vagas} vagas</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => participando ? cancelar(j.id) : participar(j.id)}
                          className="w-full mt-3 py-2 rounded-xl text-xs font-semibold transition"
                          style={participando
                            ? { background: '#fee2e2', color: '#991b1b' }
                            : { background: esp.cor, color: 'white' }}>
                          {participando ? 'Cancelar participação' : 'Quero participar →'}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer — criar jogo */}
              <div className="p-4 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={() => { setCriarJogoNaQuadra(quadraParaJogo); setQuadraParaJogo(null) }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                  + Criar jogo neste local
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB mobile */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button onClick={ativarModoPin}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition active:scale-95">
          +
        </button>
      </div>

      {/* Modais */}
      {novoPin && (
        <ModalNovaQuadra lat={novoPin.lat} lng={novoPin.lng} userId={userId}
          onFechar={() => setNovoPin(null)}
          onSalvo={(quadraId) => {
            setNovoPin(null)
            carregarDados()
            toast.success('Local cadastrado!')
            supabase.from('quadras').select('*, jogos(*, participantes(user_id,status))').eq('id', quadraId).single().then(({ data }) => {
              if (data) { setCriarJogoNaQuadra(data); setVista('mapa') }
            })
          }} />
      )}

      {criarJogoNaQuadra && (
        <ModalNovoJogo quadraId={criarJogoNaQuadra.id} userId={userId}
          onFechar={() => setCriarJogoNaQuadra(null)}
          onSalvo={() => {
            setCriarJogoNaQuadra(null)
            carregarDados()
            toast.success('Jogo criado! 🎉')
          }} />
      )}

      {showSobre && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowSobre(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-8 text-white relative">
              <button onClick={() => setShowSobre(false)} className="absolute top-4 right-4 text-blue-200 hover:text-white text-2xl leading-none">×</button>
              <div className="text-4xl mb-3">⚽</div>
              <h2 className="text-2xl font-bold">Esporte Brasília</h2>
              <p className="text-blue-200 text-sm mt-1">A rede social dos esportes do DF</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex gap-3">
                <div className="text-2xl">💚</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Saúde que conecta</p>
                  <p className="text-slate-500 text-sm mt-0.5">Acreditamos que o esporte é um dos pilares da saúde mental e física. Cada jogo é uma oportunidade de se sentir melhor — e de conhecer pessoas incríveis.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🏙️</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Feito para Brasília</p>
                  <p className="text-slate-500 text-sm mt-0.5">O DF tem parques, quadras e espaços incríveis subutilizados. Queremos mudar isso — conectando quem quer jogar com quem já joga, perto de você.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🤝</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Comunidade aberta</p>
                  <p className="text-slate-500 text-sm mt-0.5">Sem inscrições complicadas, sem taxas. Você cadastra seu jogo, abre vagas e a galera aparece. Simples assim.</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 text-center">Criado com ❤️ em Brasília · 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onFechar={() => setShowAuth(false)} onSucesso={() => toast.success('Bem-vinda! 👋')} modoInicial={authModo} />}

      {showPerfil && userId && (
        <ModalPerfil userId={userId} userEmail={userEmail}
          onFechar={() => setShowPerfil(false)}
          onSair={sair} />
      )}
    </div>
  )
}
