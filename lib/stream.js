import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

// Validate Stream Chat environment variables
const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_SECRET = process.env.STREAM_SECRET;

if (!STREAM_API_KEY || !STREAM_SECRET) {
  console.error("ERROR: STREAM_API_KEY and STREAM_SECRET must be set in environment variables");
  console.error("STREAM_API_KEY:", STREAM_API_KEY ? "Set" : "Missing");
  console.error("STREAM_SECRET:", STREAM_SECRET ? "Set" : "Missing");
  console.error("Please add these environment variables to your Render dashboard");
}

// Initialize Stream Chat server client
// Using getInstance ensures we reuse the same client instance
let serverClient = null;

try {
  if (STREAM_API_KEY && STREAM_SECRET) {
    serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_SECRET);
    console.log("Stream Chat server client initialized successfully");
  } else {
    console.warn("Stream Chat server client not initialized - missing API key or secret");
  }
} catch (error) {
  console.error("Failed to initialize Stream Chat server client:", error);
}

export { serverClient };

export const upsertStreamUser = async (userData) => {
  try {
    await serverClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log(error);
  }
};
