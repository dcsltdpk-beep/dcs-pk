import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailedAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const RETRY_INTERVAL_MS = 10000; // Do not retry connection more often than every 10s if failed

// Guarantee a single shared cache on globalThis across Next.js Hot Module Reloading & Worker Threads
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

let cached: MongooseCache = globalWithMongoose.mongooseCache || {
  conn: null,
  promise: null,
  lastFailedAt: 0,
};

globalWithMongoose.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  // 1. Fast path: If Mongoose's global default connection is already active (1 = connected), reuse it directly
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  // 2. If cached connection is already active, return it
  if (cached.conn && cached.conn.connection && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // 3. Prevent rapid hammering if recently failed
  const now = Date.now();
  if (now - cached.lastFailedAt < RETRY_INTERVAL_MS && !cached.conn) {
    return null;
  }

  // 4. If connection is already in progress, reuse the existing promise
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,       // STRICT M0 LIMIT: Cap pool to 10 connections (prevents exceeding Atlas 500 cap / 400 alert threshold)
      minPoolSize: 0,        // Scale down to 0 idle connections when server traffic pauses
      maxIdleTimeMS: 20000,  // Reclaim and close idle connections after 20 seconds
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        cached.lastFailedAt = Date.now();
        console.warn('MongoDB connection error:', err?.message || err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailedAt = Date.now();
    return null;
  }
}
