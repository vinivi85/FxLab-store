# FXlabs Store

Loja on-line de peptídeos (research/cosmético/wellness/clínico) para o mercado americano.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind 4
- Supabase (Postgres + Auth + RLS)
- Vercel (hosting + serverless functions)

## Identidade visual
Paleta puxada do rótulo dos vials: azul-marinho (#1F3A5C), branco, prata metálico, azul claro
como acento (#5B84A8). Ver `src/app/globals.css` (tema `@theme`).

## Status
- [x] Scaffold Next.js 16 + Tailwind 4
- [x] Schema Supabase (produtos, categorias, pedidos, rewards) — mantido do build anterior
- [x] Homepage (hero, ticker ao vivo, produtos em destaque, promessas)
- [x] Catálogo `/shop` com filtro por categoria e ordenação
- [x] Página de produto `/product/[slug]` com seletor de dosagem
- [x] Camada de pagamento abstrata (gateway ainda não escolhido)
- [ ] Carrinho / checkout funcional
- [ ] Auth (login/registro)
- [ ] Painel de rewards/pontos
- [ ] Fotos reais dos produtos (hoje mostra placeholder "Photo coming soon")
- [ ] Escolha do gateway de pagamento (categoria high-risk — ver notas abaixo)

## Rewards
1 ponto a cada $10 gasto. Configurável em `reward_rules` (tabela Supabase).

## Pagamento
Peptídeos são categoria high-risk — processadores mainstream (Stripe, PayPal) costumam banir
contas desse nicho. Avaliar gateways especializados (PaymentCloud, Durango Merchant Services,
NMI, Authorize.net via high-risk acquirer) antes de lançar.

## Setup
```bash
npm install
cp .env.local.example .env.local
# preencher as chaves do Supabase
npm run dev
```
