(()=>{
  const slides=[
    {
      image:'product-eko-home-mobile.png',
      alt:'Umrah Kasih Eco',
      kicker:'PAKEJ UMRAH',
      title:'Umrah Kasih Eco',
      text:'Umrah lebih mampu, perjalanan terurus.',
      price:'Bermula RM5,980',
      href:'product.html?id=eko-normal-9h7m-2026-27'
    },
    {
      image:'product-premium-home-mobile.jpg',
      alt:'Umrah Kasih Premium Musim Sejuk',
      kicker:'WAKTU KEMUNCAK · MUSIM SEJUK',
      title:'Umrah Kasih Premium',
      text:'Lebih dekat. Lebih selesa. Lebih terjaga.',
      price:'Bermula RM13,480',
      href:'product.html?id=premium-peak-winter-12h10m-2026-27'
    },
    {
      image:'product-premium-home-mobile.jpg',
      alt:'Umrah Kasih Premium Ramadhan',
      kicker:'AWAL & PERTENGAHAN RAMADHAN',
      title:'Premium Ramadhan',
      text:'Ibadah Ramadhan dengan selesa dan dibimbing setiap masa.',
      price:'Bermula RM14,380',
      href:'product.html?id=premium-ramadhan-12h10m-2026-27'
    }
  ];

  const popup=document.getElementById('ukAdPopup');
  const backdrop=document.getElementById('ukAdBackdrop');
  const close=document.getElementById('ukAdClose');
  const pImg=document.getElementById('ukAdPopupImage');
  const pKicker=document.getElementById('ukAdPopupKicker');
  const pTitle=document.getElementById('ukAdPopupTitle');
  const pText=document.getElementById('ukAdPopupText');
  const pPrice=document.getElementById('ukAdPopupPrice');
  const pCta=document.getElementById('ukAdPopupCta');
  const dots=document.getElementById('ukAdDots');
  const sticky=document.getElementById('ukAdSticky');
  const sImg=document.getElementById('ukAdStickyImage');
  const sTitle=document.getElementById('ukAdStickyTitle');
  const sPrice=document.getElementById('ukAdStickyPrice');
  if(!popup||!sticky) return;

  let index=0;
  let popupClosed=false;
  let timer=null;
  let changeTimer=null;

  dots.innerHTML=slides.map((_,i)=>`<i${i===0?' class="active"':''}></i>`).join('');

  function paint(i,animated=true){
    index=(i+slides.length)%slides.length;
    const d=slides[index];
    if(animated){popup.classList.add('is-changing');sticky.classList.add('is-changing')}
    clearTimeout(changeTimer);
    changeTimer=setTimeout(()=>{
      pImg.src=d.image;pImg.alt=d.alt;
      pKicker.textContent=d.kicker;
      pTitle.textContent=d.title;
      pText.textContent=d.text;
      pPrice.textContent=d.price;
      pCta.href=d.href;
      sImg.src=d.image;
      sTitle.textContent=d.title;
      sPrice.textContent=d.price;
      sticky.href=d.href;
      [...dots.children].forEach((dot,n)=>dot.classList.toggle('active',n===index));
      popup.classList.remove('is-changing');sticky.classList.remove('is-changing');
    },animated?170:0);
  }

  function startRotation(){
    clearInterval(timer);
    timer=setInterval(()=>paint(index+1),3000);
  }

  function openPopup(){
    if(popupClosed) return;
    backdrop.classList.add('is-open');
    popup.classList.add('is-open');
    backdrop.setAttribute('aria-hidden','false');
    popup.setAttribute('aria-hidden','false');
  }

  function closePopup(){
    popupClosed=true;
    popup.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    popup.setAttribute('aria-hidden','true');
    backdrop.setAttribute('aria-hidden','true');
    updateSticky();
  }

  function updateSticky(){
    // Sticky advert only becomes available after the large popup has been closed.
    // It softly fades away again when the visitor returns near the top of the page.
    const shouldShow=popupClosed && window.scrollY>260;
    sticky.classList.toggle('is-visible',shouldShow);
    sticky.setAttribute('aria-hidden',shouldShow?'false':'true');
  }

  paint(0,false);
  startRotation();
  setTimeout(openPopup,650);
  close.addEventListener('click',closePopup);
  backdrop.addEventListener('click',closePopup);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&popup.classList.contains('is-open'))closePopup()});
  window.addEventListener('scroll',updateSticky,{passive:true});
  window.addEventListener('pageshow',updateSticky);
})();
