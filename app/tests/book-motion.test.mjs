import test from 'node:test';
import assert from 'node:assert/strict';
import {pose,foldPoint} from '../src/bookMotion.ts';

test('paper vertices stay inside their page wedge throughout open and turn',()=>{
 for(let k=1;k<=99;k++)for(const [left,right] of [[Math.PI*k/100,0],[Math.PI,Math.PI*k/100]]){
  for(const x of [-3,-1,0,1,3])for(const y of [0,1,2,4]){
   const [px,py]=foldPoint(x,y,left,right,3.22);
   assert.ok(py*Math.cos(right)-px*Math.sin(right)>=-1e-8);
   assert.ok(px*Math.sin(left)-py*Math.cos(left)>=-1e-8);
  }
 }
});
test('paper spread follows the book angle without a second delayed animation',()=>{
 for(let k=0;k<=100;k++)for(const kind of ['opening','closing']){
  const p=pose(kind,k/100,kind==='opening');assert.equal(p.book,p.fold);
 }
});
test('opening and closing reach the same stable poses without a visibility jump',()=>{
 for(const [kind,opened,start,end] of [['opening',true,0,1],['closing',false,1,0]]){
  assert.equal(pose(kind,0,opened).book,start);
  assert.equal(pose(kind,0,opened).fold,start);
  assert.equal(pose(kind,1,opened).book,end);
  assert.equal(pose(kind,1,opened).fold,end);
  let last=pose(kind,0,opened);
  for(let i=1;i<=100;i++){
   const next=pose(kind,i/100,opened);
   assert.ok(Math.abs(next.book-last.book)<.04);
   assert.ok(Math.abs(next.fold-last.fold)<.04);
   last=next;
  }
 }
});
