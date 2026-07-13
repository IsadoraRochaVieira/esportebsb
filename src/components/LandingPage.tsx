'use client'

import { useState, useEffect } from 'react'

interface LandingPageProps {
  onEntrar: () => void
  onCriarConta: () => void
  onLogin: () => void
}

const SPORTS = [
  { emoji: '⚽', tag: '⚽ Futsal', frase: 'jogar futsal' },
  { emoji: '🏐', tag: '🏐 Vôlei', frase: 'jogar vôlei' },
  { emoji: '⚽', tag: '⚽ Futevôlei', frase: 'jogar futevôlei' },
  { emoji: '🏀', tag: '🏀 Basquete', frase: 'jogar basquete' },
  { emoji: '⛱️', tag: '⛱️ Beach Tênis', frase: 'jogar beach tênis' },
  { emoji: '🏓', tag: '🏓 Ping Pong', frase: 'jogar ping pong' },
  { emoji: '🏃', tag: '🏃 Corrida', frase: 'correr em grupo' },
  { emoji: '🛼', tag: '🛼 Patins', frase: 'andar de patins' },
  { emoji: '🛹', tag: '🛹 Skate', frase: 'andar de skate' },
  { emoji: '🧘', tag: '🧘 Yoga', frase: 'praticar yoga' },
  { emoji: '🚴', tag: '🚴 Ciclismo', frase: 'pedalar' },
  { emoji: '🪶', tag: '🪶 Peteca', frase: 'jogar peteca' },
  { emoji: '🛶', tag: '🛶 Remo / Caiaque', frase: 'remar no Lago Paranoá' },
  { emoji: '♟️', tag: '♟️ Xadrez', frase: 'jogar xadrez' },
  { emoji: '🥋', tag: '🥋 Jiu-Jitsu', frase: 'treinar jiu-jitsu' },
  { emoji: '☯️', tag: '☯️ Tai Chi Chuan', frase: 'praticar tai chi chuan' },
  { emoji: '🎾', tag: '🎾 Tênis', frase: 'jogar tênis' },
  { emoji: '🏊', tag: '🏊 Natação', frase: 'nadar' },
]

