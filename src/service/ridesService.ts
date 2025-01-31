import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
import { getLatAndLong,getCurrentLocation } from "../utility/external_apis";


@injectable()

export class RidesService{
  
    public async requestRide(request:Request,response:Response){
        const { pickup,drop } = request.body;
        const pickup_location=await getLatAndLong(pickup,drop)
        console.log(pickup_location)
    }

    public async driverLoaction(request:Request,response:Response){
        const {lat,long}=request.body;
        const getDriverLocation=await getCurrentLocation(lat,long)
        console.log(getDriverLocation)
        return getDriverLocation
    }
}