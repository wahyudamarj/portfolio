import { createFrameSequence as createOriginalVideoSequence } from './hero-video-fallback.js';

// The original 1920×1080 globe movie is decoded by the browser's video pipeline.
// It avoids decoding large image bitmaps during scroll while preserving the source resolution.
export function createFrameSequence(canvas, options) {
  return createOriginalVideoSequence(canvas, options);
}
/*
export function legacyFrameSequence(canvas, { width, height, video, onLuma }) {
  const ctx=canvas.getContext('2d',{alpha:false});
  const cache=new Map(), pending=new Map();
  const compact=window.innerWidth<768 || navigator.deviceMemory<=4;
  const limit=compact?12:24, ahead=compact?6:10;
  let disposed=false, target=0, displayed=-1, direction=1, raf=0, fallback=null;
  let rect={dx:0,dy:0,dw:0,dh:0};
  const layout = () => {
    const cw=canvas.width, ch=canvas.height;
    if(cw/ch < .85){const dh=ch*.54,dw=dh*width/height;return {dx:cw*.5-dw*SUBJECT.x,dy:ch-dh-ch*.05,dw,dh};}
    const maxDw=cw*.5/(SUBJECT.right-SUBJECT.left),dh=Math.min(ch,maxDw*height/width),dw=dh*width/height;
    return {dx:cw-dw*SUBJECT.right,dy:(ch-dh)/2,dw,dh};
  };
  const draw = (movie, index) => {
    if(disposed) return;
    const sw=movie.width,sh=movie.height,strip=Math.max(2,Math.round(sh*.02));
    const rgb=colors[Math.min(colors.length-1,index)] || colors[0];
    const top={css:`rgb(${rgb.slice(0,3).join(',')})`},bottom={css:`rgb(${rgb.slice(3,6).join(',')})`};
    const {dx,dy,dw,dh}=rect=layout(),cw=canvas.width,ch=canvas.height;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    const bg=ctx.createLinearGradient(0,0,0,ch);bg.addColorStop(0,top.css);bg.addColorStop(1,bottom.css);
    ctx.fillStyle=bg;ctx.fillRect(0,0,cw,ch);ctx.drawImage(movie,dx,dy,dw,dh);
    if(dx>.5)ctx.drawImage(movie,0,0,1,sh,0,dy,dx+1,dh);
    if(dy>.5){
      ctx.drawImage(movie,0,0,sw,1,dx,0,dw,dy+1);ctx.drawImage(movie,0,sh-1,sw,1,dx,dy+dh-1,dw,ch-dy-dh+1);
      if(dx>.5){ctx.drawImage(movie,0,0,1,1,0,0,dx+1,dy+1);ctx.drawImage(movie,0,sh-1,1,1,0,dy+dh-1,dx+1,ch-dy-dh+1);}
    }
    onLuma?.((.2126*rgb[6]+.7152*rgb[7]+.0722*rgb[8])/255);
    canvas.dataset.sourceWidth=String(sw);canvas.dataset.sourceHeight=String(sh);
    canvas.dataset.sourceTime=(index/24).toFixed(3);
  };

  const trim=()=>{
    const far=[...cache.keys()].filter(i=>i!==displayed&&i!==target).sort((a,b)=>Math.abs(b-target)-Math.abs(a-target));
    while(cache.size>limit&&far.length){const key=far.shift();cache.get(key).close();cache.delete(key);}
    canvas.dataset.cachedFrames=String(cache.size);
  };
  const render=()=>{
    raf=0;if(disposed||fallback)return;
    let frame=cache.has(target)?target:displayed;
    if(frame!==target){
      const candidates=[...cache.keys()].filter(i=>displayed<0||((i-displayed)*direction>=0&&(target-i)*direction>=0));
      candidates.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target));
      if(candidates.length)frame=candidates[0];
    }
    if(frame>=0&&cache.has(frame)&&frame!==displayed){displayed=frame;draw(cache.get(frame),frame);}
    trim();
  };
  const schedule=()=>{if(!raf&&!disposed)raf=requestAnimationFrame(render);};
  const useFallback=()=>{
    if(disposed||fallback)return;
    for(const controller of pending.values())controller.abort();
    for(const bitmap of cache.values())bitmap.close();cache.clear();
    fallback=createVideoFallback(canvas,{width,height,video,onLuma});fallback.seek(target/239);
    canvas.dataset.scrollEncoding='original-video-fallback';
  };
  const pump=()=>{
    if(disposed||fallback)return;
    const queue=[target];
    for(let n=1;n<=ahead;n++)queue.push(target+n*direction,target-n*direction);
    for(const i of queue){
      if(pending.size>=3)break;
      if(i<0||i>239||cache.has(i)||pending.has(i))continue;
      const controller=new AbortController();pending.set(i,controller);
      const url=new URL(`frames/${String(i).padStart(3,'0')}.webp`,video);
      fetch(url,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Frame unavailable');return r.blob();})
        .then(blob=>createImageBitmap(blob)).then(bitmap=>{
          if(disposed||fallback){bitmap.close();return;}
          cache.set(i,bitmap);schedule();
        }).catch(error=>{if(error.name!=='AbortError')useFallback();})
        .finally(()=>{pending.delete(i);if(!disposed&&!fallback){trim();pump();}});
    }
  };
  const resize=()=>{
    if(fallback){fallback.resize();return;}
    const dpr=Math.min(window.devicePixelRatio||1,3),w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);
    if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h;}
    rect=layout();
    if(cache.has(displayed))draw(cache.get(displayed),displayed);
    else{ctx.fillStyle='#fdfdfd';ctx.fillRect(0,0,canvas.width,canvas.height);}
  };
  canvas.dataset.heroSource='lossless-original-frames';canvas.dataset.scrollEncoding='full-hd-bitmap-cache';
  canvas.dataset.targetTime='0';resize();pump();
  return {
    seek(p){const scale=compact?119.5:239;const next=(compact?2:1)*Math.round(Math.min(1,Math.max(0,p))*scale);if(next!==target)direction=next>target?1:-1;target=next;canvas.dataset.targetTime=(target/24).toFixed(3);if(fallback){fallback.seek(p);return;}schedule();pump();},
    resize,
    subject(){if(fallback)return fallback.subject();const k=canvas.clientWidth/(canvas.width||1),{dx,dy,dw,dh}=rect.dw?rect:layout();return{x:(dx+dw*SUBJECT.x)*k,y:(dy+dh*SUBJECT.y)*k,r:dh*SUBJECT.r*k,left:(dx+dw*SUBJECT.left)*k};},
    destroy(){disposed=true;cancelAnimationFrame(raf);fallback?.destroy();for(const controller of pending.values())controller.abort();for(const bitmap of cache.values())bitmap.close();cache.clear();}
  };
}
*/
