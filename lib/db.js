import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const options = {
  ssl: true,  // Enable SSL explicitly
  tls: true,  // Ensure TLS is used
  tlsAllowInvalidCertificates: true,  // Ignore SSL validation issues
  retryWrites: true,
  w: "majority",
};

let client;
let clientPromise;

if (!uri || !dbName) {
  throw new Error("Please define MONGODB_URI and MONGODB_DB in your .env.local file");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);
    throw new Error("Could not connect to MongoDB");
  }
}
