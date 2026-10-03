/* ==========================================================================
   Coding Through Games — Algorithm Maze engine
   Students build a list of commands, then press Run to watch the robot
   follow them. The optimal route is computed with BFS so the star rating
   reflects how close the student's algorithm is to the shortest one.

   Host page needs:
     <div id="maze-root" class="maze-layout"></div>
   ========================================================================== */
(function () {
  'use strict';

  var DIRS = {
    up:    { dr: -1, dc: 0, arrow: '↑', word: 'Up' },
    down:  { dr: 1,  dc: 0, arrow: '↓', word: 'Down' },
    left:  { dr: 0,  dc: -1, arrow: '←', word: 'Left' },
    right: { dr: 0, dc: 1,  arrow: '→', word: 'Right' }
  };

  function parseGrid(rows) {
    var grid = rows.map(function (r) { return r.split(''); });
    var start = null, goal = null;
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 'S') { start = { r: r, c: c }; grid[r][c] = '.'; }
        if (grid[r][c] === 'G') { goal = { r: r, c: c }; grid[r][c] = '.'; }
      }
    }
    return { grid: grid, start: start, goal: goal };
  }

  function isWall(grid, r, c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return true;
    return grid[r][c] === '#';
  }

  /* BFS shortest path — used for the "optimal steps" figure and the hint. */
  function shortestPath(grid, start, goal) {
    var rows = grid.length, cols = grid[0].length;
    var seen = {};
    var queue = [{ r: start.r, c: start.c, path: [] }];
    seen[start.r + ',' + start.c] = true;

    while (queue.length) {
      var node = queue.shift();
      if (node.r === goal.r && node.c === goal.c) return node.path;
      var keys = ['up', 'down', 'left', 'right'];
      for (var i = 0; i < keys.length; i++) {
        var d = DIRS[keys[i]];
        var nr = node.r + d.dr, nc = node.c + d.dc;
        var id = nr + ',' + nc;
        if (isWall(grid, nr, nc) || seen[id]) continue;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        seen[id] = true;
        queue.push({ r: nr, c: nc, path: node.path.concat([keys[i]]) });
      }
    }
    return null;
  }

  function Maze(root) {
    this.root = root;
    this.data = (window.CTG_DATA || {})['algorithm-maze'];
    if (!this.data) { root.innerHTML = '<p>Maze data could not be loaded.</p>'; return; }
    this.levelIndex = 0;
    this.commands = [];
    this.playing = false;
    this.loadLevel(0);
  }

  Maze.prototype.loadLevel = function (idx) {
    this.levelIndex = idx;
    var parsed = parseGrid(this.data.levels[idx].grid);
    this.grid = parsed.grid;
    this.start = parsed.start;
    this.goal = parsed.goal;
    this.optimal = shortestPath(this.grid, this.start, this.goal) || [];
    this.robot = { r: this.start.r, c: this.start.c };
    this.commands = [];
    this.playing = false;
    this.message = '';
    this.messageType = 'info';
    this.levelStars = 0;
    this.render();
  };

  Maze.prototype.layout = function () {
    var lvl = this.data.levels[this.levelIndex];
    return '' +
    '<div class="maze-board-wrap">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:.8rem">' +
        '<strong style="font-size:.92rem;color:var(--navy-900)">' + lvl.name + '</strong>' +
        '<span class="small muted">Shortest possible route: <strong>' + this.optimal.length + ' commands</strong></span>' +
      '</div>' +
      '<div class="maze-grid" id="maze-grid" style="grid-template-columns:repeat(' + this.grid[0].length + ',1fr)"></div>' +
      '<div class="maze-legend">' +
        '<span><i class="swatch" style="background:#d8ecfb"></i> Start</span>' +
        '<span><i class="swatch" style="background:#fdf3e2"></i> Goal (⭐)</span>' +
        '<span><i class="swatch" style="background:#0b2545"></i> Wall</span>' +
        '<span><i class="swatch" style="background:#14948f"></i> Robot</span>' +
      '</div>' +
    '</div>' +
    '<div class="maze-controls">' +
      '<div class="card card-flat" style="padding:1rem">' +
        '<h4 style="margin-bottom:.6rem">Your command list <span class="muted small" id="cmd-count">(0)</span></h4>' +
        '<div class="sequence" id="sequence"></div>' +
      '</div>' +
      '<div class="cmd-pad">' +
        '<button class="cmd" type="button" data-dir="up">↑ Up</button>' +
        '<button class="cmd" type="button" data-dir="left">← Left</button>' +
        '<button class="cmd" type="button" data-dir="right">→ Right</button>' +
        '<button class="cmd" type="button" data-dir="down">↓ Down</button>' +
      '</div>' +
      '<div class="split-actions">' +
        '<button class="btn btn-primary" type="button" id="maze-run">▶ Run</button>' +
        '<button class="btn btn-outline" type="button" id="maze-undo">↶ Remove last</button>' +
        '<button class="btn btn-outline" type="button" id="maze-clear">🗑 Clear</button>' +
        '<button class="btn btn-outline" type="button" id="maze-hint">💡 Hint</button>' +
      '</div>' +
      '<div id="maze-msg"></div>' +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
        this.data.levels.map(function (l, i) {
          return '<button class="btn btn-outline btn-sm maze-lvl" type="button" data-lvl="' + i + '">Level ' + (i + 1) + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  };

  Maze.prototype.render = function () {
    var self = this;
    this.root.innerHTML = this.layout();

    /* grid */
    var gridEl = document.getElementById('maze-grid');
    for (var r = 0; r < this.grid.length; r++) {
      for (var c = 0; c < this.grid[r].length; c++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        if (this.grid[r][c] === '#') cell.classList.add('wall');
        if (r === this.start.r && c === this.start.c) cell.classList.add('start');
        if (r === this.goal.r && c === this.goal.c) {
          cell.classList.add('goal');
          cell.textContent = '⭐';
        }
        if (r === this.robot.r && c === this.robot.c) {
          cell.classList.add('robot');
        }
        gridEl.appendChild(cell);
      }
    }

    /* command pad */
    Array.prototype.forEach.call(this.root.querySelectorAll('.cmd'), function (btn) {
      btn.addEventListener('click', function () {
        if (self.playing) return;
        self.commands.push(btn.getAttribute('data-dir'));
        self.paintCommands();
      });
    });

    document.getElementById('maze-run').addEventListener('click', function () { self.run(); });
    document.getElementById('maze-undo').addEventListener('click', function () {
      if (self.playing) return;
      self.commands.pop(); self.paintCommands();
    });
    document.getElementById('maze-clear').addEventListener('click', function () {
      if (self.playing) return;
      self.commands = []; self.paintCommands(); self.setMessage('', 'info');
    });
    document.getElementById('maze-hint').addEventListener('click', function () { self.hint(); });

    Array.prototype.forEach.call(this.root.querySelectorAll('.maze-lvl'), function (btn) {
      btn.addEventListener('click', function () {
        if (self.playing) return;
        self.loadLevel(parseInt(btn.getAttribute('data-lvl'), 10));
      });
    });

    this.paintCommands();
    if (this.message) this.setMessage(this.message, this.messageType, true);
  };

  Maze.prototype.paintCommands = function () {
    var seq = document.getElementById('sequence');
    var count = document.getElementById('cmd-count');
    if (count) count.textContent = '(' + this.commands.length + ')';
    if (!seq) return;
    if (!this.commands.length) {
      seq.innerHTML = '<span class="empty-note">No commands yet — click an arrow to add your first step.</span>';
      return;
    }
    var self = this;
    seq.innerHTML = this.commands.map(function (d, i) {
      return '<span class="seq-chip">' + (i + 1) + '. ' + DIRS[d].arrow + ' ' + DIRS[d].word +
        ' <span class="x" data-i="' + i + '" title="Remove this command">✕</span></span>';
    }).join('');
    Array.prototype.forEach.call(seq.querySelectorAll('.x'), function (x) {
      x.addEventListener('click', function () {
        if (self.playing) return;
        self.commands.splice(parseInt(x.getAttribute('data-i'), 10), 1);
        self.paintCommands();
      });
    });
  };

  Maze.prototype.setMessage = function (html, type, quiet) {
    this.message = html; this.messageType = type;
    var el = document.getElementById('maze-msg');
    if (!el) return;
    if (!html) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="callout callout-' + type + '">' + html + '</div>';
    if (!quiet) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  Maze.prototype.robotEl = function () {
    var gridEl = document.getElementById('maze-grid');
    if (!gridEl) return null;
    var cols = this.grid[0].length;
    return gridEl.children[this.robot.r * cols + this.robot.c];
  };

  Maze.prototype.moveRobotTo = function (r, c) {
    var prev = this.robotEl();
    if (prev) {
      prev.classList.remove('robot');
      if (this.robot.r === this.start.r && this.robot.c === this.start.c) prev.classList.add('start');
    }
    this.robot = { r: r, c: c };
    var now = this.robotEl();
    if (now) {
      now.classList.remove('start');
      now.classList.add('robot');
    }
  };

  Maze.prototype.run = function () {
    var self = this;
    if (this.playing) return;
    if (!this.commands.length) {
      this.setMessage('<h4>Nothing to run</h4><p>Add at least one command first — an algorithm with no steps cannot do anything.</p>', 'warn');
      return;
    }

    /* reset robot to start */
    this.playing = true;
    this.robot = { r: this.start.r, c: this.start.c };
    this.paintBoardOnly();

    var i = 0;
    var step = function () {
      if (i >= self.commands.length) {
        self.playing = false;
        self.evaluate(false);
        return;
      }
      var d = DIRS[self.commands[i]];
      var nr = self.robot.r + d.dr;
      var nc = self.robot.c + d.dc;

      if (isWall(self.grid, nr, nc)) {
        self.playing = false;
        self.setMessage(
          '<h4>🚧 The robot hit a wall</h4><p>On command <strong>' + (i + 1) +
          '</strong> (' + d.arrow + ' ' + d.word + ') the robot had nowhere to go. ' +
          'That is not a failure — it is your algorithm telling you which step to fix. ' +
          'Use <strong>Remove last</strong> or edit that command, then try again.</p>', 'warn');
        self.markCollision(i);
        return;
      }

      self.moveRobotTo(nr, nc);
      i++;
      window.setTimeout(step, 420);
    };
    window.setTimeout(step, 300);
  };

  Maze.prototype.paintBoardOnly = function () {
    var gridEl = document.getElementById('maze-grid');
    if (!gridEl) return;
    var cols = this.grid[0].length;
    for (var r = 0; r < this.grid.length; r++) {
      for (var c = 0; c < this.grid[r].length; c++) {
        var el = gridEl.children[r * cols + c];
        el.classList.remove('robot', 'start', 'goal', 'path');
        if (this.grid[r][c] === '#') el.classList.add('wall');
        if (r === this.start.r && c === this.start.c) el.classList.add('start');
        if (r === this.goal.r && c === this.goal.c) { el.classList.add('goal'); }
      }
    }
    var robot = gridEl.children[this.robot.r * cols + this.robot.c];
    if (robot) { robot.classList.remove('start'); robot.classList.add('robot'); }
  };

  Maze.prototype.markCollision = function (commandIndex) {
    var chip = document.querySelectorAll('.seq-chip')[commandIndex];
    if (chip) { chip.style.background = 'var(--red-600)'; }
  };

  Maze.prototype.evaluate = function () {
    var atGoal = (this.robot.r === this.goal.r && this.robot.c === this.goal.c);
    var used = this.commands.length;
    var best = this.optimal.length;

    if (!atGoal) {
      this.setMessage(
        '<h4>The robot stopped before the star</h4><p>All ' + used + ' commands ran without hitting a wall, ' +
        'but the robot is not on the goal yet. Add more steps to the end of your list, then press Run again.</p>', 'warn');
      return;
    }

    var ratio = best / Math.max(used, 1);
    var stars = ratio >= 1 ? 3 : (ratio >= 0.7 ? 2 : 1);
    this.levelStars = stars;
    var starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);

    var extra = used - best;
    var extraNote = extra === 0
      ? '<p>You found the <strong>shortest possible route</strong> — ' + best + ' commands. That is the algorithm a computer scientist would call optimal.</p>'
      : '<p>Your route used <strong>' + used + '</strong> commands; the shortest possible route needs <strong>' + best +
        '</strong>. You walked ' + extra + ' extra step' + (extra === 1 ? '' : 's') + '. Throwing away unnecessary steps makes a program faster — see if you can trim it.</p>';

    this.setMessage(
      '<h4>⭐ Goal reached — ' + starStr + '</h4>' + extraNote +
      '<p class="small">Every time you press Run, the robot follows your commands in exactly the order you gave them. ' +
      'That list, in order, is what programmers call an <strong>algorithm</strong>.</p>', 'ok');

    if (stars >= 2 && window.CTG && window.CTG.markDone) {
      window.CTG.markDone('algorithm-maze', { score: stars * 33, stars: stars, level: this.levelIndex + 1 });
    }
  };

  Maze.prototype.hint = function () {
    if (this.playing) return;
    var path = this.optimal;
    if (!path || !path.length) { this.setMessage('<p>No route exists on this level.</p>', 'warn'); return; }
    this.setMessage(
      '<h4>💡 A nudge, not the answer</h4><p>The shortest route needs <strong>' + path.length +
      '</strong> commands and starts with <strong>' + path[0].toUpperCase() + '</strong>. ' +
      'Try to work out the rest yourself before pressing Run — that thinking is the whole point of the activity.</p>', 'info');
  };

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('maze-root');
    if (root) new Maze(root);
  });
})();
