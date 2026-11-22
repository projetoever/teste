# GET LED CENAS — Guia de produção audiovisual profissional

## Objetivo

Produzir microfilmes arquitetônicos para demonstrar automações residenciais sem deformar o ambiente, sem inserir falsos equipamentos e respeitando as limitações técnicas reais. O filme é um **conceito comercial**, não um registro da execução física.

## Primeira cena — SC01: Cinema em Casa

**Ambiente:** living com TV, cortina/persiana, perfil LED, iluminação decorativa e soundbar.

**Plano principal:** câmera estática, 16:9, 1920×1080 (ou 4K como master), 24/30 fps, 8 segundos, sem pessoas.

**Etapas:**

| Faixa | Ação | Condição de aprovação |
|---|---|---|
| 0–1s | Sala antes da cena | Geometria e mobiliário idênticos no quadro inteiro |
| 1–3s | Persiana começa a fechar | O tecido acompanha a esquadria; sombras e entrada de luz mudam de acordo |
| 3–4,5s | Luz geral desliga, perfil LED acende | Não aparecem novas luminárias; paredes e teto recebem os reflexos correspondentes |
| 4,5–6s | TV liga, soundbar é ativada | O conteúdo fica dentro da superfície exata da TV, sem segunda tela |
| 6–8s | Cena estabilizada | Quadro final utilizável como poster e comparação |

### Produção recomendada

1. **Asset-base correto:** fotografia ou render do living com a câmera fixa, geometria estável e superfícies sem deformações. Ideal: arquivo original SketchUp/Revit/Blender, quando disponível.
2. **IA de vídeo (Runway):** usar a imagem de referência, gerar *somente* a persiana descendo, preservando todos os demais elementos. Rejeitar resultados com paredes/telas deformadas.
3. **Composição (DaVinci Resolve Fusion):** criar máscaras separadas para janela/persiana, TV e iluminação. Corrigir o trajeto do tecido; aplicar luminância nas superfícies e reflexos.
4. **Se IA não preservar geometria:** animar a persiana e a iluminação em Blender, usando uma câmera correspondente à fotografia. Não publicar resultados distorcidos.
5. **Master e compressão:** exportar master com alta qualidade, depois MP4 H.264 com `+faststart`, `yuv420p`, AAC opcional. Usar ~1080p, 24/30fps e bit rate variável. Testar em redes móveis.
6. **Fotos do estado:** exportar `poster.webp`, `antes.webp` e `depois.webp` da mesma câmera. A comparação antes/depois só aparece no player quando houver duas imagens distintas e aprovadas.
7. **Catalogar:** anotar tipo de luz (ligar/desligar ou dimmer), percentual de persiana somente quando realmente suportado, e compatibilidade com dispositivos de cada projeto.

### Controle de qualidade visual

- Perspectiva e linhas arquitetônicas estáveis durante todo o filme.
- Bordas da TV, espelho, janela e esquadria sem oscilações visíveis.
- Luz e sombra coerentes com as lâmpadas e os circuitos disponíveis.
- Sem elementos novos (TV, pendente, spot) que não estejam no projeto real.
- Transição lenta o suficiente para ser percebida; último segundo estável.
- Compatibilidade entre estado audiovisual e capacidade técnica comprovada dos equipamentos.
- Legibilidade do player em iPhone/Android, retrato e paisagem.
- Consentimento, licenças e direitos de uso das imagens e do imóvel.

## Integração no produto

Arquivos sugeridos:

```text
assets/
  video/
    sc01-cinema.mp4
    sc01-cinema.webm
  sc01-cinema-poster.webp
  sc01-cinema-before.webp
  sc01-cinema-after.webp
  scene-media.json
```

No manifesto, editar somente cenas com mídia aprovada:

```json
"SC01": {
  "room": "living",
  "status": "aprovado",
  "mp4": "assets/video/sc01-cinema.mp4",
  "webm": "assets/video/sc01-cinema.webm",
  "poster": "assets/sc01-cinema-poster.webp",
  "before": "assets/sc01-cinema-before.webp",
  "after": "assets/sc01-cinema-after.webp"
}
```

**Nota:** `after` e `before` não devem ser cadastradas antes de produzidas. A versão 0.8 não inventa estados de iluminação na ausência dessas imagens.

### Pipeline de validação técnica do vídeo

```bash
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_name,width,height,pix_fmt \
  -of json assets/video/sc01-cinema.mp4
```

Executar os testes de interface. Publicar inicialmente no endereço de teste do GET LED CENAS; promover para clientes apenas após validação visual em celular físico.

## Produto escalável

- Biblioteca genérica: cenas ilustrativas com autorização de uso comercial.
- Biblioteca premium por cliente: mídias individuais armazenadas em ambiente com acesso autorizado, nunca em repositório público.
- Camada futura 3D: modelos glTF/GLB com câmera, iluminação, cortina, vídeo e áudio, renderizados em Three.js/WebXR quando a produção justificar.
