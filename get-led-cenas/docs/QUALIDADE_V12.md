# GET LED CENAS v1.2 — Critérios de QA visual

## O que já funciona
- Efeitos confinados em regiões coerentes com a foto-base.
- Câmera e mobiliário não se movem.
- Vídeos individuais, estados intermediários e cena composta.
- Navegação e reprodução de vídeo no navegador sem custo de API.

## Limites observados na análise
1. **Persiana:** a geometria foi corrigida, porém a trama ainda é gerada por composição 2.5D e não por tecido 3D fisicamente renderizado.
2. **Arandelas:** a base já mostra lâmpadas acesas; o efeito reverso de desligar tem baixa fidelidade. Ideal receber um quadro originalmente apagado ou render com emissivo desligado.
3. **Lustres:** reflexos sobre a mesa são aproximações, sem ray tracing e sem mapa de normal.
4. **Perfis LED:** há linhas existentes no teto; confirmar em projeto se cada rasgo corresponde de fato a LED instalado antes de demonstrar.
5. **TV:** o brilho ficou dentro da televisão existente, mas não equivale à filmagem real de um conteúdo.
6. **Cena composta:** a sequência pode ser exibida comercialmente apenas como conceito, com aviso de simulação ilustrativa.

## Homologação futura
- Geometria: 0 deformações visíveis
- Máscara e oclusão: sem artefatos em caixilho, sofá ou cortina
- Luz e reflexo: iluminação reage às superfícies relevantes
- Movimento: aceleração/desaceleração coerente, sem salto
- Vídeo: pelo menos 1280×720, H.264/AAC se houver áudio, carregamento mobile confiável
- Segurança: sem dados privados, scripts externos não auditados ou imagens sem licença
- Status atual: **piloto técnico, não homologado**

## Produção recomendada
Usar esses antes/depois como briefs de composição; depois gerar com PixVerse usando quadro inicial/final. Rejeitar vídeo com mudanças de arquitetura, móveis ou TV duplicada. Registrar prompt, modelo, créditos, asset original, versão e aprovação.
