# Handoff: Junto — app de controle financeiro para casal

## Visão geral

App de controle financeiro compartilhado por **duas pessoas sem hierarquia** (ambas com acesso total). O objetivo do produto é reduzir a fricção de registrar gastos do dia a dia — hoje feito numa planilha manual — e dar transparência mútua sobre reserva de emergência e fechamento mensal.

Princípio de tom que atravessa toda a interface: **ferramenta de cuidado mútuo, não de vigilância**. Não existe vermelho, alerta, "você estourou o orçamento" ou linguagem punitiva. Variação de gasto aparece como fato, não como aviso.

Decisões de produto já tomadas com o cliente:

- O dinheiro é comum: **não há acerto entre as duas pessoas**. Nenhum saldo aparece como dívida de ninguém. O avatar em cada lançamento indica apenas *quem lançou*.
- **Gasto individual existe** e conviva com o gasto do casal: no registro se escolhe "Do casal" ou "Só meu".
- **Contas fixas têm lugar próprio**, separado do fluxo de gastos do dia.
- Salário é informado **bruto**; o app calcula INSS, IRRF e o líquido.
- Mobile-first, com uma versão web (desktop) do mesmo app.
- Público: casal não-técnico, uso rápido no dia a dia. Português do Brasil, moeda BRL.

## Sobre os arquivos de design

Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento pretendidos, **não código de produção para copiar**. O trabalho é **recriar estes designs no ambiente do codebase de destino** (React/Next, Vue, React Native, SwiftUI etc.) usando os padrões e bibliotecas já estabelecidos ali. O repositório associado (`jviictordev/ui-finance-app`) está vazio no momento deste handoff — sem commits — então também cabe **escolher o stack** mais adequado e implementar os designs nele.

O protótipo mantém todo o estado em memória (uma classe de componente), sem persistência, sem API e sem autenticação. Isso é intencional para um protótipo de design; na implementação real esses pontos precisam ser resolvidos (ver "Backend e dados").

## Fidelidade

**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, raios, sombras e microinterações estão definidos e devem ser reproduzidos fielmente. Todos os valores estão em "Design tokens" abaixo.

Exceção: não há imagens/fotografias no app. Ícones são Lucide desenhados inline em SVG com `stroke-width: 2.75`.

---

## Design tokens

