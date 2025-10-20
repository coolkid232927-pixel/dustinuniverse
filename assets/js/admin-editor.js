// Blog editor CRUD with role/team checks; responds to du:editor-scope and du:editor-search
(async function(){
  const wait = () => window.fb?.add ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);
  await wait();
  const me = await window.loadMe();
  if (!window.can('editPost', me)) return window.requireRole('editPost');

  const $ = id => document.getElementById(id);
  const list = $('postList');

  function slugify(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function teamsFromInput(){ return $('postTeams').value.split(',').map(t=>t.trim()).filter(Boolean); }

  async function save(publish=false){
    const title = $('title').value.trim();
    if(!title) return alert('Title required');
    const slug  = $('slug').value.trim() || slugify(title);
    const teams = teamsFromInput();
    if (!window.can('editPost', me, teams)) return alert('You cannot edit posts for these teams.');
    const data = {
      title, slug,
      excerpt: $('excerpt').value,
      body: $('body').value,
      tags: $('tags').value.split(',').map(s=>s.trim()).filter(Boolean),
      teams, published: publish ? true : $('published').checked,
      author: me?.email,
      updatedAt: Date.now(),
      createdAt: Date.now()
    };
    await window.fb.set('posts', slug, data);
    $('msg').textContent = publish ? 'Published!' : 'Saved.';
    await loadPosts();
  }

  async function loadPosts(){
    const snap = await window.fb.getDocs(window.fb.c('posts'));
    const items=[];
    const scope = window.__editorScope || '';
    const term  = (window.__editorSearch||'').toLowerCase();
    snap.forEach(d=>{
      const p = d.data();
      if (!window.can('editPost', me, p.teams)) return;
      if (scope && !(p.teams||[]).includes(scope)) return;
      if (term && !((p.title||'').toLowerCase().includes(term))) return;
      items.push({ id:d.id, ...p });
    });
    items.sort((a,b)=> (b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0));
    list.innerHTML = items.map(p=>`<li><button data-id="${p.slug||p.id}">${p.title} ${p.published? '• published':''}</button></li>`).join('') || '<li class="muted">No accessible posts.</li>';
    list.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=> loadOne(b.dataset.id)) );
  }

  async function loadOne(id){
    const snap = await window.fb.get('posts', id); if(!snap.exists()) return;
    const p = snap.data();
    if (!window.can('editPost', me, p.teams)) return alert('No team access for this post.');
    $('title').value   = p.title||'';
    $('slug').value    = p.slug||id;
    $('excerpt').value = p.excerpt||'';
    $('body').value    = p.body||'';
    $('tags').value    = (p.tags||[]).join(', ');
    $('postTeams').value = (p.teams||[]).join(', ');
    $('published').checked = !!p.published;
    $('msg').textContent = 'Loaded.';
    document.dispatchEvent(new Event('input')); // update preview
  }

  $('save').addEventListener('click', ()=> save(false));
  $('publish').addEventListener('click', ()=>{
    const teams = teamsFromInput();
    if (!window.can('publishPost', me, teams)) return alert('You cannot publish for these teams.');
    save(true);
  });

  document.addEventListener('du:editor-scope', loadPosts);
  document.addEventListener('du:editor-search', loadPosts);

  await loadPosts();
})();
