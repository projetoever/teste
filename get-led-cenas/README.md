# GET LED CENAS — Studio v0.2

**Experiências sob medida, em um toque.**

Protótipo mobile-first de uma ferramenta de criação de catálogos de cenas inteligentes por imóvel. A Get Led seleciona os recursos e ambientes; o cliente explora uma experiência visual, escolhe as cenas e encaminha um resumo pelo WhatsApp da Ponte One (11) 91864-5151.

## Novidades da v0.2 — 21/11/2026

- Nova interface premium Get Led em grafite, turquesa e dourado suave.
- Painel Get Led com modelos **Casa essencial**, **Apartamento completo** e **Residência premium**.
- Busca entre **25 categorias de equipamentos**, **16 ambientes** selecionáveis e prévia das **30 cenas-base**.
- Cálculo instantâneo de compatibilidade por equipamentos obrigatórios e ambiente.
- Link de demonstração com configuração pública, sem identificação interna do projeto.
- Formulário mobile: hero arquitetônico ilustrativo, seis cartões iniciais, **busca de cenas**, filtros e carregamento progressivo.
- Simulador de luz/TV/persiana apenas **visual**, com alternância Antes/Depois.
- Seleção mantida temporariamente na aba do cliente (`sessionStorage`) e envio assistido por WhatsApp, sem backend.
- Correções de layout responsivo, estados de botão, controles de teclado e validação mais rígida do payload.

## Como executar

Basta servir esta pasta em um servidor estático HTTPS. Por exemplo:

```bash
python -m http.server 8080
```

- `/index.html` — painel demonstrativo Get Led
- `/formulario.html` — experiência de demonstração do morador

Sem build, sem banco, sem dependências NPM. Os arquivos são `HTML`, `CSS`, `JS` e um WebP local. O navegador pode buscar tipografia de provedores externos; caso indisponível, há fallback de sistema.

## Arquitetura dos arquivos

```
index.html             painel demonstrativo
painel.js              configuração, modelos, filtros e geração do link
formulario.html        experiência mobile-first do cliente
formulario.js          simulador, filtros, busca, seleção e WhatsApp
common.js              codificação de configuração e regras de compatibilidade
data.js                catálogo padrão — 25 equipamentos, 16 ambientes, 30 cenas
style.css              tokens e layouts responsivos
assets/logo.svg        identidade visual
assets/living.webp     render ilustrativo recortado sem identificação residencial
README.md              orientação técnica
CHANGELOG.md           mudanças e testes
SECURITY.md            limites do protótipo e requisitos para produção
```

## Segurança: condição obrigatória antes de uso com dados reais

**O painel de demonstração NÃO tem login.** O código dessa v0.2 é apenas para avaliação e não deve ser apresentado como área administrativa segura. Não registrar informações privadas, endereços, rotinas detalhadas de ausência, plantas elétricas, tokens Smart Life, senhas ou informações pessoais.

O fragmento `#p=` do link contém texto de apresentação, equipamentos e ambientes codificados em Base64URL. **Não é criptografado.** A versão comercial precisa usar API autenticada para o painel, formulários publicados em URLs aleatórias revogáveis, armazenamento do lado do servidor, segregação dos dados e registro de versões/aceites. A seleção atual não é transmitida automaticamente nem salva num servidor; clicar WhatsApp abre a conversa para confirmação manual.

## Testes v0.2

Rodados com Chromium via Playwright em `390×844` e `1440×900`:
- 25 equipamentos / 16 ambientes exibidos corretamente.
- Modelo essencial: 13 cenas; apartamento: 19; premium: 30.
- Identificação interna ausente no link público.
- Formulário carregado pela configuração gerada no painel.
- Filtros, busca, carregamento progressivo, cena selecionada e Antes/Depois funcionais.
- Sem erros JS, sem rolagem horizontal mobile.

## Piloto e marca

Marca principal: **GET LED CENAS**. Primeiro caso de teste: Família Wolf (dados internos mantidos exclusivamente no dossiê do cliente). A aplicação foi preparada para reutilização com outros projetos.
