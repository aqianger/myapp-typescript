import * as sprequest from "sp-request";
import { ISPRequest } from "sp-request";
import { ttsInfos } from "../../common/tts.info";
let config: any = require("../../common/CredentialConfig");
let spr: ISPRequest = sprequest.create(config.onlineWithAdfsCreds);
export class SpRequestService {
   request_get(url:string):Promise<any> {
    return new Promise((resolve, reject) => {
        spr.get(url).then(response => {
  //  console.log(response);
    resolve(response);
})
.catch(err2 => {
    reject(err2);
});
});
}
request_create(bodydata: any, listtitle:string,siteurl:string,apiurl:string):Promise<any> {
    return new Promise((resolve, reject) => {
        spr.requestDigest(siteurl).then((value)=> {
            listtitle=listtitle.replace(/ /g,"_x0020_");
           bodydata.__metadata= { type: `SP.Data.${listtitle}ListItem` };
           console.log(bodydata);
        spr.post(apiurl,{
            body:bodydata,
            headers: {
              "X-RequestDigest": value,
            }
          }).then(response => {
            resolve(response);
          }).catch(err2 => {
            reject(err2);
        });});
});
}
 checkfile(pathstr:string,isOut:boolean):Promise<any> {
const url:string=  `${ttsInfos.url}/_api/web/GetFileByServerRelativeUrl('${pathstr}')/${isOut?
"CheckOut()":"checkin(comment='TTS',checkintype=0)"}`;
return new Promise((resolve, reject) => {
  spr.requestDigest(ttsInfos.url).then((value)=> {
    spr.post(url, {headers: {
      "X-RequestDigest": value}
    }).then(response => {
      resolve(response);
    }, err => {
      reject(err);
    });});
  });
}

request_update(bodydata: any, listtitle:string, url:string):Promise<any> {
    return new Promise((resolve, reject) => {
        spr.requestDigest(ttsInfos.url).then((value)=> {
           bodydata.__metadata= { type: `SP.Data.${listtitle}ListItem` };
        spr.post(url,{
            body:bodydata,
            headers: {
              "X-RequestDigest": value,
    "IF-MATCH": "*",
    "X-HTTP-Method":"MERGE",
            }
          }).then(response => {
            resolve(response);
          }, err => {
            reject(err);
          });});
});
}
request_delete(bodydata: any, listtitle:string, url:string):Promise<any> {
    return new Promise((resolve, reject) => {
        spr.requestDigest(url).then((value)=> {
           bodydata.__metadata= { type: `SP.Data.${listtitle}ListItem` };
        spr.post(url,{
            body:bodydata,
            headers: {
              "X-RequestDigest": value,
    "IF-MATCH": "*",
    "X-HTTP-Method":"DELETE",
            }
          }).then(response => {
            resolve(response);
          }, err => {
            reject(err);
          });});
});
}
}


export default new SpRequestService();