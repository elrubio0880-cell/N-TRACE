/* Supply a real readiness Promise from your application; never fake progress. */
export function createLoader(element,{engine}={}){
  const bar=element.querySelector('[data-progress]'),status=element.querySelector('[data-status]'),value=element.querySelector('[data-value]');
  function update(progress,message='Preparando la plataforma…'){
    status.textContent=message;
    if(progress==null){bar.setAttribute('data-indeterminate','');bar.removeAttribute('aria-valuenow');value.textContent='';}
    else {const p=Math.max(0,Math.min(100,Math.round(progress)));bar.removeAttribute('data-indeterminate');bar.setAttribute('aria-valuenow',p);bar.style.setProperty('--progress',`${p}%`);value.textContent=`${p}%`;}
  }
  function show(){bar.hidden=false;element.classList.remove('is-leaving');element.hidden=false;engine?.replay();engine?.resume();update(null);}
  async function hide(){element.classList.add('is-leaving');const wait=matchMedia('(prefers-reduced-motion: reduce)').matches?0:250;await new Promise(r=>setTimeout(r,wait));element.hidden=true;engine?.pause();}
  async function run(readiness){show();try{const result=await readiness;await hide();return result;}catch(error){status.textContent='No se pudo iniciar. Inténtalo de nuevo.';bar.hidden=true;throw error;}}
  return {show,hide,update,run};
}
