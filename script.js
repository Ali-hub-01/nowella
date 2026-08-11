/* NOWELLA - интерактив лэндинга */
(function () {
  "use strict";

  var WA_NUMBER = "77058399888";

  /* ---------- Header: состояние при скролле ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav();
  });

  /* ---------- Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- CTA карточек: подставить услугу в форму ---------- */
  var serviceSelect = document.getElementById("f-service");

  document.querySelectorAll(".card__cta[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var service = link.getAttribute("data-service");
      for (var i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text === service) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    });
  });

  /* ---------- Форма: сборка сообщения -> WhatsApp ---------- */
  var form = document.getElementById("calc-form");
  var success = document.getElementById("form-success");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var service = form.service.value;
    var comment = form.comment.value.trim();

    var valid = true;
    [form.name, form.phone].forEach(function (field) {
      var empty = !field.value.trim();
      field.classList.toggle("is-error", empty);
      if (empty) valid = false;
    });
    if (!valid) {
      (!name ? form.name : form.phone).focus();
      return;
    }

    var lines = [
      "Здравствуйте! Заявка с сайта Nowella.",
      "Имя: " + name,
      "Телефон: " + phone
    ];
    if (service) lines.push("Услуга: " + service);
    if (comment) lines.push("Комментарий: " + comment);
    lines.push("Прошу рассчитать стоимость.");

    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");

    success.hidden = false;
    form.querySelector(".form__submit").disabled = true;
    setTimeout(function () {
      form.querySelector(".form__submit").disabled = false;
    }, 4000);
  });

  ["input", "change"].forEach(function (evt) {
    form.addEventListener(evt, function (e) {
      if (e.target.classList && e.target.classList.contains("is-error") && e.target.value.trim()) {
        e.target.classList.remove("is-error");
      }
    });
  });

  /* ---------- Год в футере ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
