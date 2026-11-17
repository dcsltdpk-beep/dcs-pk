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

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastFailedAt: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // Prevent repeated hanging if server was unreachable recently
  const now = Date.now();
  if (now - cached.lastFailedAt < RETRY_INTERVAL_MS && !cached.conn) {
    return null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fail fast in 2s instead of 30s
      connectTimeoutMS: 2000,
      socketTimeoutMS: 10000,
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
