import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import homeIcon from "@/assets/images/home.svg";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import ResponseStatusComponent from "@/components/common/ResponseStatusComponent";
import { Separator } from "@/components/ui/separator";
import { MASKED_KEY } from "@/constants/globalConstant";
import { ERROR, SUCCESS } from "@/constants/globalConstant";
import { useScrollToContentTop } from "@/context/scroll-context";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import translator from "@/i18n/translator";
import { maskData } from "@/lib/maskData";
import { ROUTES } from "@/routes/constants";

import AlertDialogComponent from "../../components/common/AlertDialogComponent";
import Stepper from "../../components/common/Stepper";
import MobileStepper from "../mobile-number-update/components/MobileStepper";
import BiometricFlow from "./BiometricFlow";
import AddressUpdateCard from "./components/AddressUpdateCard";
import CustomerSearch from "./components/CustomerSearch";
import ReKYCDetails from "./components/ReKYCDetails";
import { BIOMETRIC_OPERATIONS, STEPS } from "./constants";
import {
  useCustomerDetails,
  useCustomerSearch,
  useUpdateKYC,
  useValidateFingerprint,
} from "./hooks";
import {
  IGetCustomerSearchRequest,
  ILabelValue,
  IReKYCData,
  IUpdateKYCResponse,
} from "./types";
import {
  formatAddress,
  otherDetailsReadOnlySchema,
  reKYCFailureCheckpoints,
  reKycFormSchema,
} from "./utils";

