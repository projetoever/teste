# GET LED CENAS — Studio v0.8

## O que mudou

O protótipo passou a usar **player audiovisual nativo** em vez de criar TV, persiana, pendentes e perfis LED sobre a fotografia com SVG/CSS.

- Showroom em tela cheia, com navegação anterior/próxima e lista de cenas.
- HUD com auto-ocultação, retorno por toque, gestos laterais e rolagem otimizada para mobile e desktop.
- Reprodutor HTML5 com MP4 e WebM, pré-carregamento por cena e barra de progresso.
- Cada cena possui manifesto de mídia independente; somente mídias `status: "aprovado"` são reproduzidas.
- Quando o vídeo não está pronto, mostra a foto intacta e aviso **"Vídeo em produção"**, sem falsificar equipamentos e sem botões de vídeo funcionais.
- Preservados o catálogo filtrado por equipamentos, escolha de cenas, cenas personalizadas e envio via WhatsApp.
- Renderização de fotos e vídeos sem a perda de perspectiva provocada pela camada SVG antiga.

## Como testar

Abrir `index.html` para configurar um formulário, ou `formulario.html` para o modo público demonstrativo. Testar no celular em paisagem, usando o botão `Tela cheia`. O player pode solicitar o próximo vídeo via lista de cenas, mas **não há vídeos finais publicados nesta versão**.

Para QA, executar `python test_v08.py` e `python test_video_integration.py`, que verificam o fallback e a reprodução de MP4 com um arquivo **sintético temporário, não distribuído**.

## Como adicionar um vídeo aprovado

1. Exportar a animação do ambiente com máscara e movimentos precisos em Runway + DaVinci Fusion, Blender ou equivalente.
2. Conferir direitos de uso de imagens e vídeo; nenhum nome, endereço, ID, credencial ou imagem privada do cliente pode entrar no pacote genérico.
3. Salvar `assets/video/sc01-cinema.mp4` (H.264, yuv420p, faststart). WebM opcional.
4. Editar `assets/scene-media.json`, associando o caminho e mudando a cena para `"status":"aprovado"`.
5. Rodar QA, criar um commit e publicar no projeto de teste da Vercel.

**Atenção:** o painel atual não possui autenticação, banco de dados nem revogação de links. Não é um painel administrativo seguro para dados reais.

Veja `docs/GUIA_PRODUCAO_VIDEO.md` para o pipeline audiovisual e os critérios de qualidade.
