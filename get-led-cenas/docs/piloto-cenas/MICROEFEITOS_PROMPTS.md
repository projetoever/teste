# GET LED CENAS — Banco Mestre de Prompts de Microefeitos v1.3

As imagens e vídeos seguintes devem ser produzidos **sobre uma única imagem-mestre fixa**. Não mudar a geometria da sala entre quadros. O resultado final exige revisão visual humana.

## 00 — Regras globais (anexar a cada prompt)
**Imagem:** `Use the provided architectural interior photograph as a strict locked reference frame. Preserve EXACT camera pose, aspect ratio, furnishings, window mullions, existing light fixtures, ceiling recesses, surfaces, materials, TV dimensions and positions. Make ONLY the requested device-state change. Physical shadow and lighting response must be plausible. No new objects, no morphing, no extra LED strips, no camera movement, no imaginary reflections.`

**Vídeo:** `Locked camera, first/last-frame guidance, seamless structural continuity, photorealistic motion, no camera panning, no reframing, no geometry warping, no flicker, no object appearance/disappearance, no subtitles or overlays. 16:9. No invented equipment.`

## ME01 — Persiana motorizada
- **Início:** persiana aberta, luz natural presente; demais dispositivos inalterados.
- **Fim:** persiana rolô fechada sobre o vão, caixilhos preservados, sofá corretamente à frente da janela.
- **Imagem final:** `Close only the roller blinds inside their real window frame, preserving every mullion, the fabric edges, the visible bottom bar, realistic cloth translucency, and physically consistent shading; the sofa remains in front of the blinds.`
- **Vídeo:** `Motorized roller blind lowers gradually from the ceiling cassette to its lower stop with believable acceleration and deceleration. Daylight reaching furniture reduces gradually with the movement. Maintain stable bottom bar, no cloth morphing.`
- **Risco:** tecido vazando sobre caixilhos ou sofá.

## ME02 — Arandelas
- **Início:** arandelas desligadas, paredes sem halo artificial.
- **Fim:** emissor aceso e projeção quente concentrada na parede imediatamente adjacente.
- **Imagem final:** `Turn on only the existing wall sconces at warm 3000K. Add restrained realistic wall wash and local material illumination, respecting wall texture and luminaire positions.`
- **Vídeo:** `Wall sconces switch on with gradual exposure response, reflecting locally on wall surfaces; no extra light sources or overexposure.`
- **Risco:** halo sem relação com o corpo da luminária.

## ME03 — Lustres e pendentes
- **Início:** pendentes apagados.
- **Fim:** pendentes iluminam a mesa com sombras naturais e sem deslocamentos.
- **Imagem final:** `Illuminate only existing dining pendant fixtures with a warm white 3000K wash falling on the table, keeping the pendants' original metal and diffuser appearance.`
- **Vídeo:** `Dining pendants switch on smoothly and create a natural local light pool and subtle surface response.`
- **Risco:** mudar o formato ou a posição dos pendentes.

## ME04 — Perfis LED e cortineiro
- **Início:** perfis existentes apagados.
- **Fim:** luz contida nos rasgos efetivamente visíveis no teto, com luz indireta de rebatimento.
- **Imagem final:** `Illuminate only the EXISTING ceiling LED channels and curtain cove. Trace the original real recessed lines precisely without extending or inventing profiles. Soft warm illumination must bounce realistically onto neighboring gypsum surfaces.`
- **Vídeo:** `Existing LED profile lights activate sequentially along their real architectural recesses. No glowing lines outside the ceiling channels, no straight lines through fixtures or walls.`
- **Risco:** linhas luminosas fora da posição arquitetônica.

## ME05 — Spots de teto
- **Início:** spots desligados, sem pontos artificiais.
- **Fim:** emissores e reflexos leves no piso/teto de acordo com a geometria.
- **Imagem final:** `Activate only the existing recessed ceiling spotlights, realistic small emitters and soft directional illumination on the closest surfaces, 3000K.`
- **Vídeo:** `Recessed downlights switch on in a short staggered sequence, each illuminating its corresponding local region without adding new fixtures.`
- **Risco:** brilho global excessivo e duplicação de pontos.

## ME06 — TV e soundbar
- **Início:** TV desligada na posição original.
- **Fim:** conteúdo visual abstrato dentro dos pixels da TV; áudio ilustrativo opcional após interação do usuário.
- **Imagem final:** `Turn on the EXISTING television screen in its exact original perspective, display original abstract cinematic blue imagery within the physical screen boundary, and add a subtle blue reflection onto nearby marble and cabinet. Do not enlarge TV or alter its bezel.`
- **Vídeo:** `The original TV boots gradually from black screen to an original abstract scene; screen glow reflects subtly on the adjacent surface. Soundbar remains in the exact existing position.`
- **Risco:** segunda TV falsa sobre o equipamento real.

## ME07 — Climatização
- **Início:** ar-condicionado em espera.
- **Fim:** aletas móveis discretas e pequeno indicador na interface; sem ar visivelmente colorido.
- **Imagem final:** `Keep the existing wall-mounted air-conditioning unit exactly in place; subtly set the air outlet louver to its operating position, with no cartoon airflow.`
- **Vídeo:** `Air-conditioner louver opens smoothly. If visible airflow is necessary, use a faint localized transparent refraction close to the unit only, never smoke or streaks.`
- **Risco:** vento cartoon ou modificação física do split.

## Regra técnica de comercialização
Não demonstrar dimerização nos circuitos Zigbee de simples liga/desliga; usar OFF/ON. A posição percentual da persiana e acionamento do ar por IR dependem dos modelos e disponibilidade de estado. Conteúdo audiovisual no site é simulação visual, nunca acionamento de equipamentos.
