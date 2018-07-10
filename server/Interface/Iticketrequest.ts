export interface Iticketrequest {
    Id?:number;
    Title:string;
    Transportation_x0020_ModeLookupId: number;
    Travel_x0020_Date: string;
    TravelTime:string;
    RouteLookupId: number;
    TIcket_x0020_Type: string;
    Seat: string;
    Quantity: number;
   RequestorLookupId: number;
    Request_x0020_For?: string;
   Ticket_x0020_Pickup_x0020_LocatiLookupId: number;
   Unit_x0020_Cost : number;
    AppEdit?: string;
    RouteFrom: string;
    RouteTo: string;
    ChineseName: string;
    // 'ChineseID': data.ChineseID, //Bill feedback 2016-5-20 point 3
    Remarks: string;
    FerryRemarks:string;
    EMailTemp: string;
    Currency:string;
    Requestor_x0020_Department:string;
}