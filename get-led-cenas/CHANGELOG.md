# GET LED CENAS — Registro de Versões

## v1.2 — Máscaras orientadas à geometria + videos técnicos
- Persiana V2: material com trama discreta, trilho, barra inferior e escurecimento natural localizado.
- Arandelas V1, Lustres V1, Perfis LED V1 e TV V1, todos em mídia independente.
- Cinema em Casa V1: composição ordenada dos microefeitos.
- Showroom substituído por player de MP4, sem elementos falsos sobre a imagem no frontend.
- Navegação por gestos, antes/depois, troca de efeitos, modo paisagem, fullscreen e HUD auto-hide.
- Preservação do código e dos vídeos técnicos anteriores; novas mídias em `assets/video/v12`.
- QA em 390×844, 844×390, 1440×900: 3/3 passaram; `ffprobe` validou os seis MP4.
- Os efeitos ainda NÃO estão homologados para uso comercial como simulação fotorrealista.

# Changelog GET LED CENAS

## v1.0 — 22/11/2026
- Criada sala-modelo genérica gerada por IA e biblioteca de capacidades.
- Criados quadros inicial/final do movimento de persiana e vídeo de teste 5s sem créditos.
- Player do catálogo aceita status `piloto_tecnico` com aviso explícito.
- Criado showroom mobile-first de vídeo e link no Video Lab.
- Plano Mestre e prompt PixVerse first/last-frame versionados.
- Pendência: geração IA PixVerse, QA cinematográfico e homologação.

## v1.1 — Effects Lab de refinamento visual
- showroom substituído por um laboratório de efeitos com camadas interativas sobre a sala modelo
- adicionados 6 presets de teste: persiana, arandelas, lustres, perfis de LED, TV e cena composta
- controles do showroom redesenhados com scrub manual, navegação entre presets, modo tela cheia e HUD com auto-hide
- leitura técnica atualizada para apoiar homologação de quadros e futura geração de vídeo premium
- manutenção do pipeline local sem custo, priorizando reaproveitamento de ativos e estrutura de catálogo
