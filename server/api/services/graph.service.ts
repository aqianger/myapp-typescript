import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import * as request from 'superagent';

let siteId: string = 'esquel.sharepoint.com,ee8d7296-a555-4f00-a456-02ad6c32f750,34a11c71-bfb9-4871-8f5d-61c171e91658';
let listId: string = 'a7a1e798-a13e-4cf7-9770-31e08ed8ebdc';

export class GraphService {
    getUserData(accessToken:string):Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {  request
         .get("https://graph.microsoft.com/v1.0/me")
         .set("Authorization", "Bearer " + accessToken)
         .end((err, res:request.Response) => {
          // callback(err, res);
          if (err) {
            console.error(err);
            reject(err);
        } else {
            console.log(res.body);
            let listItem: MicrosoftGraph.ListItem = res.body.value;
            resolve(listItem);
        }});});
         }
    readAll(accessToken: string): Promise<MicrosoftGraph.ListItem[]> {
        return new Promise(
            (resolve, reject) => {
                request
                    .get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
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

    read(id: string, accessToken: string): Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {
                request
                    .get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
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

    delete(id: string, accessToken: string): Promise<request.Response> {
        return new Promise(
            (resolve, reject) => {
                request
                    .delete(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
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

    create(body: object, accessToken: string): Promise<MicrosoftGraph.ListItem> {
        return new Promise(
            (resolve, reject) => {
                request
                    .post(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: request.Response) => {
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
    update(id: string, body: object, accessToken: string): Promise<MicrosoftGraph.FieldValueSet> {
        return new Promise(
            (resolve, reject) => {
                request
                    .patch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${id}/fields`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: request.Response) => {
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

export default new GraphService();
