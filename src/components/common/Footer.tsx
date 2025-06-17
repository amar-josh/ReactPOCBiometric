import translator from "@/i18n/translator";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={`w-full p-4 text-center text-sm ${className}`}>
      {translator("footer")}
    </footer>
  );
};

export default Footer;
