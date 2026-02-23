import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import CardWrapper from "@/components/common/InfoCardWrapper";
import MobileNumberInput from "@/components/common/MobileNumberInput";
import RadioGroupComponent from "@/components/common/RadioGroupComponent";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import translator from "@/i18n/translator";

import { IDENTIFIER_TYPE_CONSTANTS, VERIFICATION_OPTIONS } from "../constants";
import { IMobileOrEmailVerificationForm } from "../types";
import { mobileOrEmailVerificationFormSchema } from "../utils";

type FormSchemaType = yup.InferType<typeof mobileOrEmailVerificationFormSchema>;

interface IVerificationFormProps {
  onSubmit: (data: IMobileOrEmailVerificationForm) => void;
  onIdentifierChange?: () => void;
  onReset: () => void;
  isSearchDetailsSuccess: boolean;
}

const VerificationForm = ({
  onSubmit,
  onReset,
  isSearchDetailsSuccess,
}: IVerificationFormProps) => {
  const handleReset = () => {
    mobileOrEmailVerificationForm.reset({
      identifier: "mobile",
      mobile: "",
      email: "",
    });
    mobileOrEmailVerificationForm.clearErrors();
    onReset();
  };
  const mobileOrEmailVerificationForm = useForm<FormSchemaType>({
    resolver: yupResolver(mobileOrEmailVerificationFormSchema),
    defaultValues: {
      identifier: "mobile",
      mobile: "",
      email: "",
    },
  });

  const watchSearchBy = mobileOrEmailVerificationForm.watch("identifier");
  useEffect(() => {
    if (watchSearchBy) {
      mobileOrEmailVerificationForm.reset({
        identifier: watchSearchBy,
        mobile: "",
        email: "",
      });
    }
    //clear field level error message
    mobileOrEmailVerificationForm.clearErrors();
    onReset();
  }, [mobileOrEmailVerificationForm, watchSearchBy]);

  const handleSubmit: SubmitHandler<FormSchemaType> = (data) => {
    onSubmit(data);
  };

  const isFormEmpty =
    !mobileOrEmailVerificationForm.watch("mobile") &&
    !mobileOrEmailVerificationForm.watch("email");

  return (
    <div>
      <CardWrapper className="my-6 p-0 w-full lg:w-2/3">
        <h4 className="font-medium text-lg mb-4">{translator("verify")}</h4>
        <Form {...mobileOrEmailVerificationForm}>
          <form
            onSubmit={mobileOrEmailVerificationForm.handleSubmit(handleSubmit)}
            className="mb-5"
          >
            <div className="space-y-5">
              <FormField
                control={mobileOrEmailVerificationForm.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroupComponent
                      value={String(field.value)}
                      onChange={field.onChange}
                      options={VERIFICATION_OPTIONS}
                    />
                  </FormItem>
                )}
              />

              {watchSearchBy === IDENTIFIER_TYPE_CONSTANTS.MOBILE && (
                <FormField
                  control={mobileOrEmailVerificationForm.control}
                  name="mobile"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-primary-gray ">
                        {translator("formFields.mobileNumber")}
                      </FormLabel>
                      <FormControl>
                        <MobileNumberInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={translator("placeholder.mobileNumber")}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {watchSearchBy === IDENTIFIER_TYPE_CONSTANTS.EMAIL && (
                <FormField
                  control={mobileOrEmailVerificationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-gray ">
                        {translator("formFields.emailId")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          className="w-full max-w-sm"
                          placeholder={translator(
                            "mobileEmailVerification.placeholder.email"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex gap-3 mt-5 w-full lg:w-2/3">
              <Button
                variant="primary"
                type="submit"
                disabled={isFormEmpty || isSearchDetailsSuccess}
              >
                {translator("button.search")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isFormEmpty}
              >
                {translator("button.reset")}
              </Button>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default VerificationForm;
