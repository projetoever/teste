# GET LED CENAS — Studio v0.6 | GPU Immersive Preview

Produto piloto, mobile-first, da Get Led para apresentar cenas por ambiente e equipamentos, selecionar propostas e compartilhar via WhatsApp.

## Entregas v0.6

- Simulador em tela cheia com uma camada **WebGL** (shader GLSL) sobre fotografia realista de referência.
- Iluminação GPU ilustrativa: dois perfis de teto diagonais, pendentes, halo de televisão e brilho da soundbar.
- A mesma foto permanece antes e depois da cena, evitando a troca brusca de imóveis e perspectivas.
- Reprodução com timing para iluminação, persianas, TV e soundbar; tour guiado mantido.
- Renderização sob demanda: a camada GPU só inicia quando a tela cheia está aberta e é interrompida ao fechar / ocultar a página.
- Fallback CSS preservado em navegadores sem WebGL, incluindo o navegador do ambiente automatizado de testes.
- Modo de movimento reduzido com menor atualização de animação.

## Arquivos

- `formulario.html` — experiência do cliente, com camada Canvas GPU.
- `gpu-effects.js` — renderizador WebGL leve independente de bibliotecas externas, com interface `window.GetLedGPU`.
- `style-v06.css` — camadas de composição e fallback visual.
- `formulario.js` — eventos que acionam / param o renderizador e sincronizam o estado dos equipamentos.
- `index.html` — painel de configuração anterior, mantido.
- `test_immersive.py` — testes automatizados via Chromium/Playwright.

## Limites e próximos passos

- O ambiente é uma fotografia com efeitos projetados, **não é um modelo tridimensional** nem realidade virtual. A aproximação ao WebXR exige geometria 3D real e mapeamento espacial dos objetos.
- WebGL não estava disponível no navegador automatizado local; foi validado o fallback CSS e o fluxo de interação. A etapa GPU deve também ser testada em aparelho físico compatível.
- Para a fase de ambiente 3D real, estudar `Three.js` (WebGLRenderer/WebXR), modelos glTF/GLB e `model-viewer` para visualização/AR compatível. Implantar de forma progressiva e sob demanda.
- O painel é demonstrativo e não oferece autenticação. Não utilizar dados pessoais ou aprovações reais no link aberto.
