// VERSÃO FINAL, REVISADA E CORRIGIDA COM BASE NOS LOGS
document.addEventListener('DOMContentLoaded', () => {
    console.log('[MORFEU] DOM carregado. Iniciando scripts...');
    
    try {
        const body = document.body;

        // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA ---
        requestAnimationFrame(() => { body.classList.remove('is-entering'); });
        document.querySelectorAll('a:not([href^="#"])').forEach(link => {
            try {
                const url = new URL(link.href);
                if (url.hostname === window.location.hostname) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const destination = link.href;
                        console.log(`[MORFEU] Navegando para: ${destination}`);
                        body.classList.add('is-entering');
                        setTimeout(() => { window.location.href = destination; }, 500);
                    });
                }
            } catch (e) { /* Ignora links inválidos */ }
        });

        // --- 2. LÓGICA DA CUTSCENE MOBILE ---
        const cutscene = document.getElementById('mobile-intro-cutscene');
        if (cutscene) {
            if (window.innerWidth <= 768 && !sessionStorage.getItem('morfeuIntroPlayed')) {
                console.log('[MORFEU] Cutscene: Iniciando animação mobile.');
                const title = cutscene.querySelector('.intro-title');
                const subtitle = cutscene.querySelector('.intro-subtitle');
                cutscene.style.display = 'flex';
                setTimeout(() => { cutscene.style.opacity = '1'; }, 10);
                setTimeout(() => { title.style.opacity = '1'; title.style.transform = 'translateY(0)'; }, 500);
                setTimeout(() => { subtitle.style.opacity = '1'; subtitle.style.transform = 'translateY(0)'; }, 1500);
                setTimeout(() => {
                    cutscene.style.opacity = '0';
                    setTimeout(() => cutscene.style.display = 'none', 500);
                }, 5500);
                sessionStorage.setItem('morfeuIntroPlayed', 'true');
            } else {
                cutscene.style.display = 'none';
            }
        }

        // --- 3. LÓGICA DO MODAL ---
        const cards = document.querySelectorAll('.service-card, .team-card');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop && cards.length > 0) {
            // Código do modal (sem alterações)
            const modal = modalBackdrop.querySelector('.modal');
            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            const closeModalBtn = modal.querySelector('.modal-close-btn');
            cards.forEach(card => card.addEventListener('click', () => {
                modalTitle.textContent = card.dataset.title;
                modalDescription.textContent = card.dataset.description;
                modalBackdrop.style.opacity = '1';
                modalBackdrop.style.pointerEvents = 'auto';
            }));
            const closeModal = () => {
                modalBackdrop.style.opacity = '0';
                modalBackdrop.style.pointerEvents = 'none';
            };
            closeModalBtn.addEventListener('click', closeModal);
            modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
        }

        // --- 4. LÓGICA DO FORMULÁRIO (VERSÃO FINAL E À PROVA DE FALHAS) ---
        const form = document.getElementById('multiStepForm');
        if (form) {
            console.log('[FORMS] Formulário encontrado. Inicializando...');
            let currentStepIndex = 0;
            const steps = Array.from(form.querySelectorAll('.form-step'));
            const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            const showStep = (index) => {
                console.log(`[FORMS] Mostrando etapa ${index + 1}`);
                steps.forEach((step, i) => {
                    step.classList.toggle('active', i === index);
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
                console.log(`[FORMS] Botões atualizados para a etapa ${currentStepIndex + 1}.`);
            };

            const validateCurrentStep = () => {
                const currentStepElement = steps[currentStepIndex];
                console.log(`[FORMS] Validando etapa ${currentStepIndex + 1}...`);
                const requiredElements = currentStepElement.querySelectorAll('[data-required="true"], input[required]');
                let isStepValid = true;

                requiredElements.forEach(el => {
                    const group = el.closest('.form-group');
                    let isValid = false;
                    let inputToCheck = el;

                    // Se o elemento for um div (grupo de rádio/check), ache o primeiro input dentro dele
                    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                        inputToCheck = el.querySelector('input');
                    }
                    
                    if (inputToCheck.type === 'radio') {
                        const radioName = inputToCheck.name;
                        if (currentStepElement.querySelector(`input[name="${radioName}"]:checked`)) {
                            isValid = true;
                        }
                    } else if (inputToCheck.type === 'checkbox') {
                        isValid = inputToCheck.checked;
                    } else { // Inputs de texto, número, etc.
                        if (inputToCheck.value.trim() !== '') {
                            isValid = true;
                        }
                    }

                    if (!isValid) {
                        isStepValid = false;
                        group.classList.add('has-error');
                        console.warn(`[FORMS] Validação FALHOU para o campo:`, inputToCheck.name);
                    } else {
                        group.classList.remove('has-error');
                    }
                });
                console.log(`[FORMS] Validação da etapa ${currentStepIndex + 1} concluída. Resultado: ${isStepValid ? 'Válido' : 'Inválido'}`);
                return isStepValid;
            };

            nextBtn.addEventListener('click', () => {
                console.log('[FORMS] Botão "Avançar" clicado.');
                if (validateCurrentStep()) {
                    if (currentStepIndex < steps.length - 1) {
                        currentStepIndex++;
                        showStep(currentStepIndex);
                    }
                }
            });

            prevBtn.addEventListener('click', () => {
                console.log('[FORMS] Botão "Voltar" clicado.');
                if (currentStepIndex > 0) {
                    currentStepIndex--;
                    showStep(currentStepIndex);
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Impede o envio padrão que causa o erro "not focusable"
                console.log('[FORMS] Botão "Enviar" clicado.');
                if (validateCurrentStep()) {
                    console.log('[FORMS] Formulário válido. Disparando animação de sucesso...');
                    const formWrapper = document.getElementById('form-wrapper');
                    const successAnimation = document.getElementById('success-animation');
                    formWrapper.style.opacity = '0';
                    setTimeout(() => {
                        formWrapper.classList.add('hidden');
                        successAnimation.classList.remove('hidden');
                        setTimeout(() => {
                           body.classList.add('is-entering');
                           setTimeout(() => window.location.href = 'index.html', 500);
                        }, 5000); // Espera 5s na tela de sucesso
                    }, 500);
                }
            });
            
            showStep(0);
        }

    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO GLOBAL:", error);
    }
});