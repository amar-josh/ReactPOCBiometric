import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import homeIcon from "@/assets/images/home.svg";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import ResponseStatusComponent from "@/components/common/ResponseStatusComponent";
import { Separator } from "@/components/ui/separator";
import { ERROR, SUCCESS } from "@/constants/globalConstant";
import { useScrollToContentTop } from "@/context/scroll-context";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";

import AlertDialogComponent from "../../components/common/AlertDialogComponent";
import Stepper from "../../components/common/Stepper";
import MobileStepper from "../mobile-number-update/components/MobileStepper";
import BiometricFlow from "./BiometricFlow";
import AddressUpdateCard from "./components/AddressUpdateCard";
import CustomerSearch from "./components/CustomerSearch";
import ReKYCDetails from "./components/ReKYCDetails";
import {
  BIOMETRIC_OPERATIONS,
  INITIAL_OTHER_DETAILS_DATA,
  INITIAL_STEP_STATUS,
  STEPS,
} from "./constants";
import {
  useCustomerDetails,
  useCustomerSearch,
  useUpdateKYC,
  useValidateFingerprint,
} from "./hooks";
import {
  useFormDetails,
  useHasDormantAccount,
  usePersonalDetails,
} from "./hooks/useRekycHelpers";
import {
  ICheckpointFailure,
  IGetCustomerSearchRequest,
  IOtherDetailsValues,
  IReKYCData,
  IValidateFingerPrintRequest,
} from "./types";
import { reKYCFailureCheckpoints } from "./utils";

