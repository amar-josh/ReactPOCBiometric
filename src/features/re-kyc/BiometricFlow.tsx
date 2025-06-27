import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import { BIOMETRIC_SERVICE_AND_DEVICE_STATUS } from "@/constants/globalConstant";
import {
  IBiometricCardDetails,
  IValidateFingerPrintRequest,
} from "@/features/re-kyc/types";
import {
  useCaptureFingerprint,
  useGetDeviceStatus,
  useGetRDServiceStatus,
} from "@/hooks/useBiometrics";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

import BiometricVerificationComponent from "./components/BiometricVerification";
import {
  BIOMETRIC_DEVICE_STATUS_CODES,
  BIOMETRIC_MODAL_ACTIONS,
  BIOMETRIC_OPERATIONS,
  MAX_BIOMETRIC_ATTEMPT,
} from "./constants";
import { getBiometricCardDetails } from "./utils";

interface IBiometricFlowProps {
  onCancel: () => void;
  updateStep: () => void;
  aadhaarNumber: string;
  isAddressUpdate?: boolean;
  requestNumber: string;
  handleValidateFingerPrint: (payload: IValidateFingerPrintRequest) => void;
  handleUpdateJourney: () => void;
  serviceRequestNumber?: string;
  isValidateFingerPrintError: boolean;
  isValidateFingerPrintLoading: boolean;
  validateFingerPrintError: AxiosError | Error | null;
  validateFingerPrintReset: () => void;
  isAadhaarVerificationComplete: boolean;
}

