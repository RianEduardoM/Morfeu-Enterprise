// VERSÃO FINAL CORRIGIDA E OTIMIZADA v4.2
document.addEventListener("DOMContentLoaded", () => {
  console.log("[MORFEU] DOM carregado. Iniciando scripts...");

  const body = document.body;

  try {
    // --- 1. LÓGICA DE TRANSIÇÃO DE PÁGINA (UNIFICADA E OTIMIZADA) ---
    const pageLinks = document.querySelectorAll(
      'a[href]:not([href^="#"]):not([href^="mailto:"]):not([target="_blank"])'
    );
    window.addEventListener(
      "load",
      () => {
        body.classList.remove("is-entering");
      },
      { once: true }
    );

    pageLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const url = new URL(link.href, window.location.origin);
        if (url.hostname === window.location.hostname) {
          e.preventDefault();
          body.classList.add("is-exiting");
          setTimeout(() => {
            window.location.href = link.href;
          }, 400);
        }
      });
    });

    // --- 2. LÓGICA DA INTRODUÇÃO CINEMATOGRÁFICA v4.2 (COM TRAVA DE SCROLL) ---
    const introSequence = document.getElementById("intro-sequence");
    if (introSequence && !sessionStorage.getItem("introPlayed_v4")) {
      console.log("[SEQUENCE] Sequência de introdução v4.2 encontrada.");

      const audioGlitchAmbient = document.getElementById(
        "audio-glitch-ambient"
      );
      const audioReveal = document.getElementById("audio-reveal");
      const audioShine = document.getElementById("audio-shine");
      const startBtn = document.getElementById("start-sequence-btn");

      const runIntroSequence = () => {
        body.classList.add("no-scroll"); // ADICIONADO: Trava o scroll
        introSequence.querySelector("#intro-gate").classList.add("hidden");

        setTimeout(() => {
          introSequence
            .querySelector("#mantra-sequence")
            .classList.add("visible");
          if (audioGlitchAmbient) {
            audioGlitchAmbient.volume = 0.3;
            audioGlitchAmbient
              .play()
              .catch((e) =>
                console.warn("Autoplay de áudio ambiente bloqueado.")
              );
          }
        }, 500);

        // A linha para .mantra-logo-container.glitching foi removida pois não é mais usada.

        setTimeout(() => {
          introSequence
            .querySelector("#mantra-sequence")
            .classList.add("hidden");
          if (audioGlitchAmbient) {
            let ambientVolume = 0.3;
            const fadeOutInterval = setInterval(() => {
              ambientVolume -= 0.05;
              if (ambientVolume > 0) {
                audioGlitchAmbient.volume = ambientVolume;
              } else {
                audioGlitchAmbient.pause();
                clearInterval(fadeOutInterval);
              }
            }, 100);
          }
        }, 7500);

        setTimeout(() => {
          introSequence
            .querySelector("#morfeu-sequence")
            .classList.add("visible");
          if (audioReveal) {
            audioReveal.volume = 0.4;
            audioReveal
              .play()
              .catch((e) =>
                console.warn("Autoplay de áudio de revelação bloqueado.")
              );
          }
        }, 8500);

        setTimeout(() => {
          introSequence
            .querySelectorAll(".morfeu-letter")
            .forEach((letter, index) => {
              setTimeout(() => {
                letter.style.opacity = "1";
                letter.style.transform = "translateZ(0) rotateY(0) rotateX(0)";
                letter.classList.add("batuque");
              }, index * 100);
            });
        }, 9000);

        setTimeout(() => {
          const morfeuVersionSubtitle = introSequence.querySelector(
            ".morfeu-version-subtitle"
          );
          const isMobile = /Mobi|Android/i.test(navigator.userAgent);
          morfeuVersionSubtitle.textContent = isMobile
            ? "Versão para Celulares"
            : "Versão para Computadores";
          morfeuVersionSubtitle.classList.add("visible");
        }, 10000);

        setTimeout(() => {
          introSequence
            .querySelector(".morfeu-tagline")
            .classList.add("visible", "move-up");
          if (audioShine)
            audioShine
              .play()
              .catch((e) =>
                console.warn("Autoplay de áudio de brilho bloqueado.")
              );
        }, 10500);

        setTimeout(() => {
          introSequence.classList.add("hidden");
        }, 18000);

        setTimeout(() => {
          introSequence.style.display = "none";
          body.classList.remove("no-scroll"); // ADICIONADO: Libera o scroll no final
        }, 18500);

        sessionStorage.setItem("introPlayed_v4", "true");
      };

      const tryAutoplay = () => {
        if (!audioGlitchAmbient) {
          runIntroSequence();
          return;
        }
        const promise = audioGlitchAmbient.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              audioGlitchAmbient.pause();
              audioGlitchAmbient.currentTime = 0;
              runIntroSequence();
            })
            .catch(() => {
              startBtn.parentElement.style.opacity = "1";
              startBtn.addEventListener("click", runIntroSequence, {
                once: true,
              });
              body.classList.add("no-scroll"); // ADICIONADO: Trava o scroll se o autoplay falhar
            });
        }
      };

      body.classList.add("no-scroll"); // ADICIONADO: Garante que o scroll já comece travado
      introSequence.style.display = "flex";
      setTimeout(() => {
        introSequence.style.opacity = "1";
        tryAutoplay();
      }, 50);
    } else if (introSequence) {
      introSequence.style.display = "none";
      body.classList.remove("no-scroll"); // ADICIONADO: Garante que o scroll está liberado se a intro não for exibida
    }

    // --- 3. LÓGICA DO MODAL (EXISTENTE E FUNCIONAL) ---
    const cards = document.querySelectorAll(".service-card, .team-card");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop && cards.length > 0) {
      const modal = modalBackdrop.querySelector(".modal");
      const modalTitle = document.getElementById("modal-title");
      const modalDescription = document.getElementById("modal-description");
      const closeModalBtn = modal.querySelector(".modal-close-btn");
      cards.forEach((card) =>
        card.addEventListener("click", () => {
          modalTitle.textContent = card.dataset.title;
          modalDescription.textContent = card.dataset.description;
          modalBackdrop.style.opacity = "1";
          modalBackdrop.style.pointerEvents = "auto";
        })
      );
      const closeModal = () => {
        modalBackdrop.style.opacity = "0";
        modalBackdrop.style.pointerEvents = "none";
      };
      closeModalBtn.addEventListener("click", closeModal);
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // --- 4. LÓGICA DO FORMULÁRIO (EXISTENTE E FUNCIONAL) ---
    const form = document.getElementById("multiStepForm");
    if (form) {
      let currentStepIndex = 0;
      const steps = Array.from(form.querySelectorAll(".form-step"));
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const submitBtn = document.getElementById("submitBtn");

      const showStep = (index) => {
        steps.forEach((step, i) => {
          step.classList.toggle("active", i === index);
        });
        updateButtons();
      };

      const updateButtons = () => {
        prevBtn.style.display = currentStepIndex > 0 ? "inline-flex" : "none";
        nextBtn.style.display =
          currentStepIndex < steps.length - 1 ? "inline-flex" : "none";
        submitBtn.style.display =
          currentStepIndex === steps.length - 1 ? "inline-flex" : "none";
      };

      const validateCurrentStep = () => {
        const currentStepElement = steps[currentStepIndex];
        const requiredElements = currentStepElement.querySelectorAll(
          '[data-required="true"], input[required]'
        );
        let isStepValid = true;

        requiredElements.forEach((el) => {
          const group = el.closest(".form-group");
          let isValid = false;
          let inputToCheck = el;
          if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
            inputToCheck = el.querySelector("input");
          }

          if (inputToCheck.type === "radio") {
            if (
              currentStepElement.querySelector(
                `input[name="${inputToCheck.name}"]:checked`
              )
            )
              isValid = true;
          } else if (inputToCheck.type === "checkbox") {
            isValid = inputToCheck.checked;
          } else {
            if (inputToCheck.value.trim() !== "") isValid = true;
          }

          if (!isValid) {
            isStepValid = false;
            group.classList.add("has-error");
          } else {
            group.classList.remove("has-error");
          }
        });
        return isStepValid;
      };

      nextBtn.addEventListener("click", () => {
        if (validateCurrentStep()) {
          if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            showStep(currentStepIndex);
          }
        }
      });

      prevBtn.addEventListener("click", () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          showStep(currentStepIndex);
        }
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
          const formData = new FormData(form);
          const action = form.getAttribute("action");
          submitBtn.textContent = "Enviando...";
          submitBtn.disabled = true;

          fetch(action, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          })
            .then((response) => {
              if (response.ok) {
                const formWrapper = document.getElementById("form-wrapper");
                const successAnimation =
                  document.getElementById("success-animation");
                formWrapper.style.opacity = "0";
                setTimeout(() => {
                  formWrapper.classList.add("hidden");
                  successAnimation.classList.remove("hidden");
                  const successContent =
                    successAnimation.querySelector(".success-content");
                  const morfeuReveal =
                    successAnimation.querySelector(".morfeu-reveal");
                  successContent.classList.remove("hidden");
                  setTimeout(() => {
                    successContent.style.opacity = "0";
                    setTimeout(() => {
                      successContent.classList.add("hidden");
                      morfeuReveal.classList.remove("hidden");
                    }, 500);
                  }, 3000);
                  setTimeout(() => {
                    body.classList.add("is-entering");
                    setTimeout(
                      () => (window.location.href = "index.html"),
                      500
                    );
                  }, 7000);
                }, 500);
              } else {
                throw new Error("Network response was not ok.");
              }
            })
            .catch((error) => {
              alert(
                "Não foi possível enviar seu diagnóstico. Por favor, tente novamente."
              );
              submitBtn.textContent = "Enviar Diagnóstico";
              submitBtn.disabled = false;
            });
        }
      });
      showStep(0);
    }
  } catch (error) {
    console.error("MORFEU ERRO CRÍTICO GLOBAL:", error);
  }
});
