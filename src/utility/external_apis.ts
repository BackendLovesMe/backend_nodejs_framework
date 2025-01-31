import twilio from "twilio";
import dotenv from "dotenv";
import { globalException } from "../exception/global_Exception";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();
export async function sendOtp(mobileNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
 // const messagingServiceSid = process.env.MESSAGING_SERVICE_SID;
  // console.log("hihihih",accountSid,authToken,messagingServiceSid,otp,mobileNumber)
  const client = twilio(accountSid, authToken);
  console.log("CHECKING WHATS WRONG", mobileNumber);
  try {
    console.log("iam here ");
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      //messagingServiceSid,
      to: `+91${mobileNumber}`,
      from: "+18482943762",
    });
    console.log(message);
    console.log(
      `OTP sent successfully to ${mobileNumber}. Message SID: ${message.sid}`
    );

    return otp;
  } catch (error) {
    console.log("Otp Error ", error, mobileNumber);
    globalException.sendErrorResponse(error);
  }
}

export async function getCurrentLocation(latitude, longitude) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  try {
    if (!latitude || !longitude) {
      return "Latitude and longitude are required.";
    }
    console.log(
      `Received Location: Latitude=${latitude}, Longitude=${longitude}`
    );
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const address = response.data.results[0].formatted_address;
      console.log(
        `Received Location: Latitude=${latitude}, Longitude=${longitude}`
      );
      console.log(`Address: ${address}`);
      return `Address: ${address}`;
    } else {
      console.error("Reverse geocoding failed:", response.data.status);
      response.data
        .status(500)
        .json({ error: "Failed to reverse geocode the location." });
    }
  } catch (error) {
    console.log("Error", error);
    globalException.sendErrorResponse(error);
  }
}

export async function getLatAndLong(pickup_location,drop_location){
  console.log(pickup_location)
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
   console.log(GOOGLE_API_KEY);
   const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${pickup_location}&key=AIzaSyD3HAi9LH89IpmQ6s1euT1bHymBRuqxCmQ`
   const  source_lat_long = await axios.get(url);
   console.log(source_lat_long)
}
