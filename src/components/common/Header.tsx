import logo from "../../assets/images/BandhanBankWhite.svg";

const Header = () => {
  return (
    <header className="bg-primary min-h-20 flex justify-between gap-4 px-12 py-5 rounded-none">
      <img src={logo} alt="Bandhan Bank" className=" w-[168px]" />
    </header>
  );
};

export default Header;
