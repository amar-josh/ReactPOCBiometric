export interface ICustomerSearchFormValues {
  searchBy: "mobile" | "cif" | "account";
  mobile?: string;
  cif?: string;
  account?: string;
}

export interface ICustomerDetails {
  customerId: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  isIndividual: boolean;
}

export interface IAccountDetail {
  accountNumber: string;
  productName: string;
  isAccountDormant: boolean;
  isDebitFreeze?: boolean;
  accountOpenDate?: string;
  accountStatus?: string;
  accountStatusCode?: string;
}

export interface ICustomerSearchResponseItem {
  custDetails: ICustomerDetails;
  accDetails: IAccountDetail[];
}

export interface ISearchOption {
  label: string;
  value: string;
}
