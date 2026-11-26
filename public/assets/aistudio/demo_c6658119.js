import {AsciiEngine} from './ascii-engine.js';
import {createLoader} from './loader.js';
const $=id=>document.getElementById(id);
const engines={home:new AsciiEngine($('hero-canvas')),login:new AsciiEngine($('login-canvas'),{density:.96,speed:.4}),loader:new AsciiEngine($('loader-canvas'),{density:1,speed:.65})};
for(const [name,engine] of Object.entries(engines))engine.ready.catch(()=>{engine.canvas.hidden=true;const img=document.createElement('img');img.alt='Ilustración monocromática de un hacker encapuchado';img.className='nt-ascii';img.src=new URL('../assets/hacker-luma.png',import.meta.url).href;engine.canvas.after(img);});
let heroPaused=false;
function route(){const login=location.hash==='#login';$('home').hidden=login;$('login').hidden=!login;if(login){engines.home.pause();engines.login.resume();}else{engines.login.pause();if(!heroPaused)engines.home.resume();}if(login||location.hash==='#inicio')window.scrollTo(0,0);if(location.hash==='#cursos')requestAnimationFrame(()=>$('cursos').scrollIntoView());}
window.addEventListener('hashchange',route);route();
$('pause-art').addEventListener('click',()=>{heroPaused=!heroPaused;heroPaused?engines.home.pause():engines.home.resume();$('pause-art').textContent=heroPaused?'Reproducir':'Pausar';$('pause-art').setAttribute('aria-pressed',String(heroPaused));});
$('speed').addEventListener('input',e=>engines.home.set({speed:Number(e.target.value)/100}));$('density').addEventListener('input',e=>engines.home.set({density:Number(e.target.value)/100}));$('rain').addEventListener('change',e=>engines.home.set({rain:e.target.checked}));
const loader=createLoader($('loader'),{engine:engines.loader});engines.loader.pause();
$('open-loader').addEventListener('click',()=>{loader.show();loader.update(null,'Vista previa de carga · cierra para continuar');$('app').inert=true;$('close-loader').focus();});
$('close-loader').addEventListener('click',async()=>{await loader.hide();$('app').inert=false;$('open-loader').focus();});
$('show-password').addEventListener('click',()=>{const visible=$('password').type==='password';$('password').type=visible?'text':'password';$('show-password').textContent=visible?'Ocultar':'Mostrar';$('show-password').setAttribute('aria-pressed',String(visible));});
$('login-form').addEventListener('submit',e=>{e.preventDefault();$('login-status').textContent='Vista previa únicamente. Conecta el formulario al sistema de autenticación existente.';});
window.addEventListener('pagehide',()=>Object.values(engines).forEach(e=>e.destroy()),{once:true});
