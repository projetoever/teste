# GET LED CENAS — Ponto de retomada obrigatório

**Documento vivo e canônico no Google Drive:** https://docs.google.com/document/d/1SWyAmvwI_ehZXbuUtpmcY5BFGl1Ssfk4cSoa9nlvL10/edit

## Início de cada novo chat

1. Ler o documento acima do início ao fim, principalmente as seções **STATUS**, **BACKLOG** e **RETOMADA IMEDIATA**.
2. Consultar o branch `main` de `projetoever/teste`, diretório `get-led-cenas`, incluindo `docs/PLANO_MESTRE.md`, `docs/MODELO_MESTRE_v1_3.md`, `assets/scene-media.json` e os manifests dos vídeos.
3. Conferir último deploy Vercel `get-led-cenas-v03-lab`; conferir o status real do workflow de render v1.4 antes de alterar arquivos.
4. Continuar **as pendências exatas**, sem renomear indiscriminadamente cenas e microefeitos.
5. Ao finalizar o chat, atualizar o Google Doc com commits, imagens, MP4, links, bugs, critérios de QA, resultados de teste e próxima ação precisa. Atualizar esta nota somente se o URL canônico mudar.

## Decisões permanentes

- Produto comercial: **catálogo de cenas filtradas por cômodo/capacidade**, não plataforma de geração de vídeo.
- Cena comercial SC01 = Cinema em Casa; microefeito ME01 = persiana, ME04 = perfis LED, ME06 = TV. Não confundir com rótulos técnicos v1.2.
- Vídeos técnicos **não homologados** devem continuar claramente rotulados.
- `GLC-LIVING-001` é a sala-mestre genérica; preservar câmera, móveis, arquitetura.
- Novos rendimentos em pasta versionada (`v14`, `v15` etc.); jamais sobrescrever v12 sem decisão explícita.
- Não enviar dados de cliente Wolf ao site público.
- Fase atual: correção de efeitos e primeiro catálogo piloto; backoffice autenticado somente após as cenas prioritárias.

## Links

- GitHub: https://github.com/projetoever/teste/tree/main/get-led-cenas
- Catálogo/site: https://get-led-cenas-v03-lab.vercel.app/
- Showroom: https://get-led-cenas-v03-lab.vercel.app/showroom.html
- Workflow técnico v1.4: https://github.com/projetoever/teste/actions/workflows/get-led-cenas-render-v14.yml

**Regra operacional:** o roadmap não é uma promessa de autonomia ou atualização em segundo plano. Registrar sua versão e handoff ao concluir cada sessão que trabalhe no projeto.
