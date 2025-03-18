import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/users";
import { PatnerRepository } from "../repository/patnerRepository";
import { patenerVechiles } from "../entities/patnerVechiles";
import { timeStamp } from "console";
import { producer, consumer } from "../config/KafkaSetup";
import { Kafka } from "kafkajs";
import { WebSocketService } from "../config/setUpWebsocket";
import { Message } from "twilio/lib/twiml/MessagingResponse";

@injectable()
export class PatnerService {
  private PatnerRepository = AppDataSource.getRepository(User);

  @inject(TYPES.PatnerRepository) private readonly patnerRepo: PatnerRepository;

  public async addPatners(request: Request, response: Response) {
    const file = request.files["profile_picture"][0];
    const {
      patner_name,
      adhar_number,
      license_number,
      DOB,
      gender,
      rating,
      current_lat,
      current_lng,
      status,
      phone,
    } = request.body;
    console.log(
      patner_name,
      adhar_number,
      license_number,
      DOB,
      gender,
      rating,
      file.originalname,
      file.buffer,
      current_lat,
      current_lng
    );
    const filebuffer = file.buffer.toString("base64");
    const patnerData = {
      patner_name,
      adhar_number,
      license_number,
      DOB,
      gender,
      rating,
      profile_picture: filebuffer,
      current_lat,
      current_lng,
      status,
      phone,
    };
    //console.log(patnerData)
    await this.patnerRepo.addPatners(patnerData); //adding patners data
    return response.status(200).json({ message: "patner added Sucessfully " });
  }

  public async patanerVechiles(request: Request, response: Response) {
    const file = request.files;
    const { company_name, vechile_number, rc_number, model_number } =
      request.body;
    const vechile_picture = file["vechile_picture"][0]["buffer"];
    //console.log("***************",vechile_picture);
    //console.log(company_name,vechile_number,rc_number,vechile_picture)

    const data = {
      company_name,
      vechile_number,
      rc_number,
      model_number,
      vechile_picture,
    };
    const alreadyExistVichle = await this.patnerRepo.getVechiles(
      vechile_number,
      rc_number
    );
    console.log("alreadyExistVichle", alreadyExistVichle);
    if (alreadyExistVichle) {
      return response.status(200).json({ message: "Vechile already Exits" });
    } else {
      const saveVechile = await this.patnerRepo.patanerVechiles(data);
      return response.status(200).json({ message: "Vichle added" });
    }
  }
  catch(err) {
    console.log("error", err.message);
  }

  public async driverLogout(request: Request, response: Response) {
    const jwtPayload = response.locals;
    console.log(jwtPayload["jwt"]["number"]);
    const patnerData = await this.patnerRepo.getPatnerDetails(
      jwtPayload["jwt"]["number"]
    );
    console.log(patnerData);
    await this.patnerRepo.driverLogout(patnerData.id, "offDuty", false);
    if (patnerData) {
      return response.status(200).json({ message: "Logged Out" });
    }
  }

  public async currentLocationProducer(request: Request, response: Response) {
    const { latitude, longitude } = request.body;
    const jwtPayload = response.locals;
    try {
      const patnerData = await this.patnerRepo.getPatnerDetails(
        jwtPayload["jwt"]["number"]
      );
      console.log(jwtPayload["jwt"]["number"]);
      const driverId = patnerData?.["id"];
      console.log(latitude, longitude, driverId, Date.now());
      if (!driverId || !latitude || !longitude) {
        return response.status(400).send("Missing required fields");
      }
      await producer.send({
        topic: "rider-location",
        messages: [
          {
            value: JSON.stringify({
              driverId,
              latitude,
              longitude,
              timestamp: Date.now(),
            }),
          },
        ],
      }); //producer to send messages to kafka stream
      response.status(200).send("Location data sent to Kafka");
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
      response.status(500).send("Error sending message to Kafka");
    }
  }

  public async currentLocationConsumer(request: Request, response: Response) {
    console.log("✅ currentLocationConsumer ");
    const kafka = new Kafka({
      clientId: "location-tracker",
      brokers: ["localhost:9092"],
    });

    const consumer = kafka.consumer({ groupId: "location-group" });

    try {
      await consumer.connect();
      await consumer.subscribe({ topic: "rider-location", fromBeginning: true });
  
      console.log("✅ Connected to Kafka and subscribed to topic...");
  
      let latestMessage: string | null = null;
  
      // Wait for one message and then respond
      await new Promise<void>((resolve) => {
        consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            console.log("👍 Received message:", message.value?.toString());
            latestMessage = message.value?.toString();
            
            // Respond immediately after receiving the first message
            response.json({ message: latestMessage });
  
            resolve(); // Stop waiting
          },
        });
      });
  
    } catch (error) {
      console.error("❌ Error in Kafka Consumer:", error);
      return response.status(500).json({ error: "Failed to start Kafka consumer" });
    } finally {
      await consumer.disconnect();
    }
  }
  }

