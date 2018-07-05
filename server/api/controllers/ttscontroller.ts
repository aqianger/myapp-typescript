import TtsServices from "../services/tts.service";
import { Request, Response, constructor } from "express";
// import * as sprequest from "sp-request";
import { ttsInfos } from "../../common/tts.info";
import { tts_parent } from "../../common/tts_parent";
import ttsService from "../services/tts.service";
import SpRequestService from "../services/sprequestservice";
// import { onlineWithAdfsCreds, onlineUrl } from "../../common/CredentialConfig";
// import { IUserCredentials } from "sp-request";
// let spr:any = sprequest.create( onlineWithAdfsCreds);
export class TtsController {
    constructor() {
        console.log(this);
    }
    getAccessToken(req: Request): string {
        return req.rawHeaders[req.rawHeaders.indexOf("Authorization") + 1];
    }
    getuser(accessToken: string): Promise<any> {
        return ttsService.getUserData(accessToken);
    }
    commreadallhandler(req: Request, res: Response, list: string): void {
        TtsServices.readAll(this.getAccessToken(req), list)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    test(req: Request, res: Response): void {
        res.json({ code: 0, msg: "ok" });
    }
    getSystemParameter(key: string, accessToken: string): Promise<any> {
        return TtsServices.readbyFilter(accessToken, ttsInfos.System_Parameters.name,
            "Title eq '" + key + "'");
    }
    getroute(routeid:string, accessToken: string):Promise<any> {
    return TtsServices.readbyFilter(accessToken,ttsInfos.Routes.name,
    "Id eq "+routeid);
    }
    travellers(req: Request, res: Response): void {
        TtsServices.getuserbyemail(this.getAccessToken(req),
            req.params.email).then((r) => {
                if (r) { res.json(r); } else { res.end(); }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    entities(req: Request, res: Response): void {
        console.log(this);
        /*
        TtsServices.get_ttsparent(this.getAccessToken(req), tts_parent.FactoryCode.name, "SubFactory")
            .then((r) => {
                if (r) {
                    r = Array.from(new Set(r));
                    res.json(r);
                } else { res.end(); }
            })
            .catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });*/
        TtsServices.readbyFilter(this.getAccessToken(req), tts_parent.Factory.name,
            "", "", "Id,Title", undefined, true)
            .then((body) => {
                let r: any[] = body.d.results;
                if (r) {
                    // r = Array.from(new Set(r));
                    res.json(r);
                } else { res.end(); }
            })
            .catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });

    }
    cost_centers(req: Request, res: Response): void {
        this.commreadallhandler(req, res, ttsInfos.Cost_Centers.name);
    }
    par_cost_centers(req: Request, res: Response): void {
        TtsServices.get_ttsparent(this.getAccessToken(req), tts_parent.FactoryCode.name, "", req.params.entity)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    locations(req: Request, res: Response): void {
        this.commreadallhandler(req, res, ttsInfos.Locations.name);
    }
    user_default_ticket_pickup_location(req: Request, res: Response): void {
        // this.commreadallhandler(req, res, ttsInfos.User_Default_Cost_Center.name);
        const accessToken: string = this.getAccessToken(req);
        const email: string = req.params.email;
        ttsService.getuserbyemail(accessToken, email)
            .then((data) => {
                const url: string = `${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos
                    [ttsInfos.User_Default_Ticket_Pickup_Location.name]
                    .listtitle}\')/items?$filter=UserId eq ${data.Id}`;
                SpRequestService.request_get(url)
                    .then((r) => {
                        if (r) {
                            res.json(r);
                        } else {
                            res.end();
                        }
                    }).catch((err) => {
                        res.statusMessage = err.message ? err.message : undefined;
                        res.statusCode = err.status ? err.status : undefined;
                        res.end();
                    });

            });
    }
    generateRequisitionNumber(keyData: string): string {
        let t: Date = new Date();
        let m: number = t.getMonth() + 1;
        let d: number = t.getDate();
        let mstr: string = m > 9 ? m + "" : "0" + m;
        let dstr: string = d > 9 ? d + "" : "0" + d;
        const tdstr: string = t.getFullYear() + mstr + dstr;
        if (keyData === null || keyData.length !== 12) {
            return "" + t.getFullYear() + mstr + dstr + "0001";
        }
        let nostr: string = "0001";
        if (keyData.indexOf(tdstr) === 0) {
            nostr = keyData.substr(keyData.length - 4);
            nostr = "000" + (parseInt(nostr, 10) + 1);
        }
        return tdstr + nostr.substr(nostr.length - 4);
    }
    user_default_cost_center(req: Request, res: Response): void {
        // this.commreadallhandler(req, res, ttsInfos.User_Default_Cost_Center.name);
        const accessToken: string = this.getAccessToken(req);
        const email: string = req.params.email;
        ttsService.getuserbyemail(accessToken, email)
            .then((data) => {
                const url: string = `${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos[ttsInfos.User_Default_Cost_Center.name]
                    .listtitle}\')/items?$filter=`;//Id eq ${data.Id}`;
                SpRequestService.request_get(url)
                    .then((r) => {
                        if (r) {
                            res.json(r);
                        } else {
                            res.end();
                        }
                    }).catch((err) => {
                        res.statusMessage = err.message ? err.message : undefined;
                        res.statusCode = err.status ? err.status : undefined;
                        res.end();
                    });

            });
    }
    transportation_modes(req: Request, res: Response): void {
        this.commreadallhandler(req, res, ttsInfos.Transportation_Modes.name);
    }
    ticket_pickup_locations(req: Request, res: Response): void {
        this.commreadallhandler(req, res, ttsInfos.Ticket_Pickup_Locations.name);
    }
    schedule(req: Request, res: Response): void {
        TtsServices.readbyFilter(this.getAccessToken(req), ttsInfos.Routes.name,
            // tslint:disable-next-line:max-line-length
            `Transportation_x0020_ModeLookupId eq ${req.params.modeid} and Arrival_x0020_LocationLookupId eq ${req.params.destinationid} and Departure_x0020_LocationLookupId eq ${req.params.originid}`)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }

            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    getSeatPrices(o_TickectRequest:any,route:any):any {

        switch (o_TickectRequest.Seat) {

            case "First Class":

                return route.First_x0020_Price;

            case "VIP":

                return route.VIP_x0020_Price;

            default:
                return route.Ticket_x0020_Price;
        }
    }
    async create_ticket_requests(req: Request, res: Response): Promise<any> {
        let accessToken: string = this.getAccessToken(req);
        let reqbody: any = req.body;
        const getparam: any = await this.getSystemParameter("Ticket Sequence Number", accessToken);
        // console.log(getparam.d.results[0].Value);
        let routeObj:any =await this.getroute(reqbody.RouteLookupId,accessToken);
        let userinfo:any=await this.getuser(accessToken);
        if(routeObj.d.results.length>0) {
            routeObj=routeObj.d.results[0];
        } else {
        routeObj= {};
       }
        reqbody.Currency = routeObj.Currency;
        reqbody.Unit_x0020_Cost = this.getSeatPrices(reqbody,routeObj);
        reqbody.Requestor_x0020_Department=userinfo.Department;
        reqbody.Title = this.generateRequisitionNumber(getparam.d.results[0].Value);
        ttsService.update(getparam.d.results[0].Id, { Value: reqbody.Title }, accessToken,
            ttsInfos.System_Parameters.name).then((d) => {
                console.log(d);
            }).catch((err) => { console.log(err); });
        TtsServices.create(reqbody, accessToken, ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {
                    /*
                    let created:string=r.fields["Created"];
                    created=created.split("T")[0]+"T00:00:00Z";
                    TtsServices.readbyFilter(accessToken,ttsInfos.Ticket_Requests.name,
                    `Created ge datetime'${created}'`,"")*/
                    const userid: string = r.fields["EditorLookupId"];
                    const url: string = `${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos
                    [ttsInfos.User_Default_Ticket_Pickup_Location.name]
                        .listtitle}\')/items?$filter=UserId eq ${userid}`;
                    SpRequestService.request_get(url).then((d) => {
                        console.log(d);
                        const datacont: any = {
                            UserLookupId: userid,
                            Ticket_x0020_Pickup_x0020_LocatiLookupId: req.body.Ticket_x0020_Pickup_x0020_LocatiLookupId
                        };
                        if (d.body.d.results.length === 0) {
                            ttsService.create(datacont,
                                accessToken, ttsInfos.User_Default_Ticket_Pickup_Location.name).then((ret) => {
                                    console.log(ret);
                                });
                        } else if (d.body.d.results[0].Ticket_x0020_Pickup_x0020_LocatiId + "" !==
                            datacont.Ticket_x0020_Pickup_x0020_LocatiLookupId) {
                            const curdata: any = d.body.d.results[0];
                            ttsService.update(curdata.Id, datacont, accessToken, ttsInfos.User_Default_Ticket_Pickup_Location.name)
                                .then((ret) => {
                                    console.log(ret);
                                });
                        }
                    });

                   



                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
        /*
        TtsServices.spcreate(req.body, this.getAccessToken(req), ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
            */
    }
    userinfo(req: Request, res: Response): void {
        TtsServices.getUserData(this.getAccessToken(req)).then((r) => {
            if (r) {
                res.json(r);
            } else {
                res.end();
            }
        }).catch((err) => {
            res.statusMessage = err.message ? err.message : undefined;
            res.statusCode = err.status ? err.status : undefined;
            res.end();
        });
    }
    read_ticket_requests(req: Request, res: Response): void {
        TtsServices.read(req.params.id, this.getAccessToken(req), ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    async user_coupon_count(req: Request, res: Response): Promise<any> {
        const accessToken: string = this.getAccessToken(req);
        const userinfo: any = await this.getuser(accessToken);
        TtsServices.readbyFilter(accessToken, ttsInfos.User_Coupon_Count.name, "UserId eq " + userinfo.Id
        ).then((r) => {
            if (r) {
                res.json(r);
            } else {
                res.end();
            }
        }).catch((err) => {
            res.statusMessage = err.message ? err.message : undefined;
            res.statusCode = err.status ? err.status : undefined;
            res.end();
        });
    }
    update_ticket_requests(req: Request, res: Response): void {
        TtsServices.update(req.params.id, req.body, this.getAccessToken(req), ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
    delete_ticket_requests(req: Request, res: Response): void {
        TtsServices.delete(req.params.id, this.getAccessToken(req), ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {
                    res.json(r);
                } else {
                    res.end();
                }
            }).catch((err) => {
                res.statusMessage = err.message ? err.message : undefined;
                res.statusCode = err.status ? err.status : undefined;
                res.end();
            });
    }
}
export default new TtsController();