-- ============================================================
-- SEED REAL — Locais e jogos reais de Brasília
-- Execute no Supabase SQL Editor
-- ============================================================

-- Limpa dados anteriores (mantém estrutura)
delete from participantes;
delete from jogos;
delete from quadras;

-- ============================================================
-- QUADRAS / LOCAIS REAIS DE BRASÍLIA
-- ============================================================
insert into quadras (id, nome, endereco, bairro, lat, lng) values
  ('b1000001-0000-0000-0000-000000000001', 'Parque da Cidade – Quadra de Vôlei', 'Parque Sarah Kubitschek, entrada P3', 'Parque da Cidade', -15.7993, -47.9241),
  ('b1000001-0000-0000-0000-000000000002', 'Quadra da 911 Sul', 'SQS 911, área de lazer', 'Asa Sul', -15.8367, -47.9267),
  ('b1000001-0000-0000-0000-000000000003', 'Parque Olhos d''Água – Pista de Corrida', 'SHIN QL 12, Lago Norte', 'Lago Norte', -15.7533, -47.8867),
  ('b1000001-0000-0000-0000-000000000004', 'Orla do Lago Paranoá – Asa Norte', 'SHTN Trecho 1, s/n', 'Lago Norte', -15.7317, -47.8567),
  ('b1000001-0000-0000-0000-000000000005', 'Quadra Poliesportiva 108 Norte', 'SQN 108, área de lazer interna', 'Asa Norte', -15.7583, -47.8967),
  ('b1000001-0000-0000-0000-000000000006', 'Academia de Tênis de Brasília', 'SCES Trecho 2, Lote 22 – Asa Sul', 'Asa Sul', -15.8150, -47.9033),
  ('b1000001-0000-0000-0000-000000000007', 'Pista de Skate da Asa Sul', 'SCS Quadra 3, próx. ao Conic', 'Asa Sul', -15.8050, -47.9033),
  ('b1000001-0000-0000-0000-000000000008', 'AABB Brasília – Área Esportiva', 'SHTN Trecho 1, Conjunto 1 – Lago Norte', 'Lago Norte', -15.7617, -47.8717),
  ('b1000001-0000-0000-0000-000000000009', 'Parque Ecológico Ermida Dom Bosco', 'Setor de Mansões Park Way', 'Park Way', -15.8467, -47.9567),
  ('b1000001-0000-0000-0000-000000000010', 'Quadra de Basquete – 405 Norte', 'SQN 405, área de lazer', 'Asa Norte', -15.7683, -47.8817),
  ('b1000001-0000-0000-0000-000000000011', 'Orla Lago Sul – Ponto de Encontro', 'SHIS QL 10, orla do lago', 'Lago Sul', -15.8567, -47.8617),
  ('b1000001-0000-0000-0000-000000000012', 'Parque Recreativo Ceilândia Norte', 'QNM 13, Ceilândia Norte', 'Ceilândia', -15.8017, -48.1033),
  ('b1000001-0000-0000-0000-000000000013', 'Clube Atlético Brasília – Quadra Coberta', 'SQS 708, Bloco H – Asa Sul', 'Asa Sul', -15.8283, -47.9183),
  ('b1000001-0000-0000-0000-000000000014', 'Parque da Cidade – Pista de Corrida', 'Parque Sarah Kubitschek, Eixo Monumental', 'Parque da Cidade', -15.8000, -47.9383)
on conflict (id) do nothing;

-- ============================================================
-- JOGOS — diversos esportes, pagos e gratuitos
-- ============================================================
insert into jogos (id, quadra_id, titulo, esporte, tipo, dia_semana, horario, vagas, descricao, custo_tipo, custo_valor, is_recorrente) values

-- Parque da Cidade – Vôlei
  ('c1000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001',
   'Vôlei Misto no Parque', 'volei', 'misto', 'sabado', '08:00', 12,
   'Encontro semanal de vôlei de praia. Nível variado, ambiente descontraído. Leve sua bola!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001',
   'Vôlei Feminino – Sábado Tarde', 'volei', 'feminino', 'sabado', '15:00', 10,
   'Grupo feminino de vôlei, todas as idades. Iniciantes bem-vindas!', 'gratis', null, true),

