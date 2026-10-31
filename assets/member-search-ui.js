(() => {
  const input = document.getElementById('member-search');
  const clear = document.getElementById('member-search-clear');
  if (!input || !clear) return;
  clear.addEventListener('click', () => { input.value = ''; input.dispatchEvent(new Event('input',{bubbles:true})); input.focus(); });
  input.addEventListener('input', () => { clear.hidden = input.value.length === 0; });
  clear.hidden = true;
})();
