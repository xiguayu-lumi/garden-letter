export const demoContent = {
 internalName:'花园来信 · 示例',names:['许知夏','陈屿'],date:'2027-05-20',time:'16:30',endDate:'',endTime:'',timezone:'Asia/Shanghai',venue:'蔷薇花园庄园',address:'这是一处虚构的示例场地，请勿据此前往。',mapUrl:'',invitation:'想把这一生的好天气，都与你分享。',fullText:'从两个人的相遇，到两个家庭的相拥。\n我们想邀请你，走进这座关于爱的花园。\n见证我们的约定，也留下你的笑容。',stories:[{title:'初见，是晴天',date:'2021.06',text:'一杯还冒着热气的咖啡，一场没有预料到的相遇。故事就这样，轻轻开始了。'},{title:'一起走过四季',date:'2023.10',text:'后来，平常的日子都有了特别的意义。看过的海，走过的路，都成了我们的风景。'},{title:'把以后交给彼此',date:'2026.05',text:'最好的答案，藏在每一次坚定的选择里。下一站，我们想一起走。'}],photos:[],emptyStory:'一路相伴，把平凡的日子过成值得珍藏的故事。',emptyPhoto:'把爱收藏在日常，把你写进每一个明天。',program:[{time:'16:00',title:'花园迎宾',text:'带着笑容，慢慢入场'},{time:'16:30',title:'婚礼仪式',text:'见证我们的郑重约定'},{time:'18:00',title:'晚宴相聚',text:'与爱的人，举杯共庆'}],music:true,shareTitle:'花园来信 · 邀你见证我们的婚礼',shareDescription:'展开一座花园，赴一场关于爱的约定。',demo:true
};
const length=s=>Array.from(s||'').length;
export function validate(c){
 const errors={}; const field=(key,value,min,max)=>{if(typeof value!=='string'||length(value.trim())<min||length(value)>max) errors[key]=`请填写 ${min}–${max} 字`;};
 field('internalName',c.internalName,1,40);field('names.0',c.names?.[0],1,12);field('names.1',c.names?.[1],1,12);field('venue',c.venue,1,40);field('address',c.address,1,120);field('invitation',c.invitation,1,60);field('fullText',c.fullText,0,200);field('emptyStory',c.emptyStory,1,60);field('emptyPhoto',c.emptyPhoto,1,60);field('shareTitle',c.shareTitle,1,36);field('shareDescription',c.shareDescription,0,60);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(c.date)||Number.isNaN(Date.parse(c.date))||new Date(c.date).toISOString().slice(0,10)!==c.date)errors.date='请选择有效日期';
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.time)) errors.time='请选择有效时间';
 try{new Intl.DateTimeFormat('zh',{timeZone:c.timezone}).format();}catch{errors.timezone='时区无效';}
 if((c.endDate||c.endTime)&&(!c.endDate||!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.endTime)||Number.isNaN(Date.parse(c.endDate))||`${c.endDate}T${c.endTime}`<=`${c.date}T${c.time}`))errors.endTime='结束时间必须晚于开始时间';
 if(c.mapUrl){try{const url=new URL(c.mapUrl);if(url.protocol!=='https:'||url.username||url.password||c.mapUrl.length>2048)throw 0;}catch{errors.mapUrl='请填写有效的 HTTPS 地图链接';}}else if(!c.demo)errors.mapUrl='正式作品需要地图链接';
 if(!Array.isArray(c.stories)||c.stories.length>3)errors.stories='最多三个故事';else c.stories.forEach((s,i)=>{field(`stories.${i}.title`,s.title,1,12);field(`stories.${i}.text`,s.text,1,80);field(`stories.${i}.date`,s.date,0,20);});
 if(!Array.isArray(c.photos)||c.photos.length>6)errors.photos='最多六张照片';else c.photos.forEach((p,i)=>{field(`photos.${i}.caption`,p.caption,0,40);if(!/^[a-f0-9]{32}$/.test(p.id))errors.photos='照片无效';if(p.crop){const a=p.crop;if(![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.x<0||a.y<0||a.width<=0||a.height<=0||a.x+a.width>1.001||a.y+a.height>1.001)errors.photos='裁剪范围超出图像';}});
 if(!Array.isArray(c.program)||c.program.length>4)errors.program='最多四个流程';else c.program.forEach((p,i)=>{field(`program.${i}.title`,p.title,1,16);field(`program.${i}.text`,p.text,0,40);if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time))errors.program='流程时间无效';});
 return errors;
}
export function ics(c,uid,sequence=1){
 const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 // UTC conversion uses the event's IANA zone, independent of the visitor.
 const utc=(d,t)=>{const target=Date.parse(`${d}T${t}:00Z`);let stamp=target;for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:c.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(stamp);const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));const shown=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);stamp+=target-shown;}return new Date(stamp).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');};
 const fold=line=>{let current='',result='';for(const char of line){if(Buffer.byteLength(current+char,'utf8')>74){result+=current+'\r\n';current=' ';}current+=char;}return result+current;};
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Garden Letter//Wedding//ZH','BEGIN:VEVENT',`UID:${uid}@garden-letter`,`SEQUENCE:${sequence}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART:${utc(c.date,c.time)}`,...(c.endDate?[`DTEND:${utc(c.endDate,c.endTime)}`]:[]),`SUMMARY:${esc(c.names.join('与')+'的婚礼')}`,`LOCATION:${esc(c.venue+' '+c.address)}`,`DESCRIPTION:${esc(c.invitation)}`,'END:VEVENT','END:VCALENDAR',''].map(fold).join('\r\n');
}
