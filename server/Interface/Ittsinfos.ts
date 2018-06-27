export interface IListinfo {
    listtitle:string;
    id:string;
    name:string;
    url?:string;
}
export interface Isiteinfo {
    sitename:string;
    id:string;
    url:string;
}
export interface Ittsinfos extends  Isiteinfo {
    Ticket_Requests_Cost_Centers_Breakdown:IListinfo;
    Ticket_Requests:IListinfo;
    System_Parameters:IListinfo;
    User_Default_Ticket_Pickup_Location:IListinfo;
    ID_Information:IListinfo;
    Cost_Centers_Breakdown_Summary:IListinfo;
    User_Default_Cost_Center:IListinfo;
    User_Coupon_Count:IListinfo;
    Cost_Centers:IListinfo;
    Locations:IListinfo;
    Routes:IListinfo;
}
export interface Ittsparentinfo extends Isiteinfo {
    FactoryCode:IListinfo;
}