const btn=document.getElementById('langBtn'),menu=document.getElementById('langMenu');
btn.addEventListener('click',()=>menu.classList.toggle('open'));
function setLang(lang){
 document.querySelectorAll('[data-ms]').forEach(el=>el.innerHTML=el.dataset[lang]);
 btn.innerHTML=lang==='ms'?'🇲🇾 <strong>BM</strong><span>⌄</span>':'🇬🇧 <strong>EN</strong><span>⌄</span>';
 document.documentElement.lang=lang;
 localStorage.setItem('uk-lang',lang);
 menu.classList.remove('open');
}
document.querySelectorAll('[data-lang]').forEach(x=>x.addEventListener('click',()=>setLang(x.dataset.lang)));
setLang(localStorage.getItem('uk-lang')||'ms');

// ===============================
// Pilihan Menuju Baitullah
// ===============================
(() => {
  const seasons=[...document.querySelectorAll('[data-season]')];
  const months=[...document.querySelectorAll('.month-btn')];
  const specials=[...document.querySelectorAll('.special-btn')];

  const monthGrid=document.getElementById('monthGrid');
  const ramadhanGrid=document.getElementById('ramadhanGrid');
  const helper=document.getElementById('monthHelper');

  const minR=document.getElementById('budgetMin');
  const maxR=document.getElementById('budgetMax');
  const fill=document.getElementById('rangeFill');
  const value=document.getElementById('budgetValue');
  const reset=document.getElementById('finderReset');
  const search=document.getElementById('finderSearch');

  const schoolMonths=new Set(['Mac','Mei','Jun','Ogos','Sep','Dis']);

  let season=null;
  let month=null;
  let period=null;

  const money=v=>'RM '+Number(v).toLocaleString('en-MY');

  function updateBudget(){
    let a=+minR.value,b=+maxR.value;
    if(a>b-500){
      if(document.activeElement===minR) a=b-500;
      else b=a+500;
    }
    minR.value=a;
    maxR.value=b;

    const ap=(a-5500)/(30000-5500)*100;
    const bp=(b-5500)/(30000-5500)*100;
    fill.style.left=ap+'%';
    fill.style.right=(100-bp)+'%';
    value.textContent=`${money(a)} – ${money(b)}`;
  }

  function clearChoice(){
    month=null;
    period=null;
    months.forEach(x=>x.classList.remove('active'));
    specials.forEach(x=>x.classList.remove('active'));
  }

  function unlockAll(){
    months.forEach(x=>{
      x.disabled=false;
      x.classList.remove('dimmed','locked');
    });
    specials.forEach(x=>{
      x.disabled=false;
      x.classList.remove('locked');
    });
  }

  function initialState(){
    season=null;
    clearChoice();
    seasons.forEach(x=>x.classList.remove('active'));

    monthGrid.hidden=false;
    ramadhanGrid.hidden=true;

    unlockAll();
    helper.textContent='Pilih bulan yang anda rancang untuk berangkat';
  }

  function renderSeason(s){
    season=s;
    clearChoice();
    unlockAll();

    seasons.forEach(x=>x.classList.toggle('active',x.dataset.season===s));

    // Jan-Dec always stay visible.
    monthGrid.hidden=false;

    if(s==='school'){
      ramadhanGrid.hidden=true;
      helper.textContent='Hanya bulan cuti sekolah Malaysia ditonjolkan';

      months.forEach(x=>{
        const enabled=schoolMonths.has(x.dataset.month);
        x.classList.toggle('dimmed',!enabled);
        x.disabled=!enabled;
      });

    } else if(s==='ramadhan'){
      // Jan-Dec remain visible but faded and cannot be clicked.
      months.forEach(x=>{
        x.disabled=true;
        x.classList.add('locked');
      });

      // Only 4 Ramadhan options can be clicked.
      ramadhanGrid.hidden=false;
      specials.forEach(x=>{
        x.disabled=false;
        x.classList.remove('locked');
      });

      helper.textContent='Pilih tempoh Ramadhan yang anda inginkan';

    } else if(s==='syawal'){
      // No Syawal button in Bulan Cadangan.
      // Selecting Syawal above is sufficient; Syawal 2027 is implied.
      months.forEach(x=>{
        x.disabled=true;
        x.classList.add('locked');
      });

      ramadhanGrid.hidden=false;
      specials.forEach(x=>{
        x.disabled=true;
        x.classList.add('locked');
      });

      period='Syawal 2027';
      helper.textContent='Syawal 2027 dipilih secara automatik';

    } else {
      ramadhanGrid.hidden=true;
      helper.textContent='Pilih bulan yang anda rancang untuk berangkat';
    }
  }

  seasons.forEach(x=>{
    x.addEventListener('click',()=>renderSeason(x.dataset.season));
  });

  months.forEach(x=>{
    x.addEventListener('click',()=>{
      if(x.disabled) return;
      months.forEach(y=>y.classList.remove('active'));
      x.classList.add('active');
      month=x.dataset.month;
      period=null;
    });
  });

  specials.forEach(x=>{
    x.addEventListener('click',()=>{
      if(x.disabled) return;
      specials.forEach(y=>y.classList.remove('active'));
      x.classList.add('active');
      period=x.dataset.period;
      month=null;
    });
  });

  minR.addEventListener('input',updateBudget);
  maxR.addEventListener('input',updateBudget);

  reset.addEventListener('click',()=>{
    minR.value=5500;
    maxR.value=30000;
    updateBudget();
    initialState();
  });

  search.addEventListener('click',()=>{
    localStorage.setItem('umrahkasih-finder',JSON.stringify({
      season,
      budgetMin:+minR.value,
      budgetMax:+maxR.value,
      month,
      period
    }));
    document.getElementById('packages')?.scrollIntoView({behavior:'smooth'});
  });

  updateBudget();
  initialState();
})();

