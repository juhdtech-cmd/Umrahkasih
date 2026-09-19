const $=(s)=>document.querySelector(s), $$=(s)=>document.querySelectorAll(s);
$('.menu').onclick=()=>$('.mobile-nav').classList.toggle('open');
$$('.mobile-nav a').forEach(a=>a.onclick=()=>$('.mobile-nav').classList.remove('open'));
$('#searchBtn').onclick=()=>{const type=$('#type').value; let count=0; $$('.package').forEach(c=>{const show=type==='all'||c.dataset.type===type;c.classList.toggle('hidden',!show);if(show)count++});$('#searchMsg').textContent=`${count} pilihan ditemui · ${$('#date').value==='all'?'Semua tarikh':$('#date').value} · ${$('#pax').value}`;location.hash='packages'};
$$('[data-open]').forEach(b=>b.onclick=()=>{$('#modalTitle').textContent=b.dataset.open;$('#modal').classList.add('open')});
const close=()=>$('#modal').classList.remove('open');$('.modal-close').onclick=close;$('.modal-close2').onclick=close;$('#modal').onclick=e=>{if(e.target.id==='modal')close()};
const slides=[['اللهم لبيك','Perjalanan Jemaah','Makkah · Madinah'],['سكينة','Momen Ibadah','Masjidil Haram'],['محبة','Bersama Umrah Kasih','Kenangan perjalanan']];let n=0;function render(){const c=$('#galleryCard');c.querySelector('.gallery-pattern span').textContent=slides[n][0];c.querySelector('.caption b').textContent=slides[n][1];c.querySelector('.caption span').textContent=slides[n][2];$('#slideNo').textContent=`0${n+1} / 03`;}$('#next').onclick=()=>{n=(n+1)%slides.length;render()};$('#prev').onclick=()=>{n=(n+slides.length-1)%slides.length;render()};
$$('.departure-list button').forEach(b=>b.onclick=()=>{location.hash='finder';$('#searchMsg').textContent='Pilih bilangan jemaah dan gaya perjalanan untuk meneruskan.'});

// V2.2 BM / EN language selector
const langBtn=$('#langBtn'), langMenu=$('#langMenu'), langCode=$('#langCode');
if(langBtn&&langMenu){
 const saved=localStorage.getItem('umrahkasih-lang')||'bm';
 const applyLang=(lang)=>{
   localStorage.setItem('umrahkasih-lang',lang);
   document.documentElement.lang=lang==='en'?'en':'ms';
   langCode.textContent=lang==='en'?'EN':'BM';
   langBtn.querySelector('.flag').textContent=lang==='en'?'🇬🇧':'🇲🇾';
   langMenu.classList.remove('open');langBtn.setAttribute('aria-expanded','false');
 };
 applyLang(saved);
 langBtn.onclick=(e)=>{e.stopPropagation();const o=langMenu.classList.toggle('open');langBtn.setAttribute('aria-expanded',String(o))};
 langMenu.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>applyLang(b.dataset.lang));
 document.addEventListener('click',()=>{langMenu.classList.remove('open');langBtn.setAttribute('aria-expanded','false')});
}
