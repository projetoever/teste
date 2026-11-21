# Security & privacy — GET LED CENAS v0.2

Status: **somente demonstração**, NÃO adequado para cadastro de dados privados ou aprovação formal.

## Ameaças e limites atuais
1. Painel sem autenticação — publicar somente como demo com dados fictícios.
2. Fragmentos de URL em Base64URL — facilmente decodificáveis; não conter dados privados.
3. `localStorage` e `sessionStorage` estão no navegador e podem permanecer em dispositivo compartilhado.
4. Respostas são enviadas apenas via abertura manual de WhatsApp, sem garantia de recebimento ou protocolo.
5. Um link compartilhado pode ser alterado pelo próprio destinatário: a versão publicada precisa de identificador de servidor e assinatura/regras de autorização.
6. A simulação não comunica com Smart Life, Alexa ou qualquer equipamento instalado.

## Gate para produção (v1.0)
- Login administrativo via identidade autenticada, MFA quando disponível.
- Acesso por organização e usuário com autorização aplicada no servidor.
- Tabelas internas separadas das representações públicas e logs com redacção de dados.
- Link de acesso com token aleatório, alta entropia, validade opcional e revogação.
- Respostas com autorização explícita, versionamento de cena e trilha de auditoria.
- Rate limiting e spam protection sem bloquear uso legítimo mobile.
- Revisão de LGPD, política de retenção e base legal para dados armazenados.
- HTTPS, cabeçalhos de segurança, CSP compatível com os assets e monitoramento.
- Mapeamento técnico interno Smart Life/Alexa nunca exposto em material público.
