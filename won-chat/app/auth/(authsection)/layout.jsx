import bg from "@/assets/images/login-top-bg.png";
import Img from "@/component/Img";
import Slider from "@/component/Slider";
function layout({ children }) {
  return (
    <section className="bg-slate-100">
      <div className="">
        <div className="bg-white rounded-2xl w-full">
          <div className="flex flex-col lg:flex-row h-fit">
            {/* left side   */}
            <div className="lg:w-1/2 w-full min-h-screen py-6 lg:py-16 flex">
              <div className="w-full max-w-[592px] ml-auto mr-auto lg:mr-0 min-h-full flex flex-col">
                {/* logo  */}
                <a
                  href="/"
                  className="flex w-fit items-center gap-2.5 pl-5 lg:pl-0"
                >
                  {/* <img src="./assets/images/logo-sm.svg" alt="" className="pb-1" /> */}
                  <h1 className="text-2xl font-bold text-dc-black">Won Chat</h1>
                </a>
                {/* form sector    */}
                {children}
              </div>
            </div>
            {/* right side  */}
            <div className="lg:w-1/2 w-full min-h-full flex bg-green-50 relative">
              {/* bg corner    */}
              <Img src={bg.src} ratio="1/1" position="absolute" width="300px" />
              <div className="w-full max-w-[708px] mr-auto ml-auto lg:ml-0 min-h-full flex flex-col py-10 lg:py-16 relative z-10">
                {/* logo   */}
                <a href="/" className="flex w-fit items-center gap-2.5 ml-auto">
                  {/* <img
  src="./assets/images/logo-sm.svg"
  alt=""
  className="pb-1"
/>  */}
                  {/* <h1 className="text-2xl font-bold text-dc-black">DashCart.</h1>  */}
                </a>
                {/* main info   */}
                <div className="flex flex-col justify-center px-5 lg:px-12 flex-1 w-full ">
                  <Slider />
                  <div className="swiper-pagination"></div>

                  <nav>
                    <ul className="flex justify-center flex-wrap gap-5 md:gap-10 mt-8">
                      <li>
                        <a href="#" className="text-base text-slate-900">
                          Terms & Conditions
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base text-slate-900">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base text-slate-900">
                          Help
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-base text-slate-900">
                          English
                        </a>
                      </li>
                    </ul>
                  </nav>
                  <p className="text-base text-slate-600 mt-4 text-center">
                    &copy; 2023 Taildo, All Right Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default layout;
