/* FAQ filtering: no external dependencies. */
(() => {
  'use strict';
  const input = document.querySelector('#faq-search');
  if(!input) return;
  const groups = [...document.querySelectorAll('[data-faq-group]')];
  const result = document.querySelector('#faq-search-result');
  const empty = document.querySelector('#faq-no-results');
  const reset = document.querySelector('#faq-reset');
  const normalize = s => String(s).normalize('NFKC').toLocaleLowerCase('ja').replace(/\s+/g,'');
  const search = () => {
    const keyword = normalize(input.value.trim());
    let count = 0;
    groups.forEach(group => {
      let inGroup = 0;
      group.querySelectorAll('[data-faq-item]').forEach(item => {
        const match = !keyword || normalize(item.textContent).includes(keyword);
        item.hidden = !match;
        if(match){ count++;inGroup++; }
      });
      group.hidden = !inGroup;
    });
    if(empty)empty.hidden = count !== 0;
    if(result)result.textContent = keyword ? `${count}件の質問が見つかりました` : '';
  };
  input.addEventListener('input', search);
  if(reset)reset.addEventListener('click', () => {input.value='';search();input.focus();});
})();
