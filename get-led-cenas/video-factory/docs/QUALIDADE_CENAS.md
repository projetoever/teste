# Controle de qualidade — vídeos GET LED CENAS

## Rejeição obrigatória

- O frame final muda a arquitetura da sala ou move mobiliário.
- A TV fica duplicada, sai da moldura, entorta ou se move.
- A persiana extrapola a janela, muda de tecido, atravessa a esquadria ou não altera a incidência de luz.
- O LED é inventado em outra posição ou produz efeito sem iluminação correspondente nas superfícies.
- Distorções de luminárias, janela, bancada ou cabos, oscilação/flicker e textos estranhos.

## Escala de avaliação por cena (0–5)

- Geometria / constância temporal: mínimo 4.
- Movimento físico do dispositivo: mínimo 4.
- Coerência de sombras e luzes: mínimo 4.
- Fidelidade do modelo de equipamento: mínimo 4.
- Qualidade em paisagem mobile: mínimo 4.
- Aderência técnica à automação disponível: obrigatório.

## Processo

1. Gerar 1 variante por ação (custo baixo, 720p).
2. Criar contato de seis frames com `contact-sheet`.
3. Revisar e rejeitar deformações.
4. Somente após um bom resultado, gerar qualidade mais alta ou testar outro modelo.
5. Compor ativos aprovados na mesma tomada, fixando máscaras/câmera.
6. Exportar master H.264 e posterior 720p mobile se necessário.
7. Testar em iPhone, Android e desktop; validar autoplay, poster, pausa, troca de cena e conexão móvel.
8. Somente então marcar como `aprovado` no manifesto.

## Importante sobre produto

A família Wolf é o primeiro piloto do catálogo comercial, mas as mídias genéricas não devem ser apresentadas como fotos do apartamento real. Materiais técnicos da residência devem permanecer privados. O projeto atual utiliza apenas imagens ilustrativas.
