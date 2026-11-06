import {useEffect,useRef,useState} from 'react';

export function useSoundtrack(notify:(message:string)=>void){
 const [music,setMusic]=useState(false);
 const bgm=useRef<HTMLAudioElement>(null),paperAudio=useRef<HTMLAudioElement>(null);
 const enabled=useRef(false),request=useRef(0);
 const stop=()=>{enabled.current=false;request.current++;bgm.current?.pause();paperAudio.current?.pause();setMusic(false);};
 useEffect(()=>{
  const hide=()=>{if(document.hidden)stop();};
  document.addEventListener('visibilitychange',hide);
  return()=>{document.removeEventListener('visibilitychange',hide);bgm.current?.pause();paperAudio.current?.pause();};
 },[]);
 const toggle=async()=>{
  if(enabled.current){stop();return;}
  const track=bgm.current,foley=paperAudio.current;if(!track||!foley)return;
  const id=++request.current;enabled.current=true;setMusic(true);track.volume=.5;
  // Unlock both media elements in the same user gesture, including mobile browsers.
  foley.volume=0;
  void foley.play().then(()=>{foley.pause();foley.currentTime=0;foley.volume=.7;}).catch(()=>{});
  try{await track.play();if(id!==request.current)track.pause();}
  catch{if(id===request.current){stop();notify('声音暂时未能播放，请再次点“开启声音”。');}}
 };
 const paper=()=>{
  const el=paperAudio.current;if(!enabled.current||document.hidden||!el)return;
  el.currentTime=0;el.volume=.7;void el.play().catch(()=>{});
 };
 return {music,toggle,paper,bgm,paperAudio};
}
