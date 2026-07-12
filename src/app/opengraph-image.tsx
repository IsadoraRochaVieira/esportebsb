import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Esporte Brasília — Seu próximo jogo está no mapa'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #030507 0%, #06251a 55%, #03202e 100%)',
          position: 'relative',
        }}
      >
        {/* brilho central */}
        <div
          style={{
            position: 'absolute',
            top: 90,
            width: 800,
            height: 420,
            borderRadius: 9999,
            background: 'radial-gradient(ellipse, rgba(0,255,135,0.22) 0%, rgba(0,212,255,0.10) 50%, transparent 75%)',
            filter: 'blur(40px)',
            display: 'flex',
          }}
        />

        {/* logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #00ff87, #00d4ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              boxShadow: '0 0 60px rgba(0,255,135,0.5)',
            }}
          >
            ⚽
          </div>
          <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 800, display: 'flex' }}>
            Esporte Brasília
          </div>
        </div>

        {/* título */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#ffffff',
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex' }}>Seu próximo jogo</div>
          <div
            style={{
              display: 'flex',
              background: 'linear-gradient(90deg, #00ff87, #00d4ff)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            está no mapa
          </div>
        </div>

        {/* esportes */}
        <div style={{ display: 'flex', fontSize: 44, marginTop: 44, gap: 26 }}>
          <span>⚽</span><span>🏐</span><span>🏀</span><span>🏃</span><span>🎾</span>
          <span>🧘</span><span>🛹</span><span>🚴</span><span>🥋</span><span>🏊</span>
        </div>

        {/* rodapé */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 28,
          }}
        >
          Jogos e grupos esportivos gratuitos no DF · esportebsb.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
