import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import * as request from 'superagent';

let siteId: string = 'esquel.sharepoint.com,3768d2ae-de61-45da-be4e-03fd8d96702a,bdbbd4aa-bc90-4a64-bc4f-6b32500e485f';
let listId: string = '67ece3a3-d709-42c9-be51-a6e8309e78c1';

export class GraphService {

    readAll(accessToken: string): Promise<MicrosoftGraph.ListItem[]> {
        return new Promise(
            (resolve, reject) => {
                request
                    .get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
                            reject(err);
                        } else {
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
                    .set('Authorization', `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
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
                    .set('Authorization', `Bearer ${accessToken}`)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
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
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
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
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(body)
                    .end((err, res: request.Response) => {
                        if (err) {
                            console.error(err)
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
