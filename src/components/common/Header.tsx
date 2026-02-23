import logo from "../../assets/images/BandhanBankWhite.svg";

const Header = () => {
  return (
    <header className="bg-primary h-15 flex px-7 py-3 rounded-none">
      <img src={logo} alt="Bandhan Bank" className="h-8" />
    </header>
  );
};

export default Header;
