/* =========================================================
   PRACTICE LIBRARY — shared behavior
   1. Gentle scroll-in animations + reading progress bar
   2. Copy buttons on every .mantra
   3. A day tracker on any element with data-tracker="unique-id"
      Optional: data-days="40" (default 40)
      Celebrates check-ins with messages, confetti and milestones.
   Progress is saved in the reader's own browser only.
   Anyone with "reduce motion" turned on gets no animation.
   ========================================================= */

(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- safe storage ----------
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  // ---------- 1. scroll-in animations ----------
  if (!reduceMotion) {
    document.documentElement.classList.add("anim");
    var targets = ".hero > *, .crumbs, main > h2, main > h3, .beat, .mantra, .compare > div, .card, " +
                  ".steps li, .voices li, .sequence li, .tags, .toc, .tracker, .screen, .book";
    var staggerParents = "ul, ol, .compare, .hero, .shelf";
    var pending = [];

    document.querySelectorAll(targets).forEach(function (el) {
      if (el.closest(".tracker") && !el.classList.contains("tracker")) return;
      el.classList.add("reveal");
      if (el.parentElement && el.parentElement.matches(staggerParents)) {
        var i = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.transitionDelay = Math.min(i, 6) * 80 + "ms";
        el.addEventListener("transitionend", function () { el.style.transitionDelay = ""; }, { once: true });
      }
      pending.push(el);
    });

    // Reveal anything that has scrolled into (or past) the bottom 94% of the screen
    var ticking = false;
    var check = function () {
      ticking = false;
      var limit = window.innerHeight * 0.94;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) { el.classList.add("in"); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
  }

  // ---------- reading progress bar (practice pages) ----------
  var header = document.querySelector(".site-header");
  if (header && document.querySelector(".toc, .tracker")) {
    var bar = document.createElement("div");
    bar.className = "read-progress";
    header.appendChild(bar);
    var updateBar = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar);
    updateBar();
  }

  // ---------- toast messages ----------
  var toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var toastTimer;
  function showToast(msg, big) {
    toast.textContent = msg;
    toast.classList.toggle("big", !!big);
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, big ? 4200 : 2600);
  }

  // ---------- confetti ----------
  var COLORS = ["#5b2a4e", "#8e4f7c", "#c99bbd", "#e8d3e1", "#d4a24c"];
  function confetti(el, count) {
    if (reduceMotion || !el) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "confetti";
      var angle = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * (count > 40 ? 220 : 120);
      p.style.left = cx + "px"; p.style.top = cy + "px";
      p.style.background = COLORS[i % COLORS.length];
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist - 40 + "px");
      p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      p.style.animationDelay = Math.random() * 80 + "ms";
      if (i % 3 === 0) p.style.borderRadius = "50%";
      document.body.appendChild(p);
      setTimeout(function (n) { n.remove(); }, 1400, p);
    }
  }

  // ---------- 2. copy buttons on mantras ----------
  document.querySelectorAll(".mantra").forEach(function (box) {
    var clone = box.cloneNode(true);
    var label = clone.querySelector("small");
    if (label) label.remove();
    var text = clone.textContent.trim();
    var btn = document.createElement("button");
    btn.className = "copy-btn"; btn.type = "button"; btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied ✓"; btn.classList.add("done");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1800);
      });
    });
    box.appendChild(btn);
  });

  // ---------- 3. day tracker ----------
  var DAY = 86400000;
  var DAY_MESSAGES = [
    "Day {n} complete. Beautifully done.",
    "Day {n} complete. Repetition is the rewiring.",
    "Day {n} complete. Another day of evidence.",
    "Day {n} complete. Your body is learning safety."
  ];
  var MILESTONES = {
    7: "One full week. The new pattern is forming.",
    14: "Two weeks of practice. Your brain is learning this is normal.",
    21: "Three weeks. This is becoming familiar.",
    30: "30 days. Look how far you have come.",
    40: "All 40 days complete. Your body knows this now."
  };

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dayNumber(startISO, total) {
    var s = new Date(startISO + "T00:00:00"), t = new Date(todayISO() + "T00:00:00");
    var n = Math.round((t - s) / DAY) + 1;
    return Math.max(1, Math.min(total, n));
  }
  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function isFull(d) { return !!(d && d.m && d.e); }

  document.querySelectorAll("[data-tracker]").forEach(function (root) {
    var key = "practice:" + root.getAttribute("data-tracker");
    var total = parseInt(root.getAttribute("data-days") || "40", 10);
    var state = load(key) || { start: null, days: {} };
    var selected = null;
    var popDay = null;

    var startBox = root.querySelector(".tracker-start");
    var body = root.querySelector(".tracker-body");
    var grid = root.querySelector(".grid40");
    var title = root.querySelector(".day-title");
    var m = root.querySelector("[data-field=m]");
    var e = root.querySelector("[data-field=e]");
    var note = root.querySelector("[data-field=note]");
    var log = root.querySelector(".evidence-log");

    // Progress summary, added automatically above the grid
    var prog = document.createElement("div");
    prog.className = "tracker-progress";
    prog.innerHTML = '<div class="tp-stats"><span class="tp-count"></span><span class="tp-streak"></span></div>' +
                     '<div class="tp-bar"><span></span></div>';
    grid.parentNode.insertBefore(prog, grid);

    function fullCount() {
      return Object.keys(state.days).filter(function (k) { return isFull(state.days[k]); }).length;
    }
    function streak(today) {
      var n = 0, i = isFull(state.days[today]) ? today : today - 1;
      while (i >= 1 && isFull(state.days[i])) { n++; i--; }
      return n;
    }

    function render() {
      if (!state.start) { startBox.hidden = false; body.hidden = true; return; }
      startBox.hidden = true; body.hidden = false;
      var today = dayNumber(state.start, total);
      if (!selected) selected = today;

      var done = fullCount(), s = streak(today);
      prog.querySelector(".tp-count").textContent = done + " of " + total + " days complete";
      prog.querySelector(".tp-streak").textContent = s > 1 ? s + "-day streak" : "";
      prog.querySelector(".tp-bar span").style.width = (done / total * 100) + "%";

      grid.innerHTML = "";
      var popped = null;
      for (var i = 1; i <= total; i++) {
        var d = state.days[i] || {};
        var b = document.createElement("button");
        b.type = "button"; b.textContent = i;
        if (isFull(d)) b.className = "full"; else if (d.m || d.e || d.note) b.className = "half";
        if (i === today) b.classList.add("today");
        if (i === selected) b.classList.add("sel");
        if (i === popDay) { b.classList.add("pop"); popped = b; }
        b.setAttribute("aria-label", "Day " + i + (isFull(d) ? ", complete" : ""));
        (function (n) { b.addEventListener("click", function () { selected = n; popDay = null; render(); }); })(i);
        grid.appendChild(b);
      }
      popDay = null;

      var cur = state.days[selected] || {};
      title.textContent = "Day " + selected + " of " + total + (selected === today ? " · today" : "");
      m.checked = !!cur.m; e.checked = !!cur.e; note.value = cur.note || "";

      var items = Object.keys(state.days).map(Number).filter(function (k) { return state.days[k].note; }).sort(function (a, b) { return b - a; });
      log.innerHTML = items.length
        ? items.map(function (k) { return "<li><span>Day " + k + "</span>" + esc(state.days[k].note) + "</li>"; }).join("")
        : '<li class="meta">Your evidence of support will collect here.</li>';
      return popped;
    }

    function update(changed) {
      var before = state.days[selected] || {};
      var wasFull = isFull(before);
      var hadNote = before.note || "";
      var d = { m: m.checked, e: e.checked, note: note.value.trim() };
      state.days[selected] = d; save(key, state);

      var nowFull = isFull(d);
      if (nowFull && !wasFull) popDay = selected;
      var cell = render();

      if (nowFull && !wasFull) {
        var count = fullCount();
        if (MILESTONES[count]) { showToast(MILESTONES[count], true); confetti(cell, 70); }
        else { showToast(DAY_MESSAGES[selected % DAY_MESSAGES.length].replace("{n}", selected)); confetti(cell, 28); }
      } else if (changed === "m" && d.m) {
        showToast("Morning practice complete.");
      } else if (changed === "e" && d.e) {
        showToast("Evening practice complete.");
      } else if (changed === "note" && d.note && d.note !== hadNote) {
        showToast("Saved to your evidence log.");
      }
    }

    root.querySelector("[data-action=start]").addEventListener("click", function (ev) {
      state.start = todayISO(); save(key, state); render();
      showToast("Day 1 begins. Welcome to the practice.");
      confetti(grid.querySelector(".today"), 20);
    });
    root.querySelector("[data-action=reset]").addEventListener("click", function () {
      if (confirm("Start over? This clears all days and notes for this practice.")) {
        state = { start: null, days: {} }; selected = null; save(key, state); render();
      }
    });
    m.addEventListener("change", function () { update("m"); });
    e.addEventListener("change", function () { update("e"); });
    note.addEventListener("change", function () { update("note"); });

    render();
  });
})();
