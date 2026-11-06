export type Story={title:string;text:string;date:string};
export type Photo={id:string;caption:string;crop?:{x:number;y:number;width:number;height:number}};
export type Content={internalName:string;names:[string,string];date:string;time:string;endDate:string;endTime:string;timezone:string;venue:string;address:string;mapUrl:string;invitation:string;fullText:string;stories:Story[];photos:Photo[];emptyStory:string;emptyPhoto:string;program:{time:string;title:string;text:string}[];music:boolean;shareTitle:string;shareDescription:string;demo:boolean};
export type Project={id:string;slug:string;revision:number;reviewed:number;status:string;expires:string;protected:boolean;content:Content;versions:{id:number;created:string}[];preview?:string};
