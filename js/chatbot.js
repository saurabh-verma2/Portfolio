const Chatbot = (() => {
  const MAX_HISTORY_MESSAGES = 12;
  const history = [];
  let isSending = false;

  function appendInlineContent(container, text) {
    const segments = text.split(/(\*\*[^*]+\*\*)/g);

    segments.forEach(segment => {
      if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
        const strong = document.createElement('strong');
        strong.textContent = segment.slice(2, -2);
        container.appendChild(strong);
      } else if (segment) {
        container.appendChild(document.createTextNode(segment.replace(/\*\*/g, '')));
      }
    });
  }

  function renderFormattedMessage(message, text) {
    message.replaceChildren();
    const lines = text.split('\n');
    let currentList = null;
    let currentListType = '';

    lines.forEach(line => {
      if (/^\s*[-*]\s*$/.test(line)) {
        return;
      }

      const bullet = line.match(/^\s*[-*]\s+(.+)/);
      const numbered = line.match(/^\s*\d+[.)]\s+(.+)/);
      const heading = line.match(/^\s*#{1,4}\s+(.+)/);
      const listType = bullet ? 'ul' : numbered ? 'ol' : '';

      if (listType) {
        if (!currentList || currentListType !== listType) {
          currentList = document.createElement(listType);
          currentList.className = 'chat-message-list';
          message.appendChild(currentList);
          currentListType = listType;
        }

        const item = document.createElement('li');
        appendInlineContent(item, (bullet || numbered)[1]);
        currentList.appendChild(item);
        return;
      }

      currentList = null;
      currentListType = '';

      if (!line.trim()) {
        const spacer = document.createElement('div');
        spacer.className = 'chat-message-space';
        message.appendChild(spacer);
        return;
      }

      const paragraph = document.createElement(heading ? 'strong' : 'p');
      if (heading) paragraph.className = 'chat-message-heading';
      appendInlineContent(paragraph, heading ? heading[1] : line);
      message.appendChild(paragraph);
    });
  }

  function addMessage(container, text, type) {
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    if (type.includes('bot') && !type.includes('error')) {
      renderFormattedMessage(message, text);
    } else {
      message.textContent = text;
    }
    container.appendChild(message);
    window.requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
    return message;
  }

  function waitForNextFrame() {
    return new Promise(resolve => window.requestAnimationFrame(resolve));
  }

  async function revealStreamedText(message, chunk, state, container) {
    const tokens = chunk.split(/(\s+)/).filter(Boolean);

    for (const token of tokens) {
      state.text += token;
      renderFormattedMessage(message, state.text);
      container.scrollTop = container.scrollHeight;
      await waitForNextFrame();
    }
  }

  function addTypingIndicator(container) {
    const message = document.createElement('div');
    message.className = 'chat-message bot';
    message.setAttribute('aria-label', 'Assistant is typing');

    const dots = document.createElement('span');
    dots.className = 'chat-typing';
    dots.innerHTML = '<span></span><span></span><span></span>';
    message.appendChild(dots);
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
    return message;
  }

  function getProjectAction(question) {
    if (typeof PROJECTS === 'undefined') return null;

    const matchers = [
      { pattern: /\bmeinstein\b|personal assistant/i, title: 'mEinstein' },
      { pattern: /\btrashdetective\b|waste classifier|waste detection/i, title: 'TrashDetective' },
      { pattern: /job board|freelance marketplace/i, title: 'Job Board' },
      { pattern: /go to kisan|smart agri|agricultural marketplace/i, title: 'Go To Kisan' },
    ];
    const match = matchers.find(item => item.pattern.test(question));
    if (!match) return null;

    const projectIndex = PROJECTS.findIndex(project => project.title.includes(match.title));
    return projectIndex >= 0
      ? { key: `project-${projectIndex}`, label: 'View this project', icon: 'fa-expand-alt', projectIndex }
      : null;
  }

  function getResponseActions(question, response) {
    const query = question.toLowerCase();
    const combined = `${question}\n${response}`.toLowerCase();
    const actions = [];
    const keys = new Set();
    const add = action => {
      if (!action || keys.has(action.key) || actions.length >= 3) return;
      keys.add(action.key);
      actions.push(action);
    };

    const projectAction = getProjectAction(question);
    add(projectAction);

    if (!projectAction && /\bprojects?\b|portfolio work|what (?:has|did) saurabh build/.test(query)) {
      add({ key: 'projects', label: 'View projects', icon: 'fa-briefcase', section: 'projects' });
    }

    if (
      /\bai\b|artificial intelligence|gemini|openai|tensorflow|language model|chatbot/.test(combined)
    ) {
      add({
        key: 'ai-skills',
        label: 'Open AI skills',
        icon: 'fa-brain',
        skillCategory: 'AI & Intelligent APIs',
      });
    }

    if (/google places|movement sdk|location-aware|location intelligence|nearby discovery/.test(combined)) {
      add({
        key: 'location-skills',
        label: 'Open location skills',
        icon: 'fa-location-dot',
        skillCategory: 'Location Intelligence',
      });
    }

    if (/\bexperience\b|work history|current role|current job|iph technologies|education/.test(query)) {
      add({
        key: 'experience',
        label: /education/.test(query) ? 'View education' : 'Go to experience',
        icon: 'fa-graduation-cap',
        section: 'experience',
      });
    }

    if (/\bcontact\b|\bhire\b|availability|available|email|phone|reach saurabh/.test(combined)) {
      add({
        key: 'contact',
        label: 'Contact Saurabh',
        icon: 'fa-paper-plane',
        section: 'contact',
      });
    }

    return actions;
  }

  function closeThenRun(elements, callback) {
    setOpen(elements.panel, elements.launcher, false);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(callback, reduceMotion ? 0 : 280);
  }

  function activateSkillCategory(categoryName) {
    const tabs = [...document.querySelectorAll('.skill-tab')];
    const matchingTabs = tabs.filter(tab => tab.textContent.trim().includes(categoryName));
    const target = matchingTabs.find(tab => tab.offsetParent !== null) || matchingTabs[0];
    target?.click();
    if (typeof scrollToSection === 'function') scrollToSection('skills');
  }

  function runResponseAction(action, elements) {
    closeThenRun(elements, () => {
      if (Number.isInteger(action.projectIndex) && typeof openProjectModal === 'function') {
        const trigger = document.querySelectorAll('#projects-grid .view-details-hint')[action.projectIndex];
        openProjectModal(action.projectIndex, trigger);
        return;
      }

      if (action.skillCategory) {
        activateSkillCategory(action.skillCategory);
        return;
      }

      if (action.section && typeof scrollToSection === 'function') {
        scrollToSection(action.section);
      }
    });
  }

  function addResponseActions(container, question, response, elements) {
    const actions = getResponseActions(question, response);
    if (actions.length === 0) return;

    const actionGroup = document.createElement('div');
    actionGroup.className = 'chat-response-actions';
    actionGroup.setAttribute('role', 'group');
    actionGroup.setAttribute('aria-label', 'Suggested portfolio actions');

    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'chat-response-action';
      button.type = 'button';

      const icon = document.createElement('i');
      icon.className = `fa ${action.icon}`;
      icon.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = action.label;

      button.append(icon, label);
      button.addEventListener('click', () => runResponseAction(action, elements));
      actionGroup.appendChild(button);
    });

    container.appendChild(actionGroup);
    window.requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }

  function isCompactChat() {
    return window.matchMedia('(max-width: 600px)').matches;
  }

  function setOpen(panel, launcher, open) {
    panel.classList.toggle('open', open);
    panel.classList.toggle('closing', !open);
    panel.setAttribute('aria-hidden', String(!open));
    if (open && isCompactChat()) {
      panel.setAttribute('aria-modal', 'true');
    } else {
      panel.removeAttribute('aria-modal');
    }
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
    document.body.classList.toggle('chatbot-is-open', open);

    if (open) {
      const focusTarget = isCompactChat()
        ? document.getElementById('chatbot-close')
        : document.getElementById('chatbot-input');
      window.setTimeout(() => focusTarget?.focus(), 220);
    } else if (panel.contains(document.activeElement)) {
      window.setTimeout(() => launcher.focus(), 220);
    }
  }

  async function sendMessage(text, elements, { focusInputAfter = false } = {}) {
    if (isSending) return;

    const cleanText = text.trim();
    if (!cleanText) return;

    isSending = true;
    elements.input.value = '';
    elements.input.style.height = '';
    elements.input.style.overflowY = 'hidden';
    elements.input.disabled = true;
    elements.send.disabled = true;
    elements.form.classList.add('sending');
    elements.suggestions.hidden = true;

    addMessage(elements.messages, cleanText, 'user');
    history.push({ role: 'user', text: cleanText });
    const typing = addTypingIndicator(elements.messages);

    try {
      const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);
      while (recentHistory[0]?.role === 'model') {
        recentHistory.shift();
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentHistory,
          stream: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Chat request failed.');
      }

      typing.remove();
      const botMessage = addMessage(elements.messages, '', 'bot streaming');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const streamed = { text: '' };

      while (true) {
        const { done, value } = await reader.read();
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
        if (chunk) {
          await revealStreamedText(botMessage, chunk, streamed, elements.messages);
        }
        if (done) break;
      }

      botMessage.classList.remove('streaming');
      if (!streamed.text.trim()) {
        throw new Error('I could not generate a response. Please try again.');
      }

      history.push({ role: 'model', text: streamed.text });
      if (history.length > MAX_HISTORY_MESSAGES) {
        history.splice(0, history.length - MAX_HISTORY_MESSAGES);
      }
      addResponseActions(elements.messages, cleanText, streamed.text, elements);
    } catch (error) {
      typing.remove();
      const errorMessage = addMessage(
        elements.messages,
        error.message || 'I am unavailable right now. Please try again later.',
        'bot error',
      );
      addResponseActions(elements.messages, cleanText, errorMessage.textContent, elements);
      history.pop();
    } finally {
      isSending = false;
      elements.input.disabled = false;
      elements.send.disabled = false;
      elements.form.classList.remove('sending');
      if (focusInputAfter && elements.panel.classList.contains('open')) {
        elements.input.focus();
      }
    }
  }

  function init() {
    const launcher = document.getElementById('chatbot-launcher');
    const panel = document.getElementById('chatbot-panel');
    const close = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const send = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');
    const suggestions = document.getElementById('chatbot-suggestions');

    if (!launcher || !panel || !form || !input || !messages) return;

    const elements = { panel, launcher, form, input, send, messages, suggestions };
    launcher.addEventListener('click', () => {
      setOpen(panel, launcher, !panel.classList.contains('open'));
    });
    close.addEventListener('click', () => setOpen(panel, launcher, false));

    form.addEventListener('submit', event => {
      event.preventDefault();
      sendMessage(input.value, elements, { focusInputAfter: true });
    });

    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      const nextHeight = Math.min(input.scrollHeight, 100);
      input.style.height = `${nextHeight}px`;
      input.style.overflowY = input.scrollHeight > 100 ? 'auto' : 'hidden';
    });

    suggestions.querySelectorAll('[data-question]').forEach(button => {
      button.addEventListener('click', () => {
        sendMessage(button.dataset.question, elements);
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.classList.contains('open')) {
        setOpen(panel, launcher, false);
        return;
      }

      if (event.key === 'Tab' && panel.classList.contains('open') && isCompactChat()) {
        const focusable = Array.from(
          panel.querySelectorAll(
            'button:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter(element => !element.hidden && element.getClientRects().length > 0);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Chatbot.init);
