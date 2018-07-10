import TtsServices from "../services/tts.service";
import { Request, Response, constructor } from "express";
// import * as sprequest from "sp-request";
import { ttsInfos } from "../../common/tts.info";
import { tts_parent } from "../../common/tts_parent";
import ttsService from "../services/tts.service";
import SpRequestService from "../services/sprequestservice";
import { Iticketrequest } from "../../Interface/Iticketrequest";
import { ITrcCentersBreakdownListItem } from "../../Interface/ITrcCentersBreakdownListItem";
import sprequestservice from "../services/sprequestservice";
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
    getroute(routeid: number, accessToken: string): Promise<any> {
        return TtsServices.readbyFilter(accessToken, ttsInfos.Routes.name,
            "Id eq " + routeid);
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
    ticket_requests_cost_centers_breakdown(req: Request, res: Response): void {
        this.commreadallhandler(req, res, ttsInfos.Ticket_Requests_Cost_Centers_Breakdown.name);
    }
    getSeatPrices(o_TickectRequest: any, route: any): any {

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
        let reqbody: Iticketrequest = {} as Iticketrequest;// = req.body;

        // console.log(getparam.d.results[0].Value);

        //  - travllers
        let costcenters: ITrcCentersBreakdownListItem[] = [];
        let reqtrcbdItems: any[] = req.body.travllers;
        let userinfo: any = await this.getuser(accessToken);
        let modetext: string = req.body.ModeText;
        reqbody.Transportation_x0020_ModeLookupId = req.body.mode;
        reqbody.Travel_x0020_Date = req.body.departureDate;
        reqbody.RouteFrom = req.body.departurePort;
        reqbody.RouteTo = req.body.arrivalPort;
        reqbody.Seat = req.body.seatClass;

        reqbody.TravelTime = req.body.TravelTime;
        reqbody.RouteLookupId = req.body.RouteLookupId;
        reqbody.TIcket_x0020_Type = req.body.tickettype;
        reqbody.Quantity = reqtrcbdItems.length;
        reqbody.RequestorLookupId = userinfo.Id;
        reqbody.Request_x0020_For=req.body.RequestFor;
        reqbody.Ticket_x0020_Pickup_x0020_LocatiLookupId = req.body.LocationId;


        reqbody.ChineseName=req.body.ChineseName||"";
        // 'ChineseID': data.ChineseID, //Bill feedback 2016-5-20 point 3
        reqbody.Remarks = req.body.Remarks;
        reqbody.FerryRemarks = req.body.FerryRemarks;
        let routeObj: any = await this.getroute(reqbody.RouteLookupId, accessToken);

        if (routeObj.d.results.length > 0) {
            routeObj = routeObj.d.results[0];
        } else {
            routeObj = {};
        }
        reqbody.Currency = routeObj.Currency;
        reqbody.Unit_x0020_Cost = this.getSeatPrices(reqbody, routeObj);
        reqbody.Requestor_x0020_Department = userinfo.Department;
        let message: string = await this.checkdata(accessToken, reqbody, userinfo.Id);
        if (message.length > 0) {
            res.json({ code: -1, message: message });
            return;
        }
        const pathparam: any = await this.getSystemParameter("Path", accessToken);
        await SpRequestService.checkfile(pathparam.d.results[0].Value, true);
        const getparam: any = await this.getSystemParameter("Ticket Sequence Number", accessToken);
        reqbody.Title = this.generateRequisitionNumber(getparam.d.results[0].Value);

        ttsService.update(getparam.d.results[0].Id, { Value: reqbody.Title }, accessToken,
            ttsInfos.System_Parameters.name).then((d) => {
                console.log(d);
                SpRequestService.checkfile(pathparam.d.results[0].Value, false);
            }).catch((err) => {
                console.log(err);
                SpRequestService.checkfile(pathparam.d.results[0].Value, false);
                res.json(err);
                return;
            });

        reqtrcbdItems.map((item, index) => {
            let ctid: number = parseInt(item.costCenterid, 10);
            if (ctid > 0) {
                costcenters.push({
                    Title: reqbody.Title,
                    Cost_x0020_Center_x0020_CodeLookupId: ctid,
                    Quantity: 1,
                    Unit_x0020_Cost: reqbody.Unit_x0020_Cost,
                    OfficeEmail: item.OfficeEmail,
                    IsGuest: item.IsGuest,
                    IDNumber: item.IDNumber,
                    SeatClass: reqbody.Seat,
                    IDType: item.IDType,
                    FullName: item.FullName
                });
                let Seatstr: string = modetext === "Ferry" ? " " : " " + reqbody.Seat;
                reqbody.EMailTemp = index === 0 ? item.FullName + Seatstr
                    : reqbody.EMailTemp + "<br/>" + item.FullName + Seatstr;
            }
        });
        TtsServices.create(reqbody, accessToken, ttsInfos.Ticket_Requests.name)
            .then((r) => {
                if (r) {

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
                    console.log(costcenters);
                    let CostCentersBreakdownSummary: any = {};
                    costcenters.map((item) => {
                        TtsServices.create(item, accessToken, ttsInfos.Ticket_Requests_Cost_Centers_Breakdown.name).then((ret) => {
                            console.log(ret);
                        });
                        this.updateIDInformation(accessToken, item);
                        if (modetext === "Ferry") {
                            const ccbsKey: string = "" + item.Cost_x0020_Center_x0020_CodeLookupId;
                            if (CostCentersBreakdownSummary[ccbsKey] == null) {
                                CostCentersBreakdownSummary[ccbsKey] = {};
                                CostCentersBreakdownSummary[ccbsKey]["UnitCost"] = item.Unit_x0020_Cost;
                                CostCentersBreakdownSummary[ccbsKey].Quantity = 0;
                                CostCentersBreakdownSummary[ccbsKey]["CostCenterCode"] = item.Cost_x0020_Center_x0020_CodeLookupId;
                                CostCentersBreakdownSummary[ccbsKey]["RequisitionNumber"] = item.Title;
                            }
                            let peopleType: string = item.IsGuest === true ? "Guest" : "People";
                            if (CostCentersBreakdownSummary[ccbsKey][peopleType] == null) {
                                CostCentersBreakdownSummary[ccbsKey][peopleType] = "";
                            }
                            CostCentersBreakdownSummary[ccbsKey]["Quantity"]++;
                            if (CostCentersBreakdownSummary[ccbsKey][peopleType] === "") {
                                CostCentersBreakdownSummary[ccbsKey][peopleType] = item.FullName;
                            } else {
                                CostCentersBreakdownSummary[ccbsKey][peopleType] += "," + item.FullName;
                            }
                        }
                    });
                    if (modetext === "Ferry") {
                        this.saveCostCentersBreakdownSummary(CostCentersBreakdownSummary, accessToken);
                    }
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

  async  update_ticket_requests(req: Request, res: Response): Promise<any> {
        let accessToken: string = this.getAccessToken(req);
        let reqbody: Iticketrequest = {} as Iticketrequest;// = req.body;
        reqbody.Id=req.params.Id;
        const oldItems:any=await TtsServices.readbyFilter(accessToken,
        ttsInfos.Ticket_Requests.name,"Id eq "+reqbody.Id);
        if(oldItems.d.results.length===0) {
           res.json({code:-1,message:"参数错误，或记录不存在"});
            res.end();
            return;
        }
        reqbody=Object.assign(oldItems.d.results[0],reqbody);
        // console.log(getparam.d.results[0].Value);

        //  - travllers
        let costcenters: ITrcCentersBreakdownListItem[] = [];
         let reqtrcbdItems: any[] = req.body.travllers;
        let userinfo: any = await this.getuser(accessToken);
        let modetext: string = req.body.ModeText;
      reqbody.Request_x0020_For=req.body.RequestFor;
        reqbody.Transportation_x0020_ModeLookupId = req.body.mode;
        reqbody.Travel_x0020_Date = req.body.departureDate;
        reqbody.RouteFrom = req.body.departurePort;
        reqbody.RouteTo = req.body.arrivalPort;
        reqbody.Seat = req.body.seatClass;

        reqbody.TravelTime = req.body.TravelTime;
        reqbody.RouteLookupId = req.body.RouteLookupId;
        reqbody.TIcket_x0020_Type = req.body.tickettype;
        reqbody.Quantity = reqtrcbdItems.length;
        reqbody.RequestorLookupId = userinfo.Id;
        reqbody.Ticket_x0020_Pickup_x0020_LocatiLookupId = req.body.LocationId;


        reqbody.ChineseName=req.body.ChineseName||"";
        // 'ChineseID': data.ChineseID, //Bill feedback 2016-5-20 point 3
        reqbody.Remarks = req.body.Remarks;
        reqbody.FerryRemarks = req.body.FerryRemarks;
        let routeObj: any = await this.getroute(reqbody.RouteLookupId, accessToken);

        if (routeObj.d.results.length > 0) {
            routeObj = routeObj.d.results[0];
        } else {
            routeObj = {};
        }
        reqbody.Currency = routeObj.Currency;
        reqbody.Unit_x0020_Cost = this.getSeatPrices(reqbody, routeObj);
        reqbody.Requestor_x0020_Department = userinfo.Department;
        let message: string = await this.checkdata(accessToken, reqbody, userinfo.Id);
        if (message.length > 0) {
            res.json({ code: -1, message: message });
            return;
        }
        reqbody.EMailTemp="";
        reqtrcbdItems.map((item, index) => {
            let ctid: number = parseInt(item.costCenterid, 10);
            if (ctid > 0) {
                let Seatstr: string = modetext === "Ferry" ? " " : " " + reqbody.Seat;
                reqbody.EMailTemp = index === 0 ? item.FullName + Seatstr
                    : reqbody.EMailTemp + "<br/>" + item.FullName + Seatstr;
            }
        });
       ttsService.update(reqbody.Id+"",{
        "Transportation_x0020_ModeId": reqbody.Transportation_x0020_ModeLookupId,
        "Travel_x0020_Date": reqbody.Travel_x0020_Date,
        "TravelTime": reqbody.TravelTime,
        "RouteLookupId": reqbody.RouteLookupId,
        "TIcket_x0020_Type": reqbody.TIcket_x0020_Type,
        "Seat": reqbody.Seat,
        "Quantity": reqbody.Quantity,
        "Currency": reqbody.Currency,
        "Request_x0020_For": reqbody.Request_x0020_For,
        "Ticket_x0020_Pickup_x0020_LocatiId":  reqbody.Ticket_x0020_Pickup_x0020_LocatiLookupId ,
        "Unit_x0020_Cost": reqbody.Unit_x0020_Cost,
        "AppEdit": "Y",
        "RouteFrom": reqbody.RouteFrom,
        "RouteTo": reqbody.RouteTo,
        "ChineseName": reqbody.ChineseName,
        "Remarks": reqbody.Remarks,
        "FerryRemarks": reqbody.FerryRemarks ,
        "EMailTemp": reqbody.EMailTemp
       },accessToken,ttsInfos.Ticket_Requests.name).then((r) => {
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




    getUserCouponCount(accessToken: string, userid: number): Promise<any> {
        return TtsServices.readbyFilter(accessToken, ttsInfos.User_Coupon_Count.name, "UserId eq " + userid);
    }
    async  checkdata(accessToken: string, o_TickectRequest: any, userid: number): Promise<string> {
        let Ucc: any = await this.getUserCouponCount(accessToken, userid);

        if (Ucc.d.results && Ucc.d.results.length > 0) {
            const getparam: any = await this.getSystemParameter("Maximum Number of Coupons", accessToken);
            const MaximunValue: number = getparam.d.results[0].Value;
            var userCouponTotal: number = Ucc.d.results[0].Count;
            if (o_TickectRequest.Type === "Coupon" && o_TickectRequest.Quantity * 1 > MaximunValue) {
                return "You cannot order more than " + MaximunValue + " per request.\n";
            } else if (o_TickectRequest.Type === "Coupon" && userCouponTotal + (o_TickectRequest.Quantity * 1) > MaximunValue) {
                // tslint:disable-next-line:max-line-length
                return "Your are having outstanding coupon request which needs to be settled with Admin department before you can make new coupon request.\n";
            } else if (o_TickectRequest.Type === "Ticket" && o_TickectRequest.Quantity * 1 > MaximunValue) {
                return "You cannot order more than " + MaximunValue + " per request.\n";
            }
        }
        return "";
    }
    updateIDInformation(accessToken: string, costcenterItem: any): void {
        ttsService.readbyFilter(accessToken, ttsInfos.ID_Information.name, "OfficeEmail eq '" + costcenterItem.OfficeEmail + "'")
            .then((itemdatas) => {
                if (itemdatas.d.results.length === 0) {
                    ttsService.create({
                        "Title": costcenterItem.OfficeEmail,
                        "IDType": costcenterItem.IDType,
                        "OfficeEmail": costcenterItem.OfficeEmail,
                        "FullName": costcenterItem.FullName,
                        "IDNumber": costcenterItem.IDNumber,
                        "IsSave": true
                    }, accessToken, ttsInfos.ID_Information.name).then((idinfo) => {
                        console.log("added ID Information", idinfo);
                    });
                } else if (itemdatas.d.results.length === 1) {
                    ttsService.update(itemdatas.d.results[0].Id,
                        {
                            "IDType": costcenterItem.IDType,
                            "IDNumber": (itemdatas.d.results[0].isSave === true ? costcenterItem.IDNumber : ""),
                        }, accessToken, ttsInfos.ID_Information.name).then((iifm) => {
                            console.log("update ID Information", iifm);
                        });
                }
            });
    }
    saveCostCentersBreakdownSummary(datas: any[], accessToken: string): void {
        for (var costCenterCodeId in datas) {
            if (datas.hasOwnProperty(costCenterCodeId)) {
                const data: any = datas[costCenterCodeId];
                let url: string = `${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos.Cost_Centers_Breakdown_Summary
                    .listtitle}\')/items?$filter=Title eq '${data.RequisitionNumber}'`;
                SpRequestService.request_get(url)
                    .then(response => {
                        let items: any[] = response.body.d.results;
                        if (items.length > 0) {
                            let id: number = items[0].Id;
                            url = `${ttsInfos.url}/_api/web/lists/GetByTitle(\'${ttsInfos.Cost_Centers_Breakdown_Summary
                                .listtitle}\')/items(${id})`;
                            SpRequestService.request_delete({}, ttsInfos.Cost_Centers_Breakdown_Summary.listtitle,
                                url).then((delret) => {
                                    console.log(delret);
                                }).catch(delerr => {
                                    console.log(delerr);
                                });
                        }
                        ttsService.create({
                            "Title": data["RequisitionNumber"],
                            "Quantity": data["Quantity"],
                            "UnitCost": data.UnitCost,
                            "CostCenterCodeLookupId": data["CostCenterCode"],
                            "People": data["People"] === null ? "" : data["People"],
                            "Guest": data["Guest"] == null ? "" : data["Guest"]
                        }, accessToken, ttsInfos.Cost_Centers_Breakdown_Summary.name)
                            .then(createdret => {
                                console.log(createdret);
                            });



                    })
                    .catch(err2 => {
                        console.log(url);
                    });
            }
        }
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