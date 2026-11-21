# Segurança e privacidade — GET LED CENAS v0.3

## Estado atual: somente demonstração pública
- Painel sem autenticação: qualquer visitante vê o mesmo código, mas não o histórico de outro navegador.
- Histórico de formulários em `localStorage`: disponível somente no navegador e perfil em que foi criado, não sincronizado e não recuperável após limpeza de dados.
- O link público contém configurações Base64URL: **não é criptografia**. Não incluir dados pessoais, instruções de acesso, endereço, planta, SSIDs, senhas ou dados de equipamentos.
- Os links não são realmente revogáveis: excluir da lista local não desativa endereços compartilhados.
- Respostas e cenas personalizadas são armazenadas somente no dispositivo e exigem envio voluntário por WhatsApp. Não existe trilha de aprovação.
- O formulário não usa dados sensíveis, localização exata nem integra Smart Life, Alexa ou API de automação.

## Requisitos para lançamento comercial
1. Controle de acesso e MFA para equipe Get Led.
2. Backend privado e armazenamento isolado por cliente, com auditoria e permissão por projeto.
3. IDs aleatórios de formulários, prazo de validade, revogação e limitação de tentativas.
4. Validação de dados no servidor, proteção anti-XSS/CSRF, rate limiting e monitoramento.
5. Política de retenção, exportação e exclusão de dados, aviso de privacidade e consentimento aplicável.
6. Aprovação versionada do cliente, confirmação de identidade e histórico de modificações.
