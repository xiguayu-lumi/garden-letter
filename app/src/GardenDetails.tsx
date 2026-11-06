import {useEffect,useMemo} from 'react';
import {useLoader} from '@react-three/fiber';
import * as THREE from 'three';

function Butterfly({x,y,z,index,onWake}:{x:number;y:number;z:number;index:number;onWake:()=>void}){
 const source=useLoader(THREE.TextureLoader,'/assets/garden-v2/butterfly.webp');
 source.colorSpace=THREE.SRGBColorSpace;
 const maps=useMemo(()=>[0,1].map(i=>{const t=source.clone();t.repeat.x=.5;t.offset.x=i*.5;return t;}),[source]);
 useEffect(()=>()=>{maps.forEach(t=>t.dispose());document.body.style.cursor='';},[maps]);
 return <group userData={{gardenActor:true,x,y,z,index}} onClick={e=>{if(e.delta>8||!e.eventObject.userData.active)return;e.stopPropagation();onWake();}} onPointerOver={e=>{if(e.eventObject.userData.active)document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='';}}>
  {[-1,1].map((side,i)=><group key={side} userData={{wing:side,index}}>
   <mesh position={[side*.16,0,0]} castShadow><planeGeometry args={[.32,.52]}/><meshStandardMaterial map={maps[i]} transparent alphaTest={.35} side={THREE.DoubleSide} roughness={1}/></mesh>
  </group>)}
 </group>;
}
export default function GardenDetails({spread,onWake}:{spread:number;onWake:()=>void}){
 return <group>
  <Butterfly x={-1.55*spread} y={1.3} z={3.6} index={0} onWake={onWake}/>
  <Butterfly x={1.65*spread} y={2.7} z={3.45} index={1} onWake={onWake}/>
  {Array.from({length:18},(_,i)=><mesh key={i} visible={false} userData={{petal:i}} raycast={()=>{}}>
   <circleGeometry args={[.055+(i%3)*.012,5]}/><meshStandardMaterial color={['#e8b9a5','#f7ead2','#d7a787'][i%3]} side={THREE.DoubleSide} roughness={1}/>
  </mesh>)}
 </group>;
}
