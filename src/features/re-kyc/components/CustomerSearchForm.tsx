import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import infoIcon from "@/assets/images/info-black.svg";
import InfoMessage from "@/components/common/InfoMessage";
import MobileNumberInput from "@/components/common/MobileNumberInput";
import RadioGroupComponent from "@/components/common/RadioGroupComponent";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ACCOUNT_NUMBER_REGEX,
  CIF_LENGTH_REGEX,
  MOBILE_NUMBER_REGEX,
} from "@/constants/regex";
import { IGetCustomerSearchRequest } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

import { CIF_LENGTH, SEARCH_OPTIONS } from "../constants";

// Yup validation schema
const formSchema = yup.object().shape({
  searchBy: yup.string(),
  mobile: yup.string().when("searchBy", {
    is: "mobile",
    then: (schema) =>
      schema
        .required(translator("validations.mobileNumber.matchesRegex"))
        .matches(
          MOBILE_NUMBER_REGEX,
          translator("validations.mobileNumber.matchesRegex")
        ),
    otherwise: (schema) => schema.optional(),
  }),

  cif: yup.string().when("searchBy", {
    is: "cif",
    then: (schema) =>
      schema
        .required(translator("validations.cif.matchesRegex"))
        .matches(CIF_LENGTH_REGEX, translator("validations.cif.matchesRegex")),
    otherwise: (schema) => schema.optional(),
  }),

  account: yup.string().when("searchBy", {
    is: "account",
    then: (schema) =>
      schema
        .required(translator("validations.account.matchesRegex"))
        .matches(
          ACCOUNT_NUMBER_REGEX,
          translator("validations.account.matchesRegex")
        ),
    otherwise: (schema) => schema.optional(),
  }),
});

type FormSchemaType = yup.InferType<typeof formSchema>;

interface ICustomerSearchProps {
  onSearch: (data: IGetCustomerSearchRequest) => void;
  onReset: () => void;
  onResetCustomerSearchAPI: () => void;
  isSuccess: boolean;
  showInfoMessage?: boolean;
}

const CustomerSearchForm = forwardRef(
  (
    {
      onSearch,
      onReset,
      onResetCustomerSearchAPI,
      isSuccess,
      showInfoMessage,
    }: ICustomerSearchProps,
    ref: React.Ref<{ resetForm: () => void }>
  ) => {
    const form = useForm<FormSchemaType>({
      // @ts-expect-error: yupResolver type mismatch with react-hook-form expected resolver, safe to ignore as per project setup
      resolver: yupResolver(formSchema),
      defaultValues: {
        searchBy: "mobile",
        mobile: undefined,
        cif: undefined,
        account: undefined,
      },
    });

    const watchSearchBy = form.watch("searchBy");

    const onSubmit = (data: FormSchemaType) => {
      if (data.searchBy === "mobile") {
        onSearch({
          mobileNumber: data.mobile,
        });
      } else if (data.searchBy === "cif") {
        onSearch({
          customerID: data.cif,
        });
      } else if (data.searchBy === "account") {
        onSearch({
          accountNumber: Number(data.account),
        });
      }
    };

    const handleReset = () => {
      form.reset();
      onReset();
    };

    const handleResetByRef = () => {
      form.reset();
    };

    useImperativeHandle(ref, () => ({
      resetForm: handleResetByRef,
    }));

    useEffect(() => {
      if (watchSearchBy) {
        form.setValue("mobile", "");
        form.setValue("cif", undefined);
        form.setValue("account", undefined);
      }
      //clear field level error message
      form.clearErrors();
      onResetCustomerSearchAPI();
    }, [form, onResetCustomerSearchAPI, watchSearchBy]);

    const isFormEmpty =
      !form.watch("mobile") && !form.watch("cif") && !form.watch("account");

    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-medium">
          {translator("reKyc.searchWith")}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="searchBy"
              render={({ field }) => (
                <FormItem>
                  <RadioGroupComponent
                    value={String(field.value)}
                    onChange={field.onChange}
                    options={SEARCH_OPTIONS}
                  />
                </FormItem>
              )}
            />

            {watchSearchBy === "mobile" && (
              <FormField
                control={form.control}
                name="mobile"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={translator(
                          "reKyc.placeholder.mobileNumber"
                        )}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {watchSearchBy === "cif" && (
              <FormField
                control={form.control}
                name="cif"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        maxLength={CIF_LENGTH}
                        autoComplete="off"
                        className="w-full max-w-sm"
                        placeholder={translator("reKyc.placeholder.cif")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchSearchBy === "account" && (
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        maxLength={14}
                        className="w-full max-w-sm"
                        autoComplete="off"
                        placeholder={translator(
                          "reKyc.placeholder.accountNumber"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showInfoMessage && (
              <InfoMessage
                icon={infoIcon}
                className="mb-5"
                message={"mobileNumberUpdate.errorMessages.aadharMustLinked"}
              />
            )}

            <div className="flex gap-3">
              <Button
                variant="primary"
                type="submit"
                disabled={isSuccess || isFormEmpty}
              >
                {translator("button.searchCustomer")}
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
      </div>
    );
  }
);

export default CustomerSearchForm;
