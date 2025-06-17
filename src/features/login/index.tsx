// Container: Login/index.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as yup from "yup";

import { ERROR, SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { VALID_EMAIL_REGEX } from "@/constants/regex";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";

import LoginComponent from "./components/LoginPage";

// ✅ Yup schema
const schema = yup.object({
  email: yup
    .string()
    .matches(VALID_EMAIL_REGEX, translator("validations.email.enterValidEmail"))
    .required(translator("validations.email.enterValidEmail")),
});

const Login = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleRedirectToListingPage = () => {
    navigate(ROUTES.HOME);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    if (!errors.email) {
      handleRedirectToListingPage();
    }
  };

  const handleNextClick = () => {
    // TODO:replace hardcoded token value with actual token value from api
    sessionStorage.setItem(SESSION_STORAGE_KEY.TOKEN, "asdf");
    trigger("email"); // Use the trigger function from useForm
  };

  const { alertMessage } = useAlertMessage(
    // TODO:Replace hardcoded passed values with api error fields
    ERROR,
    "something went wrong",
    true
  );

  return (
    <LoginComponent
      showModal={showModal}
      setShowModal={setShowModal}
      errors={errors}
      register={register}
      alertMessage={alertMessage}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      handleNextClick={handleNextClick}
    />
  );
};

export default Login;
