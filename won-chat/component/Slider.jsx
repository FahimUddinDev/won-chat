"use client";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import login1 from "../assets/images/login-1.png";
import login2 from "../assets/images/login-2.png";
import login3 from "../assets/images/login-3.png";
import Img from "./Img";

function Slider() {
  return (
    <div className="grid ">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="w-full"
        spaceBetween={50}
        slidesPerView={1}
      >
        <SwiperSlide>
          <div className="pb-12" style={{ paddingBottom: "48px" }}>
            <Img src={login1.src} ratio="59/33" />
            <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 mb-4 text-center mt-5">
              Elevate Your Style, <br />
              Simplify Your Shopping
            </h3>
            <p className="text-slate-700 text-base leading-6 text-center mt-3">
              Discover Courses Tailored to Your Professional Career Goals
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-12">
            <Img src={login2.src} ratio="59/33" />
            <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 mb-4 text-center mt-5">
              Elevate Your Style, <br />
              Simplify Your Shopping
            </h3>
            <p className="text-slate-700 text-base leading-6 text-center mt-3">
              Discover Courses Tailored to Your Professional Career Goals
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-12">
            <Img src={login3.src} ratio="59/33" />
            <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 mb-4 text-center mt-5">
              Elevate Your Style, <br />
              Simplify Your Shopping
            </h3>
            <p className="text-slate-700 text-base leading-6 text-center mt-3">
              Discover Courses Tailored to Your Professional Career Goals
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Slider;