-- Quadra 911 Sul – Futsal
  ('c1000001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000002',
   'Futsal Feminino 911 Sul', 'futsal', 'feminino', 'segunda', '19:00', 12,
   'Jogo aberto para mulheres de todos os níveis. Leve água e boa vontade!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000002',
   'Racha Misto Quarta à Noite', 'futsal', 'misto', 'quarta', '20:00', 14,
   'Racha animado, nível intermediário. Quem chegar cedo garante vaga!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000005', 'b1000001-0000-0000-0000-000000000002',
   'Futsal Domingo Manhã', 'futsal', 'aberto', 'domingo', '07:30', 14,
   'Jogo leve de domingo cedo. Ambiente familiar e descontraído.', 'gratis', null, true),

-- Parque Olhos d'Água – Corrida e Yoga
  ('c1000001-0000-0000-0000-000000000006', 'b1000001-0000-0000-0000-000000000003',
   'Corrida Matinal – Lago Norte', 'corrida', 'aberto', 'terca', '06:30', 30,
   'Corrida de 5km ao redor do parque. Ritmo livre, foco no prazer de correr.', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000007', 'b1000001-0000-0000-0000-000000000003',
   'Yoga ao Amanhecer', 'yoga', 'aberto', 'sabado', '06:30', 20,
   'Prática de yoga ao nascer do sol no parque. Traga seu tapete.', 'gratis', null, true),

-- Orla Lago Paranoá – Beach Tênis
  ('c1000001-0000-0000-0000-000000000008', 'b1000001-0000-0000-0000-000000000004',
   'Beach Tênis Lago Paranoá', 'beach_tenis', 'misto', 'terca', '18:00', 8,
   'Joguinhos de beach tênis na orla. Raquetes disponíveis pra quem não tem.', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000009', 'b1000001-0000-0000-0000-000000000004',
   'Ciclismo – Volta do Lago', 'ciclismo', 'aberto', 'domingo', '07:00', 25,
   'Pedalada em grupo ao redor do Lago Paranoá (~40km). Ritmo moderado.', 'gratis', null, true),

-- 108 Norte – Basquete e Futsal
  ('c1000001-0000-0000-0000-000000000010', 'b1000001-0000-0000-0000-000000000005',
   'Basquete das Mulheres – 108 Norte', 'basquete', 'feminino', 'quinta', '19:00', 10,
   'Time feminino de basquete. Iniciantes e experientes bem-vindas!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000011', 'b1000001-0000-0000-0000-000000000005',
   'Futsal Noturno – 108', 'futsal', 'misto', 'sexta', '20:30', 12,
   'Racha de fim de semana. Boa energia garantida!', 'gratis', null, true),

-- Academia de Tênis – Pago
  ('c1000001-0000-0000-0000-000000000012', 'b1000001-0000-0000-0000-000000000006',
   'Tênis – Grupo Intermediário', 'tenis', 'misto', 'terca', '07:00', 4,
   'Treino semanal com professor. Nível intermediário.', 'pago', 'R$ 80/mês', true),

  ('c1000001-0000-0000-0000-000000000013', 'b1000001-0000-0000-0000-000000000006',
   'Tênis Feminino – Iniciantes', 'tenis', 'feminino', 'quinta', '08:00', 4,
   'Aulas de tênis para mulheres iniciantes. Com professor.', 'pago', 'R$ 80/mês', true),

-- Pista de Skate
  ('c1000001-0000-0000-0000-000000000014', 'b1000001-0000-0000-0000-000000000007',
   'Skate – Tarde Livre', 'skate', 'aberto', 'sabado', '15:00', 30,
   'Sessão coletiva de skate. Todos os níveis, ambiente amigável.', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000015', 'b1000001-0000-0000-0000-000000000007',
   'Aula de Skate para Iniciantes', 'skate', 'aberto', 'domingo', '10:00', 8,
   'Aula coletiva para quem está começando. Instrutores voluntários.', 'gratis', null, true),

