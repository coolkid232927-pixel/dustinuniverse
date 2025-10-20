// Dashboard widgets: reads window.__dashFilters for scope/limit/term
(async function(){
  const wait = () => window.fb?.getDocs ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);
  await wait();

  async function refresh() {
    const filters = window.__dashFilters || { scope:'', limit:10, term:'' };
    await Promise.all([loadPosts(filters), loadActivity(filters)]);
  }

  async function loadPosts({scope, limit, term}) {
    const list = document.getElementById('recentBlogList');
    const badge = document.getElementById('postCount');
    const snap = await window.fb.getDocs(window.fb.c('posts'));
    let arr=[]; snap.forEach(d=>arr.push({id:d.id, ...d.data()}));
    arr = arr.filter(p => p.published);
    if (scope) arr = arr.filter(p => (p.teams||[]).includes(scope));
    if (term)  arr = arr.filter(p => (p.title||'').toLowerCase().includes(term) || (p.author||'').toLowerCase().includes(term));
    badge.textContent = arr.length;
    arr.sort((a,b)=> (b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0));
    list.innerHTML = arr.slice(0, limit).map(p =>
      `<li><a href="/pages/blog/">${p.title}</a> <span class="subtle">• ${p.author||'unknown'}</span></li>`
    ).join('') || '<li class="empty">No posts found.</li>';
  }

  async function loadActivity({scope, limit}) {
    const list = document.getElementById('activityList');
    const snap = await window.fb.getDocs(window.fb.c('activity'));
    const arr=[]; snap.forEach(d=>arr.push(d.data()));
    // (scope currently not applied to activity; could be if activity stored team)
    arr.sort((a,b)=> (b.ts||0)-(a.ts||0));
    list.innerHTML = arr.slice(0, limit).map(a =>
      `<li>${a.type} • ${a.userEmail||'unknown'} • ${new Date(a.ts||Date.now()).toLocaleString()}</li>`
    ).join('') || '<li class="empty">No recent activity.</li>';
  }

  document.addEventListener('du:refresh-widgets', refresh);
  // First load
  refresh();
})();
