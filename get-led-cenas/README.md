# GET LED CENAS — Studio v0.3 (21/11/2026)

Produto digital demonstrativo mobile-first da Get Led. Uma ferramenta de curadoria comercial e visual de cenas de automação residencial. O piloto inicial é interno; **os arquivos públicos são genéricos e não incluem nomes ou dados dos clientes**.

## Novidades v0.3

- **Experiência mobile:** carrossel horizontal com foto ilustrativa por ambiente, navegação por arrastar e botões, contador e visualização em tela cheia.
- **Simulador:** sala de referência com TV, soundbar, pendentes, perfil LED no teto e persiana/blackout. Variações ilustrativas de luz, vídeo e persiana, com antes/depois; conceito simplificado para suíte e banheiro.
- **Personalização:** campo para uma cena inédita com nome, ambiente e descrição, incluída no resumo/WhatsApp. Pode ser a única escolha enviada.
- **Painel Get Led:** histórico de até 50 formulários gerados com referência interna, título público, data, contagem de cenas, copiar, abrir, compartilhar e excluir registro local. Buscas por referência/título.
- **Compatibilidade:** preservados 25 tipos de equipamentos, 16 ambientes e 30 cenas-base com filtragem.
- **Interface:** sombras, margens, responsividade, carrossel com scroll-snap, teclado e preferência de movimento reduzido.

## Arquivos

- `index.html`, `painel.js`: painel demonstrativo (não autenticado)
- `formulario.html`, `formulario.js`: experiência do cliente (com seleção e customização)
- `common.js`, `data.js`: catálogo e verificador de elegibilidade
- `style.css`, `style-v03.css`: estilo premium responsivo
- `assets/sala-premium.webp`, `assets/jantar-premium.webp`: renderizações ilustrativas da Get Led
- `assets/quarto-conceito.svg`, `assets/banheiro-conceito.svg`: imagens esquemáticas conceituais (não são fotos)
- `assets/living.webp`, `assets/living-noite.webp`, `assets/logo.svg`: identidade e alternativas

### Limitações e segurança

**NÃO HÁ LOGIN, BASE DE DADOS OU APROVAÇÃO FORMAL.** Os links são configurados em Base64URL no hash e não representam credencial segura. O histórico é mantido somente por `localStorage` no navegador específico do operador e se perde se os dados do site forem limpos. As respostas não ficam sincronizadas entre dispositivos; só são enviadas quando a pessoa confirma a mensagem no WhatsApp. Não cadastrar dados sensíveis ou dados reais de clientes no painel demonstrativo.

As imagens são ilustrativas. O simulador não liga equipamentos e não garante qualquer controle de estado real. A elegibilidade considera dispositivos gerais e ambientes selecionados, não verifica circuito por cômodo; a Get Led valida comandos e cargas ao programar.

**Próxima fase para uso comercial:** autenticação do painel, multiusuário, projetos privados, banco de dados com RLS, APIs com autorização, formulários públicos de IDs aleatórios revogáveis, respostas persistentes e versionamento de catálogos e aceite.

## Execução

Servir a pasta como site estático HTTPS (`index.html` e `formulario.html`), sem build ou dependências NPM. Para rodar localmente: `python -m http.server 8080` dentro da pasta. Testes de interface com Chromium Playwright em `test_v03.py` (a rotina de screenshots usa substituição das imagens por data URI ao testar ambiente isolado).
