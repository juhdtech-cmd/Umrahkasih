// Referral capture foundation. Include this on public UmrahKasih pages later.
(() => {
  const q = new URLSearchParams(location.search);
  const ref = (q.get('ref') || '').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if (ref) {
    const payload = { ref, capturedAt: Date.now(), expiresAt: Date.now() + 30*24*60*60*1000 };
    try { localStorage.setItem('umrahkasih_referral', JSON.stringify(payload)); } catch (_) {}
  }
  window.UmrahKasihReferral = {
    get(){
      try {
        const x = JSON.parse(localStorage.getItem('umrahkasih_referral')||'null');
        if(!x || x.expiresAt < Date.now()) return null;
        return x.ref;
      } catch (_) { return null; }
    }
  };
})();
