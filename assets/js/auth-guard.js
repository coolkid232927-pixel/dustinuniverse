// Redirect unauthenticated users away from protected admin pages
(function(){
  const publicPages = [
    '/pages/admin/index.html',   // login
    '/pages/admin/signup.html'   // invite signup
  ];
  function isPublic() {
    return publicPages.some(p => location.pathname.endsWith(p) || location.pathname === p);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const wait = () => window.fb?.onAuth ? Promise.resolve() : new Promise(r=>setTimeout(r,50)).then(wait);
    wait().then(() => {
      window.fb.onAuth(user => {
        if (!user && !isPublic()) location.href = '/pages/admin/index.html';
      });
    });
  });
})();
