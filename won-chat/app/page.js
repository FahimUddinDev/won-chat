"use client";
import profileImg from "@/assets/images/u1.png";
import Msgl from "@/component/Msgl";
import Msgr from "@/component/Msgr";
import SenderCard from "@/component/SenderCard";
import UserCard from "@/component/UserCard";
import {
  useAccessChatMutation,
  useGetChatsQuery,
} from "@/lib/features/chat/apiSlice";
import {
  useLazyGetMessagesQuery,
  useSendMessagesMutation,
} from "@/lib/features/messages/apiSlice";
import socket from "@/lib/features/socket/socket";
import { useLazyGetUsersQuery } from "@/lib/features/users/apiSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import QuillTextBox from "./quill/quill";

export default function Home() {
  const userId = useSelector((state) => state.auth.id);
  const wrapper = useRef(null);
  const [getUsers, { data: usersData, isFetching, isLoading }] =
    useLazyGetUsersQuery();

  const [text, setText] = useState("");
  const [sendImage, setImage] = useState([]);
  const [prevImage, setPrevImage] = useState([]);
  const [accessChat, { data: chatData, isLoading: accessingChat }] =
    useAccessChatMutation();
  const [sendMessage] = useSendMessagesMutation();
  const [getMessages, { data: messages }] = useLazyGetMessagesQuery();
  const [activeUser, setActiveUser] = useState(false);
  const [search, setSearch] = useState("");
  const { data, error } = useGetChatsQuery();
  const [width, setWidth] = useState();
  useEffect(() => {
    if (wrapper?.current?.clientWidth) {
      setWidth(wrapper?.current?.clientWidth);
    }
  }, [wrapper]);
  useEffect(() => {
    const timer = setTimeout(() => {
      getUsers({ search });
    }, 500); // Delay of 500ms (can be adjusted)
    // Clean up the timer if the component is unmounted or searchTerm changes
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (activeUser) {
      accessChat(activeUser);
      socket.emit("join chat", activeUser);
    }
  }, [activeUser]);

  useEffect(() => {
    if (chatData?._id) {
      getMessages({ id: chatData._id });
    }
  }, [chatData]);

  useEffect(() => {
    socket?.emit("setup", userId);
  });

  const handleImage = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const maxTotalSize = 10 * 1024 * 1024;
      let totalSize = 0;
      files.forEach((item, i) => {
        totalSize += files[i].size;
        const imgReader = new FileReader();
        imgReader.onload = (event) => {
          if (maxTotalSize >= totalSize) {
            setPrevImage((prev) => [...prev, event.target.result]);
          }
        };
        imgReader.readAsDataURL(e.target.files[i]);
      });
      if (maxTotalSize >= totalSize) {
        setImage((prev) => [...prev, files[0]]); //single file NOTE: when you remove this and add multiple files then remove comments deleteImages() funtions
      } else {
        toast.error(
          "Total file size exceeds 10 MB. Please select smaller files."
        );
      }
    }
  };

  const deleteImage = (index) => {
    const images = formInfo.images;
    const formImages = formInfo.company_document;
    images.splice(index, 1);
    // formImages.splice(index, 1);
    setFormInfo((prev) => ({
      ...prev,
      images: [...images],
      // company_document: [...formImages],
    }));
  };

  return (
    <div className="bg-white mb-6 grid grid-cols-8 sm:grid-cols-12 screen-height-cal group aside-active chat-main relative shadow-[4px_4px_100px_0px_#00000014]">
      <div className="col-span-8 sm:col-span-4 absolute sm:static h-full max-h-full overflow-y-auto no-scroll-bar w-0 aside-active:w-full bg-white z-20">
        <div
          ref={wrapper}
          className="relative w-full h-auto sm:w-0 sm:h-0 overflow-hidden aside-active:w-full aside-active:h-auto flex flex-col items-center pb-5 aside-active:pb-5 transition-all duration-300 bg-white chat-heading"
        >
          <div
            className="w-full fixed z-10 bg-white py-5 overflow-hidden box-border"
            style={{ width: `${width}px` }}
          >
            <h1 className="text-base font-medium text-dc-black text-left w-full px-5">
              All Message (12)
            </h1>
            <div className="relative w-full mt-4 px-5">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-slate-50 w-full rounded-lg p-3 pl-10 border-0"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-8">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3561_2202)">
                    <path
                      d="M16.2501 13.923L17.8515 15.5244C18.4941 16.167 18.4941 17.2088 17.8515 17.8514C17.2089 18.494 16.1671 18.494 15.5245 17.8514L13.9231 16.25M1.66675 8.75C1.66675 4.83798 4.83806 1.66666 8.75008 1.66666C12.6621 1.66666 15.8334 4.83798 15.8334 8.75C15.8334 12.662 12.6621 15.8333 8.75008 15.8333C4.83806 15.8333 1.66675 12.662 1.66675 8.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3561_2202">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            {usersData?.users?.length > 0 && (
              <div className="">
                <div className="flex justify-between items-center w-full mt-4 px-5">
                  <p className="text-base text-slate-700">Users</p>
                </div>
                <div className="flex flex-col w-full divide-y-2 py-4 max-h-[cal(50vh-200px)] overflow-y-auto  ">
                  {/*} card  */}
                  {usersData?.users?.map((user) => (
                    <UserCard
                      action={() => setActiveUser(user._id)}
                      key={user._id}
                      img={profileImg.src}
                      title={`${user?.firstName} ${user?.lastName}`}
                      headline=""
                      time=""
                      isActive={user?.isActive}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center w-full mt-4 px-5">
              <p className="text-base text-slate-700">Message</p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_129_10195)">
                  <path
                    d="M2 14C3.10457 14 4 13.1046 4 12C4 10.8954 3.10457 10 2 10C0.89543 10 0 10.8954 0 12C0 13.1046 0.89543 14 2 14Z"
                    fill="#334155"
                  />
                  <path
                    d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                    fill="#334155"
                  />
                  <path
                    d="M22 14C23.1046 14 24 13.1046 24 12C24 10.8954 23.1046 10 22 10C20.8954 10 20 10.8954 20 12C20 13.1046 20.8954 14 22 14Z"
                    fill="#334155"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_129_10195">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col w-full divide-y-2 py-4 pt-[450px] min-h-28">
            {/*} card  */}
            {data?.map((sender) => (
              <SenderCard
                key={sender.id}
                img={profileImg.src}
                title={`${sender.users[0].firstName}  ${sender.users[0].lastName}`}
                headline={sender?.latestMessage?.content}
                time="10:45"
                isActive={true}
              />
            ))}
          </div>
        </div>
      </div>
      {/*} chat side  */}
      <div className="col-span-8 sm:col-span-12 aside-active:col-span-8 py-3 px-5 h-full relative aside-active:border-l border-slate-200 transition-all duration-300">
        <div className="flex justify-between pb-3 border-b border-slate-200">
          <div className="flex gap-3 items-center">
            <div className="w-10 aspect-square rounded-full relative">
              <img
                src="./assets/images/chat-profile.png"
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
              <div className="w-2 aspect-square rounded-full bg-green-500 absolute bottom-0.5 right-0.5"></div>
            </div>
            <div className="">
              <h1 className="text-base text-dc-black font-semibold line-clamp-1">
                {
                  chatData?.users?.filter(
                    (user) => user._id === activeUser
                  )?.[0]?.firstName
                }{" "}
                {
                  chatData?.users?.filter(
                    (user) => user._id === activeUser
                  )?.[0]?.lastName
                }
              </h1>
              <p className="text-sm text-slate-700 hidden sm:block">
                Ticket ID: #B554255 May 27, 2020 — 10:45
              </p>
            </div>
          </div>
          <div className="flex item-center gap-4">
            <button className="text-dc-black hover:text-green-500 transition-colors duration-300 message-aside-open sm:hidden">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 8L6 12M6 12L10 16M6 12L18 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="text-dc-black hover:text-green-500 transition-colors duration-300">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_110_8444)">
                  <mask
                    id="mask0_110_8444"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="20"
                    height="21"
                  >
                    <path d="M0 0.500002H20V20.5H0V0.500002Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_110_8444)">
                    <path
                      d="M15.9375 15.5H17.0703C18.3648 15.5 19.4141 14.4508 19.4141 13.1562V8.46875C19.4141 7.17422 18.3648 6.125 17.0703 6.125H2.92969C1.63516 6.125 0.585938 7.17422 0.585938 8.46875V13.1562C0.585938 14.4508 1.63516 15.5 2.92969 15.5H4.0625"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.875 12.375H3.125"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.23437 19.9141H14.7656C15.4128 19.9141 15.9375 19.3894 15.9375 18.7422V12.375H4.0625V18.7422C4.0625 19.3894 4.58719 19.9141 5.23437 19.9141Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5625 14.875H8.4375"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.5625 17.375H8.4375"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 8.625H3.125"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.40625 1.08594H13.5937C14.8882 1.08594 15.9375 2.13527 15.9375 3.42969V6.125H4.0625V3.42969C4.0625 2.13527 5.11184 1.08594 6.40625 1.08594Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_110_8444">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="text-dc-black hover:text-red-500 transition-colors duration-300">
              <svg
                width="20"
                height="23"
                viewBox="0 0 20 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7.5V17.5C3 19.7091 4.79086 21.5 7 21.5H13C15.2091 21.5 17 19.7091 17 17.5V7.5M12 10.5V16.5M8 10.5L8 16.5M14 4.5L12.5937 2.3906C12.2228 1.8342 11.5983 1.5 10.9296 1.5H9.07037C8.40166 1.5 7.7772 1.8342 7.40627 2.3906L6 4.5M14 4.5H6M14 4.5H19M6 4.5H1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="text-dc-black hover:text-orange-500 transition-colors duration-300">
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                <path
                  d="M11 10.5H12V17.5M22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/*} chart board  */}
        <div className="overflow-y-auto massage-body-wrapper no-scroll-bar scroller">
          <div className="messages">
            {messages?.map((message) =>
              message.sender._id === userId ? (
                <Msgr
                  key={message._id}
                  time={message?.createdAt}
                  message={message.content}
                />
              ) : (
                <Msgl
                  key={message._id}
                  time={message?.createdAt}
                  message={message.content}
                />
              )
            )}
          </div>
        </div>
        {/* text-box  */}
        <div className="w-full relative">
          <QuillTextBox onChange={setText} value={text} />
          {/* image send  */}
          <label htmlFor="image-message">AttachImage</label>
          <input
            type="file"
            id="image-message"
            className=" w-0 h-0"
            onChange={handleImage}
          />
          <div className="flex gap-2">
            {sendImage.map((img, index) => (
              <img key={index + "img"} src={img} alt="" className="w-10 h-10" />
            ))}
          </div>
          {/* image send  */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                sendMessage({
                  chatId: chatData?._id,
                  content: text,
                  files: sendImage,
                });
              }}
              className="rounded-md bg-green-500 px-5 py-3 text-base font-medium text-white hover:bg-green-600 flex justify-center w-40 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