// ===============================
// V55 — WhatsApp + enquiry
// Isi nombor sebenar dalam waStaff apabila diterima.
// ===============================
const UK_CONTACT_CONFIG = {
  enquiryEmail: '',
  waStaff: [
    { name:'Ustaz Fadh', role:'Konsultan Umrah', phone:'60135890865' },
    { name:'Ustaz Ihsan', role:'Konsultan Umrah', phone:'60134599260' },
    { name:'Ustaz Amirul', role:'Konsultan Umrah', phone:'60129761791' },
    { name:'Cik Sakinah', role:'Konsultan Umrah', phone:'60124964772' },
    { name:'Cik Aqilah', role:'Konsultan Umrah', phone:'60192549107' },
    { name:'Puan Su', role:'Konsultan Umrah', phone:'60175848295' }
  ]
};

(() => {
  const widget=document.getElementById('waWidget'), toggle=document.getElementById('waToggle'), panel=document.getElementById('waPanel'), list=document.getElementById('waStaffList');
  if(!widget||!toggle||!list) return;
  const pageContext=()=>document.title || 'UmrahKasih';
  const msg=(staff)=>`Assalamualaikum ${staff.name}. Saya sedang melayari UmrahKasih dan ingin mendapatkan maklumat lanjut. Halaman: ${pageContext()}`;
  if(UK_CONTACT_CONFIG.waStaff.length){
    UK_CONTACT_CONFIG.waStaff.forEach(staff=>{
      const a=document.createElement('a');
      a.href=`https://wa.me/${staff.phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg(staff))}`;
      a.target='_blank'; a.rel='noopener';
      a.innerHTML=`<span><b>${staff.name}</b><small>${staff.role||'Konsultan Umrah'}</small></span><i>›</i>`;
      list.appendChild(a);
    });
  } else {
    list.innerHTML='<div class="v55-wa-placeholder">Sales staff akan dipaparkan di sini selepas nombor WhatsApp dimasukkan.</div>';
  }
  toggle.addEventListener('click',()=>{
    const open=widget.classList.toggle('open');
    toggle.setAttribute('aria-expanded',open?'true':'false'); panel.setAttribute('aria-hidden',open?'false':'true');
  });
  document.addEventListener('click',e=>{if(!widget.contains(e.target)){widget.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
})();

(() => {
  const form=document.getElementById('enquiryForm'), status=document.getElementById('enquiryStatus');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!UK_CONTACT_CONFIG.enquiryEmail){
      status.textContent='Borang sudah siap. Alamat e-mail syarikat perlu dimasukkan untuk mengaktifkan penghantaran.';
      return;
    }
    const d=new FormData(form);
    const subject=`Pertanyaan UmrahKasih — ${d.get('topic')}`;
    const body=`Nama: ${d.get('name')}\nWhatsApp: ${d.get('phone')}\nE-mail: ${d.get('email')}\nTopik: ${d.get('topic')}\n\nPertanyaan:\n${d.get('message')}`;
    location.href=`mailto:${UK_CONTACT_CONFIG.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

/* V64 — reliable iOS/Safari testimonial video tap */
(() => {
  document.querySelectorAll('.v50-video-card video').forEach((video) => {
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.addEventListener('click', () => {
      if (video.paused) {
        document.querySelectorAll('.v50-video-card video').forEach(v => { if (v !== video && !v.paused) v.pause(); });
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    });
  });
})();

/* V66 — manual horizontal swipe fallback for iOS/Safari rows.
   Captures horizontal gestures even when they begin on a <video>. */
(() => {
  document.querySelectorAll('.v50-video-row, .v50-review-row').forEach((row) => {
    let startX = 0, startY = 0, startScroll = 0, horizontal = false, moved = false;

    row.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startScroll = row.scrollLeft;
      horizontal = false;
      moved = false;
      row.classList.add('is-dragging');
    }, {passive:true, capture:true});

    row.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (!horizontal && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.08) horizontal = true;
      if (!horizontal) return;
      moved = true;
      if (e.cancelable) e.preventDefault();
      row.scrollLeft = startScroll - dx;
    }, {passive:false, capture:true});

    const finish = () => {
      row.classList.remove('is-dragging');
      setTimeout(() => { moved = false; }, 80);
    };
    row.addEventListener('touchend', finish, {passive:true, capture:true});
    row.addEventListener('touchcancel', finish, {passive:true, capture:true});

    // Prevent an accidental video play after a real swipe, but keep normal taps working.
    row.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });
})();

/* V67 — tap anywhere on a video card to play/pause while preserving full-card swipe. */
(() => {
  document.querySelectorAll('.v50-video-card').forEach((card) => {
    const video = card.querySelector('video');
    if (!video) return;
    let x0 = 0, y0 = 0, dragged = false;

    card.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      dragged = false;
    }, {passive:true});

    card.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - x0;
      const dy = e.touches[0].clientY - y0;
      if (Math.hypot(dx, dy) > 8) dragged = true;
    }, {passive:true});

    card.addEventListener('touchend', () => {
      if (dragged) return;
      document.querySelectorAll('.v50-video-card video').forEach(v => {
        if (v !== video && !v.paused) v.pause();
      });
      if (video.paused) {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else {
        video.pause();
      }
    }, {passive:true});
  });
})();
