export function renderLoader(status, ref, loader) {
  if (status === 'pending') {
    ref.style.display = 'flex';
    ref.innerHTML = loader;
  } else {
    ref.style.display = 'none';
    ref.innerHTML = '';
  }
}
