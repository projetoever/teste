# Handoff ao Work — PixVerse Web / piloto SC01

Objetivo: produzir **uma geração** de transição 5 segundos no PixVerse Web, com câmera fixa e persiana descendo, utilizando os dois keyframes da Get Led. Não criar cadastro, não alterar pagamento/assinatura e não aprovar gastos extras automaticamente.

## Preparação

- Abrir a conta PixVerse que o usuário já possui **na sessão autenticada do navegador do Work**, após autorização explícita do usuário; não pedir senha ou token no chat.
- Obter de Drive ou upload do usuário: `GLC_LIVING_BASE_001.png` e `GLC_LIVING_SC01_BLIND_CLOSED_001.png`.
- Abrir `docs/SC01_PIXVERSE_PROMPT.md` e copiar prompt e negative prompt.
- Registrar o preço exibido em créditos antes de criar. Se ultrapassar os créditos gratuitos disponíveis, **não executar** sem aprovação explícita.

## Operação

1. Selecionar vídeo por primeiro/último quadro, PixVerse V6 quando disponível.
2. Carregar início e fim na ordem correta.
3. Fixar 16:9, 5 segundos, sem áudio; escolher 540p/720p conforme créditos e disponibilidade.
4. Conferir prévia de imagem no painel; confirmar que quadros são do mesmo ambiente.
5. Executar uma única geração dentro dos créditos autorizados.
6. Baixar MP4 e registrar nome, resolução, fps, duração, créditos usados, timestamp e motor.
7. Fazer revisão de QA 85/100: janela e sofá não podem deformar. Não republicar automaticamente nem aprovar se houver falhas.
8. Entregar MP4 + screenshots + relatório QA no Drive da pasta `v1_0_Modelo_Mestre_Sala_e_Piloto_SC01`, mantendo o resultado pendente de aprovação manual.

## Guardrails

- Não publicar mídia bruta em links públicos ou no repositório por padrão.
- Não habilitar assinatura, recargas ou pagamento.
- Não expor credenciais em logs, repositórios ou captura de tela.
- Não usar dados da Família Wolf; os arquivos são de um apartamento genérico criado para o catálogo.
