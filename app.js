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
  const seasons=[...document.querySelectorAll('[data-season]')], months=[...document.querySelectorAll('.month-btn')], specials=[...document.querySelectorAll('.special-btn')];
  const monthGrid=document.getElementById('monthGrid'), ramadhanGrid=document.getElementById('ramadhanGrid'), syawalGrid=document.getElementById('syawalGrid'), helper=document.getElementById('monthHelper');
  const minR=document.getElementById('budgetMin'), maxR=document.getElementById('budgetMax'), fill=document.getElementById('rangeFill'), value=document.getElementById('budgetValue');
  const reset=document.getElementById('finderReset'), search=document.getElementById('finderSearch');
  const schoolMonths=new Set(['Mac','Mei','Jun','Ogos','Sep','Dis']);
  let season='normal', month=null, period=null;
  const money=v=>'RM '+Number(v).toLocaleString('en-MY');
  function budget(){let a=+minR.value,b=+maxR.value;if(a>b-500){if(document.activeElement===minR)a=b-500;else b=a+500}minR.value=a;maxR.value=b;const ap=(a-5500)/(30000-5500)*100,bp=(b-5500)/(30000-5500)*100;fill.style.left=ap+'%';fill.style.right=(100-bp)+'%';value.textContent=`${money(a)} – ${money(b)}`}
  function clearSel(){month=null;period=null;months.forEach(x=>x.classList.remove('active'));specials.forEach(x=>x.classList.remove('active'))}
  function render(s){season=s;clearSel();seasons.forEach(x=>x.classList.toggle('active',x.dataset.season===s));monthGrid.hidden=(s==='ramadhan'||s==='syawal');ramadhanGrid.hidden=s!=='ramadhan';syawalGrid.hidden=s!=='syawal';months.forEach(x=>{x.classList.remove('dimmed');x.disabled=false});if(s==='school'){helper.textContent='Hanya bulan cuti sekolah Malaysia ditonjolkan';months.forEach(x=>{const on=schoolMonths.has(x.dataset.month);x.classList.toggle('dimmed',!on);x.disabled=!on})}else if(s==='ramadhan'){helper.textContent='Pilih fasa Ramadhan yang anda inginkan'}else if(s==='syawal'){helper.textContent='Pilihan perjalanan dalam bulan Syawal'}else{helper.textContent='Pilih bulan yang anda rancang untuk berangkat'}}
  seasons.forEach(x=>x.onclick=()=>render(x.dataset.season));months.forEach(x=>x.onclick=()=>{if(x.disabled)return;months.forEach(y=>y.classList.remove('active'));x.classList.add('active');month=x.dataset.month});specials.forEach(x=>x.onclick=()=>{specials.forEach(y=>y.classList.remove('active'));x.classList.add('active');period=x.dataset.period});minR.oninput=budget;maxR.oninput=budget;reset.onclick=()=>{minR.value=5500;maxR.value=30000;budget();render('normal')};search.onclick=()=>{localStorage.setItem('umrahkasih-finder',JSON.stringify({season,budgetMin:+minR.value,budgetMax:+maxR.value,month,period}));document.getElementById('packages')?.scrollIntoView({behavior:'smooth'})};budget();render('normal');
})();
