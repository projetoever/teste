# GET LED CENAS — Studio v1.0 (Modelo Mestre + SC01 Persiana)

Esta versão integra o primeiro vídeo técnico gratuito ao showroom e ao catálogo. O vídeo é **procedural 2.5D, não gerado no PixVerse** e **não homologado para uso como render arquitetônico**.

## Endereços
- `showroom.html`: demonstração direta da persiana com controles mobile-first.
- `formulario.html`: catálogo original com SC01 em vídeo demonstrativo técnico.
- `video-lab.html`: laboratório de roteiros, QA e acesso ao primeiro piloto.

## Arquivos e governança
- `docs/PLANO_MESTRE_v1_0.md`: documento central atualizado.
- `docs/MODELO_MESTRE_SALA.md`: especificação de equipamentos e capacidades.
- `docs/SC01_PIXVERSE_PROMPT.md`: instruções e prompts do próximo teste IA.
- `render_blind_pilot.py`: render determinístico para validação de produto, não material final.
- `assets/rooms/living-model`: quadros inicial e final e manifesto técnico.
- `assets/video/GLC_SC01_BLIND_TECHNICAL_V01.mp4`: demo 5s, 720p H.264, sem som.

**Privacidade:** nenhum dado de cliente real no código público. **Segurança:** não carregar chaves no browser. **Produção:** geração real via PixVerse Web requer operação autorizada da conta; API paga é projeto futuro.

## Estado atual v1.1
- `showroom.html`: laboratório de refino dos efeitos com camadas visuais e presets
- `assets/rooms/living-model/`: ambiente-base e estados de referência da persiana
- `video-lab.html`: fábrica para preparar prompts e pipeline de vídeos homologados
- `docs/ROADMAP_MASTER.md`: norte de evolução do produto

## Rotina recomendada
1. aprovar visualmente cada microefeito no `showroom.html`;
2. congelar quadro inicial e final;
3. gerar vídeo premium no motor externo;
4. integrar mídia aprovada ao catálogo público.


## v1.2 — Efeitos geométricos (fotos e MP4)
Abra `showroom.html` para assistir às 6 simulações técnicas. O navegador reproduz `assets/video/v12/*.mp4` e mostra os estados antes/depois preservados em `assets/rooms/living-model/v12/`. `render_effects_v12.py` reconstrói todos os arquivos em uma máquina com Python, OpenCV, Pillow, numpy e ffmpeg. Não requer API ou credenciais. `test_showroom_v12.py` cobre o player localmente em três tamanhos de tela sem acessar servidores externos. Para avaliação humana do resultado, consulte `preview_effects_v12.jpg` e `docs/QUALIDADE_V12.md`.
