
(function() {
  function renderRecommendations(container, data) {
    // Clear container
    container.innerHTML = "";
    const carousel = document.createElement("div");
    carousel.className = "carousel";

    const dots = document.createElement("div");
    dots.className = "dots";

    data.recommendations.forEach((item, idx) => {
      const t = document.createElement("div");
      t.className = "testimonial" + (idx === 0 ? " active" : "");
      const img = document.createElement("img");
      img.src = item.image || "";
      img.alt = item.alt || item.name || "Recommender";

      const text = document.createElement("div");
      text.className = "testimonial-text";
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = item.name || "";
      p.appendChild(strong);
      p.insertAdjacentHTML("beforeend", "<br>" + (item.quote || ""));
      text.appendChild(p);

      t.appendChild(img);
      t.appendChild(text);
      carousel.appendChild(t);

      const dot = document.createElement("span");
      dot.className = "dot" + (idx === 0 ? " active" : "");
      dot.dataset.index = idx;
      dots.appendChild(dot);
    });

    container.appendChild(carousel);
    container.appendChild(dots);

    // Interactivity
    let current = 0;
    const testimonials = Array.from(carousel.querySelectorAll(".testimonial"));
    const dotEls = Array.from(dots.querySelectorAll(".dot"));

    function show(i) {
      testimonials[current].classList.remove("active");
      dotEls[current].classList.remove("active");
      current = (i + testimonials.length) % testimonials.length;
      testimonials[current].classList.add("active");
      dotEls[current].classList.add("active");
    }

    dotEls.forEach(d => {
      d.addEventListener("click", () => show(parseInt(d.dataset.index, 10)));
    });

    // Auto-rotate
    let timer = setInterval(() => show(current + 1), 6000);

    // Pause on hover
    container.addEventListener("mouseenter", () => clearInterval(timer));
    container.addEventListener("mouseleave", () => {
      timer = setInterval(() => show(current + 1), 6000);
    });
  }

  async function init() {
    const section = document.getElementById("recommendations");
    if (!section) return;
    // Find a data-src, else default to assets/recommendations.json
    const carousel = section.querySelector(".carousel");
    const src = (carousel && carousel.getAttribute("data-src")) || "assets/recommendations.json";
    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load recommendations JSON");
      const data = await res.json();
      renderRecommendations(section, data);
    } catch (e) {
      console.error(e);
      // Fallback: if JSON missing, keep any static content
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
