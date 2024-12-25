import Img from "./Img";

function SenderCard({ img, title, headline, time, isActive }) {
  return (
    <div className="py-3 bg-white hover:bg-slate-50 transition-all duration-300 px-5 cursor-pointer message-aside-close">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3 py-1.5 mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 min-w-10 aspect-square rounded-full relative bg-gray-400">
            <div className="w-full h-full rounded-full overflow-hidden">
              <Img src={img} ratio={`1 / 1`} position={"relative"} />
            </div>
            <div
              className={`w-2 aspect-square rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-400"
              } absolute bottom-0.5 right-0.5`}
            ></div>
          </div>
          <div className="">
            <h1 className="text-base text-dc-black font-semibold line-clamp-1">
              {title}
            </h1>
            {/* <p className="text-sm text-slate-700 hidden sm:block">
              Ticket ID: #B554255 May 27, 2020 — 10:45
            </p> */}
          </div>
        </div>
        <p className="text-sm font-medium text-slate-700">{time}</p>
      </div>
      <p
        className="py-2 text-sm text-slate-700 "
        dangerouslySetInnerHTML={{ __html: headline }}
      ></p>
    </div>
  );
}

export default SenderCard;
