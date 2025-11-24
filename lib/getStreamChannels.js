import { serverClient } from "./stream.js";
import User from "../database/user.schema.js";

export const getStreamChatPartners = async (userId) => {
  try {
    if (!serverClient) {
      throw new Error("Stream Chat server client is not initialized");
    }

    const stringUserId = userId.toString();
    
    // Query Stream Chat for channels where user is a member
    const filter = {
      type: "messaging",
      members: { $in: [stringUserId] }
    };

    const sort = { last_message_at: -1 };
    const channels = await serverClient.queryChannels(filter, sort, {
      limit: 100,
      state: false,
    });

    // Extract other member IDs from channels
    const otherMemberIds = new Set();
    
    channels.forEach(channel => {
      // Get members from channel - can be in data.members or state.members
      let members = {};
      if (channel.data && channel.data.members) {
        members = channel.data.members;
      } else if (channel.state && channel.state.members) {
        members = channel.state.members;
      }
      
      const memberIds = Object.keys(members);
      
      memberIds.forEach(memberId => {
        if (memberId !== stringUserId) {
          otherMemberIds.add(memberId);
        }
      });
    });

    if (otherMemberIds.size === 0) {
      return [];
    }

    // Convert MongoDB ObjectIds - Stream uses string IDs
    const memberIdArray = Array.from(otherMemberIds);
    
    // Get user details from MongoDB for these members
    const chatPartners = await User.find({
      _id: { $in: memberIdArray }
    }).select("-password");

    return chatPartners;
  } catch (error) {
    throw error;
  }
};

