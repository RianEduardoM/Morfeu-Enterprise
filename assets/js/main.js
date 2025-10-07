document.addEventListener('DOMContentLoaded', () => {
    try {
        const body = document.body;

        // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA ---
        requestAnimationFrame(() => {
            body.classList.remove('is-entering');
        });

        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            try {
                const url = new URL(link.href, window.location.origin);
                if (url.hostname === window.location.hostname && !url.hash && url.href !== window.location.href) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const destination = link.href;
                        body.classList.add('is-entering');
                        setTimeout(() => {
                            window.location.href = destination;
                        }, 500);
                    });
                }
            } catch (e) { /* Ignora links inválidos como mailto: */ }
        });
        
        // --- 2. LÓGICA DA CUTSCENE DE INTRODUÇÃO MOBILE ---
        const cutscene = document.getElementById('mobile-intro-cutscene');
        if (cutscene && window.innerWidth <= 768 && !sessionStorage.getItem('morfeuIntroPlayed')) {
            const title = cutscene.querySelector('.intro-title');
            const subtitle = cutscene.querySelector('.intro-subtitle');
            const DURATION = 6000;

            cutscene.style.display = 'flex';
            requestAnimationFrame(() => {
                cutscene.style.transition = 'opacity 0.5s ease';
                cutscene.style.opacity = '1';
            });

            setTimeout(() => {
                title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 500);

            setTimeout(() => {
                subtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 1500);

            setTimeout(() => {
                cutscene.style.opacity = '0';
                setTimeout(() => cutscene.style.display = 'none', 500);
            }, DURATION - 500);

            sessionStorage.setItem('morfeuIntroPlayed', 'true');
        } else if (cutscene) {
            cutscene.style.display = 'none';
        }

        // --- 3. LÓGICA DO MODAL DE SERVIÇOS/EQUIPES ---
        const cards = document.querySelectorAll('.service-card, .team-card');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            const modal = modalBackdrop.querySelector('.modal');
            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            const closeModalBtn = modal.querySelector('.modal-close-btn');

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    modalTitle.textContent = card.dataset.title;
                    modalDescription.textContent = card.dataset.description;
                    modalBackdrop.style.opacity = '1';
                    modalBackdrop.style.pointerEvents = 'auto';
                    modal.style.transform = 'scale(1)';
                });
            });

            const closeModal = () => {
                modalBackdrop.style.opacity = '0';
                modalBackdrop.style.pointerEvents = 'none';
                modal.style.transform = 'scale(0.95)';
            };

            closeModalBtn.addEventListener('click', closeModal);
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    closeModal();
                }
            });
        }
        
        // --- 4. LÓGICA DO FORMULÁRIO DE DIAGNÓSTICO (CORREÇÃO CRÍTICA APLICADA AQUI) ---
        const multiStepForm = document.getElementById('multiStepForm');
        if (multiStepForm) {
            let currentStep = 0;
            const formSteps = Array.from(multiStepForm.querySelectorAll('.form-step'));
            const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            const showStep = (stepIndex) => {
                formSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });
                progressSteps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                    step.classList.toggle('completed', index < stepIndex);
                });
                updateUI();
            };

            const validateStep = (stepIndex) => {
                const currentStepFields = formSteps[stepIndex].querySelectorAll('[data-required="true"]');
                let isValid = true;
                currentStepFields.forEach(field => {
                    const group = field.closest('.form-group');
                    const errorMsg = group.querySelector('.error-message');
                    let fieldIsValid = false;

                    if (field.type === 'radio') {
                        const radioGroup = group.querySelectorAll('input[name="' + field.name + '"]');
                        if (Array.from(radioGroup).some(r => r.checked)) {
                           fieldIsValid = true;
                        }
                    } else if (field.type === 'checkbox') {
                         if (field.checked) {
                            fieldIsValid = true;
                         }
                    } else if (field.value.trim() !== '') {
                        fieldIsValid = true;
                    }

                    if (!fieldIsValid) {
                        isValid = false;
                        errorMsg.style.display = 'block';
                    } else {
                        errorMsg.style.display = 'none';
                    }
                });
                return isValid;
            };

            const updateUI = () => {
                prevBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
                nextBtn.style.display = currentStep < formSteps.length - 1 ? 'inline-flex' : 'none';
                submitBtn.style.display = currentStep === formSteps.length - 1 ? 'inline-flex' : 'none';
            };
            
            nextBtn.addEventListener('click', () => {
                if (validateStep(currentStep) && currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });

            multiStepForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    // Lógica de animação de sucesso
                    const formWrapper = document.getElementById('form-wrapper');
                    const successAnimation = document.getElementById('success-animation');
                    const successMessage = successAnimation.querySelector('.success-content');
                    const morfeuReveal = successAnimation.querySelector('.morfeu-reveal');
                    
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
                                    body.classList.add('is-entering');
                                    setTimeout(() => {
                                        window.location.href = 'index.html';
                                    }, 500);
                                }, 4000);
                            }, 500);
                        }, 3000);
                    }, 500);
                }
            });
            
            // Inicia o formulário na primeira etapa
            showStep(currentStep);
        }
    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO:", error);
    }
});