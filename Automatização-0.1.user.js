// ==UserScript==
// @name         Automatização
// @namespace    http://tampermonkey.net/
// @version      0.1
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

    // Função para inserir a mensagem no parágrafo
    function inserirJustificativa(texto) {
        const targetDiv = document.querySelector('div#mceu_47.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item');
        if (targetDiv) {
            const iframe = targetDiv.querySelector('iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const paragrafo = iframeDocument.querySelector('p');
                if (paragrafo) {
                    paragrafo.textContent = texto;
                    console.log('Justificativa inserida!');
                } else {
                    console.error('Parágrafo não encontrado');
                }
            } else {
                console.error('Iframe não encontrado');
            }
        } else {
            console.error('Div alvo não encontrada');
        }
    }

    // Função para adicionar os botões à página
    function adicionarBotoes() {
        // Substitua pelo seletor da div onde deseja inserir os botões
        const targetDiv = document.querySelector('div#mceu_36-body.mce-container-body.mce-flow-layout');
        if (targetDiv) {
            const botoes = [
                { id: 'finalizarButton1', texto: 'Segue justificativa.', label: 'Justificativa' },
                { id: 'finalizarButton2', texto: 'Segue justificativa e solicitação.', label: 'Justificativa e Solicitação' },
                { id: 'finalizarButton3', texto: 'Segue solicitação, inclusão em banco de horas.', label: 'Inclusão BH' },
                { id: 'finalizarButton4', texto: 'Justificativa lançada.', label: 'Justificativa Lançada' }
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
                            inserirJustificativa(botao.texto);
                            triggerResponderButton();
                        } else {
                            console.log('Ação cancelada pelo usuário.');
                            // Clica automaticamente no botão "Cancelar" da confirmação de responder
                            const cancelButton = document.querySelector('#');
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
