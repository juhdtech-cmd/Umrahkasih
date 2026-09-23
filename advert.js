(()=>{
  // V54.34: Large opening popup is now a cross-sell advert (Haji Mujamalah).
  // Sticky adverts remain independent and continue rotating every 3 seconds.
  const popupCampaign={
    image:'advert-haji-mujamalah.jpg',
    alt:'Haji Mujamalah Khadim Ummah Holidays'
  };

  const stickySlides=[
    {
      image:'product-eko-home-mobile.png',
      alt:'Umrah Kasih Eco',
      title:'Umrah Kasih Eco',
      price:'Bermula RM5,980',
      href:'product.html?id=eko-normal-9h7m-2026-27'
    },
    {
      image:'product-premium-home-mobile.jpg',
      alt:'Umrah Kasih Premium Musim Sejuk',
      title:'Umrah Kasih Premium',
      price:'Bermula RM13,480',
      href:'product.html?id=premium-peak-winter-12h10m-2026-27'
    },
    {
      image:'product-premium-home-mobile.jpg',
      alt:'Umrah Kasih Premium Ramadhan',
      title:'Premium Ramadhan',
      price:'Bermula RM14,380',
      href:'product.html?id=premium-ramadhan-12h10m-2026-27'
    }
  ];

  const popup=document.getElementById('ukAdPopup');
  const backdrop=document.getElementById('ukAdBackdrop');
  const close=document.getElementById('ukAdClose');
  const pImg=document.getElementById('ukAdPopupImage');
  const pCta=document.getElementById('ukAdPopupCta');
  const sticky=document.getElementById('ukAdSticky');
  const sImg=document.getElementById('ukAdStickyImage');
  const sTitle=document.getElementById('ukAdStickyTitle');
  const sPrice=document.getElementById('ukAdStickyPrice');
  if(!popup||!sticky) return;

  let popupClosed=false;
  let stickyIndex=0;
  let stickyTimer=null;
  let stickyChangeTimer=null;

  pImg.src=popupCampaign.image;
  pImg.alt=popupCampaign.alt;

  function paintSticky(i,animated=true){
    stickyIndex=(i+stickySlides.length)%stickySlides.length;
    const d=stickySlides[stickyIndex];
    if(animated) sticky.classList.add('is-changing');
    clearTimeout(stickyChangeTimer);
    stickyChangeTimer=setTimeout(()=>{
      sImg.src=d.image;
      sImg.alt=d.alt;
      sTitle.textContent=d.title;
      sPrice.textContent=d.price;
      sticky.href=d.href;
      sticky.classList.remove('is-changing');
    },animated?170:0);
  }

  function startStickyRotation(){
    clearInterval(stickyTimer);
    stickyTimer=setInterval(()=>paintSticky(stickyIndex+1),3000);
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
    const shouldShow=popupClosed && window.scrollY>260;
    sticky.classList.toggle('is-visible',shouldShow);
    sticky.setAttribute('aria-hidden',shouldShow?'false':'true');
  }

  // Until a dedicated Haji detail page is ready, Maklumat Lanjut opens the existing sales team chooser.
  pCta.addEventListener('click',e=>{
    e.preventDefault();
    closePopup();
    setTimeout(()=>document.getElementById('waOpen')?.click(),180);
  });

  paintSticky(0,false);
  startStickyRotation();
  setTimeout(openPopup,650);
  close.addEventListener('click',closePopup);
  backdrop.addEventListener('click',closePopup);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&popup.classList.contains('is-open'))closePopup()});
  window.addEventListener('scroll',updateSticky,{passive:true});
  window.addEventListener('pageshow',updateSticky);
})();
