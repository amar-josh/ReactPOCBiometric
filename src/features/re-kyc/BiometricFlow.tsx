import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useCaptureFingerprint,
  useGetDeviceStatus,
  useGetRDServiceStatus,
} from "@/features/re-kyc/hooks";
import {
  IBiometricCardDetails,
  IValidateFingerPrintRequest,
  IValidateFingerPrintResponse,
} from "@/features/re-kyc/types";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

import BiometricVerificationComponent from "./components/BiometricVerification";
import {
  BIOMETRIC_DEVICE_STATUS,
  BIOMETRIC_MODAL_ACTIONS,
  BIOMETRIC_OPERATIONS,
} from "./constants";
import { getBiometricCardDetails } from "./utils";

interface IBiometricFlowProps {
  onCancel: () => void;
  updateStep: (success: boolean) => void;
  aadhaarNumber: string;
  isAddressUpdate: boolean;
  requestNumber: string | null;
  validateFingerPrintMutate: UseMutateFunction<
    IValidateFingerPrintResponse,
    Error,
    IValidateFingerPrintRequest,
    unknown
  >;
  handleAddressConfirmed: () => void;
  biometricStatus: string;
  serviceRequestNumber?: string;
  setBiometricStatus: Dispatch<SetStateAction<string>>;
  isValidateFingerPrintError: boolean;
  isValidateFingerPrintLoading: boolean;
  validateFingerPrintError: AxiosError | Error | null;
  mobileNo?: string | undefined;
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
  validateFingerPrintMutate,
  handleAddressConfirmed,
  biometricStatus,
  setBiometricStatus,
  mobileNo,
}: IBiometricFlowProps) => {
  const { isAndroidWebView } = useDeviceDetection();
  const [isBiometricFlowDone, setIsBiometricFlowDone] = useState(false); // step 3 has 2 parts biometric modals and viewmode table and end card
  const [biometricCount, setBiometricCount] = useState(3); // only 3 chances
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false); // biometric modal flow
  const [biometricDetails, setBiometricDetails] =
    useState<IBiometricCardDetails | null>(null);
  // what to show on biometric modal
  const [isAadhaarConsentOpen, setIsAadhaarConsentOpen] = useState(false); // aadhaar consent modal

  const [isCaptureButtonClicked, setIsCaptureButtonClicked] = useState(false);

  // Check RD service status hook
  const {
    mutate: getRDServiceStatus,
    data: rdServiceStatusData,
    isPending: isRDServiceStatusLoading,
    isError: isRDServiceStatusError,
    error: rdServiceStatusError,
    reset: resetRDServiceStatus,
  } = useGetRDServiceStatus();

  // Check device status hook
  const {
    mutate: getDeviceStatus,
    data: deviceStatusData,
    isPending: isDeviceStatusLoading,
    reset: resetDeviceStatus,
    isError: isDeviceStatusError,
  } = useGetDeviceStatus();

  // Capture finger print hook
  const {
    mutate: captureFingerPrint,
    data: fingerPrintData,
    isPending: isFingerPrintCaptureLoading,
    reset: resetCaptureFingerPrint,
    isError: isFingerPrintCaptureError,
  } = useCaptureFingerprint();

  // check if RD service is available
  const checkRDServiceStatus = () => {
    getRDServiceStatus();
    setBiometricDetails(
      getBiometricCardDetails({
        statusKey: BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS,
        count: biometricCount,
      }) as IBiometricCardDetails
    );
  };

  useEffect(() => {
    if (rdServiceStatusData && !isRDServiceStatusLoading) {
      if (rdServiceStatusData) {
        // RD service is available, checking device status
        resetRDServiceStatus();
        getDeviceStatus();
      }
    }

    if (isRDServiceStatusError && rdServiceStatusError) {
      // RD service not available, show error
      setBiometricDetails(
        getBiometricCardDetails({
          statusKey: BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_ERROR,
          count: biometricCount,
        }) as IBiometricCardDetails
      );
    }
  }, [
    rdServiceStatusData,
    isRDServiceStatusLoading,
    rdServiceStatusError,
    getDeviceStatus,
    biometricCount,
    setBiometricStatus,
    isRDServiceStatusError,
    resetRDServiceStatus,
  ]);

  // retry to get Device Status
  const retryDeviceNotReady = () => {
    getDeviceStatus();
  };

  const handleBiometricModalAction = (action: string) => {
    switch (action) {
      case BIOMETRIC_MODAL_ACTIONS.RETRY_RD_SERVICE:
        resetRDServiceStatus();
        checkRDServiceStatus();
        break;
      case BIOMETRIC_MODAL_ACTIONS.RETRY_DEVICE:
        resetCaptureFingerPrint();
        resetDeviceStatus();
        retryDeviceNotReady();
        break;
      case BIOMETRIC_MODAL_ACTIONS.CLOSE:
        onClose();
        break;
      case BIOMETRIC_MODAL_ACTIONS.CAPTURE:
        captureFingerPrint();
        setIsCaptureButtonClicked(true); // when button clicked, updating to avoid showing no finger found initially
        setBiometricCount((prev) => prev - 1);
        break;
      case BIOMETRIC_MODAL_ACTIONS.RECAPTURE:
        retryDeviceNotReady();
        break;
      case BIOMETRIC_MODAL_ACTIONS.HOME:
        onCancel();
        break;
      default:
        break;
    }
  };

  // only in case of success, clsoe the modal and show the profile, tabel and address
  const onClose = () => {
    setIsBiometricModalOpen(false);
    if (!isAddressUpdate) {
      handleAddressConfirmed();
    }
  };

  const handleAadhaarConsentModal = () => {
    setIsAadhaarConsentOpen(true);
  };

  const handleConsentApproved = () => {
    setIsAadhaarConsentOpen(false);
    setIsBiometricModalOpen(true);
    if (isAndroidWebView) {
      retryDeviceNotReady();
    } else {
      resetRDServiceStatus();
      checkRDServiceStatus();
    }
  };

  const handleFingerPrintCaptureError = useCallback(
    (errCode: string, errInfo: string) => {
      if (errCode === "720" && errInfo === "Device Not Ready") {
        setBiometricDetails(
          getBiometricCardDetails({
            statusKey: BIOMETRIC_OPERATIONS.DEVICE_NOT_READY,
            count: biometricCount,
          }) as IBiometricCardDetails
        );
        return;
      }

      if (errCode === "700" || errCode === "730") {
        setBiometricDetails(
          getBiometricCardDetails({
            statusKey: BIOMETRIC_OPERATIONS.NO_FINGER_FOUND,
            count: biometricCount,
          }) as IBiometricCardDetails
        );
        return;
      }
      // If any other error occurs than above, handled in generic way
      setBiometricDetails(
        getBiometricCardDetails({
          statusKey: "default",
          count: biometricCount,
        }) as IBiometricCardDetails
      );
    },
    [biometricCount]
  );

  const handleFingerPrintCaptureSuccess = useCallback(
    (base64FingerPrintData: string) => {
      const payload = {
        aadhaarNumber: aadhaarNumber,
        rdServiceData: base64FingerPrintData,
        requestNumber: requestNumber,
        ...(mobileNo && { mobileNo }),
      };
      validateFingerPrintMutate(payload as IValidateFingerPrintRequest);
    },
    [aadhaarNumber, mobileNo, requestNumber, validateFingerPrintMutate]
  );

  useEffect(() => {
    if (!isFingerPrintCaptureLoading) {
      if (fingerPrintData) {
        alert(
          `Fingerprint in component ${JSON.stringify(fingerPrintData?.PidData?.children[0])}`
        );
        // Handle error codes from finger print capture
        const { errCode, errInfo } =
          fingerPrintData?.PidData?.children?.[0]?.Resp || {};
        alert(
          `Error Data, ${JSON.stringify(fingerPrintData?.PidData?.children?.[0]?.Resp)}`
        );
        if (errCode && errCode !== "0") {
          return handleFingerPrintCaptureError(errCode, errInfo);
        }

        // handle success case
        const jsonString = JSON.stringify(fingerPrintData);
        const base64FingerPrintData = btoa(jsonString);
        alert(`response success ${base64FingerPrintData}`);
        handleFingerPrintCaptureSuccess(base64FingerPrintData);
      } else if (isCaptureButtonClicked) {
        setBiometricStatus(BIOMETRIC_OPERATIONS.NO_FINGER_FOUND);
      }
    }
    if (isFingerPrintCaptureError) {
      setBiometricDetails(
        getBiometricCardDetails({
          statusKey: "default",
          count: biometricCount,
        }) as IBiometricCardDetails
      );
    }
  }, [
    isFingerPrintCaptureLoading,
    fingerPrintData,
    isCaptureButtonClicked,
    setBiometricStatus,
    handleFingerPrintCaptureError,
    handleFingerPrintCaptureSuccess,
    isFingerPrintCaptureError,
    biometricCount,
  ]);

  // check device status and update biometric status
  useEffect(() => {
    if (deviceStatusData && !isDeviceStatusLoading) {
      if (deviceStatusData === BIOMETRIC_DEVICE_STATUS.NOT_READY) {
        setBiometricStatus(BIOMETRIC_OPERATIONS.DEVICE_NOT_READY);
      }
      if (deviceStatusData === BIOMETRIC_DEVICE_STATUS.READY) {
        setBiometricStatus(BIOMETRIC_OPERATIONS.READY_TO_CAPTURE);
      }
    }
    if (isDeviceStatusError) {
      setBiometricStatus(BIOMETRIC_OPERATIONS.DEVICE_NOT_READY);
    }
  }, [
    biometricCount,
    deviceStatusData,
    isDeviceStatusError,
    isDeviceStatusLoading,
    setBiometricStatus,
  ]);

  useEffect(() => {
    if (isValidateFingerPrintError) {
      setBiometricDetails(
        getBiometricCardDetails({
          statusKey: validateFingerPrintError?.message,
          count: biometricCount,
        }) as IBiometricCardDetails
      );
    } else {
      setBiometricDetails(
        getBiometricCardDetails({
          statusKey: biometricStatus,
          count: biometricCount,
        }) as IBiometricCardDetails
      );
    }
  }, [
    biometricStatus,
    biometricCount,
    isValidateFingerPrintError,
    validateFingerPrintError?.message,
  ]);

  useEffect(() => {
    if (!isBiometricModalOpen && isCaptureButtonClicked) {
      setIsBiometricFlowDone(true);
    }
  }, [isBiometricModalOpen, isCaptureButtonClicked]);

  useEffect(() => {
    if (isBiometricFlowDone) {
      updateStep(true);
    }
  }, [isBiometricFlowDone, updateStep]);

  return (
    <BiometricVerificationComponent
      handleConsentApproved={handleConsentApproved}
      aadhaarNumber={aadhaarNumber}
      handleAadhaarConsentModal={handleAadhaarConsentModal}
      onCancel={onCancel}
      setIsAadhaarConsentOpen={setIsAadhaarConsentOpen}
      isBiometricModalOpen={isBiometricModalOpen}
      isAadhaarConsentOpen={isAadhaarConsentOpen}
      biometricDetails={biometricDetails}
      handleBiometricModalAction={handleBiometricModalAction}
      isPending={
        isDeviceStatusLoading ||
        isFingerPrintCaptureLoading ||
        isValidateFingerPrintLoading
      }
    />
  );
};

export default BiometricFlow;
