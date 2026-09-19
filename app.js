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

// Pilihan Menuju Baitullah
(() => {
  const seasons=[...document.querySelectorAll('[data-season]')];
  const months=[...document.querySelectorAll('.month-btn')];
  const specials=[...document.querySelectorAll('.special-btn')];

  const monthGrid=document.getElementById('monthGrid');
  const ramadhanGrid=document.getElementById('ramadhanGrid');
  const syawalGrid=document.getElementById('syawalGrid');
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

  function budget(){
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

  function clearSelections(){
    month=null;
    period=null;
    months.forEach(x=>x.classList.remove('active'));
    specials.forEach(x=>x.classList.remove('active'));
  }

  function clearSeasonButtons(){
    seasons.forEach(x=>x.classList.remove('active'));
  }

  function showInitialState(){
    season=null;
    clearSelections();
    clearSeasonButtons();

    monthGrid.hidden=false;
    ramadhanGrid.hidden=true;
    syawalGrid.hidden=true;

    months.forEach(x=>{
      x.classList.remove('dimmed');
      x.disabled=false;
    });

    helper.textContent='Pilih bulan yang anda rancang untuk berangkat';
  }

  function renderSeason(s){
    season=s;
    clearSelections();

    seasons.forEach(x=>{
      x.classList.toggle('active',x.dataset.season===s);
    });

    monthGrid.hidden=(s==='ramadhan'||s==='syawal');
    ramadhanGrid.hidden=s!=='ramadhan';
    syawalGrid.hidden=s!=='syawal';

    months.forEach(x=>{
      x.classList.remove('dimmed');
      x.disabled=false;
    });

    if(s==='school'){
      helper.textContent='Hanya bulan cuti sekolah Malaysia ditonjolkan';

      months.forEach(x=>{
        const enabled=schoolMonths.has(x.dataset.month);
        x.classList.toggle('dimmed',!enabled);
        x.disabled=!enabled;
      });

    } else if(s==='ramadhan'){
      // Only these four Ramadhan choices can be selected.
      helper.textContent='Pilih tempoh Ramadhan yang anda inginkan';

    } else if(s==='syawal'){
      // Generic Syawal button removed. Only Syawal 2027 is offered.
      helper.textContent='Hanya Syawal 2027 tersedia untuk pilihan';

    } else {
      helper.textContent='Pilih bulan yang anda rancang untuk berangkat';
    }
  }

  seasons.forEach(x=>{
    x.onclick=()=>renderSeason(x.dataset.season);
  });

  months.forEach(x=>{
    x.onclick=()=>{
      if(x.disabled) return;
      months.forEach(y=>y.classList.remove('active'));
      x.classList.add('active');
      month=x.dataset.month;
      period=null;
    };
  });

  specials.forEach(x=>{
    x.onclick=()=>{
      specials.forEach(y=>y.classList.remove('active'));
      x.classList.add('active');
      period=x.dataset.period;
      month=null;
    };
  });

  minR.oninput=budget;
  maxR.oninput=budget;

  reset.onclick=()=>{
    minR.value=5500;
    maxR.value=30000;
    budget();
    showInitialState();
  };

  search.onclick=()=>{
    localStorage.setItem('umrahkasih-finder',JSON.stringify({
      season,
      budgetMin:+minR.value,
      budgetMax:+maxR.value,
      month,
      period
    }));
    document.getElementById('packages')?.scrollIntoView({behavior:'smooth'});
  };

  budget();
  showInitialState();
})();
