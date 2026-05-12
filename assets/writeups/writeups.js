
const cards=[...document.querySelectorAll('[data-card]')];
const input=document.querySelector('#searchInput');
const chips=[...document.querySelectorAll('[data-filter]')];
const empty=document.querySelector('#emptyState');
let active='all';
function apply(){const q=(input?.value||'').toLowerCase().trim();let shown=0;cards.forEach(card=>{const hay=(card.dataset.search||'').toLowerCase();const cat=card.dataset.category;const diff=card.dataset.difficulty;const okFilter=active==='all'||cat===active||diff===active||hay.includes(active.toLowerCase());const okSearch=!q||hay.includes(q);const show=okFilter&&okSearch;card.style.display=show?'block':'none';if(show)shown++;});if(empty)empty.style.display=shown?'none':'block'}
chips.forEach(ch=>ch.addEventListener('click',()=>{chips.forEach(c=>c.classList.remove('active'));ch.classList.add('active');active=ch.dataset.filter;apply()}));
input?.addEventListener('input',apply);apply();
