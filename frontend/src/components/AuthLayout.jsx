import UI from "../assets/bg-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
        <h2 className="text-lg font-medium text-black">
          Schichtverwaltungs-App
        </h2>
        {children}
      </div>
      <div className="hidden  md:flex md:flex-col md:justify-center w-[40vw] h-screen items-center bg-blue-50 bg-[url('/bgimg.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <p className="text-white text-2xl md:text-4xl font-semibold tracking-wide leading-snug drop-shadow-md">
          SCHICHTVERWALTUNGS-APP
        </p>
        <img src={UI} alt="ui-img" />
      </div>
    </div>
  );
};

export default AuthLayout;
