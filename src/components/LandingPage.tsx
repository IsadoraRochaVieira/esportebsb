'use client'

import { useState, useEffect } from 'react'

interface LandingPageProps {
  onEntrar: () => void
  onCriarConta: () => void
  onLogin: () => void
}

const SPORTS = ['⚽ Futsal', '🏐 Vôlei', '🏀 Basquete', '🎾 Beach Tênis', '🏃 Corrida', '🛹 Skate', '🧘 Yoga', '🚴 Ciclismo', '♟️ Xadrez', '🥋 Jiu-Jitsu', '🎾 Tênis', '🏊 Natação']

export default function LandingPage({ onEntrar, onCriarConta, onLogin }: LandingPageProps) {
  const [activeSport, setActiveSport] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => setActiveSport(i => (i + 1) % SPORTS.length), 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>

      {/* Animated background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,135,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Neon glow blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,135,0.08) 0%, transparent 70%)', zIndex: 0, filter: 'blur(40px)' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', zIndex: 0, filter: 'blur(40px)' }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00ff87, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(0,255,135,0.4)' }}>⚽</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>Esporte Brasília</span>
        </div>
        <button onClick={onLogin} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
          Entrar
        </button>
      </header>

      {/* Hero */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 20, padding: '6px 14px', marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff87', boxShadow: '0 0 8px #00ff87', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#00ff87', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>27 JOGOS ACONTECENDO EM BSB</span>
        </div>

        {/* Title */}
        <h1 style={{ color: '#fff', fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 16px', letterSpacing: '-2px', maxWidth: 700 }}>
          Seu próximo jogo<br />
          <span style={{ background: 'linear-gradient(90deg, #00ff87, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
            está no mapa
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 480, margin: '0 0 48px', lineHeight: 1.6 }}>
          Encontre pessoas pra jogar {SPORTS[activeSport]} perto de você em Brasília. Gratuito, sem burocracia.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, marginBottom: 48 }}>
          <button onClick={onCriarConta} style={{
            background: 'linear-gradient(135deg, #00ff87, #00d4ff)',
            color: '#000', fontWeight: 800, fontSize: 16, padding: '16px 32px',
            borderRadius: 14, border: 'none', cursor: 'pointer',
            boxShadow: '0 0 30px rgba(0,255,135,0.35), 0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s', letterSpacing: '-0.3px'
          }}>
            Criar conta grátis →
          </button>
          <button onClick={onEntrar} style={{
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)',
            fontWeight: 600, fontSize: 15, padding: '14px 32px',
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Ver jogos sem criar conta
          </button>
        </div>

        {/* Sport tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 520 }}>
          {SPORTS.map((s, i) => (
            <span key={s} style={{
              fontSize: 12, padding: '6px 12px', borderRadius: 20,
              background: i === activeSport ? 'rgba(0,255,135,0.1)' : 'rgba(255,255,255,0.04)',
              border: i === activeSport ? '1px solid rgba(0,255,135,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: i === activeSport ? '#00ff87' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s'
            }}>
              {s}
            </span>
          ))}
        </div>
      </main>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {[
            { icon: '💚', title: 'Saúde mental', desc: 'O esporte cuida do corpo e da mente. Cada jogo é uma chance de se sentir melhor.' },
            { icon: '🏙️', title: 'Feito pra BSB', desc: 'O DF tem parques e quadras incríveis. A gente conecta quem quer jogar com quem já joga.' },
            { icon: '🤝', title: 'Comunidade livre', desc: 'Sem taxa, sem burocracia. Crie um jogo e abra vagas. A galera aparece.' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Feito com ❤️ em Brasília · 2026</p>
      </footer>

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </div>
  )
}
