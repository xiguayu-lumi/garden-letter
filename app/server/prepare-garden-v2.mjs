import sharp from 'sharp';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const source='C:/Users/lgy/.codex/generated_images/01a19ffe-9b1f-7763-8c97-39641fe81944';
const root=path.resolve('public/assets/garden-v2');
const assets={concept:'15dec47f-6a71-46b2-8f2b-670f46dbdf7c',estate:'0a6d0c19-5721-4183-8362-f99e170bc057',portal:'c9ae298b-1d40-416f-942e-af4f2c2d2d17',hedges:'73782d38-651f-4d2e-a76f-7c633606ae87',newlyweds:'f3f21524-76a7-4e9b-955b-7eade4122cbc',lawn:'b2ddfb52-532f-475e-a71d-4417d28f4b34'};
await mkdir(root,{recursive:true});await mkdir('art/garden-v2',{recursive:true});
const report=[];
for(const [name,id] of Object.entries(assets)){
 const original=path.join(source,`exec-${id}.png`);
 await copyFile(original,path.resolve('art/garden-v2',name+'.png'));
 await sharp(original).resize({width:name==='concept'?1440:1536,withoutEnlargement:true}).webp({quality:90,alphaQuality:100}).toFile(path.join(root,name+'.webp'));
 const meta=await sharp(original).metadata();report.push({name,source:original,width:meta.width,height:meta.height,alpha:meta.hasAlpha});
}
await writeFile('art/garden-v2/sources.json',JSON.stringify(report,null,2));console.log(report);
