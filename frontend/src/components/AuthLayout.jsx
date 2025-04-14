import UI from "../assets/bg-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
        <h2 className="text-lg font-medium text-black">Shift Management APP</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[40vw] h-screen items-center bg-blue-50 bg-[url('/bgimg.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img
          src={UI}
          alt="ui-img"
          className="shadow-inner shadow-black/20 rounded-md"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
