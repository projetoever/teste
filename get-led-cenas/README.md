# GET LED CENAS

**Experiências sob medida, em um toque.**

Produto digital da Get Led para configurar catálogos de cenas inteligentes por residência e permitir que cada cliente explore, selecione e sugira experiências de automação — sobretudo pelo celular.

## Estado: protótipo público demonstrativo v0.1

- **Painel de demonstração (`index.html`)**: título público, identificação interna local, 25 categorias de equipamentos, 16 ambientes, 30 cenas-base, prévia compatível, geração de link e preparação de mensagem para o WhatsApp da Ponte One: **(11) 91864-5151**.
- **Formulário do cliente (`formulario.html`)**: sem dados privados, cenas filtradas, simulação visual ilustrativa, seleção de experiências, campo de observações e resumo para WhatsApp.
- **Persistência neste protótipo**: rascunho do painel somente no `localStorage`. O link contém **somente** configuração pública, codificada mas **não criptografada**. Envio de respostas: abre o WhatsApp; **não existe banco de dados, aceite eletrônico juridicamente formal ou recebimento silencioso de dados**.
- **Projeto-piloto**: Família Wolf, mas o produto é Genérico/Get Led. A vinculação com um cliente real acontecerá apenas no painel futuro com autenticação.

## Executar localmente

Servir a pasta em HTTP local (evitar `file://` em navegadores que restringem recursos):

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080`. O formulário de amostra está em `/formulario.html`.

## Estrutura

- `index.html`, `painel.js` — demonstração de criação de formulário
- `formulario.html`, `formulario.js` — experiência pública do morador
- `data.js` — biblioteca de recursos, ambientes e cenas
- `style.css`, `assets/logo.svg` — identidade visual
- `docs/PLANO_MESTRE.md` — arquitetura de produto e roadmap
- `docs/SEGURANCA.md` — regras mínimas antes de disponibilizar o painel real
- `docs/MODELO_DE_DADOS.sql` — esquema de referência para implementação futura
- `test_ui.py` — roteiro de testes para Playwright (exige ambiente com navegador Chromium)

## Limites importantes

1. **Não divulgar o painel demonstrativo como painel seguro**. Não há autenticação, autorização por usuário ou registro persistente no servidor.
2. Não inserir dados de identificação de pessoas, endereço exato, plantas, IDs de dispositivos, câmeras, códigos IR/RF, senhas ou token no link público.
3. O hash da URL é legível por quem possui o link, portanto não é proteção de dados.
4. As simulações são **didáticas**; não acionam dispositivos Smart Life, Alexa, Zigbee ou RF.
5. Para a versão comercial, implementar backend com controle de acesso, links aleatórios por formulário, versionamento, expiração/revogação e proteção antispam, conforme o plano mestre.

## Branding

**Nome:** GET LED CENAS  
**Tagline:** Experiências sob medida, em um toque.  
**Arquitetura de marca:** Get Led (empresa) → Get Led Cenas (produto) → Coleções personalizadas (cliente).  
**Paleta:** grafite `#081116`, azul-petróleo `#12222A`, turquesa `#64E2D7`, dourado suave `#E5C18C`, branco `#F7F7F3`.

## Direitos e confidencialidade

Arte vetorial original do produto, catálogo de demonstração sem marcas de terceiros e sem credenciais. Reservar o repositório de produção como **privado** durante o desenvolvimento, salvo decisão expressa em contrário.
