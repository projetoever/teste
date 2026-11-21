# PLANO MESTRE — GET LED CENAS

Data: 21/11/2026. Estado: concepção validada em protótipo e arquitetura preliminar. Piloto: Família Wolf.

## 1. Objetivo

Transformar o catálogo WOLF em um produto independente, multi-cliente, com duas experiências: **Backoffice Get Led** e **Catálogo Digital do Morador**. O produto vende experiência, não detalhes de engenharia, e serve como etapa formal anterior à programação Smart Life/Alexa.

## 2. Jornada do operador Get Led

1. Acessar painel privado com autenticação.
2. Criar cliente interno e projeto; nome interno **nunca é serializado na URL**.
3. Definir título público genérico, cores/identidade opcional e texto de boas-vindas.
4. Selecionar tipos de equipamento existentes (iluminação, ar, TV, áudio, robô aspirador, sensores, fechadura, portão, cortina, etc.).
5. Selecionar cômodos do imóvel. Futura etapa: cadastrar cômodos personalizados.
6. Obter sugestões automáticas filtradas. Editar o conjunto antes de publicar; habilitar ou bloquear cenas individualmente; classificar em essencial/premium.
7. Publicar versão **imutável** do formulário com link público aleatório, prazo de expiração e opção de revogação.
8. Enviar pelo WhatsApp Ponte One (11) 91864-5151 ou copiar link.
9. Receber respostas no painel, revisar observações e marcar estado: recebido, em análise, aprovado, programado, testado, entregue.
10. Vincular aprovação ao memorial técnico interno, sem jamais expor o memorial no link público.

## 3. Jornada do cliente (mobile-first)

- Link com identidade Get Led e nome **público** opcional da coleção (não inserir endereço/unidade, sobrenome completo ou dados sensíveis por padrão).
- Navegar por experiências e cômodos; cada cena traz objetivo, equipamento necessário, prévia visual e personalização fácil.
- Comparar **antes/depois**, visualizar alterações ilustrativas na luz/persiana/TV sem acionamento remoto.
- Escolher cenas em um toque; informar preferências **opcionais** sem solicitar dados desnecessários.
- Revisar resumo, confirmar envio e receber referência da solicitação; mensagem de WhatsApp apenas como conveniência, sem exposição de tokens.
- Tela acessível em celular e desktop com contraste, linguagem objetiva, navegação por teclado, movimento reduzido e imagens otimizadas.

## 4. Filtragem — regra de negócio

**Critério:** apresentar cena somente se `required_capabilities ⊆ equipamentos habilitados` **E** algum cômodo compatível estiver configurado (ou cena global, sem cômodo obrigatório). Recursos opcionais enriquecem a descrição, não desclassificam.

Exemplos:
- TV + luz + sala → Cinema. Sem TV → não exibir cena Cinema.
- Robô aspirador → Casa Limpa. Sem robô → não exibir.
- Blackout + quarto + luz → Despertar em Etapas.
- Sensor de movimento + luz → Luz por Movimento (sempre com segurança operacional).
- Cena Jantar só aparece com sala de jantar, living ou área gourmet e iluminação.

O resultado é uma **sugestão comercial**, não comprovação de compatibilidade real (código IR/RF, estado, dimmer, cenas Alexa, drivers LED).

## 5. Biblioteca do produto

Biblioteca inicial: 30 cenas-base com identificadores SC01–SC30; 25 grupos de equipamentos; 16 tipos de cômodo. O piloto WOLF é uma instância de teste do catálogo, não define o produto.

Campos de cena: `id`, `nome`, `categoria`, `benefício`, `resumo comercial`, `required_capabilities`, `optional_capabilities`, `room_types`, `visual_recipe`, `technical_constraints`, `estimated_complexity`, `version`, `published`.

## 6. Arquitetura recomendada para a versão comercial

