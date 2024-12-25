const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessages = async (req, res) => {
  const { files, content, chatId } = req.body;
  // console.log({ files, content });
  if (!chatId) {
    return res
      .status(400)
      .send({ messages: "Invalid data pass into request!" });
  }
  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
    files,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name, pic, email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    messages = await Chat.populate(message, { path: "latestMessage" });
    res.status(200).send(message);
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went to wrong!");
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send({ message: "Something went to wrong!" });
  }
};

module.exports = { sendMessages, getMessages };
