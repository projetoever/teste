# GET LED CENAS — Video Lab v0.9

Laboratório demonstrativo para escolher cena/equipamento, comparar motores de vídeo, estimar o custo de uma tentativa, exportar uma tarefa técnica e revisar vídeos gerados **localmente**.

## Primeira operação

**Persiana do Living — SC01**. Roteiro preparado; falta o quadro final em perspectiva correta e autorização do provedor. A publicação fica bloqueada até aprovação técnica e de direitos.

## Acesso

- `index.html`: painel de criação de formulários (ainda demonstrativo).
- `formulario.html`: catálogo público mobile-first com player MP4/WebM.
- `video-lab.html`: comparador de produção e revisão local. É **somente demonstrativo**; nunca inserir chaves ou dados privados.
- `docs/ROADMAP_MASTER.md`: estado, responsabilidades, critérios de aprovação e etapas.
- `docs/IDEIA_PARA_COMANDO.md`: padrão para converter ideias textuais do usuário em tickets e prompts executáveis.
- `docs/PILOTO_SC01_PERSIANA.md`: sequência exata de preparação e produção.
- `video-factory/adapters.py`: adaptação segura de jobs normalizados aos esquemas de quatro motores (nenhuma requisição de rede).

## Motores em comparação

1. PixVerse V6 Transition 720p 5s, quadros inicial/final, US$ 0,225 estimados.
2. Veo 3.1 Fast 720p **6s**, quadros inicial/final, US$ 0,60 estimados.
3. Kling 4.0 720p 5s, quadros inicial/final, US$ 0,785 estimados.

O PixVerse V6 convencional (somente imagem inicial) serve para rascunho, mas não é o fluxo preferido para homologar movimentos de precisão.

## Segurança e credenciais

Nenhuma chave secreta deve aparecer no site, no GitHub ou nos arquivos enviados pelo cliente. Produção real deve ocorrer por API protegida, respeitando custo aprovado e identidade do usuário autorizado. O laboratório não executa geração paga e não publica resultados diretamente.

## Testes

- `python get_led_cenas_v09/test_video_lab_v09.py` testa UI nos modos mobile, paisagem e desktop (Chromium).
- `cd get_led_cenas_v09/video-factory && python -m unittest test_adapters.py` verifica preflight de dados e payloads.
- Resultado em `QA_VIDEO_LAB_v09.json`.

## Histórico

Veja `CHANGELOG.md` e `docs/DECISOES_2026-11-22.md`.
