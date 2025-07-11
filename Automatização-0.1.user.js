// ==UserScript==
// @name         Automatização
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Após digitar à mensagem, ele responde e arquiva o protocolo/memorando automaticamente com diferentes justificativas e confirmações de envio
// @author       Bruno Pasini
// @match        *://cacador.1doc.com.br/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Função para acionar o clique no botão "Enviar" e depois nos botões específicos
    function triggerResponderButton() {
        setTimeout(() => {
            const submitButton = document.querySelector('button#enviar_documento.btn.btn-success'); // Substitua pelo seletor do botão "Enviar"
            if (submitButton) {
                submitButton.click();
                console.log('Botão "Enviar" clicado!');

                setTimeout(() => {
                    const confirmButton = document.querySelector('a#sim.btn.btn-success'); // Substitua pelo seletor do botão de confirmação
                    if (confirmButton) {
                        confirmButton.click();
                        console.log('Botão de confirmação clicado!');

                        setTimeout(() => {
                            const finalButton = document.querySelector('button.botao_flutuante_2.bf_v_3.btn.btn-info.btn-small'); // Substitua pelo seletor do botão final
                            if (finalButton) {
                                finalButton.click();
                                console.log('Botão final clicado!');

                                setTimeout(() => {
                                    const finalConfirmButton = document.querySelector('a#sim.btn.btn-success'); // Substitua pelo seletor do botão de confirmação final
                                    if (finalConfirmButton) {
                                        finalConfirmButton.click();
                                        console.log('Botão de confirmação final clicado!');
                                    } else {
                                        console.error('Botão de confirmação final não encontrado');
                                    }
                                }, 500); // Ajuste o tempo de espera conforme necessário
                            } else {
                                console.error('Botão final não encontrado');
                            }
                        }, 1000); // Ajuste o tempo de espera conforme necessário
                    } else {
                        console.error('Botão de confirmação não encontrado');
                    }
                }, 1000); // Ajuste o tempo de espera conforme necessário
            } else {
                console.error('Botão "Enviar" não encontrado');
            }
        }, 500); // Ajuste o tempo de espera conforme necessário
    }

  function inserirJustificativa(texto) {
    // Tenta usar a API do TinyMCE primeiro
    if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
        const editor = tinymce.activeEditor;
        // Verifica se o editor está inicializado e pronto
        if (editor && !editor.isHidden()) {
            // 1. Obtenha o conteúdo HTML atual do editor
            let currentContent = editor.getContent({ format: 'html' });

            // 2. Encontre a tag <p> inicial e insira o novo texto nela
            //    Vamos procurar pelo primeiro <p> ou pelo body editável
            let newContent = '';
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentContent, 'text/html');

            // Tentar encontrar o <p> principal onde o texto é inserido
            let firstP = doc.querySelector('p');

            if (firstP) {
                // Se o <p> já existe e tem algo como '&nbsp;' ou está vazio, substitua ou adicione
                // Se ele já tiver conteúdo, adicionamos uma quebra de linha e o novo texto
                if (firstP.innerHTML.trim() === '&nbsp;' || firstP.innerHTML.trim() === '') {
                    firstP.innerHTML = texto + '<br>'; // Inserir o texto e uma quebra de linha
                } else {
                    firstP.innerHTML = texto + '<br>' + firstP.innerHTML; // Adiciona no início com quebra
                }
                newContent = doc.body.innerHTML; // Pega o HTML atualizado do body
            } else {
                // Se não encontrar <p>, pode ser que o conteúdo principal seja direto no body
                // Ou o editor ainda não criou um <p>. Neste caso, vamos apenas adicionar ao início.
                // Mas, idealmente, TinyMCE sempre tem um elemento principal para edição.
                newContent = '<p>' + texto + '</p>' + currentContent;
            }

            // 3. Defina o novo conteúdo de volta no editor
            editor.setContent(newContent, { format: 'html' });
            console.log(`Texto inserido via TinyMCE API, preservando rodapé: "${texto}"`);
            return; // Sai se a API do TinyMCE foi bem-sucedida
        }
    }

    // Fallback para manipulação direta do DOM se a API do TinyMCE não estiver disponível ou pronta
    console.warn('TinyMCE API não disponível ou editor não pronto. Recorrendo à manipulação direta do DOM.');

    const targetDiv = document.querySelector('div#mceu_94.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item');
    if (targetDiv) {
        const iframe = targetDiv.querySelector('iframe#conteudo_ifr');
        if (iframe) {
            // Usar um setTimeout para dar um pequeno tempo para o iframe carregar,
            // ou melhor ainda, uma MutationObserver se o onload não for suficiente.
            // Para iframe, idealmente, você quer garantir que o DOM interno esteja pronto.
            iframe.onload = function() {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDocument) {
                    const bodyElement = iframeDocument.querySelector('body#tinymce');
                    if (bodyElement) {
                        let paragrafo = bodyElement.querySelector('p');
                        if (!paragrafo) {
                            // Se o p tag não existe, cria um
                            paragrafo = iframeDocument.createElement('p');
                            // Inserir antes da div de assinatura, se ela existir
                            const signatureDiv = bodyElement.querySelector('div.emissao_assinatura');
                            if (signatureDiv) {
                                bodyElement.insertBefore(paragrafo, signatureDiv);
                            } else {
                                bodyElement.appendChild(paragrafo);
                            }
                        }

                        // PRESERVAR O CONTEÚDO EXISTENTE
                        // Aqui, em vez de sobrescrever com innerHTML = texto,
                        // vamos adicionar ao início do conteúdo existente do parágrafo.
                        // Consideramos que o <p> pode ter &nbsp;
                        if (paragrafo.innerHTML.trim() === '&nbsp;' || paragrafo.innerHTML.trim() === '') {
                             paragrafo.innerHTML = texto + '<br>'; // Adiciona o texto e uma quebra
                        } else {
                            paragrafo.innerHTML = texto + '<br>' + paragrafo.innerHTML; // Adiciona no início com quebra
                        }
                        console.log(`Texto inserido via DOM fallback (innerHTML), preservando rodapé: "${texto}"`);
                    } else {
                        console.error('Body com id "tinymce" não encontrado dentro do iframe (fallback).');
                    }
                } else {
                    console.error('Não foi possível acessar o documento do iframe (fallback).');
                }
            };
            // Se o iframe já estiver carregado, dispara o onload manualmente
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                iframe.onload();
            }

        } else {
            console.error('Iframe não encontrado dentro da div (fallback).');
        }
    } else {
        console.error('Div alvo não encontrada (fallback).');
    }
}
    // Função para adicionar os botões à página
    function adicionarBotoes() {
        const targetDiv = document.querySelector('div#mceu_35-body.mce-container-body.mce-flow-layout'); // Substitua pelo seletor da div onde deseja inserir os botões
        if (targetDiv) {
            const botoes = [
                { id: 'finalizarButton1', texto: 'Segue justificativa.', label: 'Justificativa' },
                { id: 'finalizarButton2', texto: 'Segue justificativa e solicitação.', label: 'Justificativa e Solicitação' },
                { id: 'finalizarButton3', texto: 'Segue solicitação, inclusão em banco de horas.', label: 'Inclusão BH' },
                { id: 'finalizarButton4', texto: 'Justificativa lançada.', label: 'Justificativa Lançada' },
                { id: 'responderButton', texto: '', label: 'Responder' } // Botão adicional "Responder"
            ];

            botoes.forEach(botao => {
                if (!document.querySelector(`#${botao.id}`)) {
                    const button = document.createElement('button');
                    button.id = botao.id;
                    button.innerText = botao.label;
                    button.style.padding = '6px 12px';
                    button.style.backgroundColor = '#1dccaa';
                    button.style.color = 'white';
                    button.style.border = '1px solid black';
                    button.style.borderRadius = '5px';
                    button.style.cursor = 'pointer';
                    button.style.fontFamily = '"Open Sans", Helvetica, Arial, sans-serif';
                    button.style.fontSize = '14px';
                    button.style.marginTop = '3px';
                    button.style.verticalAlign = 'top';
                    button.style.marginLeft = '5px';
                    button.style.transition = 'background-color 0.3s ease';

                    // Adiciona o evento de hover para mudar a cor de fundo
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = '#17b89b';
                    });
                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = '#1dccaa';
                    });

                    // Adiciona o evento de clique ao botão
                    button.addEventListener('click', () => {
                        const confirmed = confirm(`Deseja enviar a mensagem: "${botao.texto}"?`);
                        if (confirmed) {
                            if (botao.texto) {
                                inserirJustificativa(botao.texto);
                            }
                            triggerResponderButton();
                        } else {
                            console.log('Ação cancelada pelo usuário.');
                            // Clica automaticamente no botão "Cancelar" da confirmação de responder
                            const cancelButton = document.querySelector('a#nao.btn.cancelar');
                            if (cancelButton) {
                                cancelButton.click();
                            }
                        }
                    });

                    // Adiciona o botão à div
                    targetDiv.appendChild(button);
                }
            });
        } else {
            console.error('Div alvo não encontrada');
        }
    }

    // Função para observar mudanças no DOM e adicionar botões se necessário
    function observarMudancas() {
        const observer = new MutationObserver(() => {
            adicionarBotoes();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Verifica se a URL corresponde ao padrão desejado
    const urlPattern = /cacador\.1doc\.com\.br\/\?pg=doc\/ver(&hash=|&origem=desarquivamento|&erros=painel_setor)/;
    if (urlPattern.test(window.location.href)) {
        adicionarBotoes();
        observarMudancas();
    }
})();
