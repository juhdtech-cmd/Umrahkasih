(() => {
  const states = {
    MY:['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','W.P. Kuala Lumpur','W.P. Labuan','W.P. Putrajaya'],
    ID:['Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau','Jambi','Sumatera Selatan','Bangka Belitung','Bengkulu','Lampung','Banten','DKI Jakarta','Jawa Barat','Jawa Tengah','DI Yogyakarta','Jawa Timur','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara','Maluku','Maluku Utara','Papua Barat','Papua'],
    BN:['Brunei-Muara','Belait','Tutong','Temburong']
  };
  const country = document.getElementById('negara');
  const state = document.getElementById('negeri');
  const phoneCode = document.getElementById('phoneCode');
  const securityLabel = document.getElementById('securityLabel');
  const form = document.getElementById('musawwiqForm');
  const error = document.getElementById('formError');
  const modal = document.getElementById('staffModal');
  const staffList = document.getElementById('staffList');
  const applicationRef = document.getElementById('applicationRef');
  let message = '';

  const staff = [
    ['Ustaz Fadh','60135890865'],
    ['Ustaz Ihsan','60134599260'],
    ['Ustaz Amirul','60129761791'],
    ['Cik Sakinah','60124964772'],
    ['Cik Aqilah','60192549107'],
    ['Puan Su','60175848295']
  ];

  function updateCountry(){
    const code = country.value;
    state.innerHTML = '';
    if(!code){
      state.disabled = true;
      state.innerHTML = '<option value="">Pilih negara dahulu</option>';
      phoneCode.textContent = '+60';
      securityLabel.textContent = 'No. Kad Pengenalan / Dokumen';
      return;
    }
    state.disabled = false;
    state.innerHTML = '<option value="">Pilih negeri / provinsi</option>' + states[code].map(x=>`<option value="${x}">${x}</option>`).join('');
    phoneCode.textContent = code==='MY'?'+60':code==='ID'?'+62':'+673';
    securityLabel.textContent = code==='MY'?'No. Kad Pengenalan (IC)':code==='ID'?'No. KTP / Passport':'No. Passport / Dokumen Pengenalan';
  }

  function radioValue(name){
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  }

  function makeRef(){
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `MW-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${String(d.getTime()).slice(-5)}`;
  }

  function buildMessage(ref){
    const fd = new FormData(form);
    const code = country.value==='MY'?'+60':country.value==='ID'?'+62':'+673';
    const rawPhone = String(fd.get('telefon')||'').replace(/\D/g,'').replace(/^0+/, '');
    return [
      '*PERMOHONAN MUSAWWIQ UMRAHKASIH*',
      `No. Rujukan: ${ref}`,
      '',
      `Nama: ${fd.get('nama')}`,
      `Email: ${fd.get('email')}`,
      `Telefon: ${code}${rawPhone}`,
      `Negara: ${fd.get('negara')}`,
      `Negeri/Provinsi: ${fd.get('negeri')}`,
      `No. Pengenalan/Dokumen: ${fd.get('security')}`,
      `Sudah Umrah: ${radioValue('umrah')}`,
      `Sudah Haji: ${radioValue('haji')}`,
      '',
      'Mohon semakan dan pengaktifan akaun Musawwiq.'
    ].join('\n');
  }

  function openModal(ref){
    applicationRef.textContent = `No. Rujukan permohonan: ${ref}`;
    staffList.innerHTML = staff.map(([name,number]) => `<button type="button" data-wa="${number}">${name}<span>›</span></button>`).join('');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  country.addEventListener('change', updateCountry);
  updateCountry();

  form.addEventListener('submit', e => {
    e.preventDefault();
    error.hidden = true;
    if(!form.checkValidity()){
      error.textContent = 'Sila lengkapkan semua maklumat wajib sebelum menghantar pendaftaran.';
      error.hidden = false;
      form.reportValidity();
      return;
    }
    const ref = makeRef();
    message = buildMessage(ref);
    try { localStorage.setItem('umrahkasih_musawwiq_draft', JSON.stringify({ref,createdAt:new Date().toISOString()})); } catch(e){}
    openModal(ref);
  });

  staffList.addEventListener('click', e => {
    const btn = e.target.closest('[data-wa]');
    if(!btn) return;
    const url = `https://wa.me/${btn.dataset.wa}?text=${encodeURIComponent(message)}`;
    window.open(url,'_blank','noopener');
  });

  modal.addEventListener('click', e => {
    if(e.target.matches('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && !modal.hidden) closeModal(); });
})();
