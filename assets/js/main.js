
console.log("Arquivo main.js carregado com sucesso!");
// --- 2. LÓGICA DA CUTSCENE DE INTRODUÇÃO MOBILE ---
try {
    const cutscene = document.getElementById('mobile-intro-cutscene');
    
    // Verifica se está em um dispositivo móvel e se a animação ainda não rodou nesta sessão
    if (cutscene && window.innerWidth <= 768 && !sessionStorage.getItem('morfeuIntroPlayed')) {
        const title = cutscene.querySelector('.intro-title');
        const subtitle = cutscene.querySelector('.intro-subtitle');
        const DURATION = 6000; // 6 segundos no total

        // Inicia a animação
        cutscene.style.transition = 'opacity 0.5s ease';
        cutscene.style.opacity = '1';

        // Animação do Título "Morfeu"
        setTimeout(() => {
            title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 500); // 0.5s após o início

        // Animação do Subtítulo
        setTimeout(() => {
            subtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 1500); // 1.5s após o início

        // Esconde tudo e remove a cutscene
        setTimeout(() => {
            cutscene.style.opacity = '0';
            // Garante que o elemento suma após a transição
            setTimeout(() => cutscene.style.display = 'none', 500); 
        }, DURATION - 500);

        // Marca que a animação já rodou para não repetir
        sessionStorage.setItem('morfeuIntroPlayed', 'true');
    } else if (cutscene) {
        // Se não for pra rodar, apenas esconde o elemento
        cutscene.style.display = 'none';
    }
} catch (error) {
    console.error("Erro na cutscene:", error);
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        const body = document.body;

        // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA "CUTSCENE" ---
        // Animação de Entrada ao carregar a página
        requestAnimationFrame(() => {
            body.classList.add('is-transitioning');
            body.classList.remove('is-entering');
        });

        // Animação de Saída ao clicar em um link interno
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            try {
                const url = new URL(link.href, window.location.origin);
                // Ignora links para âncoras, links externos, ou a própria página
                if (url.hostname === window.location.hostname && !url.hash && url.href !== window.location.href) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const destination = link.href;
                        const overlay = document.querySelector('.transition-overlay');
                        
                        if (overlay) {
                            const targetIsForm = destination.includes('cadastro.html');
                            const currentIsForm = body.classList.contains('form-page-body');
                            
                            let overlayColor = getComputedStyle(body).backgroundColor; // Cor padrão
                            
                            if(currentIsForm && !targetIsForm){
                                overlayColor = '#0A0A0A'; // Saindo do form escuro para o claro
                            } else if(!currentIsForm && targetIsForm) {
                                overlayColor = '#F8F9FA'; // Saindo do site claro para o escuro
                            }
                            
                            overlay.style.backgroundColor = overlayColor;
                            overlay.classList.add('animate');
                            
                            // Efeito "Rojão"
                            const firework = document.createElement('div');
                            firework.classList.add('firework');
                            firework.style.left = e.clientX + 'px';
                            firework.style.top = e.clientY + 'px';
                            body.appendChild(firework);
                            firework.addEventListener('animationend', () => { firework.remove(); });

                            setTimeout(() => { window.location.href = destination; }, 700);
                        } else {
                            window.location.href = destination; // Fallback caso o overlay não exista
                        }
                    });
                }
            } catch (error) {
                // Ignora links inválidos como mailto:, tel:, etc.
            }
        });
        
        // --- 2. LÓGICA DO MODAL ---
        const interactiveCards = document.querySelectorAll('.service-card, .team-card');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if(modalBackdrop) {
            const modal = modalBackdrop.querySelector('.modal');
            const modalCloseBtn = modalBackdrop.querySelector('.modal-close-btn');
            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');

            const openModal = (title, description) => {
                if (modalTitle && modalDescription) {
                    modalTitle.textContent = title;
                    modalDescription.textContent = description;
                    document.body.classList.add('modal-open');
                }
            };
            const closeModal = () => { document.body.classList.remove('modal-open'); };

            interactiveCards.forEach(card => {
                card.addEventListener('click', () => {
                    const title = card.dataset.title;
                    const description = card.dataset.description;
                    if (title && description) { openModal(title, description); }
                });
            });

            if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
            modalBackdrop.addEventListener('click', (event) => {
                if (event.target === modalBackdrop) { closeModal(); }
            });
        }


        // --- 3. LÓGICA DO FORMULÁRIO ---
        const diagnosticForm = document.querySelector('.diagnostic-form');
        if (diagnosticForm) {
            body.classList.add('form-page-body');
            
            const steps = Array.from(diagnosticForm.querySelectorAll('.form-step'));
            const nextBtn = diagnosticForm.querySelector('#nextBtn');
            const prevBtn = diagnosticForm.querySelector('#prevBtn');
            const submitBtn = diagnosticForm.querySelector('#submitBtn');
            const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
            const progressFills = Array.from(document.querySelectorAll('.progress-bar-fill'));
            const formWrapper = document.querySelector('#form-wrapper');
            const successAnimation = document.querySelector('#success-animation');
            const successMessage = successAnimation.querySelector('.success-content');
            const morfeuReveal = successAnimation.querySelector('.morfeu-reveal');
            
            if (!nextBtn || !prevBtn || !submitBtn) {
                console.error("Morfeu ERRO CRÍTICO: Um ou mais botões de navegação do formulário não foram encontrados no HTML!");
                return;
            }
            
            let currentStep = 0;

            const validateStep = (stepIndex) => {
                let isValid = true;
                const currentStepFields = steps[stepIndex].querySelectorAll('[required]');
                
                currentStepFields.forEach(field => {
                    const parentGroup = field.closest('.relative, .form-group');
                    let fieldIsValid = false;

                    if (field.type === 'checkbox' || field.type === 'radio') {
                        if (diagnosticForm.querySelector(`input[name="${field.name}"]:checked`)) {
                            fieldIsValid = true;
                        }
                    } else if (field.checkValidity()) {
                        fieldIsValid = true;
                    }

                    if (!fieldIsValid) {
                        isValid = false;
                        parentGroup.classList.add('has-error');
                    } else {
                        parentGroup.classList.remove('has-error');
                    }
                });
                return isValid;
            };
            
            const updateUI = () => {
                progressSteps.forEach((step, index) => {
                    step.classList.remove('active', 'completed');
                    if (index === currentStep) {
                        step.classList.add('active');
                    } else if (index < currentStep) {
                        step.classList.add('completed');
                    }
                });

                progressFills.forEach((fill, index) => {
                    fill.style.width = index < currentStep ? '100%' : '0%';
                });

                const isFirstStep = currentStep === 0;
                const isLastStep = currentStep === steps.length - 1;

                prevBtn.style.display = isFirstStep ? 'none' : 'inline-flex';
                nextBtn.style.display = isLastStep ? 'none' : 'inline-flex';
                submitBtn.style.display = isLastStep ? 'inline-flex' : 'none';
            };

            const goToStep = (stepIndex) => {
                const exitingStep = steps[currentStep];
                exitingStep.classList.add('exiting');
                
                setTimeout(() => {
                    exitingStep.classList.remove('active-step', 'exiting');
                    currentStep = stepIndex;
                    steps[currentStep].classList.add('active-step');
                    updateUI();
                }, 400); 
            };

            nextBtn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    if (currentStep < steps.length - 1) {
                        goToStep(currentStep + 1);
                    }
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    goToStep(currentStep - 1);
                }
            });

            diagnosticForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    formWrapper.style.transition = 'opacity 0.5s ease-out';
                    formWrapper.style.opacity = '0';

                    setTimeout(() => {
                        formWrapper.classList.add('hidden');
                        successAnimation.classList.remove('hidden');
                        successMessage.classList.remove('hidden');
                        morfeuReveal.classList.add('hidden');

                        setTimeout(() => {
                            successMessage.style.transition = 'opacity 0.5s ease-out';
                            successMessage.style.opacity = '0';
                            
                            setTimeout(() => {
                                successMessage.classList.add('hidden');
                                morfeuReveal.classList.remove('hidden');

                                setTimeout(() => {
                                    // Dispara a animação de saída para a página inicial
                                    const homeLink = document.createElement('a');
                                    homeLink.href = 'index.html';
                                    homeLink.click();
                                }, 4000);
                            }, 500);
                        }, 3000);
                    }, 500);
                }
            });
            
            updateUI();
        }
    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO:", error);
    }
});