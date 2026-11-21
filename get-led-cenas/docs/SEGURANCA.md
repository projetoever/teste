# Segurança e privacidade — GET LED CENAS

## O que o protótipo atual **não** oferece

Sem login, banco de dados, gerenciamento real de clientes, persistência de respostas no servidor, aceite juridicamente formal, revisão de tokens, trilha de auditoria, criptografia ou rate limiting. **Não é pronto para produção.** Links gerados usam base64 URL-safe para permitir demonstração: base64 não é criptografia nem mecanismo de acesso restrito.

## Segurança obrigatória antes de abrir para clientes reais

1. Painel administrativo protegido por Supabase Auth e checagem de papel/empresa no servidor.
2. RLS e segregação de empresas/clientes. Testes negativos para impedir que operador de outra equipe consulte ou edite dados.
3. Nunca consultar diretamente tabelas internas do formulário a partir de links públicos. Usar endpoint que retorna DTO mínimo e valida token, expiração, status e limite de requisições.
4. Gerar token aleatório seguro com no mínimo 128 bits. Persistir hash, nunca texto do token, e não colocar e-mail, CPF, telefone, endereço, nome completo, ID sequencial ou equipamentos internos no link.
5. Respostas registradas com identificador anônimo do formulário, consentimento adequado e retenção definida. Salvar somente o necessário à escolha de cenas.
6. Proteger endpoint de envio contra spam, carga excessiva e dados inválidos; inserir proteção CSRF quando aplicável.
7. Segredos de integração exclusivamente em ambiente de servidor. Sem `service_role` no frontend.
8. Audit log de criação, edição, publicação, revogação, leitura administrativa e aprovação.
9. Configurar `Cache-Control: no-store` em dados sensíveis; reduzir exposição a motores de busca, analytics, logs e links de referência.
10. Garantir possibilidade de revogar link, anonimizar/excluir respostas e exportar histórico administrativo.
11. Verificar segurança antes da publicação externa, com revisão das permissões da Vercel e do banco.
12. Nunca controlar dispositivos reais por este site de marketing/seleção na fase inicial.

## Cuidados com marketing e imagens

Fotografias internas, logos de terceiros, voz e depoimentos precisam de autorização para o propósito e canal de uso. O material público não mostrará planta técnica, localização exata da unidade ou horários de ausência.
