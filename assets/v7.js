/* Live Craft v7.0: safe, read-only public-site enhancements. */
(()=>{'use strict';
 const counts={members:()=>Array.isArray(window.LIVE_CRAFT_MEMBERS)?window.LIVE_CRAFT_MEMBERS.filter(x=>x&&x.published===true).length:0,projects:()=>Array.isArray(window.LIVE_CRAFT_PROJECTS)?window.LIVE_CRAFT_PROJECTS.filter(x=>x&&x.published===true).length:0};
 for(const el of document.querySelectorAll('[data-lc7-count]')){const key=el.getAttribute('data-lc7-count');if(counts[key])el.textContent=String(counts[key]()).padStart(2,'0');}
})();
