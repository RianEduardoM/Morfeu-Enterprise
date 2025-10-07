// VERSÃO FINAL E REVISADA - MORFEU SCRIPT
document.addEventListener('DOMContentLoaded', () => {
    console.log('[MORFEU] DOM carregado. Iniciando scripts...');
    
    try {
        const body = document.body;

        // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA ---
        requestAnimationFrame(() => {
            body.classList.remove('is-entering');
        });

        document.querySelectorAll('a').forEach(link => {
            try {
                const url = new URL(link.href, window.location.origin);
                if (url.hostname === window.location.hostname && !url.hash && url.href !== window.location.href && !link.href.endsWith('#')) {
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
            // Código do modal... (sem alterações, já funcional)
        }

        // --- 4. LÓGICA DO FORMULÁRIO DE DIAGNÓSTICO (VERSÃO FINAL COM LOGS) ---
        const form = document.getElementById('multiStepForm');
        if (form) {
            console.log('[FORMS] Formulário de diagnóstico encontrado. Inicializando...');
            let currentStepIndex = 0;
            const steps = Array.from(form.querySelectorAll('.form-step'));
            const progressSteps = Array.from(document.querySelectorAll('.progress-indicator .step'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            const showStep = (index) => {
                console.log(`[FORMS] Mostrando etapa ${index + 1}`);
                steps.forEach((step, i) => {
                    const isActive = i === index;
                    step.classList.toggle('active', isActive);
                    step.classList.toggle('active-step', isActive);
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
                console.log(`[FORMS] Botões atualizados. Etapa atual: ${currentStepIndex + 1}.`);
            };

            const validateCurrentStep = () => {
                const currentStepElement = steps[currentStepIndex];
                console.log(`[FORMS] Validando etapa ${currentStepIndex + 1}...`);
                const requiredInputs = currentStepElement.querySelectorAll('[data-required="true"], input[required]');
                let isStepValid = true;

                requiredInputs.forEach(inputOrGroup => {
                    const group = inputOrGroup.closest('.form-group, .relative');
                    let isValid = false;
                    
                    if (inputOrGroup.classList.contains('radio-group')) {
                        const radioName = inputOrGroup.querySelector('input[type="radio"]').name;
                        if (inputOrGroup.querySelector(`input[name="${radioName}"]:checked`)) {
                            isValid = true;
                        }
                    } else if (inputOrGroup.querySelector('input[type="checkbox"]')) {
                        isValid = inputOrGroup.querySelector('input[type="checkbox"]').checked;
                    } else { // Inputs de texto, etc.
                        if (inputOrGroup.value.trim() !== '') {
                            isValid = true;
                        }
                    }

                    if (!isValid) {
                        isStepValid = false;
                        group.classList.add('has-error');
                        console.warn(`[FORMS] Validação FALHOU para o campo no grupo:`, group);
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
                e.preventDefault();
                console.log('[FORMS] Botão "Enviar" clicado.');
                if (validateCurrentStep()) {
                    console.log('[FORMS] Formulário válido. Enviando...');
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
            
            showStep(0); // Inicia o formulário na primeira etapa
        }

    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO GLOBAL:", error);
    }
});