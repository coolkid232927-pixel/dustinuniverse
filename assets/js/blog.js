// Public blog list helper (works with Firestore or /data/posts.json fallback)
(async function(){
  const wait = () => window.fb?.getDocs || window.__blogLocal ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);

  async function load() {
    const ul = document.getElementById('postList');
    let posts = [];
    try {
      if (window.fb && window.fb.getDocs) {
        const snap = await window.fb.getDocs(window.fb.c('posts'));
        snap.forEach(d => { const p=d.data(); if (p.published) posts.push({ id:d.id, ...p }); });
      } else {
        const res = await fetch('/data/posts.json'); posts = await res.json();
      }
    } catch (e) {
      ul.innerHTML = '<li class="no-posts">Could not load posts.</li>'; return;
    }
    posts.sort((a,b)=> new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
    ul.innerHTML = posts.map(p => `
      <li class="post-item">
        <a class="post-link" href="${p.url || '#'}">
          <h3>${p.title||'Untitled'}</h3>
          <time datetime="${p.date || ''}">${new Date(p.date || p.createdAt || Date.now()).toLocaleDateString()}</time>
          <p>${p.excerpt || ''}</p>
        </a>
      </li>`).join('') || '<li class="no-posts">No posts yet.</li>';
  }

  await wait(); load();
})();
