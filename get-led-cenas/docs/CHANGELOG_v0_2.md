# CHANGELOG — GET LED CENAS

## v0.2 — 21/11/2026

### Design
- Reestruturação total das páginas administrativa e pública.
- Nova hierarquia visual, componentes, navegação mobile e estados de interação.
- Fotografia de ambientação ilustrativa convertida em WebP otimizado e armazenada localmente.

### Painel
- Modelos de equipamento/ambiente (essencial, apartamento, premium).
- Busca de equipamentos e cenas compatíveis, seleção em massa e contadores.
- Rascunho local e invalidação de link antigo ao alterar configuração.
- Proteção básica contra inserção acidental de endereço/contato em título e apresentação públicos.

### Cliente
- Simulador visual com controles de estado, incluindo cortina e TV.
- Filtros, pesquisa, paginação incremental de seis cenas e indicadores de compatibilidade.
- Seleção preservada durante a sessão por formulário sem misturar projetos.
- Resumo e envio manual para o WhatsApp (11) 91864-5151.

### Testes
- Chromium/Playwright 390×844 e 1440×900: testes funcionais concluídos.
- Verificação de inexistência de vazamento do nome interno na URL gerada.
- Corrigida rolagem horizontal da faixa de categorias em telas pequenas.

### Segurança pendente de produto
- Backend + autenticação real de usuários Get Led.
- Links aleatórios, por documento publicado, revogáveis e auditáveis.
- Banco de dados privado, validação no servidor, versão e aceite de respostas.
- Painel real inacessível anonimamente, mecanismos antispam e retenção/consentimento.
