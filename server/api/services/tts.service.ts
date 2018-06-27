import { ttsInfos } from "../../common/tts.info";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
// import { resolve } from "dns";
import { tts_parent } from "../../common/tts_parent";
 import  SpRequestService from "./sprequestservice";
import * as suprequest from "superagent";
export class TtsServices {
    getUserData(accessToken: string): Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .get("https://graph.microsoft.com/v1.0/me")
                .set("Authorization", "Bearer " + accessToken)
                .end((err, res: suprequest.Response) => {
                    // callback(err, res);
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.log(res.body);
                        let listItem: MicrosoftGraph.ListItem = res.body.value;
                        resolve(listItem);
                    }
                });
            });
    }
    readbyFilter(accessToken: string, listKey: string, filterstring: string, topvalue?: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            suprequest.get("https://graph.microsoft.com/v1.0/me")
                .set("Authorization", "Bearer " + accessToken)
                .end((err) => {
                    // callback(err, res);
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                     SpRequestService.request_get(`${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos[listKey]
                            .listtitle}\')/items?$filter=${filterstring}${topvalue > 0 ?
                            "&$top=" + topvalue : ""}`)
                            .then(response => {
                                console.log(response.body);
                                resolve(response.body.value);
                            })
                            .catch(err2 => {
                                reject(err2);
                            });
                    }
                });
        });
    }

    getuserbyemail(accessToken: string, email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            suprequest.get("https://graph.microsoft.com/v1.0/me")
                .set("Authorization", "Bearer " + accessToken)
                .end((err, res: suprequest.Response) => {
                    // callback(err, res);
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                
                       SpRequestService.request_get(`${ttsInfos.url}/_api/web/siteuserinfolist/items?$filter=EMail eq '${email}'`)
                            .then(response => {
                                console.log(response.body);
                                resolve(response.body.value);
                            })
                            .catch(err2 => {
                                reject(err2);
                            });
                           
                    }
                });
        });
    }
    readAll(accessToken: string, listKey: string): Promise<MicrosoftGraph.ListItem[]> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .get(`https://graph.microsoft.com/v1.0/sites/${ttsInfos.id}/lists/${ttsInfos[listKey].id}/items?`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .set("Prefer","HonorNonIndexedQueriesWarningMayFailRandomly")
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log(res.body);
                            let listItems: MicrosoftGraph.ListItem[] = res.body.value;
                            resolve(listItems);
                        }
                    });
            }
        );
    }
    get_ttsparent(accessToken: string, listKey: string, select?: string, filter?: string): Promise<MicrosoftGraph.ListItem[]> {
        return new Promise(
            (resolve, reject) => {
                if (select && select !== "") {
                    select = "&$select=" + select;
                } else {
                    select = "";
                }
                if (filter && filter !== "") {
                    filter = "&$filter=" + filter;
                } else {
                    filter = "";
                }
                suprequest
                    .get(`https://graph.microsoft.com/v1.0/sites/${tts_parent
                    .id}/lists/${tts_parent[listKey].id}/items?$expand=Fields${select}${filter}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.log(`Bearer ${accessToken}`);
                            console.error(err);
                            reject(err);
                        } else {
                            console.log(res.body);
                            let listItems: MicrosoftGraph.ListItem[] = res.body.value;
                            resolve(listItems);
                        }
                    });
            }
        );
    }
    read(id: string, accessToken: string, listkey: string): Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .get(`https://graph.microsoft.com/v1.0/sites/${ttsInfos.id}/lists/${ttsInfos[listkey].id}/items/${id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .set("Prefer","HonorNonIndexedQueriesWarningMayFailRandomly")
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            let listItem: MicrosoftGraph.ListItem = res.body;
                            resolve(listItem);
                        }
                    });
            }
        );
    }

    delete(id: string, accessToken: string, listKey: string): Promise<suprequest.Response> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .delete(`https://graph.microsoft.com/v1.0/sites/${ttsInfos.id}/lists/${ttsInfos[listKey].id}/items/${id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
            }
        );
    }

    create(body: object, accessToken: string, listKey: string): Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .post(`https://graph.microsoft.com/v1.0/sites/${ttsInfos.id}/lists/${ttsInfos[listKey].id}/items`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            let listItem: MicrosoftGraph.ListItem = res.body;
                            resolve(listItem);
                        }
                    });
            }
        );
    }
    update(id: string, body: object, accessToken: string, listKey: string): Promise<MicrosoftGraph.FieldValueSet> {
        return new Promise(
            (resolve, reject) => {
                suprequest
                    .patch(`https://graph.microsoft.com/v1.0/sites/${ttsInfos.id}/lists/${ttsInfos[listKey].id}/items/${id}/fields`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: suprequest.Response) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            let listItem: MicrosoftGraph.FieldValueSet = res.body;
                            resolve(listItem);
                        }
                    });
            }
        );
    }
}
export default new TtsServices();