// Kafka Setup with Node.js (kafka-config/kafka-setup.ts)
// Fix for TimeoutNegativeWarning and Topic Creation Errors

import { Kafka, logLevel } from 'kafkajs';

// 1. Initialize Kafka Client
const kafka = new Kafka({
  clientId: 'ride-booking-system',
  brokers: ['localhost:9092'],
  logLevel: logLevel.INFO,
  requestTimeout: 30000, // Set a proper timeout to avoid negative timeout errors
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'ride-group' });
export const admin = kafka.admin();

// 2. Create Kafka Topics with Proper Configurations
export const createTopics = async () => {
  try {
    await admin.connect();
    const created = await admin.createTopics({
      topics: [
        { topic: 'rider-location', numPartitions: 2, replicationFactor: 1 },
        { topic: 'driver-location', numPartitions: 2, replicationFactor: 1 }
      ],
    });
    console.log(`Topics created: ${created ? 'rider-location, driver-location' : 'No new topics created'}`);
  } catch (error) {
    console.error('Error creating topics:', error);
  } finally {
    await admin.disconnect();
  }
};

// 3. Connect Kafka Services
export const connectKafka = async () => {
  try {
    await Promise.all([producer.connect(), consumer.connect()]);
    console.log('✅ Kafka Producer and Consumer connected successfully ');
  } catch (error) {
    console.error('❌ Failed to connect Kafka services:', error);
  }
};

// 4. Start Kafka Services with Topic Creation
(async () => {
  await createTopics();
  await connectKafka();
})();
