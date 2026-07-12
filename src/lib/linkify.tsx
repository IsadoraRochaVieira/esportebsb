import React from 'react'

// Transforma URLs e @perfis do Instagram em links clicáveis dentro de textos
const PADRAO = /(https?:\/\/[^\s]+|www\.[^\s]+|@[A-Za-z0-9_.]{2,30})/g

export function Linkify({ text, className }: { text: string; className?: string }) {
  const partes = text.split(PADRAO)
  return (
    <>
      {partes.map((parte, i) => {
        if (!parte) return null
        if (/^https?:\/\//.test(parte) || /^www\./.test(parte)) {
          const href = parte.startsWith('www.') ? `https://${parte}` : parte
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={className ?? 'text-blue-600 underline hover:text-blue-700 break-all'}>
              {parte}
            </a>
          )
        }
        if (/^@[A-Za-z0-9_.]{2,30}$/.test(parte)) {
          return (
            <a key={i} href={`https://instagram.com/${parte.slice(1)}`} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={className ?? 'text-blue-600 underline hover:text-blue-700'}>
              {parte}
            </a>
          )
        }
        return <React.Fragment key={i}>{parte}</React.Fragment>
      })}
    </>
  )
}
