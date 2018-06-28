import * as sprequest from "sp-request";
let config: any = require("../../common/CredentialConfig");
let spr: any = sprequest.create(config.onlineWithAdfsCreds);
export class SpRequestService {
   request_get(url:string):Promise<any> {
    return new Promise((resolve, reject) => {
        spr.get(url).then(response => {
    console.log(response);
    resolve(response);
})
.catch(err2 => {
    reject(err2);
});
});
}
}
export default new SpRequestService();