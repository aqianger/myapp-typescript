import * as express from 'express';
import  TtsController  from "./ttscontroller";
export default express.Router()
.get("/",TtsController.test.bind(TtsController))
.get("/entities",TtsController.entities.bind(TtsController))
.get("/cost_centers/:entity",TtsController.cost_centers.bind(TtsController))
.get("/par_cost_centers/:entity",TtsController.par_cost_centers.bind(TtsController))
.get("/locations",TtsController.locations.bind(TtsController))
.get("/schedule/:modeid/:destinationid/:originid",TtsController.schedule.bind(TtsController))
.get("/travel_ticket_requests/:id",TtsController.read_ticket_requests.bind(TtsController))
.get("/transportation_modes",TtsController.transportation_modes.bind(TtsController))
.get("/ticket_pickup_locations",TtsController.ticket_pickup_locations.bind(TtsController))
.post("/travel_ticket_requests",TtsController.create_ticket_requests.bind(TtsController))
.delete("/travel_ticket_requests/:id",TtsController.delete_ticket_requests.bind(TtsController))
.put("/travel_ticket_requests/:id",TtsController.update_ticket_requests.bind(TtsController))
    ;
