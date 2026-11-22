# Primeiro vídeo IA — SC01 / Persiana do Living

## Objetivo

Receber uma imagem inicial e uma final **da mesma sala**; interpolar apenas o movimento de persiana de rolo, sem inventar móveis ou câmera. O resultado solicitado é um clip 16:9, cinco segundos, 720p, sem áudio. A geração será feita no site PixVerse com os créditos disponíveis, ou por API autorizada mais tarde.

## Arquivos de entrada

- INICIAL: `assets/rooms/living-model/GLC_LIVING_BASE_001.png` (persiana aberta)
- FINAL: `assets/rooms/living-model/GLC_LIVING_SC01_BLIND_CLOSED_001.png` (persiana fechada, frame provisório)
- REFERÊNCIA DE MOVIMENTO: `assets/video/GLC_SC01_BLIND_TECHNICAL_V01.mp4` (animação procedural não homologada)

**Ressalva de qualidade:** o quadro final é uma composição técnica e apresenta limitações de oclusão do sofá. Se o PixVerse tentar reconstruir a geometria, preferir refazer o quadro final em ambiente 3D ou com máscara manual. Não aprovar distorções.

## Prompt principal (em inglês)

A single photorealistic modern residential living room is filmed from an absolutely locked-off wide-angle camera. The motorized beige roller blinds over the full-height central windows slowly descend straight down from the upper concealed tracks to their final fully lowered positions. The blind fabric has consistent linen texture and realistic straight lower hems. Natural daylight entering the room decreases gradually, gently changing reflections on the existing floor and sofa. Every architectural line and furniture object stays perfectly fixed: ceiling LED tracks, wall sconces, chandelier, television (off), soundbar (off), air conditioner, sofa, table, plants, marble wall and balcony framing. Keep the exact composition, perspective and geometry of both supplied keyframes. One continuous shot, smooth constant physical descent, no camera movement, no object replacement. End on the exact supplied closed-blinds frame for a brief hold. No text, no logos, no interface overlays.

## Restrições (negative prompt)

camera pan, camera shake, zoom, lens change, added furniture, warped windows, distorted mullions, morphing sofa, moving TV, new curtain panels, sideways blind motion, strange folds, extra people, duplicate furniture, exposure flicker, time-lapse, bouncy motion, text, watermark, UI overlays, cartoon effects, CGI look

## PixVerse Web: caminho com créditos do usuário

1. Acesse `https://app.pixverse.ai/` e entre na conta.
2. Na área de criação, selecione **Vídeo** → **Primeiro e último quadro** (o nome do recurso pode variar com a versão da interface).
3. Envie INICIAL como primeiro quadro e FINAL como último quadro.
4. Selecione PixVerse V6, 16:9, 5s, 540p ou 720p (menor custo disponível). Desative áudio e múltiplos planos, quando essas opções estiverem disponíveis.
5. Cole prompt principal e restrições, caso haja campo de negative prompt. Confirme **quantidade de créditos antes de criar**.
6. Faça **uma geração** e baixe o MP4. Evite várias tentativas antes da revisão.
7. Envie o MP4 ao GET LED CENAS Video Lab para QA; rejeite deformações. Não publique diretamente no catálogo.

## Automação API (somente depois)

- `fal-ai/pixverse/v6/transition` utiliza `first_image_url` e `end_image_url`, prompt, duração e resolução. Exige `FAL_KEY` no backend e cobrança/API independente dos créditos do aplicativo web.
- Não colocar chaves no frontend ou no GitHub. Enfileirar gerações e exigir aceite explícito de custo.

## Rubrica de aprovação (100 pontos)

- Geometria imutável: 35.
- Persiana desliza corretamente no vão: 25.
- Sombras e entrada de luz: 15.
- Estabilidade temporal: 15.
- Legibilidade e estado final: 10.

**Aprovar somente >=85 sem defeitos críticos.** Se falhar, executar segunda tentativa mudando apenas um parâmetro ou o último quadro. Se falhar novamente, avaliar Fusion/Blender antes de trocar de motor.