export default function LandingPage({ onEntrar, onCriarConta, onLogin }: LandingPageProps) {
  const [activeSport, setActiveSport] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => setActiveSport(i => (i + 1) % SPORTS.length), 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: '#030507', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' }}>

      {/* Grid de fundo */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,135,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.035) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 100%)',
      }} />

      {/* Brilhos animados */}
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="glow glow-c" />

      {/* Brilho atrás do título */}
      <div style={{
        position: 'fixed', top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(700px, 90vw)', height: 380, zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(0,255,135,0.10) 0%, rgba(0,212,255,0.05) 45%, transparent 75%)',
        filter: 'blur(30px)',
      }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #00ff87, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, boxShadow: '0 0 24px rgba(0,255,135,0.45), 0 0 60px rgba(0,255,135,0.15)' }}>⚽</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>Esporte Brasília</span>
        </div>
        <button onClick={onLogin}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', padding: '9px 20px', borderRadius: 22, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}>
          Entrar
        </button>
      </header>

      {/* Hero */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,135,0.07)', border: '1px solid rgba(0,255,135,0.22)', borderRadius: 20, padding: '7px 16px', marginBottom: 34, boxShadow: '0 0 20px rgba(0,255,135,0.08)' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff87', boxShadow: '0 0 10px #00ff87', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#00ff87', fontSize: 12, fontWeight: 700, letterSpacing: '0.8px' }}>35+ JOGOS ACONTECENDO EM BSB</span>
        </div>

        {/* Título */}
        <h1 style={{ color: '#fff', fontSize: 'clamp(38px, 8vw, 76px)', fontWeight: 900, lineHeight: 1.04, margin: '0 0 18px', letterSpacing: '-2.5px', maxWidth: 760, textShadow: '0 0 80px rgba(0,255,135,0.15)' }}>
          Seu próximo jogo<br />
          <span style={{ background: 'linear-gradient(90deg, #00ff87 0%, #00d4ff 50%, #00ff87 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', animation: 'shine 4s linear infinite' }}>
            está no mapa
          </span>
        </h1>

        {/* Subtítulo */}
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, maxWidth: 500, margin: '0 0 44px', lineHeight: 1.65 }}>
          Encontre pessoas pra <strong style={{ color: '#00ff87', fontWeight: 700 }}>{SPORTS[activeSport].frase} {SPORTS[activeSport].emoji}</strong> perto de você em Brasília.<br />
          Gratuito, sem burocracia.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, marginBottom: 52 }}>
          <button onClick={onCriarConta}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(0,255,135,0.5), 0 8px 30px rgba(0,0,0,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(0,255,135,0.35), 0 4px 20px rgba(0,0,0,0.4)' }}
            style={{
              background: 'linear-gradient(135deg, #00ff87, #00d4ff)',
              color: '#031007', fontWeight: 800, fontSize: 16, padding: '17px 32px',
              borderRadius: 15, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 32px rgba(0,255,135,0.35), 0 4px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.25s', letterSpacing: '-0.3px'
            }}>
            Criar conta grátis →
          </button>
          <button onClick={onEntrar}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            style={{
              background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)',
              fontWeight: 600, fontSize: 15, padding: '14px 32px',
              borderRadius: 15, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              transition: 'all 0.2s', backdropFilter: 'blur(8px)'
            }}>
            Explorar o mapa sem conta
          </button>
        </div>

        {/* Tags de esportes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 560 }}>
          {SPORTS.map((s, i) => (
            <span key={s.tag} style={{
              fontSize: 12, padding: '7px 13px', borderRadius: 20, fontWeight: 600,
              background: i === activeSport ? 'rgba(0,255,135,0.12)' : 'rgba(255,255,255,0.04)',
              border: i === activeSport ? '1px solid rgba(0,255,135,0.35)' : '1px solid rgba(255,255,255,0.08)',
              color: i === activeSport ? '#00ff87' : 'rgba(255,255,255,0.45)',
              boxShadow: i === activeSport ? '0 0 16px rgba(0,255,135,0.15)' : 'none',
              transition: 'all 0.35s', transform: i === activeSport ? 'scale(1.06)' : 'scale(1)',
            }}>
              {s.tag}
            </span>
          ))}
        </div>
      </main>

      {/* Destaques */}
      <section style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '52px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 18 }}>
          {[
            { icon: '💚', title: 'Saúde mental', desc: 'O esporte cuida do corpo e da mente. Cada jogo é uma chance de se sentir melhor.' },
            { icon: '🏙️', title: 'Feito pra BSB', desc: 'O DF tem parques e quadras incríveis. A gente conecta quem quer jogar com quem já joga.' },
            { icon: '🤝', title: 'Comunidade livre', desc: 'Sem taxa, sem burocracia. Crie um jogo e abra vagas. A galera aparece.' },
          ].map(f => (
            <div key={f.title} style={{
              textAlign: 'center', padding: '28px 20px', borderRadius: 18,
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: 34, marginBottom: 12, filter: 'drop-shadow(0 0 12px rgba(0,255,135,0.25))' }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rodapé */}
      <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '22px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>Feito com ❤️ em Brasília · 2026</p>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes shine { to { background-position: 200% center; } }
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(50px,-35px) scale(1.12); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-45px,30px) scale(1.08); }
        }
        .glow { position: fixed; border-radius: 50%; z-index: 0; pointer-events: none; }
        .glow-a {
          top: 6%; left: 12%; width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(0,255,135,0.10) 0%, transparent 68%);
          filter: blur(50px); animation: floatA 14s ease-in-out infinite;
        }
        .glow-b {
          bottom: 14%; right: 8%; width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 68%);
          filter: blur(50px); animation: floatB 17s ease-in-out infinite;
        }
        .glow-c {
          top: 46%; left: 55%; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(140,80,255,0.07) 0%, transparent 68%);
          filter: blur(55px); animation: floatA 21s ease-in-out infinite reverse;
        }
      `}</style>
    </div>
  )
}
