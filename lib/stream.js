import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

//I used this to setup a stream server client
export const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    await serverClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log(error);
  }
};
