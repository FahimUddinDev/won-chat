const userRouter = require("./userRoutes");
const usersRouter = require("./usersRoutes");
const chatsRouter = require("./chatsRoutes");
const messagesRouter = require("./messagesRoutes");

module.exports = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/chats", chatsRouter);
  app.use("/api/messages", messagesRouter);
};
