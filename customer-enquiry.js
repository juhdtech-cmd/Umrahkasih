import { db, firebaseReady } from './firebase-client.js';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const modal=$('ukEnquiryModal'),form=$('ukEnquiryForm'),interest=$('interest');
if(!modal || !form || !interest) throw new Error('Enquiry UI missing');

const cleanRef=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,40);
const referral=()=>cleanRef(window.UmrahKasihReferral?.get?.()||new URLSearchParams(location.search).get('ref'));
const state=()=>window.UmrahProductState?.()||{packageId:'',packageName:'Pakej UmrahKasih',season:'',duration:'',departure:'',room:'',price:0};

function packageText(s){
  const parts=[s.season,s.duration,s.departure,s.room,s.price?`RM${Number(s.price).toLocaleString('en-MY')}`:''].filter(Boolean);
  return `<strong>${escapeHtml(s.packageName)}</strong>${parts.map(escapeHtml).join(' · ')}`;
}
function openModal(){
  const ref=referral();
  if(!ref || !firebaseReady) return false;
  $('ukEnquiryPackage').innerHTML=packageText(state());
  $('ukEnquiryRef').textContent=`Rujukan Musawwiq: ${ref}`;
  $('ukEnquiryFormView').hidden=false;$('ukEnquirySuccess').hidden=true;
  $('ukEnquiryError').hidden=true;modal.hidden=false;modal.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden';
  setTimeout(()=>$('ukCustomerName')?.focus(),80);
  return true;
}
function closeModal(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''}
interest.addEventListener('click',e=>{if(openModal())e.preventDefault()});
modal.querySelectorAll('[data-enquiry-close]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const submit=$('ukEnquirySubmit'),err=$('ukEnquiryError');err.hidden=true;
  if(!form.reportValidity()) return;
  const ref=referral();if(!ref){err.textContent='Pautan referral tidak ditemui.';err.hidden=false;return}
  submit.disabled=true;submit.textContent='Menghantar…';
  try{
    const refSnap=await getDoc(doc(db,'referralPublic',ref));
    if(!refSnap.exists() || refSnap.data().active!==true) throw new Error('invalid-referral');
    const musawwiqUid=String(refSnap.data().musawwiqUid||'');
    if(!musawwiqUid) throw new Error('invalid-referral');
    const s=state();
    const name=String($('ukCustomerName').value||'').trim();
    const phone=String($('ukCustomerPhone').value||'').trim().replace(/[^0-9+()\-\s]/g,'');
    await addDoc(collection(db,'leads'),{
      customerName:name,
      customerPhone:phone,
      packageId:String(s.packageId||'').slice(0,80),
      packageName:String(s.packageName||'Pakej UmrahKasih').slice(0,120),
      packageSeason:String(s.season||'').slice(0,80),
      departure:String(s.departure||'').slice(0,120),
      room:String(s.room||'').slice(0,80),
      quotedPrice:Number(s.price||0),
      referralCode:ref,
      musawwiqUid,
      status:'Pertanyaan Baru',
      potentialCommission:0,
      createdAt:serverTimestamp()
    });
    form.reset();$('ukEnquiryFormView').hidden=true;$('ukEnquirySuccess').hidden=false;
  }catch(ex){
    console.error(ex);err.textContent=ex.message==='invalid-referral'?'Pautan Musawwiq ini tidak aktif.':'Pertanyaan tidak dapat dihantar. Sila cuba semula.';err.hidden=false;
  }finally{submit.disabled=false;submit.textContent='Hantar Pertanyaan ›'}
});
function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
