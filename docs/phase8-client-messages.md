# Phase 8 — Client Communication (Brazilian Portuguese)

Draft messages for after Joana tests the demo. **Fill the [brackets]** and adjust tone to
your actual relationship with her. These are starting points, not scripts to send verbatim.

---

## 8.0 — Sending the demo (before she tests)

> Oi, Joana! Preparei uma demonstração da Pérgola Dinamo em realidade aumentada.
> É só abrir este link no celular: **[URL]**
>
> Funciona assim: você vê a pérgola em 3D, gira com o dedo e, tocando em "Ver no meu
> ambiente", consegue posicioná-la no seu espaço usando a câmera. Funciona melhor em pé,
> apontando para o chão com boa iluminação.
>
> É uma amostra de uma peça só, pra você sentir a ideia. Dá uma olhada com calma e me
> conta o que achou — qualquer coisa estranha, me manda um print que eu ajusto. Consegue
> testar até [dia]?

---

## 8.1 — She loved it: scoping the full project

Natural paragraphs, no bullet points, confident and direct.

> Joana, fico muito feliz que tenha gostado! A ideia é exatamente essa: deixar o cliente
> ver o produto no espaço dele antes de comprar, com uma experiência que passa a qualidade
> da sua loja.
>
> Sobre a reunião com seu diretor, tenho disponibilidade [proponha 2–3 horários, ex.:
> "na terça às 10h ou na quinta à tarde"]. Me diz o que encaixa melhor pra vocês. A ideia
> da conversa é alinhar o escopo, o prazo e a faixa de investimento pra eu montar uma
> proposta certeira.
>
> Pra eu chegar na reunião já com uma boa noção, me ajuda com algumas coisas: quantos
> produtos vocês pensam em colocar em AR no total — entre pérgolas, persianas, cortinas e
> toldos, mesmo que seja uma estimativa de cada? Depois de no ar, quem cuidaria de
> atualizar o catálogo, a equipe de vocês ou eu? A experiência precisa conversar com o site
> ou a loja virtual que vocês já têm, ou pode ser um link à parte? E vocês já têm uma faixa
> de investimento em mente pra esse tipo de projeto?
>
> Com essas respostas eu já consigo desenhar algo sob medida. Me passa os horários que
> fecho a reunião.

**Strategic questions to have answers to (for yourself, before quoting):**
1. Total products to support (rough counts: pergolas / blinds / curtains / awnings)
2. Who maintains the catalog after launch (her team vs you → recurring vs one-off)
3. Integration with existing site / e-commerce (changes scope significantly)
4. Budget range / expected investment level

---

## 8.2 — Something went wrong: recovery message

First, an honest internal diagnosis (for you), then the client-facing message.

**Internal triage — likely causes:**
- *Pérgola gigante ou minúscula no AR* → model scale not in meters (Phase 1 export fix).
- *Não detecta o chão / fica flutuando* → plane detection on featureless/low-light surface;
  often environment, not a bug. Workaround: guidance text + test on textured floor.
- *Não abre no iPhone dela* → USDZ MIME type or missing `.usdz`; or old iOS.
- *Trava no meio* → heavy GLB on a weak phone; reduce textures/poly (Phase 5).
- **Deeper red flag:** if the product is too fine-detailed for mobile, or her real use case
  needs measurements/configurator rather than visualization — say so to yourself honestly,
  even if the client message stays softer.

**Fixability:** hours (scale, MIME, copy), days (re-model, texture rework), or platform
limitation (plane detection on bad surfaces — work around, don't fight).

**Client-facing message** (acknowledge, explain simply, propose fix + timeline, reframe):

> Joana, obrigado por testar e por me mandar o detalhe — isso ajuda muito. O que aconteceu
> aí foi [explicação em 1–2 frases, sem termos técnicos, ex.: "o tamanho da pérgola não
> estava calibrado certo, então ela apareceu maior do que o real"]. É uma coisa que eu
> ajusto [rápido / em alguns dias], já estou cuidando disso.
>
> Te mando a versão corrigida até [dia] pra você testar de novo. Esse tipo de ajuste é
> normal nessa fase — a base está funcionando, é questão de afinar. Qualquer outra coisa
> que você notar, me manda que eu vou acertando junto com você.

> Tom: reconhece sem se desculpar demais, explica simples, propõe prazo, reenquadra como
> "isso é solucionável". Não bajule, não minimize o problema dela.
