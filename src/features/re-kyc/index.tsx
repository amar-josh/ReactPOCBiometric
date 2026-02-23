import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

// TODO:Uncommment below code in phase 2
// import warningIcon from "@/assets/images/warning.svg";
// import AbortJourneyConfirmationModal from "@/components/common/AbortJourneyConfirmationModal";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import PageHeader from "@/components/common/PageHeader";
import ResponseStatusComponent from "@/components/common/ResponseStatusComponent";
import ResponsiveStepper from "@/components/common/ResponsiveStepper";
import { Separator } from "@/components/ui/separator";
import {
  ERROR,
  INITIAL_STEP_STATUS,
  JOURNEY_TYPE,
  POPUP,
  SUCCESS,
} from "@/constants/globalConstant";
import {
  IScrollContextType,
  useScrollToContentTop,
} from "@/context/scroll-context";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { ROUTES } from "@/routes/constants";
import BiometricFlow from "@/shared/biometric";
import { IValidateFingerPrintRequest } from "@/shared/biometric/types";
import CustomerSearch from "@/shared/customerSearch";
import { CUSTOMER_SEARCH_OPTIONS } from "@/shared/customerSearch/constants";

import AlertDialogComponent from "../../components/common/AlertDialogComponent";
import { useEmpInfo } from "../adfs-login/hooks";
import AddressUpdateCard from "./components/AddressUpdateCard";
import ReKYCDetails from "./components/ReKYCDetails";
import { STEP, STEPS } from "./constants";
import {
  useCustomerDetails,
  useCustomerSearch,
  useUpdateKYC,
  useValidateFingerprint,
} from "./hooks/useRekyc";
import { useFormDetails, usePersonalDetails } from "./hooks/useRekycHelpers";
import {
  IGetCustomerDetailsResponse,
  IGetCustomerSearchRequest,
  // IOtherDetailsValues,
  IReKYCData,
} from "./types";
import { reKYCFailureCheckpoints } from "./utils";

