import {useEffect,useMemo} from 'react';
import * as THREE from 'three';

export default function PopUpPanel({texture,w,h,x=0,z,alpha=.65,sway=0,onWake}:{texture:THREE.Texture;w:number;h:number;x?:number;z:number;alpha?:number;sway?:number;onWake?:()=>void}){
 const geometry=useMemo(()=>{
  const g=new THREE.PlaneGeometry(w,h,40,32);g.translate(x,h/2,0);
  g.userData.rest=Float32Array.from(g.attributes.position.array);
  return g;
 },[w,h,x]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} position={[0,.17,z]} userData={{paperPanel:true,sway}} castShadow receiveShadow frustumCulled={false} onClick={e=>{if(onWake&&e.delta<8&&e.object.userData.active){e.stopPropagation();onWake();}}}>
  <meshStandardMaterial map={texture} transparent alphaTest={alpha} side={THREE.DoubleSide} roughness={1}/>
 </mesh>;
}
