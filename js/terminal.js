/* ============================================
   INTERACTIVE TERMINAL
   - Auto-runs boot sequence on page load
   - Then accepts real keyboard input
   - Commands: help, whoami, experience, projects, skills, contact, clear, sudo hire-me
   - History (up/down arrows), tab autocomplete
   ============================================ */

(function () {
  const term = document.getElementById('terminal-output');
  if (!term) return;

  // ---------- Command definitions ----------
  const COMMANDS = {
    help: () => [
      { type: 'text', value: 'available commands:' },
      { type: 'help-grid', value: [
        ['whoami', 'who am I, briefly'],
        ['experience', 'where I\'ve shipped code'],
        ['projects', 'things I\'ve built'],
        ['skills', 'tech I work with'],
        ['contact', 'how to reach me'],
        ['resume', 'download my resume'],
        ['clear', 'clear the terminal'],
        ['sudo hire-me', '???']
      ]}
    ],
    whoami: () => [
      { type: 'text', value: 'Danial Shaikh — Software Engineer based in Toronto.' },
      { type: 'text', value: 'B.Eng. Software (Ontario Tech, 2025).' },
      { type: 'text', value: 'Builds full-stack web systems. Ships production code daily.' },
      { type: 'text', value: '70+ sites in production. Zero of them on fire (most days).' }
    ],
    experience: () => [
      { type: 'header', value: 'experience.log' },
      { type: 'text', value: '[2022-now]  Web Developer    @ Muslim Association of Canada' },
      { type: 'text', value: '[2021-2022] App Dev Intern   @ Muslim Association of Canada' },
      { type: 'text', value: '[2022]      Web Designer     @ University of Toronto' },
      { type: 'text', value: '[2022-2023] Peer Coach       @ Ontario Tech University' },
      { type: 'text', value: '[2020-now]  Mentor & Tutor   @ Engineering Outreach + 1:1' },
      { type: 'text', value: '' },
      { type: 'cyan', value: '→ full timeline: experience.html' }
    ],
    projects: () => [
      { type: 'header', value: 'projects/' },
      { type: 'text', value: '001  MAC Institutional Sites      [70+ WordPress sites]' },
      { type: 'text', value: '002  Family-Friendly Movie Filter [AI / ML]' },
      { type: 'text', value: '003  Family Circle Tracker        [Mobile]' },
      { type: 'text', value: '004  Aqsa Paints                  [aqsapaints.com]' },
      { type: 'text', value: '005  Seeds4Tomorrow               [seeds4tomorrow.org]' },
      { type: 'text', value: '006  COVID-19 Digital Review      [covid19digitalreview.com]' },
      { type: 'text', value: '' },
      { type: 'cyan', value: '→ full case studies: projects.html' }
    ],
    skills: () => [
      { type: 'header', value: 'skills.json' },
      { type: 'text', value: 'languages:    JS, Python, Java, C/C++, SQL, PHP, Bash' },
      { type: 'text', value: 'frontend:     HTML, CSS, React, Bootstrap' },
      { type: 'text', value: 'backend:      Node, Express, Django, Flask' },
      { type: 'text', value: 'databases:    MySQL, MongoDB, SQLite' },
      { type: 'text', value: 'devops:       Git, Jenkins, Kubernetes, Maven' },
      { type: 'text', value: 'cms:          WordPress (advanced)' }
    ],
    contact: () => [
      { type: 'header', value: 'contact.txt' },
      { type: 'text', value: 'email:    danialshaikh.mail@proton.me' },
      { type: 'text', value: 'linkedin: linkedin.com/in/danialshaikh-softeng' },
      { type: 'text', value: 'github:   github.com/Danial-Shaikh' },
      { type: 'text', value: 'location: Toronto, ON · Canada' },
      { type: 'text', value: '' },
      { type: 'cyan', value: '→ full form: contact.html' }
    ],
    resume: () => {
      // Trigger download
      const a = document.createElement('a');
      a.href = 'assets/danial-shaikh-resume.pdf';
      a.download = 'danial-shaikh-resume.pdf';
      a.click();
      return [
        { type: 'ok', value: '[OK] downloading danial-shaikh-resume.pdf...' }
      ];
    },
    clear: () => {
      // Special — handled in run()
      return 'CLEAR';
    },
    'sudo hire-me': () => [
      { type: 'ok', value: '[sudo] password for recruiter: ********' },
      { type: 'ok', value: 'authenticating...' },
      { type: 'ok', value: 'access granted.' },
      { type: 'text', value: '' },
      { type: 'ascii', value: [
        '   ╔══════════════════════════════════╗',
        '   ║  YOU HAVE EXCELLENT TASTE.       ║',
        '   ║  reach out: contact.html         ║',
        '   ╚══════════════════════════════════╝'
      ]},
      { type: 'text', value: '' },
      { type: 'cyan', value: 'currently open to: full-time SWE roles, contracts, and interesting work.' }
    ]
  };

  const COMMAND_LIST = Object.keys(COMMANDS);

  // ---------- DOM helpers ----------
  function lineEl(text, cls) {
    const el = document.createElement('div');
    el.className = 'terminal-line' + (cls ? ' ' + cls : '');
    el.innerHTML = text;
    return el;
  }

  function scrollToBottom() {
    term.scrollTop = term.scrollHeight;
  }

  // ---------- Renderers for each output type ----------
  function renderOutput(items) {
    items.forEach((item) => {
      if (item.type === 'text') {
        term.appendChild(lineEl(escape(item.value), 'tx'));
      } else if (item.type === 'cyan') {
        term.appendChild(lineEl(escape(item.value), 'ok'));
      } else if (item.type === 'ok') {
        term.appendChild(lineEl(escape(item.value), 'ok'));
      } else if (item.type === 'header') {
        term.appendChild(lineEl('— ' + escape(item.value) + ' —', 'welcome'));
      } else if (item.type === 'help-grid') {
        const grid = document.createElement('div');
        grid.className = 'terminal-help-grid';
        item.value.forEach(([cmd, desc]) => {
          const row = document.createElement('div');
          row.className = 'terminal-help-row';
          row.innerHTML = `<span class="hg-cmd">${escape(cmd)}</span><span class="hg-desc">${escape(desc)}</span>`;
          grid.appendChild(row);
        });
        term.appendChild(grid);
      } else if (item.type === 'ascii') {
        item.value.forEach(line => {
          term.appendChild(lineEl(escape(line), 'ascii'));
        });
      }
    });
    scrollToBottom();
  }

  function escape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------- Boot sequence (typed animation) ----------
  async function boot() {
    term.innerHTML = ''; // clear the static content
    await typeLine('./boot.sh', { prompt: true });
    await sleep(180);
    await renderTyped('[OK] loading developer profile...', 'ok', 12);
    await sleep(80);
    await renderTyped('[OK] mounting experience modules', 'ok', 12);
    await sleep(80);
    await renderTyped('[OK] establishing connection', 'ok', 12);
    await sleep(180);
    await renderTyped("> welcome. type 'help' to begin.", 'welcome', 18);
    await sleep(120);
    showInputLine();
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Type text into a new line, char by char
  async function renderTyped(text, cls, charDelay = 18) {
    const el = lineEl('', cls);
    term.appendChild(el);
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      scrollToBottom();
      await sleep(charDelay);
    }
  }

  // For typing into a prompt line
  async function typeLine(cmdText, opts = {}) {
    const el = document.createElement('div');
    el.className = 'terminal-line';
    el.innerHTML = '<span class="prompt">$</span> <span class="cmd"></span>';
    term.appendChild(el);
    const cmdSpan = el.querySelector('.cmd');
    if (opts.instant) {
      cmdSpan.textContent = cmdText;
    } else {
      for (let i = 0; i < cmdText.length; i++) {
        cmdSpan.textContent += cmdText[i];
        scrollToBottom();
        await sleep(opts.charDelay || 50);
      }
    }
  }

  // ---------- Live input ----------
  let inputBuffer = '';
  let inputEl = null;
  let history = [];
  let historyIndex = -1;

  function showInputLine() {
    const el = document.createElement('div');
    el.className = 'terminal-line terminal-input-line';
    el.innerHTML = '<span class="prompt">$</span> <span class="live-input"></span><span class="caret"></span>';
    term.appendChild(el);
    inputEl = el.querySelector('.live-input');
    inputBuffer = '';
    scrollToBottom();
  }

  function freezeInputLine() {
    // Remove caret, leave the typed command frozen
    const lines = term.querySelectorAll('.terminal-input-line');
    const last = lines[lines.length - 1];
    if (last) {
      last.classList.remove('terminal-input-line');
      const caret = last.querySelector('.caret');
      if (caret) caret.remove();
    }
    inputEl = null;
  }

  function run(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) {
      freezeInputLine();
      showInputLine();
      return;
    }

    // Save to history
    history.unshift(cmd);
    if (history.length > 50) history.pop();
    historyIndex = -1;

    freezeInputLine();

    // Match
    const handler = COMMANDS[cmd] || COMMANDS[cmd.toLowerCase()];
    if (handler) {
      const result = handler();
      if (result === 'CLEAR') {
        term.innerHTML = '';
      } else {
        renderOutput(result);
      }
    } else {
      renderOutput([
        { type: 'text', value: `command not found: ${cmd}` },
        { type: 'cyan', value: "type 'help' for available commands." }
      ]);
    }

    showInputLine();
  }

  // ---------- Keyboard ----------
  document.addEventListener('keydown', (e) => {
    if (!inputEl) return;
    // Don't capture if user is typing in the contact form etc
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Enter') {
      e.preventDefault();
      run(inputBuffer);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      inputBuffer = inputBuffer.slice(0, -1);
      inputEl.textContent = inputBuffer;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      inputBuffer = history[historyIndex];
      inputEl.textContent = inputBuffer;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.max(historyIndex - 1, -1);
      inputBuffer = historyIndex === -1 ? '' : history[historyIndex];
      inputEl.textContent = inputBuffer;
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Autocomplete
      const matches = COMMAND_LIST.filter(c => c.startsWith(inputBuffer));
      if (matches.length === 1) {
        inputBuffer = matches[0];
        inputEl.textContent = inputBuffer;
      } else if (matches.length > 1 && inputBuffer) {
        // show options
        freezeInputLine();
        renderOutput([
          { type: 'text', value: matches.join('  ') }
        ]);
        showInputLine();
        inputEl.textContent = inputBuffer;
      }
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      // Regular character
      inputBuffer += e.key;
      inputEl.textContent = inputBuffer;
    }
  });

  // Click anywhere on terminal to focus (visual cue — caret blinks)
  const terminalBody = term;
  terminalBody.addEventListener('click', () => {
    scrollToBottom();
  });

  // Boot on load
  boot();
})();
