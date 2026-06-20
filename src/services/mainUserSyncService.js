const mongoose = require("mongoose");
const { sanitizeMongoUri } = require("../config/database");

const DEFAULT_MAIN_DB = "quantum_logics";
const MAIN_URI_KEYS = ["MAIN_MONGODB_URI", "MAIN_DB_URI"];

let cached = global.mainMongooseConnection;
if (!cached) {
  cached = global.mainMongooseConnection = { conn: null, promise: null };
}

function isMongoUri(value = "") {
  return /^mongodb(\+srv)?:\/\//i.test(String(value).trim());
}

function getDatabaseNameFromUri(uri = "") {
  try {
    const parsed = new URL(uri);
    const dbName = decodeURIComponent(parsed.pathname || "")
      .replace(/^\/+/, "")
      .split("/")[0]
      .trim();
    return dbName && !/[.$\s/\\]/.test(dbName) ? dbName : "";
  } catch {
    return "";
  }
}

function getMainDatabaseName() {
  const configured = String(process.env.MAIN_DB || "").trim();
  if (!configured) return DEFAULT_MAIN_DB;

  if (isMongoUri(configured)) {
    return getDatabaseNameFromUri(configured) || DEFAULT_MAIN_DB;
  }

  if (/[.$\s/\\:]/.test(configured)) {
    console.warn(
      `Invalid MAIN_DB value. Use MAIN_DB=${DEFAULT_MAIN_DB} and put the URI in MAIN_MONGODB_URI.`,
    );
    return DEFAULT_MAIN_DB;
  }

  return configured;
}

function getMainMongoUri() {
  for (const key of MAIN_URI_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return sanitizeMongoUri(value);
  }

  const mainDbValue = process.env.MAIN_DB?.trim();
  if (isMongoUri(mainDbValue)) {
    return sanitizeMongoUri(mainDbValue);
  }

  return "";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeEmailList(emails = []) {
  return Array.from(
    new Set(
      emails
        .map(normalizeEmail)
        .filter(Boolean),
    ),
  );
}

async function getMainDatabase() {
  const mainDbName = getMainDatabaseName();
  const mainUri = getMainMongoUri();

  if (mainUri) {
    if (!cached.conn) {
      if (!cached.promise) {
        cached.promise = mongoose
          .createConnection(mainUri, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
          })
          .asPromise()
          .then((conn) => {
            console.log("✅ Main MongoDB Connected for polycoder sync");
            return conn;
          })
          .catch((error) => {
            cached.promise = null;
            throw error;
          });
      }

      cached.conn = await cached.promise;
    }

    return cached.conn.useDb(mainDbName, { useCache: true });
  }

  if (mongoose.connection.readyState !== 1) {
    return null;
  }

  return mongoose.connection.useDb(mainDbName, { useCache: true });
}

async function syncPolycoderForEmail({ email, username }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedEmail || !normalizedUsername) {
    return { skipped: true };
  }

  const mainDb = await getMainDatabase();
  if (!mainDb) {
    return { skipped: true, reason: "Main MongoDB is not connected" };
  }

  const result = await mainDb.collection("users").updateOne(
    { email: normalizedEmail },
    {
      $set: {
        polycoder: normalizedUsername,
      },
      $currentDate: {
        updatedAt: true,
      },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}

async function updateMainFollowerEmail({ targetEmail, followerEmail, follow }) {
  const normalizedTargetEmail = normalizeEmail(targetEmail);
  const normalizedFollowerEmail = normalizeEmail(followerEmail);

  if (!normalizedTargetEmail || !normalizedFollowerEmail) {
    return { skipped: true };
  }

  const mainDb = await getMainDatabase();
  if (!mainDb) {
    return { skipped: true, reason: "Main MongoDB is not connected" };
  }

  const result = await mainDb.collection("users").updateOne(
    { email: normalizedTargetEmail },
    follow
      ? {
          $addToSet: {
            follower: normalizedFollowerEmail,
            followers: normalizedFollowerEmail,
          },
          $currentDate: { updatedAt: true },
        }
      : {
          $pull: {
            follower: normalizedFollowerEmail,
            followers: normalizedFollowerEmail,
          },
          $currentDate: { updatedAt: true },
        },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}

async function syncMainFollowersForEmail({ targetEmail, followerEmails }) {
  const normalizedTargetEmail = normalizeEmail(targetEmail);
  const normalizedFollowerEmails = normalizeEmailList(followerEmails);

  if (!normalizedTargetEmail) {
    return { skipped: true };
  }

  const mainDb = await getMainDatabase();
  if (!mainDb) {
    return { skipped: true, reason: "Main MongoDB is not connected" };
  }

  const result = await mainDb.collection("users").updateOne(
    { email: normalizedTargetEmail },
    {
      $set: {
        follower: normalizedFollowerEmails,
        followers: normalizedFollowerEmails,
      },
      $currentDate: { updatedAt: true },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}

function syncPolycoderForEmailSafe(user) {
  return syncPolycoderForEmail(user)
    .then((result) => {
      if (result?.matchedCount === 0) {
        console.warn(
          `Main user polycoder sync skipped: no users document matched email ${normalizeEmail(user?.email)}`,
        );
      }
      return result;
    })
    .catch((error) => {
      console.warn("Main user polycoder sync failed:", error.message);
      return { skipped: true, error: error.message };
    });
}

function updateMainFollowerEmailSafe(payload) {
  return updateMainFollowerEmail(payload)
    .then((result) => {
      if (result?.matchedCount === 0) {
        console.warn(
          `Main user follower sync skipped: no users document matched email ${normalizeEmail(payload?.targetEmail)}`,
        );
      }
      return result;
    })
    .catch((error) => {
      console.warn("Main user follower sync failed:", error.message);
      return { skipped: true, error: error.message };
    });
}

function syncMainFollowersForEmailSafe(payload) {
  return syncMainFollowersForEmail(payload)
    .then((result) => {
      if (result?.matchedCount === 0) {
        console.warn(
          `Main user followers sync skipped: no users document matched email ${normalizeEmail(payload?.targetEmail)}`,
        );
      }
      return result;
    })
    .catch((error) => {
      console.warn("Main user followers sync failed:", error.message);
      return { skipped: true, error: error.message };
    });
}

module.exports = {
  syncPolycoderForEmail,
  syncPolycoderForEmailSafe,
  updateMainFollowerEmail,
  updateMainFollowerEmailSafe,
  syncMainFollowersForEmail,
  syncMainFollowersForEmailSafe,
};
