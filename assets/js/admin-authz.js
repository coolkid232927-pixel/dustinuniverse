window.Roles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MOD: 'moderator',
  EIC: 'editor_in_chief',
  EDITOR: 'editor',
  PUBLISHER: 'publisher',
  AUTHOR: 'author',
  VIEWER: 'viewer'
};

const perms = {
  manageUsers:    ['owner','admin'],
  manageSettings: ['owner','admin'],
  manageTeams:    ['owner','admin'],
  editPost:       ['owner','admin','editor','editor_in_chief','author'],
  publishPost:    ['owner','admin','publisher','editor_in_chief'],
  moderate:       ['owner','admin','moderator'],
};

function hasRole(user, allowed){ return allowed.includes(user?.role || 'viewer'); }
function hasTeam(user, teams){
  if (!teams || !teams.length) return true;
  const mine = user?.teams || [];
  return mine.some(t => teams.includes(t));
}
window.can = (action, user, teamScope) => hasRole(user, perms[action]||[]) && hasTeam(user, teamScope);

window.requireRole = (action, teamScope) => {
  const me = window.__currentUser;
  if (!window.can(action, me, teamScope)) {
    alert('You do not have permission to view this page.');
    location.href = '/pages/admin/dashboard.html';
  }
};

// load current user doc
window.loadMe = async function(){
  const wait = () => window.fb?.get ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);
  await wait();
  const uid = window.fb.auth.currentUser?.uid; if (!uid) return null;
  const snap = await window.fb.get('users', uid);
  const me = snap.exists() ? { uid, ...snap.data() } : null;
  window.__currentUser = me;
  return me;
};
