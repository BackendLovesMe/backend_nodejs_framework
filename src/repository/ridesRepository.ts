import { injectable } from "inversify";
import { AppDataSource } from "../config/data-source";
import { Rides } from "../entities/rides";
import { Patners } from "../entities/patners";
import { results } from "inversify-express-utils";

@injectable()
export class RidesRepository {
  private RidesRepository = AppDataSource.getRepository(Rides);
  private PatnerRepository = AppDataSource.getRepository(Patners);

  public async addRidesDeatils(data) {
    const patners = this.RidesRepository.create(data); // Prepare a new ride
    const savedPartner = await this.RidesRepository.save(patners); // Save the ride
    return savedPartner; // Return the ID of the newly created document
  }

  
//   public async getPartnersByDistance(rideId) {
//     try {
//       const result = await this.PatnerRepository.createQueryBuilder("partner")
//         .from((subquery) => {
//           return subquery
//             .select(`partner.id`, "partner_id").addSelect(`patner_name`, "name")
//             .addSelect(
//               `(
//                             6371 * acos(
//                                 cos(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
//                                 cos(radians(CAST(partner."current_lat" AS DOUBLE PRECISION))) * 
//                                 cos(radians(CAST(partner."current_lng" AS DOUBLE PRECISION)) - 
//                                 radians(CAST(ride."source_longitude" AS DOUBLE PRECISION))) + 
//                                 sin(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
//                                 sin(radians(CAST(partner."current_lat" AS DOUBLE PRECISION)))
//                             )
//                         )`,
//               "distance"
//             )
//             .from("patners", "partner")
//             .innerJoin("rides", "ride", "ride.id = :rideId", { rideId })
//             .where("partner.status = :status", { status: "onDuty" });
//         }, "filtered")
//         .where("filtered.distance <= 5")
//         .orderBy("filtered.distance", "ASC")
//         .getRawMany(); // Execute the query and get raw results

//       return result; // Return the results
//     } catch (error) {
//       console.error("Error fetching partners:", error);
//       throw new Error("Failed to fetch partners");
//     }
//   }
public async getPartnersByDistance(rideId) {
    try {
      const result = await this.PatnerRepository.createQueryBuilder("partner")
        .select([
          "partner.id AS partner_id",
          "patner_name AS name",
          `(
            6371 * acos(
              cos(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
              cos(radians(CAST(partner."current_lat" AS DOUBLE PRECISION))) * 
              cos(radians(CAST(partner."current_lng" AS DOUBLE PRECISION)) - 
              radians(CAST(ride."source_longitude" AS DOUBLE PRECISION))) + 
              sin(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
              sin(radians(CAST(partner."current_lat" AS DOUBLE PRECISION)))
            )
          ) AS distance`
        ])
        .innerJoin("rides", "ride", "ride.id = :rideId", { rideId })
        .where("partner.status = :status", { status: "onDuty" })
        .andWhere(
          `(
            6371 * acos(
              cos(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
              cos(radians(CAST(partner."current_lat" AS DOUBLE PRECISION))) * 
              cos(radians(CAST(partner."current_lng" AS DOUBLE PRECISION)) - 
              radians(CAST(ride."source_longitude" AS DOUBLE PRECISION))) + 
              sin(radians(CAST(ride."source_latitude" AS DOUBLE PRECISION))) * 
              sin(radians(CAST(partner."current_lat" AS DOUBLE PRECISION)))
            )
          ) <= 5`
        )
        .orderBy("distance", "ASC")
        .getRawMany();
  
      return result;
    } catch (error) {
      console.error("Error fetching partners:", error);
      throw new Error("Failed to fetch partners");
    }
  }
  
  public async getRideDetails(rideId){
    const rides = await this.RidesRepository.findOneBy({id:rideId}); // Prepare a new user
    return rides;
  }
  
  
}
