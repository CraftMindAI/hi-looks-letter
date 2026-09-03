import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// Some local networks hand Node a resolver (e.g. a link-local IPv6 address)
// that can't complete the SRV lookup Atlas's mongodb+srv:// URIs need, even
// though the OS resolver handles it fine. Replace (not merge with) the list:
// a broken entry earlier in it makes Node's resolver fail fast on
// ECONNREFUSED without falling through to a working server later in it.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(uri: string): Promise<MongoClient> {
  const promise = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
  // Don't let a transient failure (e.g. a cold-start DNS blip) get cached
  // forever — clear it so the next call tries again instead of replaying
  // the same rejection for the life of the process.
  promise.catch(() => {
    if (global._mongoClientPromise === promise) {
      global._mongoClientPromise = undefined;
    }
  });
  return promise;
}

export function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect(uri);
  }

  return global._mongoClientPromise.then((client) => client.db());
}
