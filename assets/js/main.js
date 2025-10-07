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
            } catch (e) { /* Ignora links inválidos */ }
        });

        // --- 2. LÓGICA DA CUTSCENE MOBILE ---
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

        // --- 3. LÓGICA DO MODAL ---
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
        
        // --- 4. LÓGICA DO FORMULÁRIO DE DIAGNÓSTICO (VERSÃO FINAL E CORRIGIDA) ---
        const form = document.getElementById('multiStepForm');
        if (form) {
            let currentStepIndex = 0;
            const steps = Array.from(form.querySelectorAll('.form-step'));
            const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            const showStep = (index) => {
                steps.forEach((step, i) => {
                    step.classList.toggle('active', i === index);
                    // Compatibilidade com o seu CSS original que usa 'active-step'
                    step.classList.toggle('active-step', i === index); 
                });
                progressSteps.forEach((step, i) => {
                    step.classList.toggle('active', i === index);
                    step.classList.toggle('completed', i < index);
                });
                updateButtons();
            };

            const updateButtons = () => {
                prevBtn.style.display = currentStepIndex > 0 ? 'inline-flex' : 'none';
                nextBtn.style.display = currentStepIndex < steps.length - 1 ? 'inline-flex' : 'none';
                submitBtn.style.display = currentStepIndex === steps.length - 1 ? 'inline-flex' : 'none';
            };

            const validateCurrentStep = () => {
                const currentStepElement = steps[currentStepIndex];
                const requiredFields = currentStepElement.querySelectorAll('[data-required="true"], input[required]');
                let isValid = true;

                requiredFields.forEach(field => {
                    const group = field.closest('.form-group, .relative');
                    let fieldIsValid = false;
                    
                    if (field.type === 'radio') {
                        const radioName = field.name;
                        if (currentStepElement.querySelector(`input[name="${radioName}"]:checked`)) {
                            fieldIsValid = true;
                        }
                    } else if (field.type === 'checkbox') {
                        fieldIsValid = field.checked;
                    } else if (field.value.trim() !== '') {
                        fieldIsValid = true;
                    }

                    if (!fieldIsValid) {
                        isValid = false;
                        group.classList.add('has-error');
                    } else {
                        group.classList.remove('has-error');
                    }
                });
                return isValid;
            };

            nextBtn.addEventListener('click', () => {
                if (validateCurrentStep()) {
                    if (currentStepIndex < steps.length - 1) {
                        currentStepIndex++;
                        showStep(currentStepIndex);
                    }
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentStepIndex > 0) {
                    currentStepIndex--;
                    showStep(currentStepIndex);
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateCurrentStep()) {
                    const formWrapper = document.getElementById('form-wrapper');
                    const successAnimation = document.getElementById('success-animation');
                    formWrapper.style.opacity = '0';
                    setTimeout(() => {
                        formWrapper.classList.add('hidden');
                        successAnimation.classList.remove('hidden');
                        setTimeout(() => {
                           body.classList.add('is-entering');
                           setTimeout(() => window.location.href = 'index.html', 500);
                        }, 5000);
                    }, 500);
                }
            });
            
            showStep(0);
        }
    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO:", error);
    }
});