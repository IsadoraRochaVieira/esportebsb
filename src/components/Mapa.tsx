'use client'

import { useEffect, useRef, useState } from 'react'
import { BSB_CENTER, BSB_ZOOM, ESPORTES } from '@/lib/constants'
import type { Quadra } from '@/lib/supabase'

interface MapaProps {
  quadras: Quadra[]
  filtroEsporte: string
  onQuadraSelecionada: (quadra: Quadra) => void
  onMapClick?: (lat: number, lng: number) => void
  modoPin?: boolean
  visible?: boolean
}

export default function Mapa({ quadras, filtroEsporte, onQuadraSelecionada, onMapClick, modoPin, visible }: MapaProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const tileRef = useRef<any>(null)
  const onMapClickRef = useRef(onMapClick)
  const modoPinRef = useRef(modoPin)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => { onMapClickRef.current = onMapClick }, [onMapClick])
  useEffect(() => { modoPinRef.current = modoPin }, [modoPin])

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const map = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: true,
      }).setView(BSB_CENTER, BSB_ZOOM)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      tileRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        maxZoom: 19,
      }).addTo(map)

      map.on('click', (e: any) => {
        if (onMapClickRef.current) onMapClickRef.current(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const container = mapInstanceRef.current.getContainer() as HTMLElement
    container.style.cursor = modoPin ? 'crosshair' : ''
  }, [modoPin])

  useEffect(() => {
    if (visible && mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 150)
    }
  }, [visible])

  useEffect(() => {
    if (!mapInstanceRef.current || !tileRef.current) return
    import('leaflet').then((L) => {
      tileRef.current.remove()
      const url = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      tileRef.current = L.tileLayer(url, { attribution: '© OpenStreetMap © CartoDB', maxZoom: 19 }).addTo(mapInstanceRef.current)
    })
  }, [darkMode])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    import('leaflet').then((L) => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      const filtradas = filtroEsporte
        ? quadras.filter((q) => q.jogos?.some((j) => j.esporte === filtroEsporte))
        : quadras

      filtradas.forEach((quadra) => {
        const jogosAtivos = quadra.jogos ?? []
        if (jogosAtivos.length === 0 && filtroEsporte === '') return

        const esportePrincipal = jogosAtivos[0]?.esporte ?? 'outro'
        const esp = ESPORTES.find((e) => e.value === esportePrincipal) ?? ESPORTES[ESPORTES.length - 1]
        const count = jogosAtivos.length

        const icon = L.divIcon({
          html: `
            <div style="
              position:relative;
              display:flex;
              flex-direction:column;
              align-items:center;
            ">
              <div style="
                background:${esp.cor};
                color:white;
                border-radius:50%;
                width:42px;
                height:42px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:20px;
                box-shadow:0 2px 8px rgba(0,0,0,0.25);
                border:3px solid white;
              ">${esp.emoji}</div>
              ${count > 1 ? `<div style="
                position:absolute;
                top:-4px;
                right:-4px;
                background:#ef4444;
                color:white;
                border-radius:50%;
                width:18px;
                height:18px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:10px;
                font-weight:700;
                border:2px solid white;
              ">${count}</div>` : ''}
              <div style="
                width:0;height:0;
                border-left:6px solid transparent;
                border-right:6px solid transparent;
                border-top:8px solid ${esp.cor};
                margin-top:-1px;
              "></div>
            </div>
          `,
          className: '',
          iconSize: [42, 52],
          iconAnchor: [21, 52],
        })

        const marker = L.marker([quadra.lat, quadra.lng], { icon })
          .addTo(mapInstanceRef.current)
          .on('click', () => onQuadraSelecionada(quadra))

        markersRef.current.push(marker)
      })
    })
  }, [quadras, filtroEsporte])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute bottom-20 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-lg border border-slate-200 hover:bg-slate-50 transition"
        title={darkMode ? 'Modo claro' : 'Modo escuro'}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </>
  )
}