-- AABB – Natação (pago)
  ('c1000001-0000-0000-0000-000000000016', 'b1000001-0000-0000-0000-000000000008',
   'Natação Adultos – AABB', 'natacao', 'aberto', 'segunda', '07:00', 15,
   'Turma de natação para adultos. Todas as faixas de habilidade.', 'pago', 'R$ 150/mês', true),

  ('c1000001-0000-0000-0000-000000000017', 'b1000001-0000-0000-0000-000000000008',
   'Natação Masters – AABB', 'natacao', 'misto', 'quarta', '06:30', 10,
   'Treino para nadadores acima de 30 anos. Nível intermediário/avançado.', 'pago', 'R$ 180/mês', true),

-- Ermida – Yoga
  ('c1000001-0000-0000-0000-000000000018', 'b1000001-0000-0000-0000-000000000009',
   'Yoga na Ermida – Fim de Semana', 'yoga', 'aberto', 'domingo', '08:00', 25,
   'Yoga ao ar livre com vista pro lago. Uma das mais lindas práticas de BSB!', 'gratis', null, true),

-- 405 Norte – Basquete
  ('c1000001-0000-0000-0000-000000000019', 'b1000001-0000-0000-0000-000000000010',
   'Basquete dos Amigos – 405N', 'basquete', 'misto', 'terca', '19:00', 10,
   'Racha animado de basquete. Nível intermediário, mas todos são bem-vindos.', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000020', 'b1000001-0000-0000-0000-000000000010',
   '3x3 Sábado na Quadra', 'basquete', 'aberto', 'sabado', '09:00', 12,
   'Torneio informal de basquete 3x3. Venha com seu time ou entre em um!', 'gratis', null, true),

-- Lago Sul – Corrida e Beach Tênis
  ('c1000001-0000-0000-0000-000000000021', 'b1000001-0000-0000-0000-000000000011',
   'Corrida na Orla do Lago Sul', 'corrida', 'aberto', 'domingo', '06:30', 40,
   'Corrida em grupo pela orla do Lago Sul. Distâncias variadas (3km, 5km, 10km).', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000022', 'b1000001-0000-0000-0000-000000000011',
   'Beach Tênis Lago Sul', 'beach_tenis', 'misto', 'sabado', '07:00', 8,
   'Beach tênis na orla do Lago Sul. Raquetes e bolas disponíveis.', 'gratis', null, true),

-- Ceilândia – Futsal e Jiu-Jitsu
  ('c1000001-0000-0000-0000-000000000023', 'b1000001-0000-0000-0000-000000000012',
   'Futsal Ceilândia – Sábado', 'futsal', 'aberto', 'sabado', '08:00', 14,
   'Jogo de futsal aberto no parque. Tradição de mais de 5 anos!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000024', 'b1000001-0000-0000-0000-000000000012',
   'Jiu-Jitsu ao Ar Livre', 'jiu_jitsu', 'aberto', 'domingo', '09:00', 16,
   'Treino de jiu-jitsu e defesa pessoal gratuito. Kimono não obrigatório.', 'gratis', null, true),

-- Clube Atlético – Quadra Coberta (pago)
  ('c1000001-0000-0000-0000-000000000025', 'b1000001-0000-0000-0000-000000000013',
   'Futsal Coberto – Liga Asa Sul', 'futsal', 'misto', 'quinta', '21:00', 12,
   'Liga de futsal semanal em quadra coberta. Taxa para manutenção da quadra.', 'pago', 'R$ 20/semana', true),

-- Parque da Cidade – Corrida
  ('c1000001-0000-0000-0000-000000000026', 'b1000001-0000-0000-0000-000000000014',
   'Corrida no Parque – Grupo Iniciantes', 'corrida', 'aberto', 'quarta', '06:00', 20,
   'Grupo de corrida para iniciantes. Sem pressão, sem ritmo mínimo. Venha como você é!', 'gratis', null, true),

  ('c1000001-0000-0000-0000-000000000027', 'b1000001-0000-0000-0000-000000000014',
   'Corrida – Treino de 10km', 'corrida', 'misto', 'sabado', '06:30', 15,
   'Treino de 10km com pace de 5:30/km. Intermediários e avançados.', 'gratis', null, true)

on conflict (id) do nothing;
