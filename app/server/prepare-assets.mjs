import sharp from 'sharp';import {existsSync} from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public/assets');
const atlas=path.join(root,'story-atlas.png');
if(existsSync(atlas)){const {width:w,height:h}=await sharp(atlas).metadata();for(const [name,x,y] of [['cafe',0,0],['bridge',.5,0],['frame',0,.5],['canopy',.5,.5]]){const dest=path.join(root,name+'.webp');if(!existsSync(dest)){const part=await sharp(atlas).extract({left:Math.floor(x*w),top:Math.floor(y*h),width:Math.floor(w/2),height:Math.floor(h/2)}).toBuffer();await sharp(part).trim().webp({quality:88}).toFile(dest);}}}
