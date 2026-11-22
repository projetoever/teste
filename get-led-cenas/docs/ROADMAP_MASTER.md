> **PLANO CANÔNICO v1.0:** consultar `docs/PLANO_MESTRE_v1_0.md`. Este documento conserva o planejamento histórico anterior.

# GET LED CENAS — Plano Mestre e Roadmap

**Atualizado:** 22/11/2026  
**Produto:** GET LED CENAS  
**Visão:** experiência digital premium que traduz equipamentos, cômodos e cenas de automação em demonstrações audiovisuais compreensíveis e selecionáveis pelo cliente.  
**Cliente-piloto:** Família Wolf (somente no acervo privado; não incluir identidade/dados em código público).  
**Parceiros comerciais:** Get Led / Ponte One / E3 Reformas conforme cada projeto.

## Regras permanentes de produto

1. **Uma ideia, uma especificação executável.** Mensagens textuais viram: objetivo, ambiente, equipamentos e suas capacidades reais, estado inicial/final, mídia de referência, roteiro, prompt, negativo, critério de aceitação, custo/canal de execução, prioridade e versão.
2. **Qualidade acima de quantidade.** Publicar no showroom somente mídia aprovada por revisão visual e compatibilidade técnica. A IA pode inventar movimentos: isso nunca vale como comprovação de comportamento real.
3. **Mobile-first.** Player em paisagem com vídeo real, controles auto-ocultáveis, carregamento sob demanda, opção de imagem estática quando vídeo ausente, compatibilidade com acessibilidade/redução de movimento.
4. **Segurança.** O painel privado não deve ser acessível sem autenticação. Chaves de API apenas no backend/secret manager; nunca em navegador, repositório ou link público. Sem nomes, endereço, prints de dispositivos ou informações pessoais de clientes em código público.
5. **Documentar toda versão.** Registro cronológico, prompt, motor, duração, resolução, créditos previstos, arquivo de entrada, arquivo resultante, observações de QA, decisão e histórico no GitHub/Drive.
6. **Work sob demanda.** Usar Work somente quando houver necessidade real de operar site com autenticação/arquivo/upload/seleções. Para gerar automaticamente, preferir API com autorização + serviço de fila no backend.

## Estado geral — 22/11/2026

| Frente | Estado | Evidência / bloqueio |
|---|---|---|
| Catálogo de cenas e filtros | Piloto funcional v0.8 | Formulário publicado; cadastro persistente ainda não pronto |
| Player de vídeos MP4/WebM | Base implementada v0.8 | Sem vídeo cinematográfico homologado |
| Laboratório de produção v0.9 | Protótipo demonstrativo em desenvolvimento | Exporta jobs, estima custos e revisa MP4; sem chamadas pagas |
| Seleção de modelo | Decisão técnica inicial | PixVerse V6 Transition primeiro; Veo Fast e Kling como fallback |
| Imagem inicial SC01 | Disponível, genérica | 16:9; precisa checagem de direitos e aderência arquitetônica |
| **Imagem final SC01** | **BLOQUEIO PRINCIPAL** | Preparar persiana realmente fechada, mesma câmera, mesmos móveis e textura |
| Conta do provedor | Aguardando autorização | Sem `FAL_KEY` nem conexão autorizada nesta sessão |
| Piloto MP4 da persiana | Não gerado | Apenas após quadro final e autorização de créditos |
| Publicação de vídeos | Bloqueada por QA | Nenhum vídeo gerado poderá ser mostrado como aprovado sem revisão |
| Painel admin seguro e banco | Planejado | Autenticação, projetos persistentes e links revogáveis |

## Etapas de execução

### E0 — Escopo e padrões (**concluída**)
- Biblioteca inicial de 30 cenas / filtros por recursos e ambiente.
- Diferenciação entre formulário público, painel Get Led e player audiovisual.
- Modelo de governança: segurança, aprovação técnica, direitos de uso e privacidade.

### E1 — Piloto persiana SC01 (**em preparação**)
- [x] Preparar imagem inicial de referência genérica.
- [x] Gerar prompt e restrições em inglês, câmera fixa.
- [x] Confirmar modelos/API e preços de referência.
- [x] Montar laboratório de jobs e revisão audiovisual.
- [ ] Validar direitos de uso da fotografia e presença/possibilidade da persiana no vão.
- [ ] Preparar **último frame** com blackout na posição final sobre a mesma fotografia; máscara, sombras e esquadria corretas.
- [ ] Conectar conta autorizada de geração e estabelecer teto de crédito.
- [ ] Gerar **um** PixVerse V6 Transition 5s 720p sem áudio.
- [ ] Aplicar QA (score >= 85/100, nenhum defeito crítico); comparar segundo motor apenas se falhar.
- [ ] Aprovar clip final, transcodificar e integrar no player.

### E2 — Biblioteca de componentes (**após E1**)
- TV ligando dentro do painel original; soundbar; perfis LED; iluminação de pendentes.
- Montar uma sequência completa SC01 com uma única perspectiva e continuidade temporal.
- Publicar apenas versões aprovadas e com escopo realista do hardware.

### E3 — Produto operacional (**planejado**)
- Autenticação painel Get Led, projetos e formulários persistentes, links individuais revogáveis, resposta centralizada.
- Video Factory via backend, fila e webhooks verificados, registro de custos, jobs, uploads e aprovações.
- Armazenamento versionado de assets e vídeo responsivo, CDN e cache.

