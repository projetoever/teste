# Padrão GET LED — Ideia em texto → Comando executável

**O usuário escreve livremente.** O projeto mantém estas traduções sem exigir formulário do usuário para cada ideia.

## Como uma ideia será processada

1. **Interpretar** o objetivo e classificar como `UX`, `cena`, `equipamento`, `render`, `integração`, `segurança`, `catálogo` ou `marketing`.
2. **Verificar compatibilidade** com equipamentos já cadastrados, sem inventar dimerização, posições intermediárias ou dispositivos.
3. **Transformar em especificação** com ID único, prioridade, entradas, saídas, etapas, teste de aceitação e custo/risco.
4. **Gerar comandos/prompts enxutos**: um por efeito controlável, câmera fixa, proibição de alterar arquitetura e validação visual.
5. **Encaminhar**: código/testes GitHub; assets/roadmap Drive; Work somente para operação externa com login quando útil; provider via API segura quando autorizada.
6. **Registrar** estado `analisado`, `em desenvolvimento`, `testado`, `aprovado` ou `publicado` e changelog.

## Modelo interno de especificação

```yaml
id: GLC-SC01-BLIND-001
area: Video Factory
prioridade: P0
fonte: ideia em texto do usuário
resultado: vídeo imersivo da persiana fechando
ambiente: Living/Sala
equipamentos: [persiana]
estado_inicial: persiana aberta, TV e luzes sem alteração
estado_final: persiana fechada, mesmos móveis e câmera
camera: tripé fixo, 16:9, sem zoom/pan
duracao: 5s
resolucao: 720p
motor_1: PixVerse V6 Transition
motor_2: Veo 3.1 Fast 6s, somente se necessário
restricoes: sem novas telas, sem deformação de esquadria, sem mudança de objetos
qa: geometria 35; movimento 25; iluminação 15; estabilidade 15; mobile 10
aprovacao: pontuação >=85 e zero falhas críticas
publicacao: bloqueada até revisão humana e direitos confirmados
```

## Prompt executável — primeiro piloto (fal/PixVerse V6 Transition)

> A single photorealistic luxury apartment living room filmed from a completely locked tripod, identical framing throughout. Animate ONLY the existing motorized roller blind in the center window. It starts fully raised at the ceiling and lowers smoothly, inside the exact glazing and frame boundaries, until fully closed in the supplied end image. The fabric moves as a real blind, and natural daylight on the floor and furniture decreases naturally. Keep the existing TV completely off; no change to ceiling LEDs, chandeliers, sofa, furnishings, window construction, perspective or camera. No people, no zoom, no pan, no new fixtures. Begin on the supplied start frame and end exactly on the supplied last frame, holding the final state stable for one second.

**Negative prompt:** warped walls, duplicate television, camera movement, changing furniture, floating blind, blind crossing window borders, unexpected lighting changes, flicker, morphing, text, watermarks, new objects.

**Observação:** o motor pode não cumprir todas as restrições. A aprovação depende da inspeção do vídeo, não só do prompt.

## Quando usar o Work

Usar **Work** (em conversa/modo próprio) somente para etapas que exijam navegação externa, autenticação, uploads de arquivos ou edição manual em plataformas visuais. Não é necessário para converter ideias em prompts, desenvolver código, validar jobs, atualizar GitHub ou atualizar o Drive por conectores. A conta do usuário deve autorizar conexões e despesas; nunca inserir chaves secretas em conversas ou sites públicos.
