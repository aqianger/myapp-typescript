export interface ITrcCentersBreakdownListItem {
    Title:string;
Cost_x0020_Center_x0020_CodeLookupId:number;
Quantity: number;
Unit_x0020_Cost: number;
OfficeEmail?:string;
IsGuest:boolean;
IDNumber?:string;
SeatClass:string;
IDType:string;
FullName?:string;
/*
'Guest': o_CostCenter[i].Guest,
'IDType': o_CostCenter[i].IDType,
'OfficeEmail': o_CostCenter[i].OfficeEmail,
'FullName': o_CostCenter[i].FullName,
'IDNumber': o_CostCenter[i].IDNumber,
'IsGuest': o_CostCenter[i].IsGuest,
"SeatClass": o_CostCenter[i].SeatClass*/
}