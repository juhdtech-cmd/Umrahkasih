const btn=document.getElementById("lang"), menu=document.getElementById("langMenu");
btn.onclick=()=>menu.classList.toggle("open");
function setLang(lang){document.querySelectorAll("[data-ms]").forEach(el=>{el.innerHTML=el.dataset[lang]});btn.innerHTML=(lang==="ms"?"🇲🇾 <b>BM</b>⌄":"🇬🇧 <b>EN</b>⌄");document.documentElement.lang=lang;localStorage.setItem("uk-lang",lang);menu.classList.remove("open")}
document.querySelectorAll("[data-lang]").forEach(x=>x.onclick=()=>setLang(x.dataset.lang));
setLang(localStorage.getItem("uk-lang")||"ms");