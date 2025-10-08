// VERSÃO FINAL E DEFINITIVA - COM INTRODUÇÃO CINEMATOGRÁFICA
document.addEventListener("DOMContentLoaded", () => {
  try {
    const body = document.body;

    // --- LÓGICA DE TRANSIÇÃO DE PÁGINA (EXISTENTE E FUNCIONAL) ---
    requestAnimationFrame(() => {
      body.classList.remove("is-entering");
    });
    document.querySelectorAll('a:not([href^="#"])').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.origin);
        if (url.hostname === window.location.hostname) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const destination = link.href;
            body.classList.add("is-entering");
            setTimeout(() => {
              window.location.href = destination;
            }, 500);
          });
        }
      } catch (e) {
        /* Ignora links inválidos */
      }
    });

    // --- NOVA LÓGICA DA INTRODUÇÃO CINEMATOGRÁFICA ---
    const introSequence = document.getElementById("intro-sequence");
    if (introSequence && !sessionStorage.getItem("introPlayed_v2")) {
      // Exibe o portal de entrada
      introSequence.style.display = "flex";
      setTimeout(() => {
        introSequence.style.opacity = "1";
      }, 50);

      const startBtn = document.getElementById("start-sequence-btn");
      const introGate = document.getElementById("intro-gate");

      startBtn.addEventListener("click", () => {
        // Esconde o botão e inicia a sequência
        introGate.classList.add("hidden");

        // Seleciona todos os elementos da cena
        const allAudio = introSequence.querySelectorAll("audio");
        const audioGlitchAmbient = document.getElementById(
          "audio-glitch-ambient"
        );
        const audioGlitchImpact = document.getElementById(
          "audio-glitch-impact"
        );
        const audioReveal = document.getElementById("audio-reveal");
        const audioShine = document.getElementById("audio-shine");

        const gridBg = document.getElementById("intro-grid-background");
        const mantraSequence = document.getElementById("mantra-sequence");
        const mantraLogoContainer = mantraSequence.querySelector(
          ".mantra-logo-container"
        );
        const morfeuSequence = document.getElementById("morfeu-sequence");
        const morfeuLogo = morfeuSequence.querySelector(".morfeu-logo");
        const morfeuTagline = morfeuSequence.querySelector(".morfeu-tagline");

        // Garante que todos os sons possam tocar
        allAudio.forEach((audio) => audio.play().then(() => audio.pause()));

        // --- INICIA A TIMELINE DA ANIMAÇÃO ---

        // 0.0s (após o clique): A cena começa
        setTimeout(() => {
          gridBg.classList.add("visible");
          mantraSequence.classList.add("visible");
          audioGlitchAmbient.volume = 0.3;
          audioGlitchAmbient.play();
        }, 500);

        // 2.0s: Logo Mantra aparece e começa o glitch
        setTimeout(() => {
          mantraLogoContainer.classList.add("visible", "glitching");
        }, 2000);

        // 5.5s: Impacto e corte para preto
        setTimeout(() => {
          audioGlitchImpact.play();
          mantraSequence.classList.add("hidden");
          audioGlitchAmbient.pause();
        }, 5500);

        // 7.0s: Início da revelação Morfeu
        setTimeout(() => {
          gridBg.classList.add("hidden");
          morfeuSequence.classList.add("visible");
          audioReveal.volume = 0.5;
          audioReveal.play();
        }, 7000);

        // 7.2s: Logo Morfeu aparece
        setTimeout(() => {
          morfeuLogo.classList.add("visible", "move-up");
        }, 7200);

        // 8.2s: Tagline Morfeu aparece
        setTimeout(() => {
          morfeuTagline.classList.add("visible", "move-up");
          audioShine.play();
        }, 8200);

        // 11.5s: Fade out final
        setTimeout(() => {
          introSequence.classList.add("hidden");
        }, 11500);

        // 12.0s: Esconde completamente a animação
        setTimeout(() => {
          introSequence.style.display = "none";
        }, 12000);

        // Marca que a animação já foi vista nesta sessão
        sessionStorage.setItem("introPlayed_v2", "true");
      });
    } else if (introSequence) {
      introSequence.style.display = "none";
    }

    // --- LÓGICA DO MODAL (EXISTENTE E FUNCIONAL) ---
    const cards = document.querySelectorAll(".service-card, .team-card");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop && cards.length > 0) {
      // ... (código do modal permanece o mesmo)
    }

    // --- LÓGICA DO FORMULÁRIO (EXISTENTE E FUNCIONAL) ---
    const form = document.getElementById("multiStepForm");
    if (form) {
      // ... (código do formulário permanece o mesmo)
    }
  } catch (error) {
    console.error("MORFEU ERRO CRÍTICO:", error);
  }
});
