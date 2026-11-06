import {Canvas,useFrame,useLoader,useThree} from '@react-three/fiber';

import {Suspense,useEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import type {Content} from './types';
import FirstGarden,{gardenSpread} from './FirstGarden';
import {pose,durations,foldPoint,type MotionKind} from './bookMotion';
import PopUpPanel from './PopUpPanel';
const PI=Math.PI;
function Paper({name,x=0,z=2,y=0,w=2,h=2,progress=1}:{name:string;x?:number;z?:number;y?:number;w?:number;h?:number;progress?:number}){
 const texture=useLoader(THREE.TextureLoader,`/assets/${name}.webp`);texture.colorSpace=THREE.SRGBColorSpace;
 return <PopUpPanel texture={texture} x={x} z={z} w={w} h={h} alpha={.25}/>;
}
function Page({i,p,c,onGarden}:{i:number;p:number;c:Content;onGarden:()=>void}){
 if(i===0)return <group userData={{sector:0}}><FirstGarden onWake={onGarden}/></group>;
 return <group userData={{sector:i}}>
  <group scale={[1,p,1]}>
   {i!==0&&<Paper name="arch" z={.65} w={2.55} h={3.05} progress={p}/>}
   {i===0&&<Paper name="arch" z={1.1} w={2.8} h={2.95} progress={p}/>}
   {i===0&&<Paper name="manor" z={1.6} w={2.8} h={2.2} progress={p}/>}
   {i===1&&<><Paper name="cafe" x={-.65} z={1.5} w={1.65} h={2.15} progress={p}/><Paper name="bridge" x={.35} z={2.6} w={2.2} h={1.1} progress={p}/><Paper name="meadow" x={.8} z={1.8} w={1.7} h={1.1} progress={p}/></>}
   {i===2&&<><Paper name="frame" z={1.9} w={2.5} h={2.9} progress={p}/>{c.photos.length>0&&<PhotoCard url={`/api/media/${c.photos[0].id}`} />}</>}
   {i===3&&<Paper name="canopy" z={1.3} w={2.8} h={3} progress={p}/>}
   {(i!==2||!c.photos.length)&&<Paper name="couple" x={i===1?.8:0} z={i===3?2.25:2.5} w={i===2?1.05:1.45} h={i===2?1.42:1.92} progress={p}/>}
   <Paper name="meadow" x={-.95} z={2.7} w={2.15} h={.94} progress={p}/>
   <Paper name="meadow" x={1.13} z={3.02} w={1.65} h={.72} progress={p}/>
   <Paper name="meadow" x={-.15} z={3.52} w={2.65} h={.55} progress={p}/>
  </group>
 </group>;
}
function PhotoCard({url}:{url:string}){const t=useLoader(THREE.TextureLoader,url);t.colorSpace=THREE.SRGBColorSpace;return <PopUpPanel texture={t} w={1.62} h={2.06} z={1.92}/>;}
function coverTexture(c:Content,art:CanvasImageSource){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=1024;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#244b3a';ctx.fillRect(0,0,768,1024);ctx.strokeStyle='#bca778';ctx.lineWidth=2;ctx.strokeRect(34,34,700,956);ctx.strokeRect(46,46,676,932);ctx.beginPath();ctx.ellipse(384,420,231,280,0,0,PI*2);ctx.stroke();ctx.drawImage(art,120,185,528,600);ctx.fillStyle='#e5d4ad';ctx.textAlign='center';ctx.font='21px Georgia';ctx.fillText('A   G A R D E N   L E T T E R',384,160);ctx.font='32px "Songti SC",SimSun,serif';ctx.fillText('花 园 来 信',384,290);ctx.font='italic 76px Georgia';ctx.fillText('With love',384,470);ctx.font='36px "Microsoft YaHei",serif';ctx.fillText(c.names.join('  ·  '),384,630);ctx.font='23px Georgia';ctx.fillText(c.date.replaceAll('-',' . '),384,700);ctx.font='18px Georgia';ctx.fillText('TOGETHER, A NEW CHAPTER',384,875);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;}
function Binding({texture}:{texture:THREE.Texture}){
 const {size}=useThree(),width=6.6*gardenSpread(size.width/size.height);
 const lawn=useLoader(THREE.TextureLoader,'/assets/garden-v2/lawn.webp');lawn.colorSpace=THREE.SRGBColorSpace;
 const halves=useMemo(()=>[-1,1].map(side=>{const t=lawn.clone();t.repeat.x=.5;t.offset.x=side<0?0:.5;return t;}),[lawn]);
 useEffect(()=>()=>halves.forEach(t=>t.dispose()),[halves]);
 return <group>
  {[-1,1].map((side,k)=><group key={side} name={side<0?'left-binding':'right-binding'} position={[0,0,1.9]}>
   <group position={[side*width/4,0,0]}>
    <mesh position={[0,-.12,0]} castShadow receiveShadow><boxGeometry args={[width/2+.06,.1,4.8]}/><meshStandardMaterial color="#244d38" roughness={.85}/></mesh>
    {[0,1,2,3].map(i=><mesh key={i} position={[0,-.055+i*.028,0]} receiveShadow><boxGeometry args={[width/2-.015,.024,4.66-i*.015]}/><meshStandardMaterial color={i%2?'#e5ddc8':'#fff9e8'} roughness={1}/></mesh>)}
    <mesh rotation={[-PI/2,0,0]} position={[0,.105,0]} receiveShadow><planeGeometry args={[width/2-.035,4.55]}/><meshStandardMaterial map={halves[k]} transparent alphaTest={.65} roughness={1} side={THREE.DoubleSide}/></mesh>
    {side<0&&<mesh position={[0,-.176,0]} rotation={[PI/2,0,PI]}><planeGeometry args={[width/2-.06,4.7]}/><meshStandardMaterial map={texture} roughness={.85}/></mesh>}
   </group>
  </group>)}
  <mesh position={[0,.093,1.9]}><boxGeometry args={[.025,.016,4.6]}/><meshStandardMaterial color="#b9ac8c"/></mesh>
  <group name="turning-leaf" position={[0,.14,1.9]}>
   <mesh position={[width/4,0,0]} castShadow receiveShadow><boxGeometry args={[width/2-.03,.025,4.6,16,1,1]}/><meshStandardMaterial color="#f8f0dc" roughness={1}/></mesh>
   <mesh position={[width/4,.016,0]} rotation={[-PI/2,0,0]}><planeGeometry args={[width/2-.05,4.55]}/><meshStandardMaterial map={halves[1]} transparent alphaTest={.65} roughness={1} side={THREE.DoubleSide}/></mesh>
  </group>
 </group>;
}
function World({open,chapter,c,lite,onReady,fast,look,onSlow,onSettled,onPaper,onGarden,gardenPulse}:{open:boolean;chapter:number;c:Content;lite:boolean;onReady:()=>void;fast:boolean;look:number;onSlow:()=>void;onSettled:()=>void;onPaper:()=>void;onGarden:()=>void;gardenPulse:number}){
 const ref=useRef<THREE.Group>(null),pages=useRef<THREE.Group>(null);
 const gardenTime=useRef(0),wakeTime=useRef(-100);
 useEffect(()=>{if(gardenPulse>0){wakeTime.current=gardenTime.current;invalidate();}},[gardenPulse]);
 const state=useRef({kind:'idle' as MotionKind,t:1,opened:open,shown:chapter,from:chapter,to:chapter,cued:false});
 const monitor=useRef({elapsed:0,frames:0,slow:0});
 const {invalidate,camera,size,gl}=useThree();const art=useLoader(THREE.TextureLoader,'/assets/arch.webp');
 const texture=useMemo(()=>coverTexture(c,art.image),[c,art]);
 useEffect(()=>{invalidate();onReady();return()=>texture.dispose();},[texture]);
 useEffect(()=>{const s=state.current;
  if(open!==s.opened){s.kind=open?'opening':'closing';s.opened=open;s.from=s.shown;s.to=chapter;s.t=0;s.cued=false;}
  else if(open&&chapter!==s.to){s.kind='turning';s.from=s.shown;s.to=chapter;s.t=0;s.cued=false;}
  invalidate();
 },[open,chapter]);
 useEffect(()=>{invalidate();},[fast,look]);
 useFrame((_,dt)=>{
  const s=state.current,moving=s.kind!=='idle';
  const alive=open&&chapter===0&&!moving&&!document.hidden&&!lite;
  if(alive)gardenTime.current+=Math.min(dt,.05);
  const time=gardenTime.current,burst=time-wakeTime.current;
  if(moving&&!document.hidden&&dt<.25){monitor.current.elapsed+=dt;monitor.current.frames++;if(monitor.current.elapsed>=2){monitor.current.slow=monitor.current.frames/monitor.current.elapsed<24?monitor.current.slow+1:0;monitor.current.elapsed=0;monitor.current.frames=0;if(monitor.current.slow>=2){monitor.current.slow=0;onSlow();}}}
  if(moving)s.t=fast?1:Math.min(1,s.t+Math.min(dt,.05)/durations[s.kind]);
  if(moving&&!s.cued&&s.t>=(s.kind==='turning'?.25:s.kind==='closing'?.4:.06)){s.cued=true;if(!fast)onPaper();}
  const v=pose(s.kind,s.t,s.opened);
  s.shown=s.kind==='turning'?(v.incoming?s.to:s.from):s.kind==='opening'?s.to:s.shown;
  if(ref.current){
   ref.current.rotation.y=look*.16;
   ref.current.scale.setScalar(1.12);
   const width=6.6*gardenSpread(size.width/size.height);
   ref.current.position.x=-(1-v.book)*width/4*1.12;
   const binding=ref.current.getObjectByName('left-binding')!;
   binding.rotation.z=-(1-v.book)*PI;binding.position.y=(1-v.book)*.3;
   const leaf=ref.current.getObjectByName('turning-leaf')!;
   leaf.visible=s.kind==='turning';
   leaf.rotation.z=(s.to>s.from?v.leaf:1-v.leaf)*PI;
  }
  const phi=(s.to>s.from?v.leaf:1-v.leaf)*PI;
  pages.current?.children.forEach(group=>{
   const i=group.userData.sector;
   let left=v.book*PI,right=0;
   if(s.kind==='turning'){
    const incoming=i===s.to,forward=s.to>s.from;
    if(incoming===forward)left=phi;else{left=PI;right=phi;}
    group.visible=(i===s.from||i===s.to)&&left-right>.0001;
   }else group.visible=i===s.shown&&v.book>.0001;
   if(!group.visible)return;
   group.traverse(node=>{
    const data=node.userData;
    data.active=alive;
    if(data.gardenActor){
     const flying=alive&&burst>=0&&burst<5;
     const t=flying?burst/5:0,arc=Math.sin(t*PI),spread=gardenSpread(size.width/size.height);
     const bx=data.x+(flying?Math.sin(t*PI*2+data.index*PI)*arc*1.4*spread:0);
     const by=data.y+(flying?arc*.85:alive?Math.sin(time*1.3+data.index)*.04:0);
     const [x,y]=foldPoint(bx,by,left,right,3.3*spread-.08);
     node.position.set(x,y+.17,data.z+(flying?Math.sin(t*PI)*.25:0));
     node.rotation.z=alive?Math.sin(time*1.6+data.index)*.12:0;
     node.scale.setScalar(.25+.75*Math.sin((left-right)/2));
    }
    if(data.wing)node.rotation.y=alive?data.wing*(.25+.65*(.5+.5*Math.sin(time*(burst<5?15:7)+data.index))):0;
    if(data.petal!==undefined){
     const j=data.petal,t=burst-j*.045;
     node.visible=alive&&t>=0&&t<3.6;
     if(node.visible){const k=t/3.6;node.position.set(Math.sin(j*2.4)*(.4+k*1.2)*gardenSpread(size.width/size.height),.35+Math.sin(k*PI)*1.75,3.55+Math.cos(j)*.15);node.rotation.set(t*2+j,t+j,t*1.8);node.scale.setScalar(Math.sin(k*PI));}
    }
    if(data.paperPanel){
    const mesh=node as THREE.Mesh,geometry=mesh.geometry;
    const rest=geometry.userData.rest as Float32Array,positions=geometry.attributes.position;
    const radius=3.3*gardenSpread(size.width/size.height)-.08;
    for(let j=0;j<positions.count;j++){
     const wind=alive?Math.sin(time*1.15+rest[j*3]*.8)*data.sway*rest[j*3+1]**2:0;
     const [x,y]=foldPoint(rest[j*3]+wind,rest[j*3+1],left,right,radius);
     positions.setXYZ(j,x,y,rest[j*3+2]);
    }
    positions.needsUpdate=true;geometry.computeVertexNormals();
   }});
  });
  const aspect=size.width/size.height;
  const fitDistance=Math.max(11.1,6.6*gardenSpread(aspect)*1.12/(2*Math.tan(19*PI/180)*aspect*.96)+3.64);
  camera.position.set(0,THREE.MathUtils.lerp(6.8,2.15,v.book),THREE.MathUtils.lerp(10.8,fitDistance,v.book)+Math.sin(v.book*PI)*2.4);
  camera.lookAt(0,THREE.MathUtils.lerp(.2,1.15,v.book)+Math.sin(v.book*PI)*.35,1.9);
  gl.domElement.dataset.motion=moving&&s.t<1?'moving':'settled';
  gl.domElement.dataset.phase=s.kind;gl.domElement.dataset.progress=s.t.toFixed(3);
  gl.domElement.dataset.fold=v.fold.toFixed(3);gl.domElement.dataset.leaf=v.leaf.toFixed(3);
  if(moving&&s.t===1){s.kind='idle';s.shown=s.to;onSettled();}
  if(moving||alive)invalidate();
 });
 return <><ambientLight intensity={1.65}/><directionalLight position={[-5,9,6]} intensity={1.1} castShadow={!lite} shadow-mapSize={[2048,2048]} shadow-radius={4} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.001}/><group ref={ref} position={[0,-.65,0]}><Binding texture={texture}/><group ref={pages}>{[0,1,2,3].map(i=><Page key={i} i={i} p={1} c={c} onGarden={onGarden}/>)}</group></group><mesh position={[0,-.85,0]} rotation={[-PI/2,0,0]} receiveShadow><planeGeometry args={[30,30]}/><shadowMaterial transparent opacity={.16}/></mesh></>;
}
export default function Book({open,chapter,c,lite,onReady,onFail,fast,look,onSlow,onSettled,onPaper,onGarden,gardenPulse}:{open:boolean;chapter:number;c:Content;lite:boolean;onReady:()=>void;onFail:()=>void;fast:boolean;look:number;onSlow:()=>void;onSettled:()=>void;onPaper:()=>void;onGarden:()=>void;gardenPulse:number}){
 return <Canvas shadows={!lite} dpr={lite?1:[1,1.5]} frameloop="demand" camera={{position:[0,4.6,8.8],fov:38,near:.1,far:80}} onCreated={({camera,gl})=>{camera.lookAt(0,.5,1.2);gl.domElement.addEventListener('webglcontextlost',onFail);}}><Suspense fallback={null}><World onGarden={onGarden} gardenPulse={gardenPulse} onPaper={onPaper} onSettled={onSettled} fast={fast} look={look} onSlow={onSlow} open={open} chapter={chapter} c={c} lite={lite} onReady={onReady}/></Suspense></Canvas>;
}
