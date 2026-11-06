import {useLoader,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import PopUpPanel from './PopUpPanel';
import GardenDetails from './GardenDetails';

function Layer({name,w,h,z,onWake}:{name:string;w:number;h:number;z:number;onWake?:()=>void}){
 const texture=useLoader(THREE.TextureLoader,`/assets/garden-v2/${name}.webp`);
 texture.colorSpace=THREE.SRGBColorSpace;
 return <PopUpPanel texture={texture} w={w} h={h} z={z} sway={name==='hedges'?.025:name==='portal'?.012:0} onWake={onWake}/>;
}

export function gardenSpread(aspect:number){return THREE.MathUtils.clamp(aspect/1.6,.64,1);}

export default function FirstGarden({onWake}:{onWake:()=>void}){
 const {size}=useThree();const spread=gardenSpread(size.width/size.height);
 return <group>
  <Layer name="estate" w={5.25*spread} h={3.25} z={.25}/>
  <Layer name="hedges" w={5.35*spread} h={2.45} z={1.55} onWake={onWake}/>
  <Layer name="newlyweds" w={1.56} h={2.32} z={2.65}/>
  <Layer name="portal" w={6.4*spread} h={3.95} z={3.25}/>
  <GardenDetails spread={spread} onWake={onWake}/>
 </group>;
}
