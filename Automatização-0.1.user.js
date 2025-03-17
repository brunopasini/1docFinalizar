// ==UserScript==
// @name         Automatização
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Após digitar à mensagem, ele responde e arquiva o protocolo/memorando automaticamente
// @author       Bruno Pasini
// @match        *://cacador.1doc.com.br/?pg=doc/ver&hash=*
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

    // Função para adicionar o botão à div específica
    function adicionarBotao() {
        // Encontra a div alvo
        const targetDiv = document.querySelector('div._form-actions.hide.tm.tm_botoes');
        if (targetDiv) {
            // Cria o botão
            const button = document.createElement('button');
            button.innerText = 'Finalizar';
            button.style.padding = '8px 15px';
            button.style.backgroundColor = '#1dccaa';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontFamily = '"Open Sans", Helvetica, Arial, sans-serif';
            button.style.marginLeft = '10px'; // Adiciona um espaçamento à esquerda

            // Adiciona o evento de clique ao botão
            button.addEventListener('click', triggerResponderButton);

            // Adiciona o botão à div alvo
            targetDiv.appendChild(button);
        } else {
            console.error('Div alvo não encontrada');
        }
    }

    // Verifica se a URL corresponde ao padrão desejado
    if (window.location.href.includes('cacador.1doc.com.br/?pg=doc/ver&hash=')) {
        window.addEventListener('load', adicionarBotao);
    }
})();
