/* ==========================================================================
   Coding Through Games — shared quiz engine
   Powers: Find the Bug, If-Else Challenge, Pattern Detective, Guess the Output
   Renders one question at a time, gives instant feedback, tracks score,
   shows a final report with a per-question review, persists the best score.

   The host page only needs:
     <div id="quiz-root" data-activity="find-the-bug"></div>
   ========================================================================== */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  var KEYS = ['A', 'B', 'C', 'D', 'E'];

  function Quiz(root) {
    this.root = root;
    this.slug = root.getAttribute('data-activity');
    this.data = (window.CTG_DATA || {})[this.slug];
    this.i = 0;
    this.score = 0;
    this.locked = false;
    this.answers = [];
    if (!this.data) {
      root.innerHTML = '<div class="quiz-body"><p>Activity data could not be loaded.</p></div>';
      return;
    }
    this.questions = this.data.questions;
    this.render();
  }

  Quiz.prototype.shell = function (inner, extraHead) {
    var total = this.questions.length;
    var done = Math.min(this.i, total);
    var pct = Math.round((done / total) * 100);
    return '' +
      '<div class="quiz-head">' +
        '<h2>' + esc(this.data.title) + '</h2>' +
        '<span class="spacer"></span>' +
        (extraHead || '') +
        '<span class="score-chip" id="q-score">Score: <b>0</b> / ' + total + '</span>' +
      '</div>' +
      '<div class="progress-track"><div class="progress-fill" id="q-progress" style="width:' + pct + '%"></div></div>' +
      '<div class="progress-meta">' +
        '<span id="q-pos">' + (done < total ? 'Question ' + (this.i + 1) + ' of ' + total : 'Complete') + '</span>' +
        '<span>' + esc(this.data.concept) + '</span>' +
      '</div>' +
      inner;
  };

  Quiz.prototype.updateChrome = function () {
    var total = this.questions.length;
    var done = Math.min(this.i, total);
    var fill = document.getElementById('q-progress');
    var pos = document.getElementById('q-pos');
    var sc = document.getElementById('q-score');
    if (fill) fill.style.width = Math.round((done / total) * 100) + '%';
    if (pos) pos.textContent = done < total ? 'Question ' + (this.i + 1) + ' of ' + total : 'Complete';
    if (sc) sc.innerHTML = 'Score: <b>' + this.score + '</b> / ' + total;
  };

  Quiz.prototype.render = function () {
    var q = this.questions[this.i];
    var self = this;
    this.locked = false;

    var opts = q.options.map(function (o, idx) {
      return '<li><button class="opt" type="button" data-idx="' + idx + '">' +
        '<span class="key">' + KEYS[idx] + '</span><span>' + esc(o) + '</span>' +
      '</button></li>';
    }).join('');

    var inner = '<div class="quiz-body">' +
      '<p class="q-stem">' + esc(q.stem) + '</p>' +
      '<p class="q-prompt">' + esc(q.prompt) + '</p>' +
      (q.code ? '<pre class="q-code"><code>' + esc(q.code) + '</code></pre>' : '') +
      '<ul class="opts">' + opts + '</ul>' +
      '<div id="q-feedback"></div>' +
      '<div class="quiz-foot">' +
        '<button class="btn btn-outline btn-sm" type="button" id="q-prev">← Previous</button>' +
        '<span class="spacer"></span>' +
        '<button class="btn btn-primary btn-sm" type="button" id="q-next" disabled>Next →</button>' +
      '</div>' +
    '</div>';

    this.root.innerHTML = this.shell(inner);

    Array.prototype.forEach.call(this.root.querySelectorAll('.opt'), function (btn) {
      btn.addEventListener('click', function () { self.choose(parseInt(btn.getAttribute('data-idx'), 10)); });
    });

    var next = document.getElementById('q-next');
    if (next) next.addEventListener('click', function () { self.next(); });

    var prev = document.getElementById('q-prev');
    if (prev) {
      prev.disabled = this.i === 0;
      prev.addEventListener('click', function () { self.prev(); });
    }

    /* If this question was already answered (going back with Previous),
       restore the answered state so the student does not lose their work. */
    if (this.answers[this.i]) this.paint(this.answers[this.i].chosen, true);
    this.updateChrome();
  };

  Quiz.prototype.choose = function (idx) {
    if (this.locked) return;
    var q = this.questions[this.i];
    var correct = idx === q.answer;
    var firstTime = !this.answers[this.i];
    if (firstTime && correct) this.score++;
    this.answers[this.i] = { chosen: idx, correct: correct };
    this.paint(idx, false);
  };

  Quiz.prototype.paint = function (idx, silent) {
    var q = this.questions[this.i];
    var self = this;
    this.locked = true;

    Array.prototype.forEach.call(this.root.querySelectorAll('.opt'), function (btn) {
      var i = parseInt(btn.getAttribute('data-idx'), 10);
      btn.setAttribute('disabled', 'disabled');
      if (i === q.answer) btn.classList.add('is-correct');
      else if (i === idx) btn.classList.add('is-wrong');
    });

    var fb = document.getElementById('q-feedback');
    var gotIt = idx === q.answer;
    if (fb && !silent) {
      fb.innerHTML =
        '<div class="feedback ' + (gotIt ? 'good' : 'bad') + '">' +
          '<h4>' + (gotIt ? '✅ Correct!' : '❌ Not quite') + '</h4>' +
          '<p>' + esc(q.explain) + '</p>' +
        '</div>';
    } else if (fb) {
      fb.innerHTML = '<div class="feedback ' + (gotIt ? 'good' : 'bad') + '">' +
        '<h4>' + (gotIt ? '✅ You got this one' : '❌ This one was tricky') + '</h4>' +
        '<p>' + esc(q.explain) + '</p></div>';
    }

    var next = document.getElementById('q-next');
    if (next) {
      next.disabled = false;
      next.textContent = (this.i === this.questions.length - 1) ? 'See my result →' : 'Next →';
    }
    this.updateChrome();
  };

  Quiz.prototype.next = function () {
    if (this.i < this.questions.length - 1) {
      this.i++;
      this.render();
      window.scrollTo({ top: this.root.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    } else {
      this.finish();
    }
  };

  Quiz.prototype.prev = function () {
    if (this.i > 0) { this.i--; this.render(); }
  };

  Quiz.prototype.finish = function () {
    var total = this.questions.length;
    var pct = Math.round((this.score / total) * 100);
    var self = this;

    var verdict, note;
    if (pct === 100) { verdict = 'Outstanding — a perfect round!'; note = 'You traced every program correctly. You are ready for harder puzzles.'; }
    else if (pct >= 80) { verdict = 'Excellent work!'; note = 'You have a strong grip on this idea. Look again at the one that tripped you.'; }
    else if (pct >= 60) { verdict = 'Good effort!'; note = 'You understood most of it. Read the explanations for the missed questions and try again — scores usually jump the second time.'; }
    else if (pct >= 40) { verdict = 'A solid start.'; note = 'Some ideas need a second look. Work through the explanations slowly, then press Try Again.'; }
    else { verdict = 'Keep going — this is exactly how programmers learn.'; note = 'Everyone starts here. Read each explanation carefully and try the activity again; it will click.'; }

    var review = this.questions.map(function (q, i) {
      var a = self.answers[i];
      var ok = a && a.correct;
      return '<li><span class="mark ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓' : '✕') + '</span>' +
        '<span><strong>Q' + (i + 1) + '.</strong> ' + esc(q.stem) + ' — answer: <strong>' +
        esc(q.options[q.answer]) + '</strong></span></li>';
    }).join('');

    var inner = '<div class="quiz-result">' +
      '<div class="big">' + this.score + '<small> / ' + total + '</small></div>' +
      '<p class="verdict">' + esc(verdict) + '</p>' +
      '<p class="muted">' + esc(note) + '</p>' +
      '<div class="actions">' +
        '<button class="btn btn-primary" type="button" id="q-again">Try Again</button>' +
        '<a class="btn btn-outline" href="activities.html">Back to all activities</a>' +
        '<a class="btn btn-outline" href="dashboard.html">See sample dashboard</a>' +
      '</div>' +
      '<ul class="review-list">' + review + '</ul>' +
    '</div>';

    this.root.innerHTML = this.shell(inner);
    this.updateChrome();

    var again = document.getElementById('q-again');
    if (again) {
      again.addEventListener('click', function () {
        self.i = 0; self.score = 0; self.answers = []; self.render();
      });
    }

    if (window.CTG && window.CTG.markDone) {
      window.CTG.markDone(this.slug, { score: pct, correct: this.score, total: total });
    }

    window.scrollTo({ top: this.root.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  };

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('#quiz-root[data-activity]'), function (root) {
      new Quiz(root);
    });
  });
})();
