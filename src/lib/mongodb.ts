import { MongoClient, ServerApiVersion, type Db, type Document } from "mongodb";

const DEFAULT_URI = "mongodb://admin:secret123@shared1.bsthun.in:11802/";
const DB_NAME = process.env.MONGODB_DB || "ucan_community";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient(): MongoClient {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

if (!global._mongoClientPromise) {
  const client = createMongoClient();
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}


