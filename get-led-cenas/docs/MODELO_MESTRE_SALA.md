# GET LED CENAS — Modelo Mestre de Sala de Automação

**ID do ambiente:** GLC-LIVING-001  
**Versão:** 1.0, 22/11/2026  
**Finalidade:** ambiente genérico e reutilizável em propostas de automação, sem dados de imóveis reais.  
**Política de publicação:** não usar imagem ou vídeo de cliente no catálogo público sem licença/consentimento.

## Visão

Um living contemporâneo integrado com jantar, varanda e automação multimodal. A sala é a base visual para a biblioteca de cenas, servindo a clientes residenciais e a escritórios de arquitetura. A imagem fotográfica inicial é um **conceito visual gerado por IA**, não o projeto executivo de nenhum cliente.

## Inventário padrão do ambiente

| Equipamento / camada | Função demonstrável | Regra de compatibilidade |
|---|---|---|
| Iluminação geral / spots | Ligar e desligar; nível apenas quando hardware permitir | Não prometer dimerização com relés Zigbee somente liga/desliga |
| Perfil LED linear de teto | Iluminação cênica; acendimento/desligamento | Ponto de iluminação deve estar separado no circuito |
| Cortineiro iluminado | Efeito indireto decorativo | Separar do motor da persiana; são funções diferentes |
| Arandelas | Destaque nas paredes | Circuito independente, se disponível |
| Pendentes / lustre jantar | Cena social, jantar, receber | Grupo dependente da instalação e da fiação |
| Persiana motorizada | Abrir, fechar e parar | Posição parcial e duração reais dependem do motor/integração |
| TV | Ligar/desligar, comandos suportados | Controlador IR/RF e modelo devem ser validados; IR pode não ter estado real |
| Soundbar / áudio | Ligar, volume, fonte; música opcional | Música requer origem licenciada/autorizada e interação do visitante |
| Ar-condicionado | Liga/desliga, modo, temperatura quando suportado | Em IR, resposta é comando enviado, não confirmação garantida |
| Alexa/app Smart Life | Atalhos e gatilhos de cena | Somente cenas configuradas e testadas podem ser prometidas |
| Sensores e aspirador (opcional) | Contexto de ambiente e manutenção | Somente se equipamento de fato disponível |

## Diretrizes de fotografia e composição

- Proporção 16:9, centro da imagem livre, TV perfeitamente visível à direita, janela central com espaço para persiana descer; sofás no primeiro plano.
- A câmera **não muda** entre estado inicial, intermediário, final e vídeo.
- O inventário deve estar visível quando sua participação na cena for relevante.
- Não criar UI dentro da fotografia: botões e controles devem vir do código HTML, não dos prompts de imagem.
- Uma imagem master original deve ser preservada imutável. Derivações sempre vinculadas ao ID, prompt, motor, data e direitos.

## Biblioteca inicial (sem escala prematura)

1. **SC01 Cinema em Casa**: persiana fechando, luz geral apagando, perfil indireto acendendo, TV ligando, áudio ativo; na primeira iteração implementar **apenas persiana**.
2. **SC03 Jantar Especial**: luz social e pendentes em destaque, ambiente aconchegante, TV desligada; apenas circuitos reais.
3. **SC04 Receber Visitas**: iluminação completa e acolhedora, persiana aberta conforme horário, climatização confortável.

Cada cena completa será composta por efeitos já aprovados individualmente: P1 Persiana → P2 LEDs → P3 TV → P4 áudio/AC. Não colar mídias incoerentes de ambientes diferentes.

## Evolução técnica

- MVP: quadro inicial e final, vídeo com câmera fixa, MP4 H.264 720p e poster.
- Premium: modelos Blender/GLB, render de materiais e iluminação para máscaras exatas; composição em Fusion/After Effects e vídeo 1080p.
- VR: WebXR + objetos com geometria real e navegação, somente após qualidade 2D/2.5D comprovada.

## Status do primeiro piloto

`GLC-SC01-BLIND-001`: sequência técnica local de cinco segundos, 720p/24fps, sem áudio, **não homologada**. Câmera constante; o material compõe uma demonstração gratuita de infraestrutura. Não confundir com resultado do PixVerse. Os dois quadros estão disponíveis para avaliação em gerador first/last frame.
