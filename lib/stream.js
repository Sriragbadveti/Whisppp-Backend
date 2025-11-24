import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

// Validate Stream Chat environment variables
if (!process.env.STREAM_API_KEY || !process.env.STREAM_SECRET) {
  console.error("ERROR: STREAM_API_KEY and STREAM_SECRET must be set in environment variables");
  console.error("STREAM_API_KEY:", process.env.STREAM_API_KEY ? "Set" : "Missing");
  console.error("STREAM_SECRET:", process.env.STREAM_SECRET ? "Set" : "Missing");
}

//I used this to setup a stream server client
export const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY || "",
  process.env.STREAM_SECRET || ""
);

export const upsertStreamUser = async (userData) => {
  try {
    await serverClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log(error);
  }
};
