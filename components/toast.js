/** Toast notifications */

let tc = 0;

const ICONS = {
  success: '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>',
  info: '<i class="bi bi-info-circle-fill" aria-hidden="true"></i>',
  warning: '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>',
  error: '<i class="bi bi-x-circle-fill" aria-hidden="true"></i>',
};

export function rmToast(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(120%)';
    setTimeout(() => el.remove(), 300);
  }
}

export function toast(msg, type = 'info') {
  const id = 't' + ++tc;
  const div = document.createElement('div');
  div.className = `toast ${type === 'info' ? '' : type}`;
  div.id = id;
  div.innerHTML = `<span class="toast-icon">${ICONS[type] || ICONS.info}</span><span>${msg}</span><button type="button" class="toast-close" onclick="rmToast('${id}')" aria-label="Dismiss"><i class="bi bi-x-lg" aria-hidden="true"></i></button>`;
  document.getElementById('toastContainer')?.appendChild(div);
  setTimeout(() => rmToast(id), 3800);
}
