/* NØTRACE ASCII engine — framework agnostic ES module, no dependencies. */
const SOURCE = new URL('../assets/hacker-luma.png', import.meta.url).href;
const GLYPHS = ' .:+-=/0#%@';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export class AsciiEngine {
  constructor(canvas,{source=SOURCE,density=.85,speed=.6,rain=true,assemble=true,quality='auto'}={}) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d',{alpha:false});
    if(!this.ctx) throw new Error('Canvas 2D no disponible');
    this.options={density,speed,rain,assemble,quality};this.playing=true;this.visible=true;this.disposed=false;this.clock=0;this.last=0;this.lastMutation=0;
    this.media=matchMedia('(prefers-reduced-motion: reduce)');this.reduce=this.media.matches;
    this.onVisibility=()=>this.sync();this.onMotion=e=>{this.reduce=e.matches;this.sync();};
    document.addEventListener('visibilitychange',this.onVisibility);this.media.addEventListener('change',this.onMotion);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.intersection=new IntersectionObserver(([e])=>{this.visible=e.isIntersecting;this.sync();});this.intersection.observe(canvas);
    this.image=new Image();this.image.decoding='async';
    this.ready=new Promise((resolve,reject)=>{this.image.onload=()=>{if(!this.disposed){this.resize();this.sync();}resolve(this);};this.image.onerror=()=>reject(new Error('No se pudo cargar la ilustración ASCII'));});
    this.image.src=source;
  }
  set(options){Object.assign(this.options,options);this.draw();this.sync();}
  pause(){this.playing=false;this.sync();}
  resume(){this.playing=true;this.sync();}
  replay(){this.clock=0;this.lastMutation=0;this.draw();this.sync();}
  resize(){if(this.disposed||!this.image.naturalWidth)return;
    const w=Math.round(this.canvas.clientWidth);if(!w)return;
    const h=Math.round(w/1.6),dpr=Math.min(devicePixelRatio||1,2);
    this.w=w;this.h=h;this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);
    const q=this.options.quality;const target=q==='low'?74:q==='high'?176:w<480?88:144;
    this.cols=Math.min(target,Math.max(48,Math.floor(w/4.6)));this.cw=w/this.cols;this.font=this.cw*1.58;this.ch=this.font*1.03;this.rows=Math.floor(h/this.ch);
    const sample=document.createElement('canvas');sample.width=this.cols;sample.height=this.rows;
    const s=sample.getContext('2d',{willReadFrequently:true});s.imageSmoothingEnabled=true;s.imageSmoothingQuality='high';s.fillStyle='#000';s.fillRect(0,0,this.cols,this.rows);s.drawImage(this.image,0,0,this.cols,this.rows);
    const p=s.getImageData(0,0,this.cols,this.rows).data;this.cells=[];
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols;c++){
      const i=r*this.cols+c,lum=p[i*4]/255;if(lum<.025)continue;
      const level=clamp(Math.round(Math.pow(lum,.47)*(GLYPHS.length-1)),1,GLYPHS.length-1);
      this.cells.push({c,r,lum,level,glyph:GLYPHS[level],seed:noise(c,r)});
    }
    this.draw();
  }
  sync(){if(this.disposed)return;const active=this.playing&&!this.reduce&&this.visible&&!document.hidden&&!!this.cells;
    if(!active){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.last=0;if(this.reduce)this.draw(true);return;}
    if(!this.frame)this.frame=requestAnimationFrame(this.tick);
  }
  tick=(ts)=>{this.frame=0;if(this.disposed)return;const dt=this.last?Math.min(50,ts-this.last):0;this.last=ts;this.clock+=dt;
    if(this.clock-this.lastMutation>1000/(5+10*clamp(this.options.speed,0,1))){this.lastMutation=this.clock;
      for(let i=0;i<Math.ceil(this.cells.length*.035);i++){const cell=this.cells[Math.floor(Math.random()*this.cells.length)];if(!cell)break;const n=clamp(cell.level+Math.floor(Math.random()*3)-1,1,GLYPHS.length-1);cell.glyph=GLYPHS[n];}
    }
    // 30 fps caps canvas paint while keeping timing independent of display refresh.
    if(!this.lastPaint||ts-this.lastPaint>=32){this.draw();this.lastPaint=ts;}this.sync();
  };
  draw(forceStatic=false){if(!this.cells||this.disposed)return;const {ctx,w,h,cw,ch,rows,cols}=this;const t=this.clock/1000,still=forceStatic||this.reduce;
    ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.font=`${this.font}px monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
    if(this.options.rain){for(let c=1;c<cols;c+=5){const head=(noise(c,9)*rows+(still?0:t*(2+noise(c,2)*4)))%rows;for(let k=0;k<7;k++){const r=(head-k+rows)%rows;ctx.fillStyle=`rgba(165,165,165,${.085*(1-k/7)})`;ctx.fillText(noise(c,k+Math.floor(still?0:t))>.5?'1':'0',(c+.5)*cw,(r+.5)*ch);}}}
    const reveal=still||!this.options.assemble?1:clamp(t/0.9,0,1);const amount=clamp(this.options.density,.15,1);
    for(const cell of this.cells){const {r,c,lum,seed}=cell;if(seed>amount&&lum<.30)continue;if(reveal<1&&seed*.45+r/rows*.55>reveal)continue;
      const pulse=still?1:.94+.06*Math.sin(t*1.6+seed*6);const scan=still?0:Math.max(0,1-Math.abs(r-(t*5%(rows*2.5)))/2)*.10;
      const brightness=clamp((.29+Math.pow(lum,.50)*.96)*pulse+scan,0,1);
      ctx.fillStyle=`rgba(245,245,245,${brightness.toFixed(2)})`;ctx.fillText(cell.glyph,(c+.5)*cw,(r+.5)*ch);
    }
  }
  destroy(){this.disposed=true;if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;this.resizeObserver.disconnect();this.intersection.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);this.media.removeEventListener('change',this.onMotion);this.image.onload=null;this.image.onerror=null;}
}
