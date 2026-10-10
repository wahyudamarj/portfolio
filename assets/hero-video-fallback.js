// Use the original 1920×1080 movie directly. No downsampled frame sequence.
const SUBJECT = { x: .725, y: .55, r: .44, left: .44, right: .97 };
export function createFrameSequence(canvas, { width, height, video, onLuma }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const movie = document.createElement('video');
  movie.muted = true; movie.playsInline = true; movie.preload = 'auto';
  let disposed = false, progress = 0, raf = 0;
  let rect = { dx: 0, dy: 0, dw: 0, dh: 0 };
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleCanvas.height = 1;
  const sampler = sampleCanvas.getContext('2d', { willReadFrequently: true });
  const sample = (x, y, w, h) => {
    sampler.drawImage(movie, x, y, w, h, 0, 0, 1, 1);
    const [r,g,b] = sampler.getImageData(0,0,1,1).data;
    return { css: `rgb(${r},${g},${b})`, luma: (.2126*r+.7152*g+.0722*b)/255 };
  };
  const layout = () => {
    const cw=canvas.width, ch=canvas.height;
    if(cw/ch < .85){const dh=ch*.54,dw=dh*width/height;return {dx:cw*.5-dw*SUBJECT.x,dy:ch-dh-ch*.05,dw,dh};}
    const maxDw=cw*.5/(SUBJECT.right-SUBJECT.left),dh=Math.min(ch,maxDw*height/width),dw=dh*width/height;
    return {dx:cw-dw*SUBJECT.right,dy:(ch-dh)/2,dw,dh};
  };
  const paint = () => {
    if(disposed || movie.readyState<2 || movie.seeking) return;
    const sw=movie.videoWidth,sh=movie.videoHeight,strip=Math.max(2,Math.round(sh*.02));
    const top=sample(0,0,sw,strip),bottom=sample(0,sh-strip,sw,strip);
    const {dx,dy,dw,dh}=rect=layout(),cw=canvas.width,ch=canvas.height;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    const bg=ctx.createLinearGradient(0,0,0,ch);bg.addColorStop(0,top.css);bg.addColorStop(1,bottom.css);
    ctx.fillStyle=bg;ctx.fillRect(0,0,cw,ch);ctx.drawImage(movie,dx,dy,dw,dh);
    if(dx>.5)ctx.drawImage(movie,0,0,1,sh,0,dy,dx+1,dh);
    if(dy>.5){
      ctx.drawImage(movie,0,0,sw,1,dx,0,dw,dy+1);ctx.drawImage(movie,0,sh-1,sw,1,dx,dy+dh-1,dw,ch-dy-dh+1);
      if(dx>.5){ctx.drawImage(movie,0,0,1,1,0,0,dx+1,dy+1);ctx.drawImage(movie,0,sh-1,1,1,0,dy+dh-1,dx+1,ch-dy-dh+1);}
    }
    onLuma?.(sample(sw*.3,0,sw*.4,sh*.12).luma);
    canvas.dataset.sourceWidth=String(sw);canvas.dataset.sourceHeight=String(sh);
    canvas.dataset.sourceTime=movie.currentTime.toFixed(3);
  };
  const chase = () => {
    if(disposed || !Number.isFinite(movie.duration) || movie.seeking) return;
    const target=progress*Math.max(0,movie.duration-1/24);
    canvas.dataset.targetTime=target.toFixed(3);
    if(Math.abs(movie.currentTime-target)>1/48)movie.currentTime=target;
  };
  const show = () => {paint();chase();};
  movie.addEventListener('loadeddata',show);movie.addEventListener('seeked',show);
  movie.addEventListener('error',()=>{canvas.dataset.sourceError='Video could not be loaded';});
  const resize=()=>{
    const dpr=Math.min(window.devicePixelRatio||1,3),w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);
    if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h;}
    rect=layout();if(movie.readyState<2){ctx.fillStyle="#fdfdfd";ctx.fillRect(0,0,canvas.width,canvas.height);}paint();
  };
  canvas.dataset.heroSource='original-video';
  movie.src=video;movie.load();resize();
  return {
    seek(p){progress=Math.min(1,Math.max(0,p));if(!raf)raf=requestAnimationFrame(()=>{raf=0;chase();});},
    resize,
    subject(){const k=canvas.clientWidth/(canvas.width||1),{dx,dy,dw,dh}=rect.dw?rect:layout();return{x:(dx+dw*SUBJECT.x)*k,y:(dy+dh*SUBJECT.y)*k,r:dh*SUBJECT.r*k,left:(dx+dw*SUBJECT.left)*k};},
    destroy(){disposed=true;cancelAnimationFrame(raf);movie.removeEventListener('loadeddata',show);movie.removeEventListener('seeked',show);movie.removeAttribute('src');movie.load();}
  };
}
