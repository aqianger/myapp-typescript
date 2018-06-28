import * as express from 'express';
import  TtsController  from "./ttscontroller";
export default express.Router()
.get("/",TtsController.test)
.get("/entities",TtsController.entities)
.get("/cost_centers/:entity",TtsController.cost_centers)
.get("/locations",TtsController.locations)
.get("/schedule/:modeid/:destinationid/:originid",TtsController.schedule)
.get("/travel_ticket_requests/:id",TtsController.read_ticket_requests)
.post("/travel_ticket_requests",TtsController.create_ticket_requests)
.delete("/travel_ticket_requests/:id",TtsController.delete_ticket_requests)
.put("/travel_ticket_requests/:id",TtsController.update_ticket_requests)
    ;
