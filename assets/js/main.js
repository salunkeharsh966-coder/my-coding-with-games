/* ==========================================================================
   Coding Through Games — shared site behaviour
   - mobile navigation
   - active nav highlighting
   - global CEP progress (which activities the student has completed)
   - localStorage helpers + reset control
   No external dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'ctg-progress-v1';

  /* ---------- storage helpers ---------- */
  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  function writeStore(obj) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* private mode */ }
  }
  function markDone(slug, payload) {
    var s = readStore();
    s[slug] = Object.assign({ done: true, at: new Date().toISOString() }, payload || {});
    writeStore(s);
    renderProgress();
  }
  function isDone(slug) {
    var s = readStore();
    return !!(s[slug] && s[slug].done);
  }
  function clearAll() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    renderProgress();
  }

  /* Activity registry — order matters for the progress bar */
  var ACTIVITIES = [
    { slug: 'algorithm-maze',   title: 'Algorithm Maze' },
    { slug: 'find-the-bug',     title: 'Find the Bug' },
    { slug: 'if-else-challenge', title: 'If–Else Challenge' },
    { slug: 'pattern-detective', title: 'Pattern Detective' },
    { slug: 'guess-output',     title: 'Guess the Output' }
  ];

  /* ---------- global progress rendering ---------- */
  function renderProgress() {
    var nodes = document.querySelectorAll('[data-progress]');
    if (!nodes.length) return;
    var store = readStore();
    var done = 0;
    for (var i = 0; i < ACTIVITIES.length; i++) {
      if (store[ACTIVITIES[i].slug] && store[ACTIVITIES[i].slug].done) done++;
    }
    var pct = Math.round((done / ACTIVITIES.length) * 100);

    Array.prototype.forEach.call(nodes, function (el) {
      var fill = el.querySelector('.js-progress-fill');
      var text = el.querySelector('.js-progress-text');
      if (fill) fill.style.width = pct + '%';
      if (text) text.textContent = done + ' of ' + ACTIVITIES.length + ' activities completed (' + pct + '%)';
    });

    /* activity hub cards */
    Array.prototype.forEach.call(document.querySelectorAll('[data-activity-card]'), function (card) {
      var slug = card.getAttribute('data-activity-card');
      var pill = card.querySelector('.status-pill');
      var s = store[slug];
      if (s && s.done) {
        if (pill) {
          pill.classList.add('done');
          pill.textContent = 'Completed' + (typeof s.score === 'number' ? ' · ' + s.score + '%' : '');
        }
        card.classList.add('is-done');
      }
    });

    /* reset button visibility */
    Array.prototype.forEach.call(document.querySelectorAll('[data-reset-progress]'), function (btn) {
      btn.hidden = done === 0;
    });
  }

  /* ---------- navigation ---------- */
  function wireNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? '✕ Close' : '☰ Menu';
      });
      Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '☰ Menu'; }
        });
      });
    }

    /* active link by filename */
    var here = location.pathname.split('/').pop() || 'index.html';
    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function (a) {
      var target = a.getAttribute('href');
      if (!target) return;
      if (target === here || (here === '' && target === 'index.html')) a.classList.add('is-active');
    });
  }

  /* ---------- placeholder tooltips ---------- */
  function wirePlaceholders() {
    Array.prototype.forEach.call(document.querySelectorAll('.ph'), function (el) {
      if (!el.title) el.title = 'Placeholder — replace with real data collected during the field visit.';
    });
  }

  /* ---------- year stamp ---------- */
  function stampYear() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- public API (used by quiz.js / maze.js) ---------- */
  window.CTG = {
    markDone: markDone,
    isDone: isDone,
    readStore: readStore,
    clearAll: clearAll,
    renderProgress: renderProgress,
    activities: ACTIVITIES
  };

  document.addEventListener('DOMContentLoaded', function () {
    wireNav();
    wirePlaceholders();
    stampYear();
    renderProgress();

    Array.prototype.forEach.call(document.querySelectorAll('[data-reset-progress]'), function (btn) {
      btn.addEventListener('click', function () {
        if (window.confirm('Reset all saved activity progress on this device?')) clearAll();
      });
    });
  });
})();
