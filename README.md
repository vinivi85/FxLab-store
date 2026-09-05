# FXLabs Store

Loja on-line de peptídeos e hormônios (cosmético, fitness/research, wellness, clínico) para o mercado americano.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- Vercel (hosting + serverless functions)

## Status
- [x] Scaffold Next.js
- [x] Schema Supabase (produtos, categorias, pedidos, rewards)
- [x] Camada de pagamento abstrata (gateway ainda não escolhido — ver `PAYMENT_PROVIDER` em `.env.local`)
- [ ] Cadastro de categorias definitivas
- [ ] Import do catálogo do fornecedor (produtos + imagens)
- [ ] Escolha do gateway de pagamento (categoria high-risk — ver notas abaixo)
- [ ] UI: catálogo, carrinho, checkout
- [ ] Painel de rewards/pontos pro cliente

## Rewards
1 ponto a cada $10 gasto. Configurável em `reward_rules` (tabela Supabase).
Resgate: 100 pontos mínimo, taxa de conversão em `redemption_rate_cents_per_point`.

## Pagamento
Peptídeos/hormônios são categoria high-risk — processadores mainstream (Stripe, PayPal)
costumam banir contas desse nicho. Avaliar gateways especializados (PaymentCloud,
Durango Merchant Services, NMI, Authorize.net via high-risk acquirer) antes de lançar.
A camada em `src/lib/payment/` foi feita pra plugar qualquer gateway sem reescrever o checkout.

## Setup
```bash
npm install
cp .env.local.example .env.local
# preencher as chaves do Supabase
```

Rodar a migration em `supabase/migrations/0001_init.sql` no seu projeto Supabase
(SQL editor ou Supabase CLI).
