document.addEventListener("DOMContentLoaded", () => {
  try {
    const body = document.body;

    // --- LÓGICA DE TRANSIÇÃO DE PÁGINA (EXISTENTE) ---
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
    if (introSequence && !sessionStorage.getItem("introPlayed")) {
      // Seleciona todos os elementos da cena
      const audioGlitchAmbient = document.getElementById(
        "audio-glitch-ambient"
      );
      const audioGlitchImpact = document.getElementById("audio-glitch-impact");
      const audioReveal = document.getElementById("audio-reveal");
      const audioShine = document.getElementById("audio-shine");
      const mantraSequence = document.getElementById("mantra-sequence");
      const morfeuSequence = document.getElementById("morfeu-sequence");
      const glitchOverlay = mantraSequence.querySelector(".glitch-overlay");
      const mantraLogo = mantraSequence.querySelector(".mantra-logo");
      const morfeuLogo = morfeuSequence.querySelector(".morfeu-logo");
      const morfeuTagline = morfeuSequence.querySelector(".morfeu-tagline");

      // --- INICIA A TIMELINE DA ANIMAÇÃO ---

      // 0.0s: A cena começa
      introSequence.style.display = "flex";
      setTimeout(() => (introSequence.style.opacity = "1"), 100);

      // Fase 1: Mantra
      setTimeout(() => {
        mantraSequence.style.opacity = "1";
        audioGlitchAmbient.volume = 0.3;
        audioGlitchAmbient.play();
      }, 500); // 0.5s

      setTimeout(() => {
        glitchOverlay.style.display = "block";
        mantraLogo.style.opacity = "1";
        mantraLogo.classList.add("glitching");
      }, 2000); // 2.0s

      // 5.5s: Impacto e corte
      setTimeout(() => {
        audioGlitchImpact.play();
        mantraSequence.style.opacity = "0";
        audioGlitchAmbient.pause();
      }, 5500);

      // Fase 2: Transição (silêncio)
      // (Ocorre naturalmente entre 6.0s e 7.0s)

      // Fase 3: Morfeu
      setTimeout(() => {
        morfeuSequence.style.opacity = "1";
        audioReveal.volume = 0.5;
        audioReveal.play();
      }, 7000); // 7.0s

      setTimeout(() => {
        morfeuLogo.classList.add("visible", "move-up");
      }, 7200); // 7.2s

      setTimeout(() => {
        morfeuTagline.classList.add("visible", "move-up");
        audioShine.play();
      }, 8200); // 8.2s

      // 11.5s: Fim da cena
      setTimeout(() => {
        introSequence.style.opacity = "0";
      }, 11500);

      // 12.0s: Esconde a animação e permite a interação com a página
      setTimeout(() => {
        introSequence.style.display = "none";
      }, 12000);

      // Marca que a animação já foi vista nesta sessão
      sessionStorage.setItem("introPlayed", "true");
    } else if (introSequence) {
      introSequence.style.display = "none";
    }

    // --- LÓGICA DO MODAL (EXISTENTE) ---
    const cards = document.querySelectorAll(".service-card, .team-card");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop && cards.length > 0) {
      // ... (código do modal permanece o mesmo)
    }

    // --- LÓGICA DO FORMULÁRIO DE DIAGNÓSTICO (EXISTENTE) ---
    const form = document.getElementById("multiStepForm");
    if (form) {
      // ... (código do formulário permanece o mesmo)
    }
  } catch (error) {
    console.error("MORFEU ERRO CRÍTICO:", error);
  }
});