const BiometricFlow = ({
  onCancel,
  updateStep,
  isValidateFingerPrintError,
  validateFingerPrintError,
  aadhaarNumber,
  isAddressUpdate,
  isValidateFingerPrintLoading,
  requestNumber,
  handleValidateFingerPrint,
  handleUpdateJourney,
  validateFingerPrintReset,
  isAadhaarVerificationComplete,
}: IBiometricFlowProps) => {
  const { isAndroidWebView } = useDeviceDetection();
  const initialBiometricModalState = isAndroidWebView
    ? BIOMETRIC_OPERATIONS.DEVICE_NOT_READY
    : BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS;
  const [attemptCount, setAttemptCount] = useState(MAX_BIOMETRIC_ATTEMPT);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [hasAttemptFailed, setHasAttemptFailed] = useState(false);
  const [isAadhaarConsentOpen, setIsAadhaarConsentOpen] = useState(false);
  const [biometricModalDetails, setBiometricModalDetails] =
    useState<IBiometricCardDetails | null>(
      getBiometricCardDetails({
        statusKey: initialBiometricModalState,
        count: MAX_BIOMETRIC_ATTEMPT,
      }) as IBiometricCardDetails
    );

  const updateBiometricModalDetails = useCallback(
    (statusKey: string, count: number) => {
      setBiometricModalDetails(
        getBiometricCardDetails({ statusKey, count }) as IBiometricCardDetails
      );
    },
    []
  );

  // Check RD service status hook
  const {
    mutate: getRDServiceStatus,
    data: rdServiceStatusData,
    isPending: isRDServiceStatusLoading,
    isSuccess: isRDServiceStatusSuccess,
    isError: isRDServiceStatusError,
    error: rdServiceStatusError,
    reset: resetRDServiceStatus,
  } = useGetRDServiceStatus();

  // Check device status hook
  const {
    mutate: getDeviceStatus,
    data: deviceStatusData,
    isPending: isDeviceStatusLoading,
    isSuccess: isDeviceStatusSuccess,
    reset: resetDeviceStatus,
    isError: isDeviceStatusError,
  } = useGetDeviceStatus();

  // Capture finger print hook
  const {
    mutate: captureFingerPrint,
    data: fingerPrintData,
    isPending: isFingerPrintCaptureLoading,
    isSuccess: isFingerPrintCaptureSuccess,
    isError: isFingerPrintCaptureError,
    reset: resetCaptureFingerPrint,
  } = useCaptureFingerprint();

  // retry to get Device Status
  const retryDeviceStatus = () => getDeviceStatus();

  const handleCheckRDServiceStatus = () => {
    resetRDServiceStatus();
    updateBiometricModalDetails(
      BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS,
      attemptCount
    );
    getRDServiceStatus();
  };

  const handleConsentApproved = () => {
    setIsAadhaarConsentOpen(false);
    setIsBiometricModalOpen(true);
    if (isAndroidWebView) {
      retryDeviceStatus();
    } else {
      resetRDServiceStatus();
      getRDServiceStatus();
    }
  };

  // RD service is available, checking device status
  useEffect(() => {
    if (isRDServiceStatusSuccess && rdServiceStatusData) {
      resetRDServiceStatus();
      getDeviceStatus();
    }
  }, [
    getDeviceStatus,
    isRDServiceStatusSuccess,
    rdServiceStatusData,
    resetRDServiceStatus,
  ]);

  // RD service not available
  useEffect(() => {
    if (isRDServiceStatusError && rdServiceStatusError) {
      updateBiometricModalDetails(
        BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_ERROR,
        attemptCount
      );
    }
  }, [
    attemptCount,
    isRDServiceStatusError,
    rdServiceStatusError,
    updateBiometricModalDetails,
  ]);

  // Handle Device Status
  useEffect(() => {
    if (hasAttemptFailed) return;
    if (isDeviceStatusSuccess && deviceStatusData) {
      const operationMode =
        deviceStatusData === BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY
          ? BIOMETRIC_OPERATIONS.READY_TO_CAPTURE
          : BIOMETRIC_OPERATIONS.DEVICE_NOT_READY;
      updateBiometricModalDetails(operationMode, attemptCount);
    }
    if (isDeviceStatusError) {
      updateBiometricModalDetails(
        BIOMETRIC_OPERATIONS.DEVICE_NOT_READY,
        attemptCount
      );
    }
  }, [
    attemptCount,
    deviceStatusData,
    hasAttemptFailed,
    isDeviceStatusError,
    isDeviceStatusSuccess,
    updateBiometricModalDetails,
  ]);

  const handleBiometricModalAction = (action: string) => {
    setHasAttemptFailed(false);
    switch (action) {
      case BIOMETRIC_MODAL_ACTIONS.RETRY_RD_SERVICE:
        handleCheckRDServiceStatus();
        break;
      case BIOMETRIC_MODAL_ACTIONS.RECAPTURE:
      case BIOMETRIC_MODAL_ACTIONS.RETRY_DEVICE:
        resetCaptureFingerPrint();
        resetDeviceStatus();
        retryDeviceStatus();
        break;
      case BIOMETRIC_MODAL_ACTIONS.CLOSE:
        onClose();
        break;
      case BIOMETRIC_MODAL_ACTIONS.CAPTURE:
        captureFingerPrint();
        break;
      case BIOMETRIC_MODAL_ACTIONS.HOME:
        onCancel();
        break;
      default:
        console.log(`Unhandled biometric modal action: ${action}`);
        break;
    }
  };

  // only in case of success, clsoe the modal and show the profile, tabel and address
  const onClose = () => {
    setIsBiometricModalOpen(false);
    updateStep();
    updateBiometricModalDetails(
      initialBiometricModalState,
      MAX_BIOMETRIC_ATTEMPT
    );
    if (!isAddressUpdate) {
      handleUpdateJourney();
    }
  };

  const handleAadhaarConsentModal = () => {
    setIsAadhaarConsentOpen(true);
  };

  const handleFingerPrintCaptureSuccess = useCallback(
    (base64FingerPrintData: string) => {
      const payload = {
        aadhaarNumber: aadhaarNumber,
        rdServiceData: base64FingerPrintData,
        requestNumber: requestNumber,
      };
      handleValidateFingerPrint(payload);
    },
    [aadhaarNumber, handleValidateFingerPrint, requestNumber]
  );

  useEffect(() => {
    if (isAadhaarVerificationComplete) {
      updateBiometricModalDetails(BIOMETRIC_OPERATIONS.SUCCESS, attemptCount);
    }
  }, [
    attemptCount,
    isAadhaarVerificationComplete,
    updateBiometricModalDetails,
  ]);

  const processCaptureError = useCallback(
    (code: string) => {
      const operationMap: Record<string, string> =
        BIOMETRIC_DEVICE_STATUS_CODES;
      updateBiometricModalDetails(
        operationMap[code] || BIOMETRIC_OPERATIONS.DEFAULT,
        attemptCount
      );
    },
    [attemptCount, updateBiometricModalDetails]
  );

  // Handle fingerprint capture success
  useEffect(() => {
    if (isFingerPrintCaptureSuccess && fingerPrintData) {
      let errCode = null;
      const childrenArray = fingerPrintData?.PidData?.children;

      if (childrenArray && Array.isArray(childrenArray)) {
        const respContainer = childrenArray.find((child) => child.Resp);
        if (respContainer && respContainer.Resp) {
          errCode = respContainer.Resp.errCode;
        }
      }

      // Handle error code which comes in fingerprint capture success response
      if (errCode && errCode !== "0") {
        resetCaptureFingerPrint();
        processCaptureError(errCode);
      } else {
        // Handle success case
        const jsonString = JSON.stringify(fingerPrintData);
        const base64FingerPrintData = btoa(jsonString);
        handleFingerPrintCaptureSuccess(base64FingerPrintData);
        resetCaptureFingerPrint();
      }
    }
  }, [
    isFingerPrintCaptureSuccess,
    fingerPrintData,
    handleFingerPrintCaptureSuccess,
    resetCaptureFingerPrint,
    processCaptureError,
  ]);

  // Handle fingerprint capture error response
  useEffect(() => {
    if (isFingerPrintCaptureError) {
      updateBiometricModalDetails(BIOMETRIC_OPERATIONS.DEFAULT, attemptCount);
    }
  }, [attemptCount, isFingerPrintCaptureError, updateBiometricModalDetails]);

  // Handle validate fingerprint error
  useEffect(() => {
    if (isValidateFingerPrintError) {
      setHasAttemptFailed(true);
      const isAttemptFailedPopUp =
        (validateFingerPrintError as any)?.data?.action === "pop-up";
      if (isAttemptFailedPopUp) {
        setAttemptCount((prev) => prev - 1);
        updateBiometricModalDetails(
          BIOMETRIC_OPERATIONS.ATTEMPT_FAILED,
          attemptCount - 1
        );
      } else {
        updateBiometricModalDetails(BIOMETRIC_OPERATIONS.DEFAULT, attemptCount);
      }
      validateFingerPrintReset();
    }
  }, [
    attemptCount,
    isValidateFingerPrintError,
    updateBiometricModalDetails,
    validateFingerPrintError,
    validateFingerPrintReset,
  ]);

  return (
    <BiometricVerificationComponent
      handleConsentApproved={handleConsentApproved}
      aadhaarNumber={aadhaarNumber}
      handleAadhaarConsentModal={handleAadhaarConsentModal}
      onCancel={onCancel}
      setIsAadhaarConsentOpen={setIsAadhaarConsentOpen}
      isBiometricModalOpen={isBiometricModalOpen}
      isAadhaarConsentOpen={isAadhaarConsentOpen}
      biometricDetails={biometricModalDetails}
      handleBiometricModalAction={handleBiometricModalAction}
      isPending={
        isRDServiceStatusLoading ||
        isDeviceStatusLoading ||
        isFingerPrintCaptureLoading ||
        isValidateFingerPrintLoading
      }
    />
  );
};

export default BiometricFlow;