### E4 — Produção arquitetônica avançada (**futuro**)
- Ambientes renderizados Blender/Twinmotion com máscaras e renders de estados.
- Experiências de câmera/visita guiada e player WebXR para demonstrações de alto padrão.

## Controle de qualidade de mídias (peso 100 pontos)

| Critério | Peso |
|---|---:|
| Geometria/elementos preservados (móveis, TV, teto, esquadria) | 35 |
| Movimento físico da persiana dentro do vão | 25 |
| Sombras/reflexos/entrada de luz coerentes | 15 |
| Consistência temporal, sem flicker ou morphing | 15 |
| Legibilidade mobile e estado final estável | 10 |

**Aprovado:** >=85/100 **e** nenhum defeito crítico.  
**Reprovado automaticamente:** segunda TV, janela deformada, persiana atravessando paredes, móvel mudando de posição, câmera mudando de ângulo, marcas indesejadas ou conteúdo sem direitos de uso.

## Decisão de motores (22/11/2026)

- **A — PixVerse V6 Transition**: 720p, 5s, sem áudio. US$ 0,225 por tentativa, se preço de US$ 0,045/s mantido.
- **B — Veo 3.1 Fast first/last**: 720p, **6s** (a API aceita 4, 6 ou 8s), sem áudio. Aproximadamente US$ 0,60.
- **C — Kling 4.0**: 720p, 5s, quadro inicial e opcional final, sem áudio. Aproximadamente US$ 0,785.

Cota inicial recomendada para o primeiro teste: **até três tentativas PixVerse**, e alternativas adicionais somente após inspeção das três. Nenhum gasto autorizado implicitamente por este documento.

## Convenção de mídia e governança

- `room=Living` / `scene=SC01` / `device=Persiana` / `take=001` / `engine=PixVerseV6`
- Identificadores padronizados: `GLC-SC01-BLIND-001`.
- Estados: `ideia` → `roteiro` → `assets_pendentes` → `pronto_para_gerar` → `gerado` → `em_revisao` → `aprovado` / `reprovado` → `publicado`.
- Sem publicação direta do resultado de um motor de IA; exige `aprovado` + direitos autorizados + confirmação técnica.

## Referências oficiais (acesso em 22/11/2026)

- PixVerse V6 Transition/fal: https://fal.ai/models/fal-ai/pixverse/v6/transition/api
- Veo 3.1 Fast first/last/fal: https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video/api
- Kling 4.0 first/last/fal: https://fal.ai/models/kling/v4/image-to-video/api
- Runway Gen-4.5: https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5
- DaVinci Resolve Fusion: https://www.blackmagicdesign.com/br/products/davinciresolve/fusion

## Sprint v1.1 — Refinamento dos efeitos
**Objetivo:** trocar a leitura “tosca” de simulação por um laboratório de camadas mais convincente e útil para homologação.

### Entregue
- showroom em modo laboratório de efeitos
- presets independentes para persiana, arandelas, lustres, perfis de LED, TV e cena cinema
- HUD com linguagem de player e auto-hide para leitura mobile/landscape
- slider de ajuste fino para inspecionar transições quadro a quadro

### Próximos passos
1. produzir quadro final aprovado para arandelas
2. produzir quadro final aprovado para perfil LED
3. testar glow/reflexo da TV com conteúdo mais realista
4. levar os quadros aprovados para o pipeline de vídeo externo
5. substituir o vídeo técnico por vídeo premium homologado

### Observação operacional
Os arquivos foram organizados localmente e versionados por pasta (`get_led_cenas_v11`) para reduzir retrabalho e facilitar sincronização manual em Drive/GitHub.


## 2026-11-22 | Sprint 1.2 — Microefeitos e interface audiovisual
### Concluído
- [x] Geometria da sala de referência fixada em 1280×720.
- [x] Máscara de persiana por painel e proteção da geometria à frente (sofá).
- [x] Seis videos técnicos curtos e estados before/mid/after.
- [x] Motor determinístico documentado em `render_effects_v12.py`.
- [x] Showroom usa videos MP4, com seletor de efeitos, scrubber e fullscreen.
- [x] QA automatizado para mobile, paisagem e desktop (sem rolagem horizontal).
### Próximos marcos de qualidade
1. Aprovação visual da persiana V2; se a textura não passar, criar estado final no motor de imagens e interpolação via PixVerse.
2. Melhorar efeito de arandelas e pendentes com máscara de luminária e iluminação realista em materiais.
3. Validar os perfis que existem no projeto arquitetônico antes de representar todos os rasgos como LEDs.
4. Evoluir TV para conteúdo original/royalty-free, e limitar reflexão a regiões fisicamente plausíveis.
5. Gerar e homologar MP4 Premium com o PixVerse utilizando os frames da biblioteca versionada.
6. Só então atualizar os vídeos do catálogo público, com aprovação explícita da Get Led.
### Guardrails
- Nunca substituir um asset anterior; inserir revisões em subpastas versionadas.
- Evitar afirmar realismo físico perfeito sem render arquitetônico ou vídeo revisado.
- Não publicar identidade e detalhes privativos de cliente em links abertos.
- A biblioteca comercial serve vários clientes; use ambientes genéricos.
