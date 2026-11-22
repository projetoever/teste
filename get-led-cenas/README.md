# GET LED CENAS Studio — Showroom v0.7

## Objetivo

Transformar o formulário comercial de cenas em uma experiência demonstrativa envolvente, **mobile-first**, com player imersivo e transições visuais de iluminação, persianas, TV e áudio. Mantém a geração de formulários e a opção de cenas personalizadas.

**Esta é uma demonstração ilustrativa, sem qualquer comando real de automação.** A fotografia base do living é genérica e não representa o imóvel de um cliente específico.

## Evolução visual implementada

- Hero do formulário mais enxuto no smartphone, com marca e CTA.
- Catálogo em carrossel horizontal, com busca e filtros.
- Player de tela inteira, **sem painel lateral competindo com a imagem**.
- Controles sobrepostos com ocultação automática e retorno por toque.
- Setas para mudar cena, toque/deslize lateral, teclado (`←`, `→`, `Espaço`, `Esc`) e visita guiada.
- Foto 2.5D com camadas SVG posicionadas em coordenadas do ambiente (perfil de LED, persiana, tela de TV, som e iluminação geral).
- Timeline em fases: base, luz geral, persiana, LED, TV, soundbar e conclusão.
- Modo paisagem prioritário e enquadramento completo em retrato.
- Fallback sem WebGL e suporte a `prefers-reduced-motion`.

## Arquivos principais

- `formulario.html` — experiência do cliente.
- `style.css` + `style-v0*.css` — estilos base e evolução.
- `formulario.js` — catálogo, opções e pré-seleção.
- `player-v07.js` — cinema player, auto-hide do HUD, gestos e timeline.
- `gpu-effects.js` — camada WebGL experimental para ambientes genéricos, com fallback CSS.
- `assets/scene-living-map.json` — coordenadas, máscara e roteiro de efeitos do living.
- `index.html` + `painel.js` — painel demonstrativo da Get Led.

## Importante para implantação profissional

O painel atual é demonstrativo, **sem autenticação nem banco de dados**, e não deve receber dados privados reais. Os links de formulário gerados por configuração em fragmento `#p=` não são controles de acesso e ainda não possuem revogação. Manter esse conteúdo público limitado a recursos gerais, nunca IDs Smart Life, endereços, credenciais ou dispositivos individuais.

Para uso comercial: autenticação Get Led, API privada, armazenamento centralizado, links revogáveis, aprovação versionada, política de acesso e monitoramento.

## Pipeline 3D futuro

Quando houver render arquitetônico, idealmente solicitar projeto de origem (SketchUp/Revit/Blender). Modelar os emissores de luz, motor de persiana, TV e áudio como objetos separados; exportar `.glb` com animações e bake de iluminação; renderizar com Three.js/React Three Fiber. WebXR deve ser recurso futuro, com fallback mobile 2.5D.

## QA

Rodar `python test_v07.py` em ambiente com Playwright/Chromium. O teste cobre seleção, reprodução, controles, mudança de cena, formulário personalizado e ausência de erros JavaScript em retrato, paisagem e desktop. O navegador automatizado pode não validar hardware WebGL de dispositivos reais.
