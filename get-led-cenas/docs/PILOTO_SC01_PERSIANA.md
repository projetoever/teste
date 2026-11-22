# Produção piloto — Persiana do Living (SC01)

**Versão:** teste 1, sem uso comercial antes da aprovação.  
**Condição:** um equipamento por vez, frame inicial/final controlados e sem alterar imagem da TV.

## Material necessário

- `SC01_blind_first.png`: foto/render **com direitos confirmados**, 16:9, enquadramento fixo, persiana recolhida.
- `SC01_blind_last.png`: mesma foto/render e mesma perspectiva, persiana fechada **somente dentro da esquadria**. Luz externa e sombra atualizadas de modo fisicamente plausível.
- Opcional: `SC01_blind_mask.png`, máscara em escala de cinza da área da persiana; se o motor não aceitar máscara, usar na composição final.
- Registro de autorização da imagem e descrição do mecanismo real (roller/blackout/cortina de tecido).

**Atenção:** a imagem ilustrativa atual mostra cortinas e uma grande esquadria, mas não prova a existência nem a posição exata de uma persiana de enrolar. Precisamos de um frame final preciso, baseado na configuração escolhida, para impedir um resultado inventado.

## Passos

1. Validar o enquadramento original e identificar o polígono da área da persiana.
2. Criar o frame final no editor de composição ou Blender, mantendo cada objeto da sala intocado.
3. Revisar diferença entre quadros: somente persiana, sombra e luz natural podem mudar.
4. No Video Lab, selecionar `SC01 — Blackout descendo` e `PixVerse V6 Transition`.
5. Exportar job de geração 5s, 720p, 16:9, sem áudio.
6. Com conexão autorizada e teto de gastos aprovado, realizar **uma única tentativa**.
7. Produzir folha de contato (quadros em 0, 1, 2, 3, 4, 5s) e revisão em tela cheia mobile.
8. Se aprovado: guardar master + versão H.264 MP4 e poster WebP no storage. Se reprovado: documentar falha e ajustar prompt/frames antes de outra tentativa.
9. Caso três tentativas PixVerse não atinjam 85 pontos, comparar Veo 3.1 Fast (6s); Kling 4.0 como alternativa posterior.
10. Só publicar em `scene-media.json` com autorização, QA e documentação aprovados.

## Critérios de rejeição imediata

- Mais de uma TV ou objetos adicionados.
- Janela ou cortineiro deformados.
- Tecido atravessando paredes, cortinas ou móveis.
- Zoom/pan involuntário, desfoque excessivo ou geometria instável.
- Mudança de iluminação sem relação com a persiana.

## Estado em 22/11/2026

Imagem inicial genérica e roteiro preparados; **imagem final precisa, autorização do provedor e vídeo gerado ainda pendentes**. Nenhuma chamada paga foi realizada.
