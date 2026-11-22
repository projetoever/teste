# GET LED CENAS — Video Factory 0.1

Sistema piloto para produzir, revisar e preparar mídias cinematográficas de automação residencial. A ferramenta **não controla dispositivos** e **não gera vídeo artificialmente por conta própria**: conecta-se à fal/PixVerse V6 quando autorizado, recebe os resultados, arquiva, valida e permite integrar clips aprovados no player GET LED CENAS v0.8.

## Situação da execução

- Configuração e prompts: preparados.
- Referências visuais: duas imagens ilustrativas do projeto GET LED CENAS, convertidas para 16:9.
- Validação gratuita (`plan`/`generate` sem `--execute`): executada.
- Filmes profissionais por IA: **não foram gerados nesta sessão**, porque a fal não está conectada e não existe uma credencial da conta autorizada.
- Qualquer mídia gerada entra como **pendente de revisão visual**, nunca é publicada automaticamente.

## Fluxo mínimo para um operador

1. Conectar a conta fal via ChatGPT, ou criar uma chave de API na conta fal e configurá-la **somente em variável de ambiente do servidor/terminal**, nunca no chat ou repositório.
2. Escolher SC01_BLIND_PILOT como primeiro teste (persiana descendo), usando `inputs/sala_base_16x9.jpg`.
3. Depois gerar SC01_TV_PILOT, SC03_DINING_PILOT e SC04_RECEIVE_PILOT em lotes pequenos.
4. Revisar se os quadros mantêm a mesma geometria, sem TV duplicada, persiana atravessando esquadria ou LED inventado.
5. Se aprovado, completar a pós-produção precisa em DaVinci Resolve/Fusion para integrar movimentos em um vídeo final de 6–8 segundos por cena.
6. Aprovar manualmente, otimizar para celular e integrar no `scene-media.json` do GET LED CENAS, armazenando as mídias aprovadas.

## Comandos

```bash
python factory.py plan
python factory.py generate --ids SC01_BLIND_PILOT SC03_DINING_PILOT
pip install -r requirements.txt
# Configure a FAL_KEY em um gerenciador de segredos ou variável ambiente local; nunca publique.
python factory.py generate --ids SC01_BLIND_PILOT --execute --max-jobs 1
python factory.py contact-sheet SC01_BLIND_PILOT
python factory.py approve SC01_BLIND_PILOT --reviewer "GET LED" --note "Geometria estável, movimento revisado quadro a quadro"
python factory.py stage SC01 SC01_BLIND_PILOT
```

O último comando apenas gera um pacote local `output/ready_for_review` com MP4 otimizado e manifesto; **não publica** o conteúdo. Para a SC01, o vídeo de persiana isolada é somente um teste técnico. O catálogo comercial deverá usar **um filme composto completo**, não três trechos técnicos desconectados.

## Convenção de biblioteca

`SC01` Cinema em Casa: janela/persiana -> luz -> TV/audio (componentes gerados e pós-produzidos separadamente).  
`SC03` Jantar Especial: pendentes e iluminação decorativa em uma cena consistente.  
`SC04` Receber Visitas: acolhimento e perfis de LED existentes.

## Segurança e operação

- **Chaves nunca no código do frontend**.
- Os vídeos gerados são de referência arquitetônica, não representam execução real da casa do cliente.
- Revisão humana obrigatória para aprovar qualidade e compatibilidade técnica.
- Não usar imagens reais do cliente sem direitos de uso/consentimento.
- Os links temporários de geração devem ser baixados e arquivados; não usá-los como hosting final.
- O `output/` é ignorado pelo GitHub. Não enviar imagens privativas do Wolf para o repositório público.

## Integração recomendada para operação contínua

Painel privado Get Led (auth) -> upload de asset autorizado -> geração fal em fila -> webhook verificado -> storage privado -> revisão -> publicação controlada do player. Controle de custos com limites por job e por cliente. Para implementar o backend, usar Vercel Functions + banco relacional + object storage; uploads e webhooks protegidos, sem credenciais no navegador.

## Referências técnicas verificadas

- PixVerse V6 / fal: https://fal.ai/models/fal-ai/pixverse/v6/image-to-video/api
- PixVerse V6 Max / fal: https://fal.ai/models/pixverse/v6/max/image-to-video/api
- API PixVerse: https://docs.platform.pixverse.ai/start-here-2394989m0
- fal SDK Python: https://fal.ai/learn/tools/how-to-generate-ai-videos-with-an-api
