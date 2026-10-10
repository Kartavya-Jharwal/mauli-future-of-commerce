// Optional introduction is user-initiated: documents and deep links never wait.
const intro = document.querySelector('#thread-intro');
const trigger = document.querySelector('#intro-trigger');
const close = document.querySelector('#intro-close');
if (intro && trigger && close && typeof intro.showModal === 'function') {
  trigger.hidden = false;
  trigger.addEventListener('click', () => {
    intro.showModal();
    close.focus();
  });
  close.addEventListener('click', () => intro.close());
  intro.addEventListener('close', () => trigger.focus());
  intro.addEventListener('click', (event) => {
    if (event.target !== intro) return;
    const bounds = intro.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) intro.close();
  });
}