- **Front-end:** Next.js/TypeScript (App Router) ou stack web equivalente com design system Get Led, responsiva e acessível.
- **Hospedagem:** Vercel, em projeto separado do site WOLF anterior.
- **Autenticação e banco:** Supabase Auth + Postgres com RLS, e uma camada servidor que centralize autorização e devolva exclusivamente os campos públicos do formulário.
- **Admin:** autenticação obrigatória, privilégios de operador, clientes isolados, trilha de auditoria e revogação de acessos.
- **Link:** `/c/{token-aleatorio}`; token secreto de acesso ao formulário **não contém cadastro**; o servidor procura o formulário pela versão/token e retorna DTO público mínimo.
- **Publicação:** coleção de cenas congelada por versão; revogar/republicar gera novo token.
- **Respostas:** gravar no backend com validação e limite de requisições, registrar consentimento de envio de preferências e produzir um identificador de referência.
- **Integrações:** WhatsApp como entrega/atalho; no futuro API empresarial com opt-in e conformidade. Smart Life e Alexa não são controlados pelo catálogo v1.
- **Mídias:** imagens ilustrativas licenciadas ou produzidas pela Get Led; futura galeria de fotos reais autorizadas.

## 7. Privacidade e segurança

Nunca incluir no DTO público: nome completo do cliente, endereço/unidade, dados financeiros, plantas elétricas, MACs, IPs, SSIDs, senhas, IDs internos, códigos de dispositivos, conta Alexa/Smart Life, horário de ausência, imagens de câmeras.

Painel fechado; autorização em **cada ação de API**, não só na interface. Serviços privilegiados somente no servidor. Rate limiting por link/IP, anti-abuso e validação de todas as entradas; logs sem dados pessoais desnecessários. Tokens aleatórios com no mínimo 128 bits de entropia, armazenados em hash. Estabelecer prazo de retenção e exclusão.

## 8. Simulações e identidade visual

Produto: **GET LED CENAS**. Tagline: **Experiências sob medida, em um toque.**
Cores: grafite, azul petróleo, turquesa luminosa e dourado discreto. Símbolo de camadas/luz, linhas limpas e aparência tecnológica premium. Evitar excesso de efeitos que aumentem peso no 4G.

MVP: ilustração vetorial responsiva com controles antes/depois e mudança de luz, blackout e tela. Etapa futura: render fotorrealista, fotos de cada cliente autorizadas, animações temporizadas e vídeos demonstrativos leves.

## 9. Documentação e fluxo Get Led

Material comercial público: apenas cenas, benefícios, simulações e preferências. Material técnico privado: cadastro de IDs, plantas, canal de cada botão, roteadores, controladores, cenas executadas, testes e revisões.

A resposta do cliente gera uma tarefa interna: `selecionado → viabilidade → orçamento/aditivo quando necessário → programado → testado → aprovado → entregue`. Nenhuma seleção implica instalação sem validação e aprovação contratual.

## 10. Fases

**Fase 0 — Feito (protótipo v0.1):** identidade, catálogo filtrado, painel demonstrativo, formulário público demonstrativo, mobile + desktop, visualização 2D simples, geração de link sem identificadores internos, WhatsApp Ponte One.

**Fase 1 — Próxima:** painel real com login; banco multi-cliente; formulários persistidos; tokens públicos revogáveis; respostas persistidas; trilha de status; deploy de preview protegido e testes de segurança.

**Fase 2:** editor de cenas, categorias, texto, preço/complexidade opcional, importação/exportação, relatórios PDF internos e lembretes de aprovação.

**Fase 3:** novas simulações, animações cinematográficas, tours por cômodo e cenários progressivos; uso de foto real só com autorização do proprietário.

**Fase 4:** painel de suporte, cenas implementadas, biblioteca de projetos, catálogo replicável em múltiplas equipes/parceiros Get Led.

## 11. Indicadores para piloto

Taxa de abertura do link (sem rastreamento intrusivo), cenas visualizadas e selecionadas, taxa de envio, aprovação, tempo até programação, retrabalho por incompatibilidade e satisfação pós-entrega.

## 12. Fontes de referência

- Next.js, autenticação e autorização: https://nextjs.org/docs/app/guides/authentication
- Next.js, segurança de dados: https://nextjs.org/docs/app/guides/data-security
- Supabase, Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- OWASP, Broken Access Control: https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/
- OWASP, IDOR: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
- Vercel, proteção de deployments: https://vercel.com/docs/deployment-protection
