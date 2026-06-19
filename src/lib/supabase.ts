import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Esporte = 'futsal' | 'tenis' | 'volei' | 'basquete' | 'corrida' | 'jiu_jitsu' | 'natacao' | 'outro'
export type TipoJogo = 'misto' | 'feminino' | 'masculino' | 'aberto'
export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'
export type Genero = 'masculino' | 'feminino' | 'nao_informado'

export interface Perfil {
  id: string
  nome?: string
  avatar_url?: string
  esportes?: string[]
  genero?: Genero
}

export interface Quadra {
  id: string
  nome: string
  endereco: string
  bairro?: string
  lat: number
  lng: number
  criado_por?: string
  jogos?: Jogo[]
}

export interface Participante {
  user_id: string
  status: string
}

export interface Jogo {
  id: string
  quadra_id: string
  titulo: string
  esporte: Esporte
  tipo: TipoJogo
  dia_semana?: DiaSemana
  horario?: string
  vagas?: number
  descricao?: string
  custo_tipo?: 'gratis' | 'pago'
  custo_valor?: string
  is_recorrente?: boolean
  data_evento?: string
  criado_por?: string
  criado_em?: string
  quadra?: Quadra
  participantes?: Participante[]
}