O protótipo consome um design system chamado **Organic** (arquivo `_ds/organic-*/styles.css`), com os tokens de cor sobrescritos para a paleta do cliente (https://coolors.co/586994-7d869c-a2abab-b4c4ae-e5e8b6).

### Cores

Papéis:

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-bg` | `#f0f2e8` | fundo da aplicação |
| `--color-surface` | `#fafbf4` | cartões, linhas de lista, campos |
| `--color-text` | `#252a35` | texto principal |
| `--color-divider` | `rgba(37,42,53,.13)` | filetes e bordas de campos |

Rampa do acento (azul — ações, seleção, foco):

`--color-accent` = `#586994`
`100 #ebeef6` · `200 #d4ddee` · `300 #aebbd6` · `400 #8494bb` · `500 #586994` · `600 #47567c` · `700 #374262` · `800 #282f47` · `900 #1a1f2e`

Rampa do segundo acento (sage — reserva, receitas, "pago", gasto individual):

`--color-accent-2` = `#8fa383`
`100 #eaf0e0` · `200 #d7e0cb` · `300 #b4c4ae` · `400 #9fb096` · `500 #8fa383` · `600 #748764` · `700 #5a6a4d` · `800 #414d38`

Rampa neutra:

`100 #f4f5ef` · `200 #e7e9df` · `300 #d1d5ca` · `400 #a2abab` · `500 #8b939c` · `600 #7d869c` · `700 #5f6673` · `800 #434956` · `900 #252a35`

Regras de uso:
- Fundos tingidos usam os passos 100–200; texto sobre eles usa 700–900 da mesma rampa.
- Botão primário: fundo `--color-accent`, texto `#fff`; hover `--color-accent-600`; pressed `--color-accent-700`.
- Botão desabilitado: fundo `--color-neutral-200`, texto `--color-neutral-500`.
- Foco de teclado: `outline: 2px solid var(--color-accent); outline-offset: 2px`. Nunca o azul padrão do browser.
- **Nunca use vermelho.** Saída de dinheiro/retirada é indicada com o sinal `−` e cor neutra (`--color-neutral-700`), não com cor de alerta.

### Tipografia

- Display/números: **Caprasimo** 400 (`--font-heading`). Só ela como voz de display.
- Texto: **Figtree** 400/600/700 (`--font-body`).
- Ambas via Google Fonts.
- Base: 15px, `line-height: 1.55`.
- Títulos: `line-height: 1.12`, `letter-spacing: -0.015em`.

Escala usada nas telas (mobile):

| Papel | Tamanho | Família |
| --- | --- | --- |
| Valor total do mês / saldo da reserva | 34px | Caprasimo |
| Valor grande no teclado de registro | 50px | Caprasimo |
| Meses cobertos (anel da reserva) | 46px | Caprasimo |
| Título de tela (Perfil, Contas fixas) | 26px | Caprasimo |
| Título de seção / valor de cartão | 19–21px | Caprasimo |
| Item de lista (título) | 15px / 600 | Figtree |
| Valor em linha de lista | 15.5px / 700 | Figtree |
| Texto de apoio | 13–14.5px / 400 | Figtree |
| Legenda / meta | 11.5–12.5px | Figtree |
| Rótulo de seção (caixa alta) | 11px, `letter-spacing: .1em`, `text-transform: uppercase`, cor `--color-neutral-600` | Figtree |

No web (desktop) o valor principal sobe para 38–40px; o resto acompanha os mesmos papéis com 0.5–1px menos.

### Espaçamento, raio e sombra

- Escala de espaço: 4.4 / 8.8 / 13.2 / 17.6 / 26.4 / 35.2 px (densidade 1.10×). Na prática o protótipo usa 7–9px entre itens de lista, 12–22px de padding interno e 18–24px entre blocos.
- Raios: campos e botões `999px` (pílula); cartões de lista `22–24px`; cartões de conteúdo `26–30px`; folhas inferiores `34px 34px 0 0`; avatares e checkboxes `999px`.
- Sombras: `--shadow-sm: 0 1px 2px rgba(46,43,37,.14)` · `--shadow-md: 0 3px 10px rgba(46,43,37,.16)` · `--shadow-lg: 0 12px 32px rgba(46,43,37,.22)`.
- **Sem cantos retos e sem geometria de fio de cabelo.** O sistema é redondo; formas circulares são o vocabulário.

### Alvos de toque

Nenhum controle interativo abaixo de **44px** de altura. Teclado numérico: teclas de 54px. Botão de salvar: 56px. FAB: 64px.

---

## Formatação de números e datas

- Moeda: `R$ ` + valor com separador de milhar `.` e decimal `,`, sempre com 2 casas — `R$ 1.234,50`. Implementado como `(centavos/100).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})`.
- **Todo valor monetário é armazenado em centavos (inteiro).** Nunca float.
- Entrada de valor pelo teclado numérico: os dígitos preenchem os centavos da direita para a esquerda (digitar `4`, `2`, `9`, `0` → `R$ 42,90`). A tecla `,` é inerte. `⌫` remove o último dígito. Limite de 8 dígitos.
- Entrada de valor por teclado físico (web e campos de renda): texto livre no formato pt-BR, parseado com `parseFloat(txt.replace(/\./g,'').replace(',','.')) * 100`.
- Dias do mês: rótulos relativos na lista de gastos ("Hoje", "Ontem") e depois data curta ("terça, 1").

---

## Regras de negócio

### 1. Renda: bruto → líquido

Para cada pessoa:

```
bruto            = valor informado (centavos)
inss             = INSS progressivo(bruto)
irrf             = IRRF(bruto, inss, dependentes)
outrosDescontos  = soma dos descontos de folha informados
liquido          = max(0, bruto − inss − irrf − outrosDescontos)
outrasRendas     = soma das outras rendas informadas
totalDaPessoa    = liquido + outrasRendas
```

Renda do casal = `totalDaPessoa(ana) + totalDaPessoa(rafa)`.

**INSS progressivo** — desconto por faixa, aplicando a alíquota apenas sobre a parcela dentro de cada faixa (valores em centavos):

| Faixa (até) | Alíquota |
| --- | --- |
| 151800 | 7,5% |
| 279388 | 9% |
| 419083 | 12% |
| 815741 | 14% |

Acima do teto (815741) não há acréscimo — a contribuição fica travada no valor do teto.

**IRRF** — base = `max(0, bruto − inss − dependentes × 18959)`; sobre a base, alíquota menos parcela a deduzir:

| Base (até) | Alíquota | Dedução |
| --- | --- | --- |
| 242880 | 0% | 0 |
| 282665 | 7,5% | 18216 |
| 375105 | 15% | 39416 |
| 466468 | 22,5% | 67549 |
| acima | 27,5% | 90873 |

Resultado nunca negativo.

⚠️ **Estas tabelas estão hard-coded no protótipo.** Na implementação real elas devem vir de configuração/servidor com vigência por data, porque mudam anualmente. Dedução por dependente: `18959` centavos (R$ 189,59).

Cada pessoa também tem:
- **Tipo**: `Fixa` | `Variável`. Se variável, a interface informa que o mês trabalha com a **média dos últimos 3 meses** (essa média não está implementada no protótipo — é uma regra a implementar).
- **Dia de recebimento**: 1–28.
- **Descontos de folha**: lista de `{nome, valor}`, adicionáveis e removíveis. Reduzem o líquido; **não** reduzem a base do IRRF no protótipo.
- **Outras rendas**: lista de `{nome, valor}` (freela, aluguel, dividendos). Somam ao total da pessoa.

Percentual de participação exibido por pessoa = `totalDaPessoa / rendaDoCasal`.

### 2. Aporte da reserva

Percentual da renda do casal (0–50%, passo de 1). `aporteMensal = round(rendaDoCasal × pct / 100)`. Sai no dia 1, antes de qualquer gasto, da conta comum. Os dois podem alterar.

### 3. Reserva de emergência

- Saldo atual e histórico de **aportes e retiradas**, com o avatar de quem originou cada movimento.
- **Meses cobertos** = `saldo / médiaMensalDeGasto`, exibido com uma casa decimal e vírgula (`2,4`).
- **Meta em meses de despesa** (3–12, default 6). Progresso = `min(100, meses / meta × 100)`, desenhado como anel (`conic-gradient`).
- Frase de contexto: "Se as duas rendas parassem hoje, vocês cobririam X meses no ritmo atual."

No protótipo o saldo (`R$ 18.400,00`) e a média mensal (`R$ 7.800,00`) são fixos; na implementação real vêm dos dados.

### 4. Lançamento de gasto

Campos:

| Campo | Tipo | Obrigatório | Default |
| --- | --- | --- | --- |
| valor | centavos | sim (ou recibo) | — |
| categoria | enum | sim (ou recibo) | vazio |
| escopo | `casal` \| `individual` | sim | `casal` |
| data | data | sim | hoje |
| descrição | texto | não | vazio |
| forma de pagamento | `Pix` \| `Crédito` \| `Débito` \| `Dinheiro` | sim | `Pix` |
| parcelas | 1–24 | sim | 1 |
| parcelas pagas | inteiro | sim | 1 |
| recibo (foto) | anexo | não | não |
| quem lançou | usuário | sim | usuário atual |
| reações | lista `{tipo, quem}` | — | vazia |
| comentários | lista `{quem, texto}` | — | vazia |

Categorias (fixas): Mercado, Restaurante, Transporte, Casa, Lazer, Saúde. Cada uma tem uma cor de avatar tirada das rampas (ver `CATS` no arquivo do protótipo) e a inicial da categoria é usada como marca no círculo da linha.

Regras:
- **Parcelas só aparecem quando a forma é Crédito.** Trocar para outra forma reseta para 1.
- O campo de parcelas mostra o valor da parcela: `valor / parcelas`.
- **Recibo sem valor é um lançamento válido**: salva a foto e marca o lançamento como **"a detalhar"** (categoria vazia, valor 0). O botão de salvar muda para "Salvar recibo e detalhar depois".
- Estado do botão de salvar: `Digite o valor ou anexe o recibo` → `Escolha a categoria` → `Salvar`.
- Após salvar, aparece um toast: "Salvo. {outra pessoa} já vê esse lançamento."

**Parcelamento na exibição:** cada lançamento parcelado mostra `parcela P de N · R$ X por mês`, barra de progresso (`P/N`) e, abaixo, `saldo devedor R$ (valor − P × valorDaParcela)`.

### 5. Contas fixas

Lista própria de `{nome, valor, dia de vencimento, paga, quem paga}`. A tela mostra:
- total mensal das fixas;
- quantas estão pagas (`4 de 6 pagas`) e quanto ainda falta;
- barra de progresso = `somaPagas / somaTotal`;
- cada conta com checkbox circular para marcar como paga, dia de vencimento, valor e avatar de quem paga;
- na mesma tela, a seção **Parcelas em andamento** (derivada dos lançamentos com `parcelas > 1`) e o **saldo devedor somado**.

Um lançamento que corresponde a uma conta fixa recebe a etiqueta "conta fixa" na lista do mês.

### 6. Mês corrente

- Total gasto = soma de todos os lançamentos do mês.
- Quebra por escopo: `Do casal R$ X · individuais R$ Y`.
- `Sobrou` = renda do casal (líquida, calculada em 1) − total gasto.
- `Por dia` = total gasto / dia do mês corrente.
- Lançamentos agrupados por dia, mais recente primeiro.

### 7. Fechamento mensal

Mês anterior, **congelado** (não muda quando se lança algo no mês corrente — isso foi um bug corrigido no protótipo e é uma regra importante): total do mês, variação contra o mês anterior, gasto por categoria em barras proporcionais à maior categoria, e quanto sobrou e foi para a reserva. Total, barras e aporte vêm todos da mesma fonte de dados do mês fechado.

### 8. Presença das duas pessoas

- Avatar com cor por pessoa em cada lançamento, comentário, aporte e conta fixa.
- **Aba de atividade**: feed cronológico de "X lançou mercado de R$ 124,30", "X comentou: …", aportes automáticos e fechamento de mês.
- **Reações e comentários por lançamento**: duas reações (`Curti` — coração preenchido quando é sua; `Combinado` — check) com contagem, e uma conversa em thread com campo de envio. Reagir é um toggle por pessoa por tipo.

---

## Telas

Todas as medidas de mobile são para uma tela de **402 × 874** (iPhone 16 Pro). O protótipo desenha o aparelho com moldura, ilha dinâmica e barra de status; isso é cenografia do design, não parte do app.

### Mobile

**Navegação:** barra inferior com 4 destinos — `Mês`, `Atividade`, `Reserva`, `Fechar` (fechamento) — e um FAB central de 64px que abre o registro. A barra tem 98px de altura com um gradiente do fundo para transparente, para a lista passar por baixo. Ícones Lucide 22px, rótulo 10.5px/600. Item ativo em `--color-accent`, inativo em `--color-neutral-600`.

Telas de Perfil, Renda e Contas fixas são **overlays em tela cheia** (`top: 50px` para não cobrir a ilha dinâmica; `z-index` acima do conteúdo, abaixo das folhas).

#### 1. Mês (home)

- Cabeçalho: rótulo "Setembro" em caixa alta, total do mês em 34px Caprasimo. À direita, **pilha de avatares** dos dois (34px, sobreposição de −10px, borda de 2px na cor do fundo) — é o **botão que abre o Perfil**.
- Cartão de resumo (`--color-surface`, raio 30px, `--shadow-sm`): frase acolhedora de contexto, dois mini-cartões lado a lado (`Sobrou` em tingido azul, `Por dia` em tingido sage) e, embaixo, a linha de quebra por escopo em 12.5px.
- Botão de **Contas fixas**: linha com ícone de calendário em círculo, "Contas fixas", "4 de 6 pagas · faltam R$ 1.259,00" e chevron.
- Lista de lançamentos agrupada por dia. Cada linha é um botão (abre o detalhe): círculo de 38px na cor da categoria com a inicial, título (`Categoria · descrição`), subtítulo (forma de pagamento), valor à direita e avatar de 22px de quem lançou.
  - Se parcelado: bloco tingido azul embaixo com "parcela 2 de 6 · R$ 315,00 por mês", barra de 6px e "saldo devedor R$ 1.260,00".
  - Rodapé de etiquetas quando aplicável: "só seu"/"só do Rafa" (sage), "conta fixa" (neutro), contagem de reações com coração, "2 comentários", "a detalhar".

#### 2. Registro (folha inferior)

Ancorada embaixo, raio 34px no topo, `max-height: 94%`, com scrim `rgba(26,31,46,.42)` e animação de entrada (`translateY(16px)` → 0, 260ms, `cubic-bezier(.2,.8,.2,1)`).

Ordem dos elementos:
1. Alça de 44 × 5px.
2. **Atalhos de gastos recorrentes** em linha rolável: Mercado R$ 284,50 · Delivery R$ 68,90 · Gasolina R$ 200,00 · Faxina R$ 150,00. Um toque preenche valor, categoria e forma.
3. Valor em 50px Caprasimo, centralizado, `--color-neutral-400` quando vazio.
4. Chips de categoria em linha rolável (selecionado: fundo acento, texto branco).
5. Escolha de escopo: `Do casal` | `Só meu` (dois botões de 46px).
6. Linha com o **resumo dos detalhes** ("Hoje · Pix · à vista") que expande, e o **botão de recibo** (48px, ícone de câmera; ativo com fundo acento).
7. Quando os detalhes estão abertos, o teclado é substituído pelo painel: descrição, data (`Hoje` / `Ontem` / `Outro dia`), forma de pagamento, e parcelas com stepper (só em Crédito) mostrando o valor da parcela.
8. Teclado numérico 3 × 4 (`1–9`, `,`, `0`, `⌫`), teclas de 54px, raio 22px, `--color-surface`, pressed `--color-accent-200`.
9. Botão de salvar, 56px, pílula, Caprasimo 16px.

#### 3. Detalhe do lançamento (folha inferior)

Círculo da categoria 52px, valor em 26px Caprasimo, título. Cartão de meta com: quem lançou, data, forma de pagamento, tipo de gasto (do casal/individual), parcelas (`2 de 6 pagas · R$ 315,00/mês`) e saldo devedor. Se houver recibo, um cartão tingido com a miniatura. Dois botões de reação de 48px com contagem. Thread de comentários (avatar 30px + bolha `--color-surface` raio 20px) e campo de envio com botão circular de 50px.

#### 4. Atividade

Rótulo + título "Vocês dois" e feed de linhas: avatar 32px, texto 14px, tempo em 11.5px.

#### 5. Reserva

Saldo em 34px. **Anel de 212px** desenhado com `conic-gradient(var(--color-accent) X%, var(--color-accent-200) 0)` e um disco interno de `inset: 26px` na cor do fundo, com os meses cobertos em 46px, "meses de despesa" e "meta: 6 meses". Cartão com a frase de contexto. Lista "Aportes e retiradas": avatar, nome do movimento, data, valor com sinal (`+` em `--color-accent-2-700`, `−` em `--color-neutral-700`).

#### 6. Fechamento

Título do mês fechado, total em 29px, variação com ícone de seta, filete, e barras por categoria (rótulo + valor, barra de 9px proporcional à maior categoria). Cartão sage: "Sobrou e foi para a reserva" com o valor do aporte, "de R$ X que sobrou" e a frase de contexto.

#### 7. Perfil (overlay)

Título + botão de fechar (X, 44px). Avatar de 76px com a inicial, campo de nome ("Como você aparece para o Rafa"). Cartão com 4 opções de cor do avatar (círculos de 46px, borda de 3px em acento quando selecionado). Botão para **Renda do casal** (tingido azul, total em 24px, resumo dos líquidos e % do aporte). Cartão de notificações com dois interruptores (46 × 26px, botão interno de 22px, transição de 160ms): "Avisar quando Rafa lançar" e "Resumo de domingo". Cartão sage "Vocês dois": avatar do parceiro, "junto com você desde março" e o texto que explica que o acesso é igual para os dois.

#### 8. Renda (overlay)

Voltar (chevron) + título. Total do casal em 36px e a linha "líquido de Ana R$ X + Rafa R$ Y". Um **cartão expansível por pessoa**: cabeçalho com avatar, nome, % da renda do casal, total da pessoa e chevron. Aberto, mostra:
- salário bruto (campo de 48px, Caprasimo 19px);
- dependentes no IR com stepper;
- painel de cálculo (`--color-bg`, raio 22px): INSS, Imposto de renda, cada desconto de folha com botão de remover (26px), filete, e "Líquido na conta" em 21px Caprasimo com "X% de descontos";
- botão tracejado "+ outro desconto na folha" que abre um formulário tingido (nome, valor, `Somar`, `Sair`);
- seção "Outras rendas" com o total sage, cada renda em linha sage removível e botão tracejado "+ outra renda";
- tipo (`Fixa`/`Variável`) e dia de recebimento com stepper;
- nota contextual.

Ao final, cartão sage do aporte: stepper de − / +, valor em 30px, "17% da renda", barra de progresso e a frase explicando que sai no dia 1.

#### 9. Contas fixas (overlay)

Título + fechar. Cartão com total mensal em 31px, "por mês · 2 de 6 pagas", barra sage de progresso e "Ainda faltam R$ X neste mês". Lista de contas: checkbox circular de 26px (marcado: fundo `--color-accent-2-600`), nome, "vence dia 10 · a pagar", valor e avatar de quem paga; linha paga ganha fundo `--color-accent-2-100`. Depois, "Parcelas em andamento" com o saldo devedor total no cabeçalho da seção e um cartão por parcelamento (nome, "2 de 6 pagas", barra, "R$ 315,00 por mês" e "saldo devedor R$ 1.260,00").

### Web (desktop)

Layout de três colunas em 1180 × 780 (o protótipo desenha uma janela de browser em volta; é cenografia).

- **Barra lateral, 216px**, filete à direita: marca "Junto" em 26px Caprasimo; navegação em pílulas de 44px (`Mês`, `Atividade`, `Reserva`, `Fechamento`, `Contas fixas`), ativa com fundo `--color-accent-100`; ao pé, as duas pessoas — a sua linha é um **botão que abre Renda e perfil**, a outra mostra "· online".
- **Coluna central, flexível**: cabeçalho com o mês, total em 40px e, à direita, `Sobrou` e `Por dia` em 22px. Abaixo, a **linha de lançamento rápido** em duas linhas deliberadas: (1) valor, descrição e botão `Lançar`; (2) chips de categoria à esquerda e o par `Do casal` / `Só meu` à direita. Depois, a lista de lançamentos agrupada por dia, em linhas de 22px de raio com etiquetas de escopo e de parcelas.
- **Coluna direita, 290px**: cartão da reserva (anel de 88px + saldo + "2,4 de 6 meses de despesa") e cartão de atividade recente (rola sozinho).
- As views `Contas fixas` e `Renda e perfil` **substituem a coluna central**, mantendo barra lateral e coluna direita.

Mobile e web compartilham o mesmo estado no protótipo: lançar em um aparece no outro. Na implementação real isso é sincronização em tempo real entre os dois usuários (ver abaixo).

---

## Interações e animação

- Entrada de folha inferior: `translateY(16px)` → 0 com opacidade, 260ms, `cubic-bezier(.2,.8,.2,1)`. Scrim com fade de 160ms.
- Overlays de tela cheia e painéis que expandem: fade de 180ms.
- Toast: sobe 14px com fade em 220ms, fica **2,8s**, ancorado 128px acima da base, fundo `--color-accent-800`, texto branco, raio 22px.
- Interruptores: `left` do botão interno com transição de 160ms.
- Hover em linha de lista clicável: fundo passa a `--color-accent-100`.
- Hover em botão primário: `--color-accent-600`; pressed: `--color-accent-700`.
- Linhas roláveis horizontais (atalhos, categorias) escondem a barra de rolagem (`scrollbar-width: none`).

Sem animação decorativa além destas. O tom é calmo.

---

## Estado

Estado do protótipo (uma única classe). Serve como mapa das entidades:

```
tab                'mes' | 'feed' | 'reserva' | 'fecha'
view               null | 'perfil' | 'renda' | 'fixas'      (overlays mobile)
webView            'app' | 'renda' | 'fixas'                (coluna central web)
sheet              null | 'registro' | 'detalhe'
detalheId          id do lançamento aberto

lancamentos[]      { id, dia, cat, desc, valor, quem, forma, parcelas,
                     pagas, escopo, fixa?, recibo, reacoes[], comentarios[] }
nextId             contador de id
fixas[]            { id, nome, valor, dia, paga, quem }

renda              { ana: {...}, rafa: {...} }
                   cada um: { bruto, dependentes, tipo, dia,
                              descontos[{nome,valor}], outras[{nome,valor}] }
aportePct          0–50
perfil             { nome, cor, notifLanc, notifResumo }
rendaAberto        'ana' | 'rafa' | null    (cartão expandido)
novo               { quem, tipo: 'desconto'|'outra', nome, valor }  (form aberto)

digitos            string de dígitos do teclado (centavos)
cat, desc, data, forma, parcelas, escopo, recibo, detalhes   (rascunho do registro)
comentario         texto do comentário em digitação
webValor, webDesc, webCat, webEscopo                          (rascunho web)
toast              string
```

Derivados (recalcular, não guardar): total do mês, total por escopo, `Sobrou`, `Por dia`, grupos por dia, feed, líquido/INSS/IRRF por pessoa, renda do casal, aporte mensal, meses cobertos, % da meta, totais de contas fixas, parcelas em andamento, saldo devedor.

### Backend e dados (a resolver na implementação)

O protótipo não tem nada disso; a implementação precisa de:

- **Autenticação** e o conceito de **casal**: duas contas ligadas a um mesmo espaço, ambas com permissão total. Nenhuma noção de dono ou administrador.
- **Sincronização em tempo real** entre os dois usuários: o app promete "Rafa já vê esse lançamento". Um lançamento, comentário, reação ou conta marcada como paga deve aparecer no outro aparelho sem ação manual.
- **Notificações push**: por lançamento (opcional por usuário) e resumo semanal de domingo.
- **Upload de foto de recibo** e o estado "a detalhar" como fila de pendências.
- **Fechamento de mês**: congelar os números do mês encerrado (total, categorias, aporte) para que lançamentos posteriores não alterem o histórico.
- **Tabelas de INSS/IRRF versionadas por vigência**, não hard-coded.
- **Média de 3 meses** para renda variável.
- **Baixa de parcelas** mês a mês (incremento de `pagas`) e recorrência das contas fixas (resetar `paga` a cada ciclo).
- Moeda em centavos inteiros no banco.

---

## Copy

Toda a interface está em português do Brasil. Alguns textos exatos usados, como referência de tom:

- Mês: "Quatro dias de setembro registrados. O aluguel e o sofá já saíram, então o resto do mês tende a ser mais leve."
- Reserva: "Se as duas rendas parassem hoje, vocês cobririam 2,4 meses no ritmo atual. A meta de 6 meses chega em fevereiro mantendo o aporte."
- Aporte: "No dia 1 saem R$ 2.380,00 da conta comum para a reserva, antes de qualquer gasto. Vocês dois podem mudar isso a qualquer momento."
- Perfil: "Os dois têm o mesmo acesso a tudo. Não existe dono da conta, e nada aqui fica escondido de ninguém."
- Fechamento: "O aporte sai no dia 1, antes de qualquer gasto. O que ficou fora dele seguiu na conta corrente."
- Toast ao salvar: "Salvo. Rafa já vê esse lançamento."
- Vazio: "Só o salário por enquanto." / "Nada parcelado agora." / "Nenhum comentário ainda."

Nomes das pessoas no protótipo (Ana e Rafa) são exemplo. O usuário atual é Ana.

---

## Assets

Nenhuma imagem. Ícones são **Lucide** (https://lucide.dev) desenhados inline com `stroke-width: 2.75`, `stroke-linecap: round`, `stroke-linejoin: round`: cartão, escudo, barras, mensagem, mais, câmera, documento, calendário, chevrons, X, check, seta.

Fontes: Caprasimo 400 e Figtree 400/600/700, via Google Fonts.

---

## Arquivos deste pacote

| Arquivo | O que é |
| --- | --- |
| `Junto - app financeiro do casal v2.dc.html` | **O design.** Protótipo completo: mobile + web, todas as telas e regras. Abre no navegador. |
| `Junto - app financeiro do casal.dc.html` | Versão 1, anterior (tinha acerto entre as duas pessoas — descartado). Só como histórico. |
| `styles.css` | Folha do design system Organic com os tokens. É a fonte dos valores de cor, tipo, espaço, raio e sombra. |
| `ios-frame.jsx` | Moldura de iPhone usada para apresentar o design. Cenografia, não faz parte do app. |
| `browser-window.jsx` | Moldura de janela de browser. Idem. |
| `support.js` | Runtime que faz o arquivo de design rodar no navegador. Não é código de produção. |

Para ler as regras de negócio no código: no arquivo `.dc.html` da v2, o bloco `<script data-dc-script>` no fim contém a classe com `inss()`, `irrf()`, `calc()`, `gravar()` e o mapeamento de todos os dados exibidos.
