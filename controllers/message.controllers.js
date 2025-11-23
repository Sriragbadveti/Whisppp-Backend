import message from "../database/message.schema.js";
 import User from "../database/user.schema.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export async function getAllContacts(req, res) {
  try {
    const userId = req.user._id;

    const contacts = await User.find({ _id: { $ne: userId } }).select("-password");

    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(400).json({ message: "Error in message controller" });
  }
}

export async function getMessagesByUserId(req, res) {
  try {
    const loggedInUser = req.user._id;
    const toUserId = req.params.id;

    const filteredMessages = await message.find({
      $or: [
        { senderId: loggedInUser, receiverId: toUserId },
        { senderId: toUserId, receiverId: loggedInUser },
      ],
    });

    return res.status(200).json(filteredMessages);
  } catch (error) {
    return res.status(400).json({ message: "Error in message controller" });
  }
}

export async function sendMessage(req, res) {
  try {
    const loggedInUser = req.user._id;
    const toUserId = req.params.id;

    const { text, image } = req.body;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await message({
      senderId: loggedInUser,
      receiverId: toUserId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit message to receiver if they're online
    const receiverSocketId = getReceiverSocketId(toUserId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage" , newMessage);
    }

    // Also emit to sender so they can see their message in real-time
    const senderSocketId = getReceiverSocketId(loggedInUser);
    if(senderSocketId){
      io.to(senderSocketId).emit("newMessage" , newMessage);
    }

    return res.status(200).json({ newMessage });
  } catch (error) {
    return res.status(400).json({ message: "error in message controller" });
  }
}

export async function getChatPartners(req, res) {
  try {
    const loggedInUser = req.user._id;

    const messages = await message.find({
      $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    });

    const filteredMessagesUsers = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUser.toString() ? msg.receiverId : msg.senderId
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: filteredMessagesUsers },
    }).select("-password");

    return res.status(200).json(chatPartners);
  } catch (error) {
    return res.status(400).json({ message: "Error in the message controller" });
  }
}