const ReKYC = () => {
  const empInfo = useEmpInfo();

  const customerSearchRef = useRef<{ resetForm: () => void }>(null);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(STEP.SEARCH_CUSTOMER);
  const [completed, setCompleted] = useState<{ [key: number]: boolean }>(
    INITIAL_STEP_STATUS
  );

  const { scrollToContentTop } = useScrollToContentTop() as IScrollContextType;

  const [open, setOpen] = useState(false);
  const [isOtherDetailsChange, setIsOtherDetailsChange] = useState(false);

  const [isWithAddressUpdate, setIsWithAddressUpdate] =
    useState<boolean>(false); // which button is clicked no change or address update
  // const [otherDetails, setOtherDetails] = useState<IOtherDetailsValues>(
  //   INITIAL_OTHER_DETAILS_DATA
  // );

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const [steps, setSteps] = useState(STEPS);

  const [actionCode, setActionCode] = useState<string | undefined>();

  // const [
  //   showAbortJourneyConfirmationModal,
  //   setShowAbortJourneyConfirmationModal,
  // ] = useState<boolean>(false);

  const updateStep = useCallback(() => {
    setCompleted((prev) => ({ ...prev, [currentStep]: true }));
    setCurrentStep((step) => step + 1);
  }, [currentStep]);

  const resetStep = () => {
    setCompleted(INITIAL_STEP_STATUS);
    setCurrentStep(STEP.SEARCH_CUSTOMER);
    setSteps(STEPS);
  };

  const {
    mutate: customerSearchMutate,
    data: customerSearchResponse,
    isSuccess: isCustomerSearchSuccess,
    error: customerSearchError,
    isError: isCustomerSearchError,
    isPending: isCustomerSearchLoading,
    reset: customerSearchReset,
  } = useCustomerSearch();

  const {
    mutate: customerDetailsMutate,
    data: customerDetailsResponse,
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
    data: updateKycResponse,
    isPending: isUpdateKYCLoading,
    isError: isUpdateKYCError,
    error: updateKycErrorResponse,
    reset: updateKYCReset,
  } = useUpdateKYC();

  const {
    alertMessage: customerSearchAlertMessage,
    setAlertMessage: setCustomerSearchAlertMessage,
  } = useAlertMessage(
    ERROR,
    customerSearchError?.message,
    isCustomerSearchError
  );

  // Get reKYC details from customerDetailsResponse
  const reKYCDetailsResponse = useMemo(
    () => customerDetailsResponse?.data,
    [customerDetailsResponse]
  );

  // Get account details from customerSearchResponse
  const accountDetails = useMemo(
    () => customerSearchResponse?.data,
    [customerSearchResponse]
  );

  const personalDetails = usePersonalDetails(customerDetailsResponse);
  //  Other details are not available in the ESB yet, so we are hiding them until they become available
  // const formDetails = useFormDetails(otherDetails, reKYCDetailsResponse);
  const formDetails = useFormDetails(reKYCDetailsResponse);

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
    return customerDetailsResponse?.data?.requestNumber || "";
  }, [customerDetailsResponse?.data?.requestNumber]);

  // Handle customer search success and default cif selection
  useEffect(() => {
    if (isCustomerSearchSuccess) {
      // Select the first CIF number if available
      if (customerSearchResponse?.data?.length > 0) {
        const enabledCifDetails = customerSearchResponse.data?.find(
          (cifDetails) => cifDetails.custDetails.isIndividual
        );
        if (enabledCifDetails) {
          setSelectedCustomerId(enabledCifDetails.custDetails.customerId);
        }
      }
    }
  }, [
    customerSearchResponse,
    isCustomerSearchSuccess,
    setCustomerSearchAlertMessage,
  ]);

  // Move the focus at top when new step start
  useEffect(() => {
    scrollToContentTop();
  }, [scrollToContentTop, completed]);

  const handleSearch = (data: IGetCustomerSearchRequest) => {
    customerSearchMutate(data);
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
  };

  const handleCustomerDetailsSuccess = useCallback(
    (res: IGetCustomerDetailsResponse) => {
      if (res?.data?.action === POPUP) {
        setOpen(true);
        setActionCode(res?.data?.actionCode);
      } else {
        updateStep();
      }
    },
    [updateStep]
  );

  const handleReKYCNext = useCallback(() => {
    const payload = {
      customerID: selectedCustomerId,
      makerDetails: {
        initiatedBy: empInfo?.empName,
        empId: empInfo?.empId,
        empBranchCode: empInfo?.branchCode,
      },
    };
    customerDetailsMutate(payload, {
      onSuccess: handleCustomerDetailsSuccess,
    });
  }, [
    customerDetailsMutate,
    handleCustomerDetailsSuccess,
    selectedCustomerId,
    empInfo,
  ]);

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

  const handleResetSearch = useCallback(() => {
    resetStep();
    setSelectedCustomerId("");
    customerSearchReset();
    handleResetCustomerSearchAPI();
    customerDetailsReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    customerSearchRef.current?.resetForm();
  }, [
    customerDetailsReset,
    customerSearchReset,
    setCustomerSearchAlertMessage,
    handleResetCustomerSearchAPI,
  ]);

  const handleContinueToEsign = useCallback(() => {
    setIsWithAddressUpdate(false);
    updateStep();
  }, [updateStep]);

  const handleUpdateCommunicationAddress = useCallback(() => {
    setIsWithAddressUpdate(true);
    updateStep();
    setSteps((prev) => {
      return [...prev, "reKyc.updateCommunicationAddress"];
    });
  }, [updateStep]);

  const onCancel = useCallback(() => {
    setOpen(false);
    handleResetSearch();
    updateKYCReset();
    validateFingerPrintReset();
    scrollToContentTop();
  }, [
    handleResetSearch,
    updateKYCReset,
    validateFingerPrintReset,
    scrollToContentTop,
  ]);

  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  // filteredAccountDetails is not usefull at all for FE side. It comes from BE in getUserDetails API and we are sending this details while kyc update and ovd update API in request body.
  const filteredAccountDetails = useMemo(
    () => customerDetailsResponse?.data?.filteredAccountDetails || [],
    [customerDetailsResponse?.data?.filteredAccountDetails]
  );

  const handleKYCUpdate = () => {
    if (!customerDetailsResponse?.data.rekycDetails) return;

    const payload = {
      requestNumber: requestNumber,
      isOtherDetailsChange,
      makerDetails: {
        initiatedBy: empInfo?.empName,
        empId: empInfo?.empId,
        empBranchCode: empInfo?.branchCode,
      },
      kycNoChange: isWithAddressUpdate ? false : true,
      rekycDetails: {
        customerName: customerDetailsResponse.data.rekycDetails.customerName,
        aadhaarNumber: customerDetailsResponse.data.rekycDetails.aadhaarNumber,
        aadhaarRefNumber:
          customerDetailsResponse.data.rekycDetails.aadhaarRefNumber,
        customerID: customerDetailsResponse.data.rekycDetails.customerID,
        mobileNo: customerDetailsResponse.data.rekycDetails.mobileNo,
        emailId: customerDetailsResponse.data.rekycDetails.emailId,
        kycStatus: customerDetailsResponse.data.rekycDetails.kycStatus,
        permanentAddress:
          customerDetailsResponse.data.rekycDetails.permanentAddress,
        communicationAddress:
          customerDetailsResponse.data.rekycDetails.communicationAddress,
        ...(isWithAddressUpdate && {
          aadhaarCommunicationAddress:
            validateFingerPrintResponse?.data?.aadhaarAddress,
        }),
        // TODO - These details are not available in the ESB yet, so we are hiding them until they become available.
        // otherDetails: {
        //   occupation: Number(otherDetails.occupation.value),
        //   residentType: Number(otherDetails.residentType.value),
        //   incomeRange: Number(otherDetails.incomeRange.value),
        // },
      },
      filteredAccountDetails,
    };
    updateKYC(payload, {
      onSuccess: () => updateStep(),
      onError: () => updateStep(),
    });
  };

  const aadhaarNumber = useMemo(() => {
    return customerDetailsResponse?.data?.rekycDetails?.aadhaarNumber || "";
  }, [customerDetailsResponse?.data?.rekycDetails?.aadhaarNumber]);

  // const handleShowCancelModal = useCallback(() => {
  //   setShowAbortJourneyConfirmationModal(true);
  // }, []);

  // const handleConfirmAbortJourney = () => {
  //   handleResetSearch();
  //   setCustomerDetailsErrorAlertMessage({
  //     type: SUCCESS,
  //     message: "",
  //   });
  //   setShowAbortJourneyConfirmationModal(false);
  // };

  // const handleCloseCancelModal = () => {
  //    setShowAbortJourneyConfirmationModal(false);
  // };

  return (
    <div className="px-6 py-3">
      {isLoading && <FullScreenLoader />}
      <PageHeader title="reKyc.title" />
      <Separator />
      <div className="flex flex-col lg:flex-row gap-10 mt-5">
        <ResponsiveStepper
          steps={steps}
          currentStep={currentStep}
          completed={completed}
        />
        <div className="flex flex-col gap-4 w-full">
          {currentStep === STEP.SEARCH_CUSTOMER && (
            <CustomerSearch
              customerSearchRef={customerSearchRef}
              handleSearch={handleSearch}
              handleResetSearch={handleResetSearch}
              handleShowCancelModal={onCancel}
              handleResetCustomerSearchAPI={handleResetCustomerSearchAPI}
              isCustomerSearchSuccess={isCustomerSearchSuccess}
              customerSearchAlertMessage={customerSearchAlertMessage}
              accountDetails={accountDetails}
              customerDetailsErrorMessage={customerDetailsErrorMessage}
              selectedCustomerId={selectedCustomerId}
              setSelectedCustomerId={setSelectedCustomerId}
              handleNext={handleReKYCNext}
              journeyType={JOURNEY_TYPE.REKYC}
              searchOptions={CUSTOMER_SEARCH_OPTIONS}
            />
          )}
          {currentStep === STEP.VERIFY && (
            <ReKYCDetails
              handleShowCancelModal={onCancel}
              setIsOtherDetailsChange={setIsOtherDetailsChange}
              reKYCDetails={reKYCDetailsResponse as IReKYCData}
              handleContinueToEsign={handleContinueToEsign}
              handleUpdateCommunicationAddress={
                handleUpdateCommunicationAddress
              }
              // setOtherDetails={setOtherDetails}
            />
          )}
          {currentStep === STEP.ESIGN && (
            <BiometricFlow
              aadhaarNumber={aadhaarNumber}
              onCancel={onCancel}
              updateStep={updateStep}
              isAddressUpdate={isWithAddressUpdate}
              requestNumber={requestNumber}
              handleUpdateJourney={handleKYCUpdate}
              handleValidateFingerPrint={handleValidateFingerPrint}
              isValidateFingerPrintError={isValidateFingerPrintError}
              validateFingerPrintError={validateFingerPrintError}
              isValidateFingerPrintLoading={isValidateFingerPrintLoading}
              validateFingerPrintReset={validateFingerPrintReset}
              validateFingerPrintResponse={validateFingerPrintResponse}
              aadhaarVerificationStatus={
                validateFingerPrintResponse?.data?.aadhaarVerification
              }
            />
          )}
          {currentStep === STEP.ADDRESS_UPDATE && isWithAddressUpdate && (
            <AddressUpdateCard
              formDetails={formDetails}
              communicationAddress={
                (reKYCDetailsResponse as IReKYCData)?.rekycDetails
                  ?.communicationAddress
              }
              handleAddressConfirmed={handleKYCUpdate}
              validateFingerPrintResponse={validateFingerPrintResponse}
              handleShowCancelModal={onCancel}
            />
          )}
          {/* display below component when the rekyc success or failed */}
          {(isUpdateKYCError || isUpdateKYCSuccess) && (
            <ResponseStatusComponent
              isSuccess={isUpdateKYCSuccess}
              title={
                isUpdateKYCSuccess ? "thankYou" : "reKyc.rekycUpdateFailed"
              }
              message={
                (isUpdateKYCSuccess
                  ? updateKycResponse?.message
                  : updateKycErrorResponse?.message) as string
              }
              requestNumber={requestNumber}
              backToHome={backToHome}
            />
          )}
        </div>
      </div>
      {actionCode && (
        <AlertDialogComponent
          title={reKYCFailureCheckpoints[actionCode]?.title}
          message={reKYCFailureCheckpoints[actionCode]?.message}
          icon={reKYCFailureCheckpoints[actionCode]?.icon}
          onConfirm={onCancel}
          open={open}
          confirmButtonText="button.ok"
        />
      )}
      {/* {showAbortJourneyConfirmationModal && (
        <AbortJourneyConfirmationModal
          open={showAbortJourneyConfirmationModal}
          onCancel={handleCloseCancelModal}
          onConfirm={handleConfirmAbortJourney}
          description={"reKyc.modal.confirmationText"}
          icon={warningIcon}
        />
      )} */}
    </div>
  );
};

export default ReKYC;
