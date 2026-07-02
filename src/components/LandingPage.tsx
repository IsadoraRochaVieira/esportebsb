'use client'

interface LandingPageProps {
  onEntrar: () => void
  onCriarConta: () => void
}

export default function LandingPage({ onEntrar, onCriarConta }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f172a' }}>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center overflow-hidden">
        {/* Background blur circles */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#2563eb' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl" style={{ background: '#16a34a' }} />

        {/* Logo */}
        <div className="relative z-10 mb-8">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-4xl shadow-2xl mx-auto mb-4" style={{ boxShadow: '0 0 40px rgba(37,99,235,0.5)' }}>
            ⚽
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Esporte Brasília
          </h1>
          <p className="text-blue-300 text-lg mt-2 font-medium">A rede social dos esportes do DF</p>
        </div>

        {/* Tagline */}
        <p className="relative z-10 text-slate-300 text-xl sm:text-2xl max-w-lg mx-auto leading-relaxed mb-10">
          Encontre jogos perto de você, conheça gente nova e cuide da sua saúde.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto mb-12">
          <button
            onClick={onCriarConta}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl text-base transition shadow-xl"
            style={{ boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}>
            Criar conta grátis
          </button>
          <button
            onClick={onEntrar}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl text-base transition border border-white/20">
            Ver os jogos →
          </button>
        </div>

        {/* Esportes tags */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 max-w-md mx-auto mb-12">
          {['⚽ Futsal', '🏐 Vôlei', '🏀 Basquete', '🎾 Beach Tênis', '🏃 Corrida', '🛹 Skate', '🧘 Yoga', '🚴 Ciclismo', '♟️ Xadrez', '🥋 Jiu-Jitsu'].map((s) => (
            <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="max-w-2xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">💚</div>
            <h3 className="text-white font-bold mb-2">Saúde que conecta</h3>
            <p className="text-slate-400 text-sm leading-relaxed">O esporte cuida do corpo e da mente. Cada jogo é uma oportunidade de se sentir melhor.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🏙️</div>
            <h3 className="text-white font-bold mb-2">Feito para Brasília</h3>
            <p className="text-slate-400 text-sm leading-relaxed">O DF tem parques e quadras incríveis. A gente conecta quem quer jogar com quem já joga.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-white font-bold mb-2">Comunidade aberta</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Sem inscrições complicadas. Você cadastra seu jogo, abre vagas e a galera aparece.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-white/10">
        <p className="text-slate-500 text-sm">Feito com ❤️ em Brasília · 2026</p>
        <button onClick={onEntrar} className="text-slate-400 text-xs mt-1 hover:text-slate-300 underline">
          Entrar sem criar conta
        </button>
      </div>
    </div>
  )
}
