(function () {
      "use strict";
      document.body.classList.add("js");
      var D = window.PORTFOLIO_DATA;
      var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* ---------- i18n ---------- */
      var lang = "id";
      try { lang = localStorage.getItem("pf-lang") || "id"; } catch (e) {}
      if (!D[lang]) lang = "id";

      function T(key) {
        var cur = D[lang];
        key.split(".").forEach(function (k) { if (cur) cur = cur[k]; });
        return cur;
      }

      function applyStaticI18n() {
        document.documentElement.lang = lang;
        document.title = T("meta.title");
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
          var v = T(el.getAttribute("data-i18n"));
          if (typeof v !== "string") return;
          if (el.tagName === "META") { el.setAttribute("content", v); return; }
          el.textContent = v;
        });
        var target = lang === "id" ? "EN" : "ID";
        var lb1 = document.getElementById("lang-btn");
        var lb2 = document.getElementById("lang-btn-mobile");
        if (lb1) lb1.textContent = target;
        if (lb2) lb2.textContent = target;
      }

      function setLang(next) {
        lang = next;
        try { localStorage.setItem("pf-lang", lang); } catch (e) {}
        applyStaticI18n();
        renderTicker();
        renderStats();
        renderAchievements();
        renderSkills();
        renderProjects();
      }

      /* ---------- Ticker ---------- */
      function renderTicker() {
        var track = document.getElementById("ticker-track");
        if (!track) return;
        var items = T("ticker").map(function (t) {
          return '<span class="ticker__item">' + t + "</span>";
        }).join("");
        track.innerHTML = items + items;
      }

      /* ---------- Stats (accordion) ---------- */
      function renderStats() {
        var grid = document.getElementById("stats-grid");
        var panels = document.getElementById("stat-panels");
        if (!grid || !panels) return;
        var s = T("about.stats");
        var shortNames = T("projectShort");
        var repoBase = "https://github.com/mifada2543/";
        var keys = ["projects", "php", "ai", "y2026"];

        grid.innerHTML = keys.map(function (k, i) {
          var st = s[k];
          return '<button class="stat" type="button" aria-expanded="false" aria-controls="stat-panel-' + k + '" id="stat-btn-' + k + '" data-stat="' + k + '">' +
            '<div class="stat__row">' +
              '<span class="stat__num">' + st.num + '</span>' +
              '<svg class="stat__chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
            '</div>' +
            '<span class="stat__label">' + st.label + '</span>' +
          '</button>';
        }).join("");

        panels.innerHTML = keys.map(function (k) {
          var st = s[k];
          var inner = "";
          if (k === "projects") {
            inner = '<div class="stat-panel__card"><h3>' + st.open + '</h3><ul class="stat-list">' +
              Object.keys(shortNames).map(function (name) {
                return '<li><span class="proj-name">' + name + '</span> <span class="proj-desc">— ' + shortNames[name] + '</span></li>';
              }).join("") +
              '</ul><p style="margin-top:0.9rem">' + st.more + '</p></div>';
          } else {
            inner = '<div class="stat-panel__card"><h3>' + st.open + '</h3><p>' + st.body + '</p></div>';
          }
          return '<div class="stat-panel" id="stat-panel-' + k + '" role="region" aria-labelledby="stat-btn-' + k + '"><div class="stat-panel__inner">' + inner + '</div></div>';
        }).join("");

        grid.querySelectorAll(".stat").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var panel = document.getElementById("stat-panel-" + btn.dataset.stat);
            var isOpen = btn.getAttribute("aria-expanded") === "true";
            grid.querySelectorAll(".stat").forEach(function (b) {
              b.setAttribute("aria-expanded", "false");
              var p = document.getElementById("stat-panel-" + b.dataset.stat);
              if (p) p.classList.remove("open");
            });
            if (!isOpen) {
              btn.setAttribute("aria-expanded", "true");
              if (panel) panel.classList.add("open");
            }
          });
        });
      }

      /* ---------- Achievements ---------- */
      var ACHV_IMG = {
        "Pull Shark ×2": "https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png",
        "Pair Extraordinaire": "https://github.githubassets.com/assets/pair-extraordinaire-default-579438a20e01.png",
        "YOLO": "https://github.githubassets.com/assets/yolo-default-be0bbff04951.png",
        "Quickdraw": "https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png"
      };

      function renderAchievements() {
        var grid = document.getElementById("achv-grid");
        if (!grid) return;
        grid.innerHTML = T("achievements.items").map(function (item) {
          return '<div class="achv reveal">' +
            '<img src="' + (ACHV_IMG[item.name] || "MEeL.png") + '" alt="' + item.name + '" loading="lazy" width="64" height="64" />' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.desc + '</p>' +
          '</div>';
        }).join("");
        observeReveals();
      }

      /* ---------- Skills ---------- */
      function renderSkills() {
        var grid = document.getElementById("skills-grid");
        if (!grid) return;
        grid.innerHTML = T("skills.groups").map(function (g) {
          return '<div class="skill reveal"><h3>' + g.name + '</h3><div class="skill__tags">' +
            g.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") +
          '</div></div>';
        }).join("");
        observeReveals();
      }

      /* ---------- Projects ---------- */
      var GLOW_COLORS = {
        "MEeL-HUB": "rgba(52, 211, 153, 0.14)",
        "FikaAI": "rgba(245, 185, 66, 0.14)",
        "RoKenAI": "rgba(56, 189, 248, 0.14)",
        "WVGM": "rgba(45, 212, 191, 0.14)",
        "mikkan": "rgba(167, 139, 250, 0.14)",
        "MEPeL": "rgba(148, 163, 184, 0.14)",
        "Web": "rgba(148, 163, 184, 0.14)"
      };
      function renderProjects() {
        var grid = document.getElementById("projects-grid");
        if (!grid) return;
        var labels = T("projects.statusLabels");
        grid.innerHTML = T("projects.items").map(function (p, i) {
          var isWide = i === 0;
          var statusCls = p.status || "old";
          var demos = (p.demos || []).map(function (d) {
            return '<a class="project__demo" href="' + d.url + '" target="_blank" rel="noopener">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' +
              d.label + "</a>";
          }).join("");
          return '<article class="project reveal' + (isWide ? " project--wide" : "") + '" style="--glow:' + (GLOW_COLORS[p.name] || "rgba(52,211,153,0.14)") + '">' +
            '<p class="project__tune">tuning in: ' + p.tune + '</p>' +
            '<span class="project__status project__status--' + statusCls + '">' + (labels[p.status] || "—") + '</span>' +
            '<h3>' + p.name + '</h3>' +
            '<p class="project__desc">' + p.desc + '</p>' +
            '<div class="project__tech">' + p.tech.map(function (t) { return "<span>" + t + "</span>"; }).join("") + '</div>' +
            (demos ? '<div class="project__demos">' + demos + '</div>' : "") +
            '<div class="project__features"><ul>' + p.features.map(function (f) { return "<li>" + f + "</li>"; }).join("") + '</ul></div>' +
            '<a href="' + p.repo + '" class="project__link" target="_blank" rel="noopener">Buka repo →</a>' +
          '</article>';
        }).join("");
        observeReveals();
      }

      /* ---------- Reveal ---------- */
      var revealObs = null;
      function observeReveals() {
        if (prefersReduced || !("IntersectionObserver" in window)) {
          document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
          return;
        }
        if (!revealObs) {
          revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObs.unobserve(entry.target);
              }
            });
          }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        }
        document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) { revealObs.observe(el); });
      }

      /* ---------- Mobile menu ---------- */
      var mobileBtn = document.getElementById("mobile-btn");
      var mobileMenu = document.getElementById("mobile-menu");
      var iconOpen = document.getElementById("menu-icon-open");
      var iconClose = document.getElementById("menu-icon-close");

      function setMenu(open) {
        mobileMenu.classList.toggle("open", open);
        mobileBtn.setAttribute("aria-expanded", String(open));
        mobileBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
        iconOpen.style.display = open ? "none" : "block";
        iconClose.style.display = open ? "block" : "none";
      }

      if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", function () { setMenu(!mobileMenu.classList.contains("open")); });
        mobileMenu.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () { setMenu(false); });
        });
        document.addEventListener("click", function (e) {
          if (mobileMenu.classList.contains("open") && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) setMenu(false);
        });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && mobileMenu.classList.contains("open")) setMenu(false);
        });
      }

      /* ---------- Scroll spy + section label ---------- */
      var navLinks = document.querySelectorAll(".nav__links a[data-s], .nav__mobile a[data-s]");
      var sectionLabel = document.getElementById("section-label");
      var labelTimer = null;

      function showLabel(id) {
        if (!sectionLabel) return;
        var name = T("nav." + id) || id;
        sectionLabel.textContent = "// " + name;
        sectionLabel.classList.add("visible");
        clearTimeout(labelTimer);
        labelTimer = setTimeout(function () { sectionLabel.classList.remove("visible"); }, 1600);
      }

      if ("IntersectionObserver" in window) {
        var spyObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              navLinks.forEach(function (a) { a.classList.toggle("active", a.dataset.s === id); });
            }
          });
        }, { threshold: 0.4 });
        document.querySelectorAll("section[id]").forEach(function (s) { spyObs.observe(s); });
      }

      /* ---------- Scroll progress + nav shadow ---------- */
      var bar = document.getElementById("scroll-progress");
      var nav = document.getElementById("nav");
      var ticking = false;
      function onScroll() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? window.scrollY / max : 0;
        bar.style.transform = "scaleX(" + pct + ")";
        nav.classList.toggle("scrolled", window.scrollY > 8);
        ticking = false;
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
      }, { passive: true });

      /* ---------- Page transition ---------- */
      var slices = document.querySelectorAll(".overlay-slice");
      var overlay = document.getElementById("transition-overlay");
      var transitioning = false;

      function resetSlices() {
        slices.forEach(function (s) { s.classList.remove("slice-in", "slice-out"); s.style.transform = "scaleY(0)"; });
      }

      function transitionTo(target, id) {
        if (transitioning) return;
        transitioning = true;
        overlay.style.pointerEvents = "all";
        resetSlices();
        slices.forEach(function (s, i) {
          s.style.transform = "";
          setTimeout(function () { s.classList.add("slice-in"); }, i * 30);
        });
        var inEnd = (slices.length - 1) * 30 + 350;
        setTimeout(function () {
          var navH = nav.offsetHeight + 20;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: "auto" });
          showLabel(id);
          slices.forEach(function (s, i) {
            s.classList.remove("slice-in");
            s.style.transform = "scaleY(1)";
            setTimeout(function () { s.classList.add("slice-out"); }, i * 32 + 40);
          });
          var outEnd = (slices.length - 1) * 32 + 460 + 40;
          setTimeout(function () {
            resetSlices();
            overlay.style.pointerEvents = "none";
            transitioning = false;
          }, outEnd);
        }, inEnd);
      }

      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var href = a.getAttribute("href");
          if (!href || href === "#") return;
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          var target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          if (location.hash !== href) history.pushState(null, "", href);
          if (prefersReduced) {
            var navH = nav.offsetHeight + 20;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH });
            showLabel(href.slice(1));
            return;
          }
          transitionTo(target, href.slice(1));
        });
      });

      window.addEventListener("popstate", function () {
        var id = location.hash ? location.hash.slice(1) : "home";
        var target = document.getElementById(id);
        if (target) {
          var navH = nav.offsetHeight + 20;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH });
          showLabel(id);
        }
      });

      /* ---------- Lang buttons ---------- */
      var langBtns = [document.getElementById("lang-btn"), document.getElementById("lang-btn-mobile")];
      langBtns.forEach(function (btn) {
        if (btn) btn.addEventListener("click", function () {
          setLang(lang === "id" ? "en" : "id");
          setMenu(false); /* tutup menu mobile setelah ganti bahasa */
        });
      });

      /* ---------- Init ---------- */
      applyStaticI18n();
      renderTicker();
      renderStats();
      renderAchievements();
      renderSkills();
      renderProjects();
      observeReveals();
      onScroll();
    })();
