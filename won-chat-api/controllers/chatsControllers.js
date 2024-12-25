const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const Chat = require("../models/chatModel");

// login user

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("Please give a valid user info.");
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -verified")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    const data = isChat.map((chatData) => {
      const users = chatData.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
      chatData.users = users;
      return chatData;
    });
    res.status(200).send(data[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      fullChat.users = fullChat.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
      return res.status(200).send(fullChat);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        const data = results.map((chatData) => {
          const users = chatData.users.filter(
            (user) => user._id.toString() !== req.user._id.toString()
          );
          chatData.users = users;
          return chatData;
        });

        res.status(200).send(data);
      });
  } catch (error) {
    res.status(400).send({ message: "Something went to wrong!" });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send({ message: "Please Provide valid information!" });
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More then 2 users are required to from a group chat" });
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(201).send(fullGroupChat);
  } catch (error) {
    res.send(400).send({ message: "Something went to wrong!" });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res
      .status(400)
      .send({ message: "Please provide a valid information" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400).send({ message: "Something went to wrong!" });
  } else {
    res.status(200).send(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res
      .status(400)
      .send({ message: "Please provide a valid information!" });
  }
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return res.status(404).send({ message: "Chat not found" });
  } else {
    return res.status(200).send(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res
      .status(400)
      .send({ message: "Please provide a valid information!" });
  }
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    return res.status(404).send({ message: "Chat not found" });
  } else {
    return res.status(200).send(removed);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
