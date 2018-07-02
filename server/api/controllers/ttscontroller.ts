import TtsServices from "../services/tts.service";
import { Request, Response, constructor } from "express";
// import * as sprequest from "sp-request";
import { ttsInfos } from "../../common/tts.info";
import { tts_parent } from "../../common/tts_parent";
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
    commreadallhandler(req: Request, res: Response,list:string):void {
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
   test(req: Request, res: Response):void {
   res.json({code:0,msg:"ok"});
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
            TtsServices.readbyFilter(this.getAccessToken(req),tts_parent.Factory.name,
            "","","Id,Title",undefined,true)
            .then((body) => {
                let r:any[]=body.d.results;
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
        this.commreadallhandler(req,res,ttsInfos.Cost_Centers.name);
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
        this.commreadallhandler(req,res,ttsInfos.Locations.name);
    }
    transportation_modes(req:Request,res:Response):void {
        this.commreadallhandler(req,res,ttsInfos.Transportation_Modes.name);
    }
    ticket_pickup_locations(req:Request,res:Response):void {
        this.commreadallhandler(req,res,ttsInfos.Ticket_Pickup_Locations.name);
    }
    schedule(req: Request, res: Response): void {
        TtsServices.readbyFilter(this.getAccessToken(req), ttsInfos.Routes.name,
        // tslint:disable-next-line:max-line-length
        `Transportation_x0020_ModeId eq ${req.params.modeid} and Arrival_x0020_LocationId eq ${req.params.destinationid} and Departure_x0020_LocationId eq ${req.params.originid}`)
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
    create_ticket_requests(req: Request, res: Response): void {
TtsServices.create(req.body, this.getAccessToken(req), ttsInfos.Ticket_Requests.name)
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