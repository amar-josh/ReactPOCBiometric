import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

// import warningIcon from "@/assets/images/warning.svg";
// import AbortJourneyConfirmationModal from "@/components/common/AbortJourneyConfirmationModal";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
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
import { IGetCustomerSearchRequest } from "@/features/re-kyc/types";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { ROUTES } from "@/routes/constants";
import BiometricFlow from "@/shared/biometric";
import { IValidateFingerPrintRequest } from "@/shared/biometric/types";
import CustomerSearch from "@/shared/customerSearch";
import { CUSTOMER_SEARCH_OPTIONS } from "@/shared/customerSearch/constants";

import { useEmpInfo } from "../adfs-login/hooks";
import alertIcon from "./../../assets/images/alert.svg";
import UpdateDetails from "./components/UpdateDetails";
import {
  BRANCH,
  BU,
  EMERGING_ENTREPRENEURS_BUSINESS,
  STEP,
  STEPS,
} from "./constants";
import {
  useCustomerSearch,
  useFetchRecords,
  useUpdateNumber,
  useValidateFingerprint,
} from "./hooks";
import { mobileNumberUpdateFailureCheckpoints } from "./utils";

const MobileNumberUpdate = () => {
  const empInfo = useEmpInfo();

  const navigate = useNavigate();
  const customerSearchRef = useRef<{ resetForm: () => void }>(null);

  const { scrollToContentTop } = useScrollToContentTop() as IScrollContextType;

  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState<number>(STEP.SEARCH_CUSTOMER);
  const [completed, setCompleted] = useState<{ [key: number]: boolean }>(
    INITIAL_STEP_STATUS
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [newMobileNumber, setNewMobileNumber] = useState<string | undefined>(
    ""
  );

  const [actionCode, setActionCode] = useState<string | undefined>("");

  // TODO:Uncommment below code in phase 2
  // const [
  //   showAbortJourneyConfirmationModal,
  //   setShowAbortJourneyConfirmationModal,
  // ] = useState<boolean>(false);

  const updateStep = () => {
    setCompleted((prev) => ({ ...prev, [currentStep]: true }));
    setCurrentStep((step) => step + 1);
  };

  const resetStep = () => {
    setCompleted(INITIAL_STEP_STATUS);
    setCurrentStep(STEP.SEARCH_CUSTOMER);
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
    mutate: updateNumber,
    data: updateNumberResponse,
    error: updateNumberErrorResponse,
    isSuccess: isUpdateNumberSuccess,
    isError: isUpdateNumberError,
    isPending: isUpdateNumberLoading,
  } = useUpdateNumber();

  const {
    mutate: validateFingerPrintMutate,
    isPending: isValidateFingerPrintLoading,
    error: validateFingerPrintError,
    data: validateFingerPrintResponse,
    isError: isValidateFingerPrintError,
    reset: validateFingerPrintReset,
  } = useValidateFingerprint();

  const {
    data: getRecordsData,
    mutate: fetchRecordsMutate,
    isPending: isFetchRecordsLoading,
    error: fetchRecordsError,
    reset: fetchRecordsReset,
    isError: isFetchRecordsError,
  } = useFetchRecords();

  const {
    alertMessage: customerSearchAlertMessage,
    setAlertMessage: setCustomerSearchAlertMessage,
  } = useAlertMessage(
    ERROR,
    customerSearchError?.message,
    isCustomerSearchError
  );

  const handleValidateFingerPrint = useCallback(
    (payload: IValidateFingerPrintRequest) => {
      validateFingerPrintMutate(payload);
    },
    [validateFingerPrintMutate]
  );

  const { requestNumber, personalDetails, aadhaarNumber } = useMemo(() => {
    const firstRecord = Array.isArray(getRecordsData?.data)
      ? getRecordsData.data[0]
      : undefined;

    return {
      requestNumber: firstRecord?.requestNumber || "",
      personalDetails: firstRecord || {},
      aadhaarNumber: firstRecord?.custDetails?.aadhaarNumber || "",
    };
  }, [getRecordsData?.data]);

  const numberUpdateData = useMemo(
    () => updateNumberResponse?.data,
    [updateNumberResponse?.data]
  );

  // Move the focus at top when new step start
  useEffect(() => {
    scrollToContentTop();
  }, [scrollToContentTop, completed]);

  // TODO:Uncommment below code in phase 2
  // const handleShowCancelModal = useCallback(() => {
  //   setShowAbortJourneyConfirmationModal(true);
  // }, []);

  // TODO:Uncommment below code in phase 2
  // const handleConfirmAbortJourney = () => {
  //   handleResetSearch();
  //   setFetchRecordsErrorMessage({ type: SUCCESS, message: "" });
  //   setShowAbortJourneyConfirmationModal(false);
  // };

  // TODO:Uncommment below code in phase 2
  // const handleCloseCancelModal = () => {
  //   setShowAbortJourneyConfirmationModal(false);
  // };

  // Handle customer search success and default cif selection
  useEffect(() => {
    if (isCustomerSearchSuccess) {
      if (customerDetailsResponse?.data?.length > 0) {
        const enabledCifDetails = customerDetailsResponse?.data?.find(
          (cifDetails) => cifDetails?.custDetails?.isIndividual
        );
        if (enabledCifDetails) {
          setSelectedCustomerId(enabledCifDetails.custDetails.customerId);
        }
      }
    }
  }, [
    customerDetailsResponse?.data,
    customerDetailsResponse?.message,
    isCustomerSearchSuccess,
  ]);

  const handleSearch = (data: IGetCustomerSearchRequest) => {
    customerSearchMutate(data);
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
  };

  const handleResetSearch = () => {
    resetStep();
    setSelectedCustomerId("");
    customerSearchReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    customerSearchRef.current?.resetForm();
  };

  const {
    alertMessage: fetchRecordsErrorMessage,
    setAlertMessage: setFetchRecordsErrorMessage,
  } = useAlertMessage(ERROR, fetchRecordsError?.message, isFetchRecordsError);

  const handleResetCustomerSearchAPI = useCallback(() => {
    customerSearchReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    fetchRecordsReset();
    setFetchRecordsErrorMessage({ type: SUCCESS, message: "" });
  }, [
    customerSearchReset,
    fetchRecordsReset,
    setCustomerSearchAlertMessage,
    setFetchRecordsErrorMessage,
  ]);

  const onCancel = useCallback(() => {
    setIsOpen(false);
    handleResetSearch();
    handleResetCustomerSearchAPI();
    scrollToContentTop();
  }, [handleResetCustomerSearchAPI, handleResetSearch, scrollToContentTop]);

  // Get account details from customerDetailsResponse
  const accountDetails = useMemo(
    () => customerDetailsResponse?.data,
    [customerDetailsResponse]
  );

  const customerName = useMemo(
    () => getRecordsData?.data?.custDetails?.customerName,
    [getRecordsData?.data?.custDetails?.customerName]
  );

  const handleUpdateMobileNumber = () => {
    if (!selectedCustomerId || !newMobileNumber) {
      return;
    }
    const payload = {
      customerID: selectedCustomerId,
      custUpdatedMobileNumber: newMobileNumber,
      branchCode: empInfo?.branchCode || "10001",
      customerName,
      requestNumber: requestNumber,
      type:
        empInfo?.department === EMERGING_ENTREPRENEURS_BUSINESS ? BU : BRANCH,
    };
    updateNumber(payload);
  };

  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleNext = () => {
    const payload = {
      branchCode: empInfo?.branchCode || "10001",
      employeeId: empInfo?.empId || "222222",
      employeeName: empInfo?.empName || "VENDOR TESTING",
      customerID: selectedCustomerId,
    };
    fetchRecordsMutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.action === POPUP) {
          setIsOpen(true);
          setActionCode(res?.data?.actionCode);
        } else {
          updateStep();
        }
      },
    });
  };

  return (
    <div className="px-6 py-3">
      {(isCustomerSearchLoading ||
        isUpdateNumberLoading ||
        isFetchRecordsLoading) && <FullScreenLoader />}
      <PageHeader title="mobileNumberUpdate.title" />
      <Separator />
      <div className="flex flex-col lg:flex-row gap-10 mt-5">
        <ResponsiveStepper
          steps={STEPS}
          currentStep={currentStep}
          completed={completed}
        />
        <div className="flex flex-col gap-6 w-full">
          {currentStep === STEP.SEARCH_CUSTOMER && (
            <CustomerSearch
              handleNext={handleNext}
              customerSearchRef={customerSearchRef}
              handleSearch={handleSearch}
              handleShowCancelModal={onCancel}
              handleResetSearch={handleResetSearch}
              handleResetCustomerSearchAPI={handleResetCustomerSearchAPI}
              isCustomerSearchSuccess={isCustomerSearchSuccess}
              customerSearchAlertMessage={customerSearchAlertMessage}
              accountDetails={accountDetails}
              customerDetailsErrorMessage={fetchRecordsErrorMessage}
              selectedCustomerId={selectedCustomerId}
              setSelectedCustomerId={setSelectedCustomerId}
              journeyType={JOURNEY_TYPE.MOBILE_NUMBER_UPDATE}
              searchOptions={CUSTOMER_SEARCH_OPTIONS}
            />
          )}
          {currentStep === STEP.UPDATE_DETAILS && (
            <UpdateDetails
              updateStep={updateStep}
              setNewMobileNumber={setNewMobileNumber}
              requestNumber={requestNumber}
              personalDetails={personalDetails}
            />
          )}
          {currentStep === STEP.ESIGN && (
            <BiometricFlow
              aadhaarNumber={aadhaarNumber}
              onCancel={onCancel}
              updateStep={updateStep}
              isAddressUpdate={false}
              requestNumber={requestNumber}
              validateFingerPrintResponse={validateFingerPrintResponse}
              handleUpdateJourney={handleUpdateMobileNumber}
              handleValidateFingerPrint={handleValidateFingerPrint}
              isValidateFingerPrintError={isValidateFingerPrintError}
              validateFingerPrintError={validateFingerPrintError}
              isValidateFingerPrintLoading={isValidateFingerPrintLoading}
              validateFingerPrintReset={validateFingerPrintReset}
              aadhaarVerificationStatus={
                validateFingerPrintResponse?.data?.aadhaarVerification
              }
            />
          )}
          {currentStep === STEP.SUCCESS_FAILURE &&
            (isUpdateNumberError || isUpdateNumberSuccess) && (
              <ResponseStatusComponent
                isSuccess={isUpdateNumberSuccess}
                title={
                  isUpdateNumberSuccess
                    ? "thankYou"
                    : "mobileNumberUpdate.mobileNumberUpdateFailed"
                }
                message={
                  (isUpdateNumberSuccess
                    ? updateNumberResponse?.message
                    : updateNumberErrorResponse?.message) as string
                }
                requestNumber={numberUpdateData?.requestNumber || ""}
                newMobileNumber={
                  isUpdateNumberSuccess ? numberUpdateData?.newMobileNumber : ""
                }
                oldMobileNumber={numberUpdateData?.oldMobileNumber || ""}
                backToHome={backToHome}
              />
            )}
        </div>
      </div>
      {actionCode && (
        <AlertDialogComponent
          title={mobileNumberUpdateFailureCheckpoints[actionCode]?.title}
          message={mobileNumberUpdateFailureCheckpoints[actionCode]?.message}
          icon={alertIcon}
          onConfirm={onCancel}
          open={isOpen}
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

export default MobileNumberUpdate;