const ReKYC = () => {
  const { isAndroidWebView } = useDeviceDetection();
  const customerSearchRef = useRef<{ resetForm: () => void }>(null);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({
    1: true,
    2: true,
    3: false,
  });

  const { scrollToContentTop } = useScrollToContentTop();

  const [open, setOpen] = useState(false);
  const [isOtherDetailsChange, setIsOtherDetailsChange] = useState(false);

  const [isWithAddressUpdate, setIsWithAddressUpdate] =
    useState<boolean>(false); // which button is clicked no change or address update
  const [otherDetails, setOtherDetails] = useState<{
    occupation: ILabelValue;
    residentType: ILabelValue;
    incomeRange: ILabelValue;
  }>({
    occupation: { label: "", value: "" },
    residentType: { label: "", value: "" },
    incomeRange: { label: "", value: "" },
  });

  const [selected, setSelected] = useState<string | undefined>(""); // selected CIF

  const [cardDetails, setCardDetails] = useState<IUpdateKYCResponse | null>(
    null
  ); // when biometric is successful, storing the response in cardDetails --- represents address as per aadhaar
  const [steps, setSteps] = useState(STEPS);
  const biometricStatusInitialValue = isAndroidWebView
    ? BIOMETRIC_OPERATIONS.DEVICE_NOT_READY
    : BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS;
  const [biometricStatus, setBiometricStatus] = useState(
    biometricStatusInitialValue
  );

  const updateStep = (isCompleteSuccess = true) => {
    setCompleted((prev) => ({ ...prev, [currentStep]: isCompleteSuccess }));
    setCurrentStep((step) => step + 1);
  };

  const resetStep = () => {
    setCompleted({
      1: false,
      2: false,
      3: false,
    });
    setCurrentStep(1);
    setSteps(STEPS);
  };

  const {
    mutate: customerSearchMutate,
    data: customerDetailsResponse,
    isSuccess: isCustomerSearchSuccess,
    error: customerSearchError,
    isError: isCustomerSearchError,
    isPending: isCustomerSearchLoading,
    reset: customerSearchReset,
  } = useCustomerSearch();

  const {
    mutate: customerDetailsMutate,
    data: customerDetailResponse,
    reset: customerDetailsReset,
    error: customerDetailsError,
    isError: isCustomerDetailsError,
    isPending: isCustomerDetailsLoading,
  } = useCustomerDetails();

  const {
    mutate: validateFingerPrintMutate,
    isPending: isValidateFingerPrintLoading,
    data: validateFingerPrintResponse,
    error: validateFingerPrintError,
    isError: isValidateFingerPrintError,
  } = useValidateFingerprint();

  const {
    mutate: updateKYC,
    isSuccess: isUpdateKYCSuccess,
    isPending: isUpdateKYCLoading,
    data: updateKYCResponse,
    error: updateKYCError,
    isError: isUpdateKYCError,
  } = useUpdateKYC();

  const {
    alertMessage: customerSearchAlertMessage,
    setAlertMessage: setCustomerSearchAlertMessage,
  } = useAlertMessage(
    ERROR,
    customerSearchError?.message,
    isCustomerSearchError
  );

  const isLoading =
    isCustomerSearchLoading || isCustomerDetailsLoading || isUpdateKYCLoading;

  const requestNumber = customerDetailResponse?.data?.requestNumber;

  // Handle customer search success and default cif selection
  useEffect(() => {
    if (isCustomerSearchSuccess) {
      setCustomerSearchAlertMessage({
        type: SUCCESS,
        message: customerDetailsResponse.message,
      });
      // Select the first CIF number if available
      if (customerDetailsResponse?.data?.length > 0) {
        const enabledCifDetails = customerDetailsResponse.data?.find(
          (cifDetails) => !cifDetails.custDetails.isIndividual
        );
        setSelected(
          enabledCifDetails
            ? String(enabledCifDetails.custDetails?.customerId)
            : undefined
        );
      }
    }
  }, [customerDetailsResponse, isCustomerSearchSuccess]);

  useEffect(() => {
    if (!isValidateFingerPrintLoading && validateFingerPrintResponse?.data) {
      if (
        validateFingerPrintResponse?.data?.aadhaarVerification ==
        BIOMETRIC_OPERATIONS.SUCCESS
      ) {
        setBiometricStatus(BIOMETRIC_OPERATIONS.SUCCESS);
      } else {
        setBiometricStatus(BIOMETRIC_OPERATIONS.ATTEMPT_FAILED);
      }
    }
  }, [validateFingerPrintResponse, isValidateFingerPrintLoading]);

  useEffect(() => {
    if (isUpdateKYCSuccess) {
      setCardDetails(updateKYCResponse);
      // update as per module
      updateStep(
        updateKYCResponse?.status === BIOMETRIC_OPERATIONS.SUCCESS
          ? true
          : false
      );
    }
  }, [isUpdateKYCSuccess]);

  // Move the focus at top when new step start
  useEffect(() => {
    scrollToContentTop();
  }, [scrollToContentTop, completed]);

  const handleSearch = (data: IGetCustomerSearchRequest) => {
    customerSearchMutate(data);
  };

  const handleReKYCNext = () => {
    customerDetailsMutate(
      {
        customerID: +selected,
      },
      {
        onSuccess: (res) => {
          if (res?.data.action === "pop-up") {
            setOpen(true);
          } else {
            updateStep();
          }
        },
      }
    );
  };

  const handleResetSearch = () => {
    resetStep();
    setSelected("");
    customerSearchReset();
    customerDetailsReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    customerSearchRef.current?.resetForm();
  };

  const {
    alertMessage: customerDetailsErrorMessage,
    setAlertMessage: setCustomerDetailsErrorAlertMessage,
  } = useAlertMessage(
    ERROR,
    customerDetailsError?.message,
    isCustomerDetailsError
  );

  const handleResetCustomerSearchAPI = useCallback(() => {
    customerSearchReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    customerDetailsReset();
    setCustomerDetailsErrorAlertMessage({ type: SUCCESS, message: "" });
  }, [
    customerSearchReset,
    setCustomerSearchAlertMessage,
    customerDetailsReset,
    setCustomerDetailsErrorAlertMessage,
  ]);

  const handleContinueToEsign = () => {
    setIsWithAddressUpdate(false);
    updateStep();
  };

  const handleUpdateCommunicationAddress = () => {
    setIsWithAddressUpdate(true);
    updateStep();
    setSteps((prev) => {
      return [...prev, "reKyc.updateCommunicationAddress"];
    });
  };

  const personalDetails = {
    fullName: customerDetailResponse?.data?.rekycDetails?.customerName || "",
    mobileNo: customerDetailResponse?.data?.rekycDetails?.mobileNo || "",
    emailId: customerDetailResponse?.data?.rekycDetails?.emailId || "",
  };

  // Get account details from customerDetailsResponse
  const accountDetails = useMemo(
    () => customerDetailsResponse?.data,
    [customerDetailsResponse]
  );

  // Check if any of the accounts is dormant
  const hasDormantAccount = accountDetails?.some((account) =>
    account.accDetails?.some((accDetail) => accDetail.isAccountDormant)
  );

  // Get reKYC details from customerDetailResponse
  const reKYCDetails = useMemo(
    () => customerDetailResponse?.data,
    [customerDetailResponse]
  );

  const formDetails = useMemo(() => {
    const rekycFields = reKycFormSchema.map((ele) => {
      if (["communicationAddress", "permenantAddress"].includes(ele.value)) {
        return {
          ...ele,
          defaultValue: formatAddress(
            customerDetailResponse?.data?.rekycDetails[ele.value]
          ),
        };
      }
      return {
        ...ele,
        defaultValue: customerDetailResponse?.data?.rekycDetails[ele.value],
      };
    });
    const otherFields = otherDetailsReadOnlySchema.map((field) => {
      const selectedOption = otherDetails[field.value];

      return {
        ...field,
        defaultValue: selectedOption?.label ?? "",
      };
    });

    return {
      rekycFields: rekycFields,
      otherFields: otherFields,
    };
  }, [customerDetailResponse?.data?.rekycDetails, otherDetails]);

  const actionCode =
    customerDetailResponse?.data?.actionCode || "ACCOUNT_IS_INDIVIDUAL";

  const onCancel = () => {
    setOpen(false);
    handleResetSearch();
  };

  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleAddressConfirmed = () => {
    const payload = {
      requestNumber: requestNumber,
      isOtherDetailsChange,
      // TODO - replace below 3 fields (maker details)  once api response for login is fixed
      makerDetails: {
        initiated_by: "employee",
        emp_id: "12345",
        emp_branchcode: "ABC1232",
      },
      kycNoChange: isWithAddressUpdate ? false : true,
      kycDetails: {
        ...reKYCDetails?.rekycDetails,
        otherDetails: {
          occupation: otherDetails.occupation.value,
          residentType: otherDetails.residentType.value,
          incomeRange: otherDetails.incomeRange.value,
        },
        ...(isWithAddressUpdate && {
          aadhaarCommunicationAddress:
            validateFingerPrintResponse?.data?.aadhaarAddress,
        }),
      },
    };
    updateKYC(payload, {
      onSuccess: () => {
        updateStep();
      },
    });
  };

  const aadhaarNumber =
    customerDetailResponse?.data?.rekycDetails?.aadhaarNumber || "";

  const maskedAadhaarNumber = maskData(aadhaarNumber, MASKED_KEY.AADHAAR);

  return (
    <div className="p-6">
      {isLoading && <FullScreenLoader />}
      <div className="flex items-center mb-3">
        <h2 className="text-xl font-semibold">{translator("reKyc.title")}</h2>
      </div>
      <Separator />
      <div className="flex gap-10 mt-5">
        <div className="w-1/4 hidden lg:block">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            completed={completed}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div
            onClick={backToHome}
            className="text-sm text-gray-700 inline-flex cursor-pointer w-fit"
          >
            <img src={homeIcon} alt="Home Icon" className="w-5" />
            <p className="text-primary-gray font-bold text-base ml-1">
              {translator("reKyc.home")}
            </p>
          </div>
          <div className="block lg:hidden">
            <MobileStepper
              steps={steps}
              currentStep={currentStep}
              completed={completed}
            />
          </div>
          {currentStep === 1 && (
            <CustomerSearch
              customerSearchAlertMessage={customerSearchAlertMessage}
              customerDetailsErrorMessage={customerDetailsErrorMessage}
              setCustomerDetailsErrorAlertMessage={
                setCustomerDetailsErrorAlertMessage
              }
              reset={customerDetailsReset}
              setSelected={setSelected}
              selected={selected}
              handleReKYCNext={handleReKYCNext}
              isCustomerSearchSuccess={isCustomerSearchSuccess}
              customerSearchRef={customerSearchRef}
              handleResetSearch={handleResetSearch}
              isCustomerSearchLoading={isCustomerSearchLoading}
              handleSearch={handleSearch}
              handleResetCustomerSearchAPI={handleResetCustomerSearchAPI}
              accountDetails={accountDetails}
              customerDetailsError={customerDetailsError}
              isCustomerDetailsError={isCustomerDetailsError}
              hasDormantAccount={hasDormantAccount}
            />
          )}
          {currentStep === 2 && (
            <ReKYCDetails
              onCancel={handleResetSearch}
              setIsOtherDetailsChange={setIsOtherDetailsChange}
              reKYCDetails={reKYCDetails as IReKYCData}
              handleContinueToEsign={handleContinueToEsign}
              handleUpdateCommunicationAddress={
                handleUpdateCommunicationAddress
              }
              setOtherDetails={setOtherDetails}
              cif={selected}
              setSteps={setSteps}
            />
          )}
          {currentStep === 3 && (
            <BiometricFlow
              aadhaarNumber={maskedAadhaarNumber}
              onCancel={onCancel}
              updateStep={updateStep}
              isAddressUpdate={isWithAddressUpdate}
              requestNumber={requestNumber}
              biometricStatus={biometricStatus}
              setBiometricStatus={setBiometricStatus}
              handleAddressConfirmed={handleAddressConfirmed}
              validateFingerPrintMutate={validateFingerPrintMutate}
              isValidateFingerPrintError={isValidateFingerPrintError}
              validateFingerPrintError={validateFingerPrintError}
              isValidateFingerPrintLoading={isValidateFingerPrintLoading}
              mobileNo={personalDetails?.mobileNo}
            />
          )}
          {/* // TODO: display it when the rekyc success or failed */}
          {currentStep === 4 && isWithAddressUpdate ? (
            <AddressUpdateCard
              personalDetails={personalDetails}
              isUpdateKYCError={isUpdateKYCError}
              updateKYCError={updateKYCError}
              formDetails={formDetails}
              communicationAddress={
                (reKYCDetails as IReKYCData)?.rekycDetails?.communicationAddress
              }
              handleAddressConfirmed={handleAddressConfirmed}
              validateFingerPrintResponse={validateFingerPrintResponse}
              onCancel={onCancel}
            />
          ) : (
            cardDetails &&
            cardDetails?.status && (
              <ResponseStatusComponent
                status={cardDetails.status}
                title={
                  translator(
                    cardDetails?.status === "success"
                      ? "reKyc.thankYou"
                      : "reKyc.rekycUpdateFailed"
                  ) as string
                }
                message={cardDetails?.message}
                requestNumber={requestNumber}
                backToHome={backToHome}
              />
            )
          )}
        </div>
      </div>
      <AlertDialogComponent
        title={reKYCFailureCheckpoints[actionCode]?.title}
        message={reKYCFailureCheckpoints[actionCode]?.message}
        icon={reKYCFailureCheckpoints[actionCode]?.icon}
        onConfirm={onCancel}
        open={open}
        confirmButtonText={translator("button.ok")}
      />
    </div>
  );
};

export default ReKYC;
