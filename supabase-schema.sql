-- Tabela de quadras/locais
create table quadras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text not null,
  bairro text,
  lat double precision not null,
  lng double precision not null,
  criado_por uuid references auth.users(id),
  criado_em timestamptz default now()
);

-- Tabela de jogos/grupos recorrentes
create table jogos (
  id uuid primary key default gen_random_uuid(),
  quadra_id uuid references quadras(id) on delete cascade,
  titulo text not null,
  esporte text not null,          -- futsal, tenis, volei, basquete, etc.
  tipo text not null,             -- misto, feminino, masculino, aberto
  dia_semana text,                -- segunda, terca, quarta, quinta, sexta, sabado, domingo
  horario time,
  vagas int,
  descricao text,
  criado_por uuid references auth.users(id),
  criado_em timestamptz default now()
);

-- Participantes de cada jogo
create table participantes (
  id uuid primary key default gen_random_uuid(),
  jogo_id uuid references jogos(id) on delete cascade,
  user_id uuid references auth.users(id),
  confirmado_em timestamptz default now(),
  unique(jogo_id, user_id)
);

-- Perfil público de cada usuário
create table perfis (
  id uuid primary key references auth.users(id),
  nome text,
  avatar_url text,
  esportes text[],
  atualizado_em timestamptz default now()
);

-- RLS
alter table quadras enable row level security;
alter table jogos enable row level security;
alter table participantes enable row level security;
alter table perfis enable row level security;

create policy "Qualquer um pode ler quadras" on quadras for select using (true);
create policy "Autenticado pode criar quadra" on quadras for insert with check (auth.uid() = criado_por);

create policy "Qualquer um pode ler jogos" on jogos for select using (true);
create policy "Autenticado pode criar jogo" on jogos for insert with check (auth.uid() = criado_por);
create policy "Criador pode editar jogo" on jogos for update using (auth.uid() = criado_por);
create policy "Criador pode deletar jogo" on jogos for delete using (auth.uid() = criado_por);

create policy "Qualquer um pode ver participantes" on participantes for select using (true);
create policy "Usuário confirma presença" on participantes for insert with check (auth.uid() = user_id);
create policy "Usuário cancela presença" on participantes for delete using (auth.uid() = user_id);

create policy "Qualquer um pode ver perfis" on perfis for select using (true);
create policy "Usuário edita próprio perfil" on perfis for all using (auth.uid() = id);
