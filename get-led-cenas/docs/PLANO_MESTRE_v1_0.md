# GET LED CENAS — Plano Mestre Consolidado

**Versão:** 1.0 | **Data:** 22/11/2026 | **Responsável:** Get Led

## Missão

Ferramenta comercial e de produção que transforma automação residencial em uma experiência visual testável pelo cliente: ambientes por categoria, cenas compatíveis com os equipamentos cadastrados, vídeos curtos explicativos, seleção de preferências e roteiro técnico de instalação. Público-alvo: cliente final, escritórios de arquitetura e engenharia, incorporadoras e parceiros de reforma.

## Princípios imutáveis

1. **Não prometer hardware não instalado.** Cada cena resulta de um conjunto explícito de capacidades.
2. **Não publicar vídeos gerados sem aprovação humana.** A IA não confirma comportamento físico.
3. **Uma arquitetura por ambiente:** imagem master, quadros base/finais e clipes compartilhando câmera/geometria.
4. **Video-first + mobile-first:** usar vídeo já renderizado, player otimizado e controles discretos; não adicionar equipamentos fake sobre a foto por CSS.
5. **Biblioteca reutilizável:** componentes `LED`, `Persiana`, `TV`, `Áudio`, `AC`, `Arandela`, `Lustre` e cenas combinadas.
6. **Privacidade:** links públicos sem dados pessoais; IDs dos dispositivos e informações de clientes só em área autenticada e privada.
7. **Custos primeiro:** validar uma transição simples usando créditos do PixVerse Web, não comprar múltiplas APIs prematuramente.
8. **Registros:** cada versão contém fonte, prompts, resultados, QA, mudança de status e histórico em GitHub e Drive.

## Pipeline de produção

Ideia → capacidade técnica → roteiro → imagem base → estados inicial/final → prompt travado → vídeo IA/3D → teste QA → aprovação → transcodificação → manifesto no catálogo → publicação.

## Arquitetura de pastas

`assets/rooms/<room-id>`: imagens originais, estados e metadados.  
`assets/video`: vídeos MP4 aprovados ou demo devidamente sinalizada.  
`docs`: plano mestre, roteiros, prompt, QA e decisões.  
`video-factory`: roteiros/algoritmos, sem credenciais.  
`assets/scene-media.json`: estado de integração das mídias no player.

## Modelo do ambiente-piloto

`GLC-LIVING-001`: living integrado com TV, soundbar, ar-condicionado, perfil linear de LED, spots, arandelas, lustres/pendentes, cortineiro e persiana. A sala deve poder demonstrar SC01 Cinema, SC03 Jantar, SC04 Receber; produção começa pelo efeito isolado SC01/P1 Persiana. Consultar `docs/MODELO_MESTRE_SALA.md`.

## Status em 22/11/2026

| Etapa | Estado | Evidência |
|---|---|---|
| Sala conceitual IA | Feito | `GLC_LIVING_BASE_001.png` |
| Primeiro/último quadro SC01 persiana | Feito tecnicamente | Arquivos em `assets/rooms/living-model`; quadro final não homologado |
| Vídeo técnico gratuito | Feito | MP4 5s, 720p, 24fps; procedural, sem IA |
| Player do site | Integrado em desenvolvimento | SC01 com aviso piloto técnico; showroom direto |
| PixVerse Web via créditos diários | Pronto para operação manual/Work | Conta do usuário; não acessível diretamente neste chat |
| Primeira geração IA PixVerse | Pendente | Depende da conta operada pelo usuário/Work e QA dos keyframes |
| Homologação do primeiro vídeo | Pendente | 85/100 sem falha crítica |
| Biblioteca SC03 e SC04 | Projetada | Requer novos estados finais e vídeos |
| Backend seguro / cadastro real | Futuro | Auth, filas, custo, mídia, aprovações e links revogáveis |

## Decisão de integração de motor

- Rota **sem compra imediata:** PixVerse no app web, usando créditos diários disponíveis. Work só se autorizado para navegar autenticação, upload, download e operação que exigem interação gráfica.
- Rota **API futura:** fal/PixVerse Transition, pelo backend, usando chave em segredo e orçamento aprovado. Créditos do app PixVerse não devem ser assumidos como crédito de API fal.
- Fallback de qualidade: retoque final e máscaras em Fusion; Blender para render 3D se a geometria variar demais.

## Etapas seguintes

1. Revisar vídeo procedural no site em smartphone, marcando-o como *piloto técnico*.
2. Revisar/aperfeiçoar o quadro final da persiana com máscara/3D, se necessário.
3. Uma geração PixVerse Web V6 first/last frame (5s, sem áudio); registrar créditos, resultado, modelo e prompt.
4. Aplicar pontuação de QA. Se aprovado, substituir a mídia de demonstração técnica pelo vídeo IA homologado.
5. Iniciar SC01/P2 acendimento dos perfis LED; depois P3 TV, P4 soundbar, respeitando equipamentos do cliente.
6. Desenvolver SC03 Jantar e SC04 Receber no mesmo living.
7. Introduzir conta Get Led, banco e fila/API somente quando houver resultados visuais consistentes.

## Governança de novas ideias

Toda sugestão textual vira entrada estruturada: `ID | ambiente | dispositivos e compatibilidade | estado antes/depois | prompt imagem | prompt vídeo | restrições | orçamento | QA | próximo teste`. Ideia não implica publicação ou execução automática sem aprovação de custo.
