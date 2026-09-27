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
  return `<strong>${escapeHtml(s.packageName)}</strong>${parts.length?`<span>${parts.map(escapeHtml).join(' · ')}</span>`:''}`;
}
function openModal(){
  const ref=referral();
  $('ukEnquiryPackage').innerHTML=packageText(state());
  $('ukEnquiryRef').textContent=ref?`Rujukan Musawwiq: ${ref}`:'Pertanyaan terus kepada pasukan jualan UmrahKasih';
  $('ukEnquiryFormView').hidden=false;
  $('ukEnquirySuccess').hidden=true;
  $('ukEnquiryError').hidden=true;
  modal.hidden=false;
  modal.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden';
  setTimeout(()=>$('ukCustomerName')?.focus(),80);
}
function closeModal(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''}
interest.addEventListener('click',e=>{e.preventDefault();openModal()});
modal.querySelectorAll('[data-enquiry-close]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});

function whatsappFallback(name,phone,s,ref){
  const parts=[
    `Assalamualaikum, saya ${name}.`,
    `No. telefon/WhatsApp: ${phone}.`,
    `Saya berminat dengan ${s.packageName}${s.season?` (${s.season})`:''}.`,
    s.departure?`Tarikh: ${s.departure}.`:'',
    s.room?`Bilik: ${s.room}.`:'',
    s.price?`Harga dipilih: RM${Number(s.price).toLocaleString('en-MY')}.`:'',
    ref?`Rujukan Musawwiq: ${ref}.`:''
  ].filter(Boolean).join(' ');
  location.href='https://wa.me/60135890865?text='+encodeURIComponent(parts);
}

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const submit=$('ukEnquirySubmit'),err=$('ukEnquiryError');
  err.hidden=true;
  if(!form.reportValidity()) return;
  const ref=referral();
  const s=state();
  const name=String($('ukCustomerName').value||'').trim();
  const phone=String($('ukCustomerPhone').value||'').trim().replace(/[^0-9+()\-\s]/g,'');

  // Direct visitors still get the requested Name + Phone form, then continue to WhatsApp.
  if(!ref){
    whatsappFallback(name,phone,s,'');
    return;
  }

  submit.disabled=true;submit.textContent='Menghantar…';
  try{
    if(!firebaseReady || !db) throw new Error('firebase-unavailable');
    const refSnap=await getDoc(doc(db,'referralPublic',ref));
    if(!refSnap.exists() || refSnap.data().active!==true) throw new Error('invalid-referral');
    const musawwiqUid=String(refSnap.data().musawwiqUid||'');
    if(!musawwiqUid) throw new Error('invalid-referral');
    const leadRef=await addDoc(collection(db,'leads'),{
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
    form.reset();
    $('ukEnquiryFormView').hidden=true;
    const proof=$('ukEnquirySuccessRef');
    if(proof){
      const shortLead=String(leadRef.id||'').slice(-8).toUpperCase();
      proof.textContent=`Direkod melalui Musawwiq ID: ${ref}${shortLead?` · Rujukan Enquiry: ${shortLead}`:''}`;
      proof.hidden=false;
    }
    $('ukEnquirySuccess').hidden=false;
  }catch(ex){
    console.error(ex);
    if(ex.message==='invalid-referral'){
      err.textContent='Pautan Musawwiq ini tidak aktif. Anda masih boleh teruskan pertanyaan melalui WhatsApp.';
    }else{
      err.textContent='Sistem pertanyaan sedang terganggu. Anda masih boleh teruskan melalui WhatsApp.';
    }
    err.hidden=false;
    // Keep enquiry usable even if Firebase is temporarily unavailable.
    setTimeout(()=>whatsappFallback(name,phone,s,ref),650);
  }finally{
    submit.disabled=false;submit.textContent='Hantar Pertanyaan ›';
  }
});

function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
