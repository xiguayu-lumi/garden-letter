export type MotionKind='idle'|'opening'|'closing'|'turning';
const smooth=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
export const durations={idle:0,opening:3.2,closing:2.6,turning:2.8};
// One timeline drives the hinge, pop-ups and page leaf, so they cannot drift apart.
export function pose(kind:MotionKind,t:number,opened:boolean){
 if(kind==='opening'){const book=smooth(t);return {book,fold:book,leaf:0,incoming:false};}
 if(kind==='closing'){const book=1-smooth(t);return {book,fold:book,leaf:0,incoming:false};}
 if(kind==='turning'){const leaf=smooth(t);return {book:1,fold:1-leaf,leaf,incoming:t>=.5};}
 return {book:opened?1:0,fold:opened?1:0,leaf:0,incoming:false};
}

// Cross-section of a centre-creased pop-up, confined to the wedge between its pages.
// z never changes: paper layers cannot sweep through the layers in front of them.
export function foldPoint(x:number,y:number,left:number,right:number,radius:number){
 const half=(left-right)/2,mid=(left+right)/2;
 const across=x*Math.sin(half);
 const radial=Math.abs(x)*Math.cos(half)+y*Math.sin(half);
 // Accordion compression keeps the closed insert within the cover footprint.
 const limit=radius+Math.max(0,-Math.cos(left-right))*8;
 const scale=Math.min(1,limit/Math.max(.001,Math.hypot(across,radial)));
 return [(radial*Math.cos(mid)+across*Math.sin(mid))*scale,
         (radial*Math.sin(mid)-across*Math.cos(mid))*scale];
}