const ReKYC = () => {
  const customerSearchRef = useRef<{ resetForm: () => void }>(null);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>(
    INITIAL_STEP_STATUS
  );

  const { scrollToContentTop } = useScrollToContentTop();

  const [open, setOpen] = useState(false);
  const [isOtherDetailsChange, setIsOtherDetailsChange] = useState(false);

  const [isWithAddressUpdate, setIsWithAddressUpdate] =
    useState<boolean>(false); // which button is clicked no change or address update
  const [otherDetails, setOtherDetails] = useState<IOtherDetailsValues>(
    INITIAL_OTHER_DETAILS_DATA
  );

  const [selected, setSelected] = useState<string | undefined>(""); // selected CIF

  const [steps, setSteps] = useState(STEPS);

  const [actionCode, setActionCode] = useState<string | undefined>("");

  const updateStep = (isCompleteSuccess = true) => {
    setCompleted((prev) => ({ ...prev, [currentStep]: isCompleteSuccess }));
    setCurrentStep((step) => step + 1);
  };

  const resetStep = () => {
    setCompleted(INITIAL_STEP_STATUS);
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
    reset: validateFingerPrintReset,
  } = useValidateFingerprint();

  const {
    mutate: updateKYC,
    isSuccess: isUpdateKYCSuccess,
    isPending: isUpdateKYCLoading,
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

  // Get reKYC details from customerDetailResponse
  const reKYCDetailsResponse = useMemo(
    () => customerDetailResponse?.data,
    [customerDetailResponse]
  );

  // Get account details from customerDetailsResponse
  const accountDetails = useMemo(
    () => customerDetailsResponse?.data,
    [customerDetailsResponse]
  );

  const personalDetails = usePersonalDetails(customerDetailResponse);
  const formDetails = useFormDetails(otherDetails, reKYCDetailsResponse);
  // Check if any of the accounts is dormant
  const hasDormantAccount = useHasDormantAccount(accountDetails);

  const handleValidateFingerPrint = useCallback(
    (payload: IValidateFingerPrintRequest) => {
      validateFingerPrintMutate({
        ...payload,
        ...(personalDetails?.mobileNo && {
          mobileNo: personalDetails?.mobileNo,
        }),
      });
    },
    [personalDetails?.mobileNo, validateFingerPrintMutate]
  );

  const isLoading = useMemo(() => {
    return (
      isCustomerSearchLoading || isCustomerDetailsLoading || isUpdateKYCLoading
    );
  }, [isCustomerDetailsLoading, isCustomerSearchLoading, isUpdateKYCLoading]);

  const requestNumber = useMemo(() => {
    return customerDetailResponse?.data?.requestNumber || "";
  }, [customerDetailResponse?.data?.requestNumber]);

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
  }, [
    customerDetailsResponse,
    isCustomerSearchSuccess,
    setCustomerSearchAlertMessage,
  ]);

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
        customerID: selected || "",
      },
      {
        // TODO:check success or error response
        onSuccess: () => {
          updateStep();
        },
        onError: (error: Error) => {
          // Type guard to check if error is ICheckpointFailure
          const checkpointError = error as unknown as ICheckpointFailure;
          if (checkpointError?.data?.action === "pop-up") {
            setOpen(true);
            setActionCode(checkpointError?.data?.actionCode || "");
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

  const onCancel = () => {
    setOpen(false);
    handleResetSearch();
  };

  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleAddressConfirmed = () => {
    if (!customerDetailResponse?.data.rekycDetails) return;

    const payload = {
      requestNumber: requestNumber,
      isOtherDetailsChange,
      // TODO - replace below 3 fields (maker details)  once api response for login is fixed
      makerDetails: {
        initiatedBy: "employee",
        empId: "12345",
        empBranchCode: "ABC1232",
      },
      kycNoChange: isWithAddressUpdate ? false : true,
      rekycDetails: {
        customerName: customerDetailResponse.data.rekycDetails.customerName,
        aadhaarNumber: customerDetailResponse.data.rekycDetails.aadhaarNumber,
        aadhaarRefNumber:
          customerDetailResponse.data.rekycDetails.aadhaarRefNumber,
        customerID: customerDetailResponse.data.rekycDetails.customerID,
        mobileNo: customerDetailResponse.data.rekycDetails.mobileNo,
        emailId: customerDetailResponse.data.rekycDetails.emailId,
        permanentAddress:
          customerDetailResponse.data.rekycDetails.permanentAddress,
        communicationAddress:
          customerDetailResponse.data.rekycDetails.communicationAddress,
        ...(isWithAddressUpdate && {
          aadhaarCommunicationAddress:
            validateFingerPrintResponse?.data?.aadhaarAddress,
        }),
        otherDetails: {
          occupation: Number(otherDetails.occupation.value),
          residentType: Number(otherDetails.residentType.value),
          incomeRange: Number(otherDetails.incomeRange.value),
        },
      },
    };
    updateKYC(payload, {
      onSuccess: () => updateStep(),
      onError: () => updateStep(),
    });
  };

  const aadhaarNumber = useMemo(() => {
    return customerDetailResponse?.data?.rekycDetails?.aadhaarNumber || "";
  }, [customerDetailResponse?.data?.rekycDetails?.aadhaarNumber]);

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
              customerDetailsReset={customerDetailsReset}
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
              reKYCDetails={reKYCDetailsResponse as IReKYCData}
              handleContinueToEsign={handleContinueToEsign}
              handleUpdateCommunicationAddress={
                handleUpdateCommunicationAddress
              }
              setOtherDetails={setOtherDetails}
            />
          )}
          {currentStep === 3 && (
            <BiometricFlow
              aadhaarNumber={aadhaarNumber}
              onCancel={onCancel}
              updateStep={updateStep}
              isAddressUpdate={isWithAddressUpdate}
              requestNumber={requestNumber}
              handleAddressConfirmed={handleAddressConfirmed}
              handleValidateFingerPrint={handleValidateFingerPrint}
              isValidateFingerPrintError={isValidateFingerPrintError}
              validateFingerPrintError={validateFingerPrintError}
              isValidateFingerPrintLoading={isValidateFingerPrintLoading}
              validateFingerPrintReset={validateFingerPrintReset}
              isAadhaarVerificationComplete={
                validateFingerPrintResponse?.data?.aadhaarVerification ===
                BIOMETRIC_OPERATIONS.SUCCESS
              }
            />
          )}
          {/* // TODO: display it when the rekyc success or failed */}
          {currentStep === 4 && isWithAddressUpdate && (
            <AddressUpdateCard
              personalDetails={personalDetails}
              formDetails={formDetails}
              communicationAddress={
                (reKYCDetailsResponse as IReKYCData)?.rekycDetails
                  ?.communicationAddress
              }
              handleAddressConfirmed={handleAddressConfirmed}
              validateFingerPrintResponse={validateFingerPrintResponse}
              onCancel={onCancel}
            />
          )}
          {(isUpdateKYCError || isUpdateKYCSuccess) && (
            <ResponseStatusComponent
              status={isUpdateKYCSuccess ? "success" : "failure"}
              title={
                (isUpdateKYCSuccess
                  ? "reKyc.thankYou"
                  : "reKyc.rekycUpdateFailed") as string
              }
              message={
                isUpdateKYCSuccess
                  ? "reKyc.updateKYCMessage.success"
                  : "reKyc.updateKYCMessage.failure"
              }
              requestNumber={requestNumber}
              backToHome={backToHome}
            />
          )}
        </div>
      </div>
      <AlertDialogComponent
        title={actionCode ? reKYCFailureCheckpoints[actionCode]?.title : ""}
        message={actionCode ? reKYCFailureCheckpoints[actionCode]?.message : ""}
        icon={
          actionCode ? reKYCFailureCheckpoints[actionCode]?.icon : undefined
        }
        onConfirm={onCancel}
        open={open}
        confirmButtonText={translator("button.ok")}
      />
    </div>
  );
};

export default ReKYC;
