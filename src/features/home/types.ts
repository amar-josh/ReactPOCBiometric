export interface IInstaModule {
  moduleId: number;
  moduleName: string;
  moduleDesc: string;
  moduleKey: string;
  moduleOrderValue: string;
  moduleActive: string;
}

export interface IInstaService {
  categoryId: number;
  categoryName: string;
  categoryDesc: string;
  categoryKey: string;
  categoryOrderValue: string;
  categoryIsActive: string;
  rolesAssigned: string;
  modules: IInstaModule[];
}

export interface IInstaServicesData {
  instaServices: IInstaService[];
}

export interface IInstaServicesResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IInstaServicesData;
}

export interface IInstaServicesRequest {
  userId: string;
  userRole: string;
}

export interface IInstaServiceCards {
  moduleKey: string;
  moduleName: string;
  moduleDesc: string;
}
