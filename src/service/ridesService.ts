import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
import { getLatAndLong, getCurrentLocation } from "../utility/external_apis";
import { AppDataSource } from "../config/data-source";
import { Rides } from "../entities/rides";
import { RidesRepository } from "../repository/ridesRepository";
import { getDistanceBetweenCoordinates } from "../utility/calculateDistance";
import redisClient from "../config/Redis";
import { User } from "../entities/users";
import { PatnerRepository } from "../repository/patnerRepository";
//import { producer,consumer } from "../config/KafkaSetup";

@injectable()
export class RidesService {
  private PatnerRepository = AppDataSource.getRepository(User);

  @inject(TYPES.PatnerRepository) private readonly patnerRepo: PatnerRepository;
  @inject(TYPES.RidesRepository) private readonly RideRepo: RidesRepository;

  public async requestRide(request: Request, response: Response) {
    let baseFare = 50;
    const { user_id, pickup_location, dropLocation } = request.body;
    console.log("iam in service", user_id, pickup_location, dropLocation);
    //     try{
    //     await producer.send({
    //         topic:'ride-requests',
    //         messages:[{value:JSON.stringify({riderId,pickup_location,dropLocation})}]
    //     })
    //     response.send('Ride Requested successfully !');
    // }catch(err){
    //     console.log("Error Messages from Catch", err.message)
    // }
    const pickUp_lat_long = await getLatAndLong(pickup_location);
    const drop_lat_long = await getLatAndLong(dropLocation);
    const source = {
      latitude: pickUp_lat_long.lat,
      longitude: pickUp_lat_long.lng,
    };
    const destination = {
      latitude: drop_lat_long.lat,
      longitude: drop_lat_long.lng,
    };
    console.log(
      `Distance: ${getDistanceBetweenCoordinates(source, destination)} km`
    );
    const fare = Math.round(
      getDistanceBetweenCoordinates(source, destination) * 7 + baseFare
    ); //calculating fare
    console.log("✅ LatAND LONG", pickUp_lat_long, "Drop", drop_lat_long);
    let dataObject = {
      user_id,
      source_location: pickup_location,
      source_latitude: pickUp_lat_long.lat,
      source_longitude: pickUp_lat_long.lng,
      destinantion_location: dropLocation,
      destination_latitude: drop_lat_long.lat,
      destinantion_longitude: drop_lat_long.lng,
      fare: fare,
      ride_status: "requested",
    }; //response data

    console.log(dataObject, "✅");
    const saveRideDetails = await this.RideRepo.addRidesDeatils(dataObject);
    console.log("🌟", saveRideDetails);
    if (saveRideDetails !== null) {
      return response.status(200).json({
        message: `Ride Requested Successfully  Request_id:${saveRideDetails["id"]}`,
      });
    } else {
      return response.status(500).json({ message: "Something went wrong" });
    }
  }

  public async driverLoaction(request: Request, response: Response) {
    const { lat, long } = request.body;
    const getDriverLocation = await getCurrentLocation(lat, long);
    console.log(getDriverLocation);
    return getDriverLocation;
  }

  public async acceptRide(request: Request, response: Response) {
    const getRedisDriverData = JSON.parse(await redisClient.get("drivers"));

    console.log(getRedisDriverData[0]);
    const jwtPayload = response.locals;
    console.log("✅", jwtPayload["jwt"]["number"]);
    const getPatnerDetails = await this.patnerRepo.getPatnerDetails(
      jwtPayload["jwt"]["number"]
    );
    console.log(
      "✅ Patners Deatils",
      getRedisDriverData[0]["RideId"],
      getPatnerDetails.id
    );
    const ridesData = await this.RideRepo.getRideDetails(
      getRedisDriverData[0]["RideId"]
    );
    const rideKey = `ride:${getRedisDriverData[0]["RideId"]}:accepted`;
    console.log(ridesData["partnerId"], ridesData["ride_status"]);
    const existingDriver = await redisClient.get(rideKey);
    if (existingDriver) {
      console.log(
        `❌ Ride ${getRedisDriverData[0]["RideId"]} is already accepted by Driver ${existingDriver}`
      );
      return false;
    }
    const success = await redisClient.set(rideKey, getPatnerDetails.id, {
      NX: true,
      EX: 300,
    });

    if (success) {
       
      console.log(
        `✅ Ride ${getRedisDriverData[0]["RideId"]} assigned to Driver ${getPatnerDetails.id}`
      );
      return response.status(200).json({
        message: `Ride ${getRedisDriverData[0]["RideId"]} assigned to Driver ${getPatnerDetails.id}`,
      });
    } else {
      console.log(
        `❌ Ride ${getRedisDriverData[0]["RideId"]} was taken just now.`
      );
      return  response.status(200).json({
        message: `Something went wrong`,
      });;
    }
  }

  public async notifyDrivers(request: Request, response: Response) {
    const RideId = request.query.rideId;
    try {
      const driver = await this.RideRepo.getPartnersByDistance(RideId);
      console.log("👌 Drivers Data ", driver);
      let baseFare = 20;
      let perKmRate = 7;
      const fare = Math.round(driver[0]["distance"] * perKmRate) + baseFare; // cal the fare
      const updateDrivers = driver.map((driver) => ({
        ...driver,
        fare: fare,
        RideId,
        ride_status: "requested",
      }));
      await redisClient.setEx(
        // soring DataToStore in redis cache
        "drivers",
        3600,
        JSON.stringify(updateDrivers)
      );
      console.log("✅ driver data ", updateDrivers);
      if (updateDrivers.length != 0) {
        return response.status(200).json({
          Drivers_Data: updateDrivers,
        });
      } else {
        return response.status(200).json({
          message: "No Drivers Loctaed near to you",
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
