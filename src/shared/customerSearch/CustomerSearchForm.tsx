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
import translator from "@/i18n/translator";
import { CIF_LENGTH } from "./constants";
import { customerSearchFormSchema } from "./utils";
import { IGetCustomerSearchRequest } from "@/features/re-kyc/types";
import { ISearchOption } from "./types";

type FormSchemaType = yup.InferType<typeof customerSearchFormSchema>;

interface ICustomerSearchProps {
  onSearch: (data: IGetCustomerSearchRequest) => void;
  onReset: () => void;
  onResetCustomerSearchAPI: () => void;
  isSuccess: boolean;
  showInfoMessage?: boolean;
  searchOptions: ISearchOption[];
  onSearchByChange?: (searchBy: string) => void;
}

const CustomerSearchForm = forwardRef(
  (
    {
      onSearch,
      onReset,
      onResetCustomerSearchAPI,
      isSuccess,
      showInfoMessage,
      searchOptions,
      onSearchByChange,
    }: ICustomerSearchProps,
    ref: React.Ref<{ resetForm: () => void }>
  ) => {
    const form = useForm<FormSchemaType>({
      resolver: yupResolver(customerSearchFormSchema),
      defaultValues: {
        searchBy: "cif",
        mobile: "",
        cif: "",
        account: "",
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
          accountNumber: data.account,
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
        form.reset({
          searchBy: watchSearchBy,
          mobile: "",
          cif: "",
          account: "",
        });
        onSearchByChange?.(watchSearchBy);
      }
      //clear field level error message
      form.clearErrors();
      onResetCustomerSearchAPI();
    }, [form, onResetCustomerSearchAPI, onSearchByChange, watchSearchBy]);

    const isFormEmpty =
      !form.watch("mobile") && !form.watch("cif") && !form.watch("account");

    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-medium">
          {translator("reKyc.searchWith")}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="searchBy"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroupComponent
                      value={String(field.value)}
                      onChange={field.onChange}
                      options={searchOptions}
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
                          placeholder={translator("placeholder.mobileNumber")}
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
                          placeholder={translator("placeholder.cif")}
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
                          placeholder={translator("placeholder.accountNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {showInfoMessage && (
              <InfoMessage
                icon={infoIcon}
                className="mt-1.5"
                message={"mobileNumberUpdate.errorMessages.aadharMustLinked"}
              />
            )}

            <div className="flex gap-3 mt-5">
              <Button
                variant="primary"
                type="submit"
                disabled={isSuccess || isFormEmpty}
              >
                {translator("searchCustomer")}
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
