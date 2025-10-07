// VERSÃO FINAL E DEFINITIVA - COM INTEGRAÇÃO FORMSPREE
document.addEventListener('DOMContentLoaded', () => {
    try {
        const body = document.body;

        // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA ---
        // (Código de transição, sem alterações)

        // --- 2. LÓGICA DA CUTSCENE MOBILE ---
        // (Código da cutscene, sem alterações)

        // --- 3. LÓGICA DO MODAL ---
        // (Código do modal, sem alterações)
        
        // --- 4. LÓGICA DO FORMULÁRIO (VERSÃO FINAL COM FORMSPREE) ---
        const form = document.getElementById('multiStepForm');
        if (form) {
            let currentStepIndex = 0;
            const steps = Array.from(form.querySelectorAll('.form-step'));
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            const showStep = (index) => {
                steps.forEach((step, i) => {
                    step.classList.toggle('active', i === index);
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
                const requiredElements = currentStepElement.querySelectorAll('[data-required="true"], input[required]');
                let isStepValid = true;
                requiredElements.forEach(el => {
                    // ... (lógica de validação, sem alterações) ...
                });
                return isStepValid;
            };

            nextBtn.addEventListener('click', () => {
                if (validateCurrentStep()) {
                    currentStepIndex++;
                    showStep(currentStepIndex);
                }
            });

            prevBtn.addEventListener('click', () => {
                currentStepIndex--;
                showStep(currentStepIndex);
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!validateCurrentStep()) return;

                const formData = new FormData(form);
                const action = form.getAttribute('action');
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => {
                    if (response.ok) {
                        // SUCESSO! Dispara a animação
                        const formWrapper = document.getElementById('form-wrapper');
                        const successAnimation = document.getElementById('success-animation');
                        formWrapper.style.opacity = '0';
                        setTimeout(() => {
                            formWrapper.classList.add('hidden');
                            successAnimation.classList.remove('hidden');
                            const successContent = successAnimation.querySelector('.success-content');
                            const morfeuReveal = successAnimation.querySelector('.morfeu-reveal');
                            successContent.classList.remove('hidden');
                            setTimeout(() => {
                                successContent.style.opacity = '0';
                                setTimeout(() => {
                                    successContent.classList.add('hidden');
                                    morfeuReveal.classList.remove('hidden');
                                }, 500);
                            }, 3000);
                            setTimeout(() => {
                               body.classList.add('is-entering');
                               setTimeout(() => window.location.href = 'index.html', 500);
                            }, 7000);
                        }, 500);
                    } else {
                        // ERRO NO ENVIO
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('Houve um problema com o envio do formulário:', error);
                    alert('Não foi possível enviar seu diagnóstico. Por favor, tente novamente.');
                    submitBtn.textContent = 'Enviar Diagnóstico';
                    submitBtn.disabled = false;
                });
            });
            
            showStep(0);
        }
    } catch (error) {
        console.error("MORFEU ERRO CRÍTICO GLOBAL:", error);
    }
});