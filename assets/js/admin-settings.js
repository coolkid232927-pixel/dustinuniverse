(async function(){
  const wait = () => window.fb?.set ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);
  await wait();

  // Save Profile
  document.getElementById('saveProfile')?.addEventListener('click', async ()=>{
    const uid = window.fb.auth.currentUser.uid;
    const displayName = document.getElementById('displayName').value.trim();
    const bio = document.getElementById('bio').value.trim();
    await window.fb.set('users', uid, { displayName, bio }, { merge:true });
    alert('Profile saved');
  });

  // Preferences
  document.getElementById('savePrefs')?.addEventListener('click', async ()=>{
    const uid = window.fb.auth.currentUser.uid;
    const timeFormat = document.getElementById('timeFormat').value;
    const autosaveSec = parseInt(document.getElementById('autosaveSec').value||'0',10);
    await window.fb.set('users', uid, { prefs:{ timeFormat, autosaveSec } }, { merge:true });
    alert('Preferences saved');
  });

  // Home options
  document.getElementById('saveHome')?.addEventListener('click', async ()=>{
    const carousel = document.getElementById('optCarousel').checked;
    const tagline  = document.getElementById('optTagline').value.trim();
    const featuredSlug = document.getElementById('featuredSlug').value.trim();
    await window.fb.set('settings', 'home', { carousel, tagline, featuredSlug });
    try { localStorage.setItem('du_tagline', tagline); } catch(_) {}
    alert('Home settings saved');
  });

  // SEO
  document.getElementById('saveSEO')?.addEventListener('click', async ()=>{
    const siteDescription = document.getElementById('siteDescription').value.trim();
    const ogImage = document.getElementById('ogImage').value.trim();
    await window.fb.set('settings', 'seo', { siteDescription, ogImage });
    alert('SEO saved');
  });

  // Roles tab
  document.getElementById('saveRole')?.addEventListener('click', async ()=>{
    const email = document.getElementById('roleEmail').value.trim();
    const role  = document.getElementById('roleSelect').value;
    const teams = document.getElementById('roleTeams').value.split(',').map(s=>s.trim()).filter(Boolean);
    const me = await window.loadMe();
    if (!window.can('manageUsers', me)) return alert('Not allowed');
    const { getDocs, q } = window.fb;
    const snap = await getDocs(q('users','email','==',email));
    let uid=null; snap.forEach(d=> uid=d.id);
    if(!uid) return alert('User not found');
    await window.fb.set('users', uid, { role, teams }, { merge:true });
    alert('Role updated');
  });

  document.getElementById('saveInviteDefaults')?.addEventListener('click', async ()=>{
    const role  = document.getElementById('defaultInviteRole').value;
    const teams = document.getElementById('defaultInviteTeams').value.split(',').map(s=>s.trim()).filter(Boolean);
    await window.fb.set('settings', 'invites', { role, teams });
    alert('Invite defaults saved');
  });

  // Appearance
  document.getElementById('saveAppearance')?.addEventListener('click', async ()=>{
    const brandName   = document.getElementById('brandName').value.trim() || 'Dustin Universe';
    const accentColor = document.getElementById('accentColor').value || '#7aa2ff';
    await window.fb.set('settings', 'appearance', { brandName, accentColor });
    alert('Appearance saved');
  });

  document.getElementById('saveLogo')?.addEventListener('click', async ()=>{
    const logoUrl = document.getElementById('logoUrl').value.trim() || '/images/logo.svg';
    await window.fb.set('settings', 'appearance', { logoUrl }, { merge:true });
    alert('Logo URL saved');
  });

  // Notifications
  document.getElementById('saveNotifications')?.addEventListener('click', async ()=>{
    const uid = window.fb.auth.currentUser.uid;
    const prefs = {
      postApproved: document.getElementById('notifyPostApproved').checked,
      comments:     document.getElementById('notifyComments').checked,
      mentions:     document.getElementById('notifyMentions').checked,
    };
    await window.fb.set('users', uid, { notifications: prefs }, { merge:true });
    alert('Notifications saved');
  });

  // Security
  document.getElementById('changePassword')?.addEventListener('click', async ()=>{
    const pw = document.getElementById('newPassword').value;
    if (!pw) return alert('Enter a new password');
    try { await window.fb.updatePassword(pw); document.getElementById('secMsg').textContent = 'Password updated.'; }
    catch(e){ document.getElementById('secMsg').textContent = e.message; }
  });
})();
