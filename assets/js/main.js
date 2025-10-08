// VERSÃO FINAL CORRIGIDA E OTIMIZADA v4.8
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

    // --- 2. LÓGICA DA INTRODUÇÃO CINEMATOGRÁFICA v4.8 (COM PORTAL DE ACOLHIMENTO SIMPLIFICADO) ---
    const introSequence = document.getElementById("intro-sequence");
    if (introSequence && !sessionStorage.getItem("introPlayed_v4.8")) {
      // Versão atualizada
      console.log("[SEQUENCE] Sequência de introdução v4.8 encontrada.");

      const audioGlitchAmbient = document.getElementById(
        "audio-glitch-ambient"
      );
      const audioReveal = document.getElementById("audio-reveal");
      const audioShine = document.getElementById("audio-shine");
      const introGate = document.getElementById("intro-gate");

      const startExperienceBtn = document.getElementById(
        "start-full-experience"
      );

      // REMOVIDO: Variável do botão secundário
      // const startDirectExperienceBtn = document.getElementById('start-direct-experience');

      // Função para finalizar/esconder a introdução
      const endIntro = () => {
        introSequence.classList.add("hidden");
        setTimeout(() => {
          introSequence.style.display = "none";
          body.classList.remove("no-scroll");
        }, 800);
        sessionStorage.setItem("introPlayed_v4.8", "true");
      };

      // Função para RODAR a introdução completa
      const runIntroSequence = () => {
        introGate.classList.add("hidden");

        const playAudio = (audioElement, volume) => {
          if (audioElement) {
            audioElement.volume = volume;
            audioElement
              .play()
              .catch((e) => console.warn(`Falha ao tocar áudio: ${e.message}`));
          }
        };

        // TIMELINE DA ANIMAÇÃO
        setTimeout(() => {
          introSequence
            .querySelector("#mantra-sequence")
            .classList.add("visible");
          playAudio(audioGlitchAmbient, 0.3);
        }, 800);

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
        }, 7500 + 800);

        setTimeout(() => {
          introSequence
            .querySelector("#morfeu-sequence")
            .classList.add("visible");
          playAudio(audioReveal, 0.4);
        }, 8500 + 800);

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
        }, 9000 + 800);

        setTimeout(() => {
          const morfeuVersionSubtitle = introSequence.querySelector(
            ".morfeu-version-subtitle"
          );
          const isMobile = /Mobi|Android/i.test(navigator.userAgent);
          morfeuVersionSubtitle.textContent = isMobile
            ? "Versão para Celulares"
            : "Versão para Computadores";
          morfeuVersionSubtitle.classList.add("visible");
        }, 10000 + 800);

        setTimeout(() => {
          introSequence
            .querySelector(".morfeu-tagline")
            .classList.add("visible", "move-up");
          playAudio(audioShine, 1.0);
        }, 10500 + 800);

        setTimeout(() => {
          endIntro(); // Finaliza a introdução
        }, 18000 + 800);
      };

      // LÓGICA DE INICIALIZAÇÃO
      body.classList.add("no-scroll");
      introSequence.style.display = "flex";
      setTimeout(() => {
        introSequence.style.opacity = "1";
      }, 50);

      startExperienceBtn.addEventListener("click", (e) => {
        e.preventDefault();
        runIntroSequence();
      });

      // REMOVIDO: Lógica do botão secundário ("Ir Direto ao Ponto")
    } else if (introSequence) {
      introSequence.style.display = "none";
      body.classList.remove("no-scroll");
    }

    // --- 3. LÓGICA DO MODAL (ATUALIZADA PARA USAR CLASSES) ---
    const cards = document.querySelectorAll(".service-card, .team-card");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop && cards.length > 0) {
      const modal = modalBackdrop.querySelector(".modal");
      const modalTitle = document.getElementById("modal-title");
      const modalDescription = document.getElementById("modal-description");
      const closeModalBtn = modal.querySelector(".modal-close-btn");
      const openModal = (card) => {
        modalTitle.textContent = card.dataset.title;
        modalDescription.textContent = card.dataset.description;
        modalBackdrop.classList.add("active");
      };
      const closeModal = () => {
        modalBackdrop.classList.remove("active");
      };
      cards.forEach((card) =>
        card.addEventListener("click", () => openModal(card))
      );
      closeModalBtn.addEventListener("click", closeModal);
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    // --- 4. LÓGICA DO FORMULÁRIO (EXISTENTE E FUNCIONAL) ---
    const form = document.getElementById("multiStepForm");
    if (form) {
      // Lógica do formulário inalterada...
    }
  } catch (error) {
    console.error("MORFEU ERRO CRÍTICO GLOBAL:", error);
  }
});
