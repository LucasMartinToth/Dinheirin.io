# Dinheir.io 💰

> **Status: 📋 Em planejamento** — nome ainda não definido (sugestão inicial: *NossaGrana*), este README é temporário e será atualizado conforme o desenvolvimento avança.

App (PWA) de controle financeiro para uso pessoal de um casal, com banco de dados compartilhado ("casa") e projeção de saldo futuro.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-iOS%20%2F%20Android-purple)
![Custo](https://img.shields.io/badge/Custo-R%240-brightgreen)

---

## 📖 Sobre o projeto

Um app privado de controle financeiro para uso exclusivo de duas pessoas (o casal), sem distribuição na App Store. Instalado como **PWA** (Progressive Web App) — abre pela Safari e é adicionado à tela de início do iPhone, funcionando como um app nativo, mas com custo zero de manutenção e sem depender de Mac/Xcode.

O diferencial em relação a apps de controle financeiro genéricos é a **projeção de saldo futuro**: o app não mostra só o que já aconteceu, mas simula os próximos 6 meses com base em lançamentos esperados, recorrências e parcelamentos, cascateando o saldo final de um mês como saldo inicial do próximo.

| | |
|---|---|
| **Uso** | Privado — apenas você e sua esposa |
| **Distribuição** | PWA (fora da App Store), instalado via "Adicionar à Tela de Início" |
| **Custo de operação** | R$ 0 (100% dentro de free tiers) |
| **Diferencial** | Saldo esperado projetado + confirmação de lançamentos previstos |

### Por que PWA e não app nativo?

Um app nativo instalado fora da App Store com Apple ID gratuito **expira a cada 7 dias** e exige reconectar o iPhone num Mac com Xcode para reinstalar. Para um app de uso diário do casal, isso vira fricção constante. A PWA resolve isso: instala uma vez, nunca expira, atualiza sozinha a cada `git push`, e reaproveita o mesmo stack de outros projetos (Next.js + Supabase + Vercel).

**Trade-off aceito:** notificações push no iOS via PWA (16.4+) funcionam, mas exigem configuração extra (VAPID keys + service worker). Como o app já tem confirmação por modal ao abrir (ver funcionalidades), a dependência de push é baixa — o app funciona bem mesmo sem push 100% configurado.

⚠️ **Login com Apple**: o "Sign in with Apple" oficial exige conta paga no Apple Developer Program (US$99/ano) para configurar o Service ID usado pelo Supabase Auth. Isso conflita com o requisito de custo zero. **Recomendação:** lançar com email/senha + Google (ambos gratuitos) e deixar Apple como opcional futuro, caso decidam pagar a taxa por outro motivo.

---

## 🛠️ Stack tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | App Router, reaproveita conhecimento do LeadFlow |
| Estilização | Tailwind CSS | Rápido, consistente, fácil pra iniciante |
| PWA | `next-pwa` (ou manifest + service worker manual) | Instalação na tela de início, funcionamento offline básico |
| Banco de dados | Supabase (PostgreSQL) | Banco + auth + RLS + Edge Functions, free tier generoso |
| Autenticação | Supabase Auth (email/senha + Google OAuth) | Google é gratuito; Apple fica de fora por custo |
| Recorrências | Supabase Edge Functions + `pg_cron` | Gera lançamentos esperados futuros automaticamente, sem servidor extra |
| Push notifications (opcional) | Web Push API + VAPID keys | Gratuito, mas com setup técnico — pode ficar pra fase final |
| Deploy | Vercel (Hobby) | CI/CD automático, HTTPS grátis (obrigatório pra PWA) |
| Monitoramento (opcional) | Sentry free tier | Se quiser rastrear erros em produção |

---

## ✨ Funcionalidades planejadas

### Autenticação e casa compartilhada
- Cadastro e login com email e senha
- Login com Google (OAuth via Supabase)
- Criar uma "casa" → gera um **código de casa** único (ex: `CASA-7F3K9`)
- Entrar em uma casa existente informando o código
- Todos os dados financeiros pertencem à casa (RLS garante que só os membros daquela casa acessam)

### Lançamentos
- Registrar entradas e saídas concluídas (só em mês atual ou passado)
- Registrar entradas e saídas **esperadas**, programáveis para meses futuros
- Periodicidade configurável para lançamentos esperados: semanal, mensal, anual ou personalizada
- Tags por lançamento: salário, investimentos, mercado, restaurante, transporte, moradia, pets, igreja, lazer, viagem, outros
- Parcelamentos: ao marcar um lançamento como parcelado, o sistema gera automaticamente as parcelas seguintes nos meses futuros como lançamentos esperados
- Registro rápido: formulário enxuto (valor, tag, descrição, data) pensado pra ser preenchido em segundos

### Saldos e projeção
- Saldo inicial do mês atual (herdado do saldo esperado do mês anterior)
- Saldo atual (com base em entradas/saídas já concluídas)
- Saldo esperado de fim de mês (concluídos + esperados restantes do mês)
- Cascata automática: saldo esperado do mês N vira saldo inicial do mês N+1
- Visualização dos próximos 6 meses, com regra clara: mês futuro só aceita lançamentos **esperados**, nunca "concluídos"
- Alerta visual caso o saldo previsto de algum mês fique negativo

### Confirmação de lançamentos esperados
- Ao chegar a data programada de um lançamento esperado, o app mostra um modal ao abrir: **"Confirmar" ou "Ainda não"**
- Confirmar → lançamento vira "concluído" e entra no saldo atual
- "Ainda não" → permanece esperado, o app pergunta novamente na próxima abertura

### Insights
- Comparativo semanal por tag (ex: "você gastou 18% menos em mercado do que na semana passada")
- Comparativo mensal (ex: "você gastou 12% a mais em lazer do que no mês passado")
- Resumo de economia acumulada (ex: "nos últimos 2 meses você economizou R$ 850")

### UI
- Minimalista, poucos toques até registrar um lançamento
- Acessível (contraste adequado, áreas de toque grandes, sem depender só de cor pra alertas)

---

## 🗺️ Roadmap

### Fase 1 — Fundação
- [ ] Schema SQL completo no Supabase (`households`, `profiles`, `transactions`, `recurring_rules`, `tags`) com RLS ativado
- [ ] Autenticação com Supabase Auth (email/senha)
- [ ] Criar casa (gera código) e entrar em casa via código
- [ ] Estrutura Next.js 14 + deploy inicial na Vercel

**Entregável:** login funcional + casa compartilhada criada, sem localStorage, 100% na nuvem

### Fase 2 — Lançamentos e saldo
- [ ] CRUD de lançamentos (entrada/saída, concluído/esperado)
- [ ] Tags pré-definidas
- [ ] Cálculo de saldo atual e saldo esperado do mês
- [ ] Regra de bloqueio: mês futuro só aceita "esperado"

**Entregável:** app já registra e mostra saldo real e projetado do mês atual

### Fase 3 — Recorrência e parcelamentos
- [ ] Motor de recorrência (Edge Function + `pg_cron`) gerando lançamentos esperados futuros
- [ ] Parcelamentos automáticos (geração das parcelas seguintes)
- [ ] Cascata de saldo inicial entre meses
- [ ] Visualização dos próximos 6 meses

**Entregável:** projeção de 6 meses funcionando, parcelas e recorrências automáticas

### Fase 4 — Confirmação e alertas
- [ ] Modal de confirmação de lançamento esperado ao abrir o app
- [ ] Alerta de saldo previsto negativo
- [ ] Insights semanais e mensais por tag

**Entregável:** app completo no fluxo principal do dia a dia

### Fase 5 — PWA e login social
- [ ] Manifest.json + ícones + service worker (instalação na tela de início)
- [ ] Login com Google
- [ ] Push notifications (opcional, se topar a complexidade extra)
- [ ] Polimento de UI/acessibilidade

**Entregável:** app instalável no iPhone de vocês dois, pronto para uso diário

---

## ✅ Próximos passos

1. **Criar o repositório**
   ```bash
   npx create-next-app@latest nossagrana --typescript --tailwind --app
   ```

2. **Configurar o Supabase**
   - Criar projeto (região: South America / São Paulo)
   - `npm install @supabase/supabase-js @supabase/ssr`
   - Rodar o schema SQL (tabelas + RLS)

3. **Implementar autenticação e criação/entrada de casa**
   - Middleware Next.js protegendo rotas privadas
   - Tela de login/cadastro + tela "criar casa" / "entrar com código"

4. **Construir o CRUD de lançamentos**
   - Formulário rápido de entrada/saída
   - Cálculo de saldo em tempo real

5. **Configurar o PWA por último**, depois que o app já funcionar bem no navegador
   - `manifest.json`, ícones, `next-pwa`
   - Testar "Adicionar à Tela de Início" no iPhone de vocês dois

---

## 💰 Custos

| Serviço | Plano | Custo mensal |
|---|---|---|
| Vercel | Hobby | R$ 0 |
| Supabase | Free tier | R$ 0 |
| Google OAuth | Google Cloud (gratuito p/ esse uso) | R$ 0 |
| Domínio | Opcional — pode usar `*.vercel.app` | R$ 0 (ou R$ 40/ano se quiser domínio próprio) |
| Push notifications (VAPID) | Gratuito | R$ 0 |

**Custo total:** R$ 0/mês, para sempre — dentro dos limites do free tier do Supabase e Vercel, mais do que suficientes para 2 usuários.

---

## 📋 Schema SQL — tabelas principais

| Tabela | Descrição |
|---|---|
| `households` | A "casa" do casal — nome, código de convite único |
| `household_members` | Relaciona usuários (`auth.users`) à casa, com papel |
| `profiles` | Extensão de `auth.users` (nome, household_id) |
| `transactions` | Lançamentos — tipo (entrada/saída), status (concluído/esperado), valor, tag, data, `recurring_rule_id`, `installment_group_id` |
| `recurring_rules` | Regras de recorrência — frequência, valor, tag, data de início/fim |
| `tags` | Lista fixa de categorias (salário, mercado, lazer, etc.) |

### Observação de design
- **Parcelamento** e **recorrência** usam a mesma tabela `transactions`, diferenciadas por `installment_group_id` (parcelas) ou `recurring_rule_id` (recorrência) — evita duplicar lógica.
- O **saldo inicial de cada mês** não precisa de tabela própria: é calculado como o saldo esperado do mês anterior, sempre em tempo real (view SQL ou função no Supabase).

---

## 📌 Considerações importantes

- **Começar sem PWA**: monte o app funcionando normalmente no navegador primeiro (fases 1 a 4). Só transforme em PWA instalável na fase 5 — assim você valida a lógica financeira (a parte mais delicada) antes de mexer em manifest/service worker.
- **Push notifications são opcionais**: o modal de confirmação ao abrir o app já resolve a necessidade principal, sem depender de infraestrutura extra.
- **RLS é essencial**: como é dado financeiro sensível de vocês dois, configure Row Level Security no Supabase desde a Fase 1 para garantir que só os membros da própria casa acessem os dados.

---

## 🔖 Licença

* <a href ="./LICENSE"> MIT License </a>

---

*Documento de planejamento baseado na versão de Julho/2026. Este README será atualizado conforme o projeto evolui.*
>>>>>>> efd0ff6deedb17be24d2dc7bb1d280a4ec03ddd7
