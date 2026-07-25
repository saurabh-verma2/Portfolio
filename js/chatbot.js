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

  function setOpen(panel, launcher, open) {
    panel.classList.toggle('open', open);
    panel.classList.toggle('closing', !open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
    document.body.classList.toggle('chatbot-is-open', open);

    if (open) {
      window.setTimeout(() => document.getElementById('chatbot-input')?.focus(), 220);
    }
  }

  async function sendMessage(text, elements) {
    if (isSending) return;

    const cleanText = text.trim();
    if (!cleanText) return;

    isSending = true;
    elements.input.value = '';
    elements.input.style.height = '';
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
    } catch (error) {
      typing.remove();
      addMessage(
        elements.messages,
        error.message || 'I am unavailable right now. Please try again later.',
        'bot error',
      );
      history.pop();
    } finally {
      isSending = false;
      elements.input.disabled = false;
      elements.send.disabled = false;
      elements.form.classList.remove('sending');
      elements.input.focus();
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

    const elements = { form, input, send, messages, suggestions };
    launcher.addEventListener('click', () => {
      setOpen(panel, launcher, !panel.classList.contains('open'));
    });
    close.addEventListener('click', () => setOpen(panel, launcher, false));

    form.addEventListener('submit', event => {
      event.preventDefault();
      sendMessage(input.value, elements);
    });

    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
    });

    suggestions.querySelectorAll('[data-question]').forEach(button => {
      button.addEventListener('click', () => {
        sendMessage(button.dataset.question, elements);
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.classList.contains('open')) {
        setOpen(panel, launcher, false);
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Chatbot.init);
