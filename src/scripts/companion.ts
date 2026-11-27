type State = 'idle' | 'greeting' | 'curious' | 'sleeping';

const messages = {
  greeting: 'Hi, I’m Orbit. Want a shortcut to a section?',
  curious: 'Exploring the portfolio? Try the project concepts or technical expertise.',
};

const sleepDelay = 30_000;

export function initializeCompanion() {
  const root = document.querySelector<HTMLElement>('[data-companion]');
  const trigger = root?.querySelector<HTMLButtonElement>('[data-orbit-trigger]');
  const restore = root?.querySelector<HTMLButtonElement>('[data-orbit-restore]');
  const minimize = root?.querySelector<HTMLButtonElement>('[data-orbit-minimize]');
  const close = root?.querySelector<HTMLButtonElement>('[data-orbit-close]');
  const panel = root?.querySelector<HTMLElement>('[data-orbit-panel]');
  const message = root?.querySelector<HTMLElement>('[data-orbit-message]');
  if (!root || !trigger || !restore || !minimize || !close || !panel || !message) return;

  const setState = (state: State) => { root.dataset.state = state; };
  const hidePanel = () => {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    setState('idle');
  };

  let greeted = false;
  let inactivityTimer: number | undefined;
  let lastActivity = performance.now();

  const checkInactivity = () => {
    const remaining = sleepDelay - (performance.now() - lastActivity);
    if (remaining > 0) {
      inactivityTimer = window.setTimeout(checkInactivity, remaining);
      return;
    }
    inactivityTimer = undefined;
    if (panel.hidden && !trigger.hidden) setState('sleeping');
  };

  const noteActivity = () => {
    lastActivity = performance.now();
    if (root.dataset.state === 'sleeping') setState('idle');
    if (inactivityTimer === undefined) inactivityTimer = window.setTimeout(checkInactivity, sleepDelay);
  };

  const closePanel = () => {
    hidePanel();
    noteActivity();
    trigger.focus();
  };

  trigger.addEventListener('click', () => {
    noteActivity();
    if (!panel.hidden) {
      closePanel();
      return;
    }
    const state = greeted ? 'curious' : 'greeting';
    setState(state);
    panel.hidden = false;
    message.textContent = messages[state];
    trigger.setAttribute('aria-expanded', 'true');
    greeted = true;
  });

  trigger.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && panel.hidden && root.dataset.state === 'idle') setState('curious');
  });
  trigger.addEventListener('pointerleave', () => {
    if (panel.hidden && root.dataset.state === 'curious') setState('idle');
  });

  close.addEventListener('click', closePanel);
  minimize.addEventListener('click', () => {
    hidePanel();
    trigger.hidden = true;
    restore.hidden = false;
    restore.focus();
  });
  restore.addEventListener('click', () => {
    restore.hidden = true;
    trigger.hidden = false;
    noteActivity();
    trigger.focus();
  });

  panel.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link) return;
    hidePanel();
    document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });
  document.addEventListener('pointerdown', (event) => {
    if (panel.hidden || root.contains(event.target as Node)) return;
    if (panel.contains(document.activeElement)) trigger.focus();
    hidePanel();
  });
  for (const event of ['pointerdown', 'keydown', 'scroll']) {
    window.addEventListener(event, noteActivity, { passive: true });
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) noteActivity();
  });

  root.hidden = false;
  noteActivity();
}
