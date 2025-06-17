import translator from "@/i18n/translator";

import pageNotFoundImage from "../../assets/images/pageNotFound.svg";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <img
        src={pageNotFoundImage}
        alt="Page Not Found"
        className="mb-4 w-40 h-40"
      />
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        {translator("pageNotFound.title")}
      </h1>
      <p className="mb-4 text-md">{translator("pageNotFound.message")}</p>
    </div>
  );
};
export default PageNotFound;
