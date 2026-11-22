# MODELO MESTRE — GET LED CENAS v1.3

## Produto central
Painel de criação e envio de catálogos de cenas filtrados por equipamentos e ambientes, com links individuais e seleção do cliente. Produção audiovisual é um subsistema interno, **não o produto principal**.

## Fluxo
1. Get Led define título público, recursos e cômodos no painel;
2. Get Led faz curadoria de cenas compatíveis e gera link;
3. o cliente explora cenas pelo smartphone e seleciona opções;
4. o cliente envia escolhas por WhatsApp;
5. Get Led valida circuitos e funcionalidades antes de programar Smart Life/Alexa;
6. projeto homologado recebe memorial técnico.

## Primeiro catálogo-piloto
Template genérico `Living · piloto` com 3 cenas: Cinema em Casa (SC01), Receber Visitas (SC04) e Boa Noite Social (SC05). Publicamente não inclui nomes, endereços ou IDs pessoais.

## Biblioteca de mídia
`assets/catalogo-piloto/` contém imagens-base e rascunhos antes/depois. Os arquivos são **rascunhos técnicos** e não devem ser tratados como animações fotorrealistas.

## Padrões de qualidade
- Um ambiente-mestre e uma perspectiva fixa por projeto-modelo.
- Cada cena registra recursos obrigatórios, opcionais e sequência técnica.
- Antes/depois são revisados antes de gerar vídeos; vídeo só entra no catálogo quando aprovado.
- O catálogo não promete controle percentual/dimerização sem confirmação do hardware.
- Sempre preservar versões anteriores; manter changelog e status dos arquivos.

## Roadmap
### V1.3 concluído
- Retorno à arquitetura catalog-first; presets e curadoria individual; três cenas para living; imagens/prompts padronizados.
### Próximo sprint
- Aprovar imagens finais corrigidas de persiana, arandelas, perfis e TV com máscara e referência master.
- Gerar um único vídeo premium da cena Cinema, usando créditos PixVerse e aprovação humana.
- Publicar vídeo aprovado no catálogo e testar experiência no telefone físico.
### Futuro
- Área autenticada do operador, biblioteca de links em servidor e pipeline visual automatizado.
