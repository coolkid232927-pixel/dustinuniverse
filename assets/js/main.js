document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Apply brand appearance (if saved)
  const applyAppearance = async () => {
    try {
      if (!window.fb?.get) return;
      const snap = await window.fb.get('settings','appearance');
      if (snap.exists()) {
        const { brandName, accentColor, logoUrl } = snap.data();
        if (brandName) document.title = document.title.replace(/^.*?( • |$)/, `${brandName}$1`);
        if (accentColor) document.documentElement.style.setProperty('--brand', accentColor);
        if (logoUrl) {
          const logos = document.querySelectorAll('link[rel="icon"], .brand img');
          logos.forEach(el => { if (el.tagName === 'IMG') el.src = logoUrl; });
        }
      }
      const homeSnap = await window.fb.get('settings','home');
      if (homeSnap.exists()) {
        const { tagline } = homeSnap.data();
        if (tagline) {
          const el = document.getElementById('heroTag');
          if (el) el.textContent = tagline;
        }
      }
    } catch(_) {}
  };
  applyAppearance();
});
