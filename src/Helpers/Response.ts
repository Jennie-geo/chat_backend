import httpStatus from 'http-status';
import { values } from 'lodash';

export enum ServiceResponseStatusErrorEnum {
  ERROR = 'error',
  UNSUCCESSFUL = 'unsuccessful',
  FAILED = 'failed',
  FALSE = 'false',
}

export const ServiceResponseStatusErrorArray = values(
  ServiceResponseStatusErrorEnum,
);

export type ServiceResponseStatusErrorType =
  (typeof ServiceResponseStatusErrorArray)[number];

export enum ServiceResponseStatusSuccessEnum {
  SUCCESS = 'success',
  TRUE = 'true',
}

export const ServiceResponseStatusSuccessArray = values(
  ServiceResponseStatusSuccessEnum,
);

export type ServiceResponseStatusSuccessType =
  (typeof ServiceResponseStatusSuccessArray)[number];

export type ServiceResponseType = {
  status:
    | (ServiceResponseStatusErrorType | ServiceResponseStatusSuccessType)
    | boolean;
  statusCode: number;
  data?: any;
  message?: string | null;
};

export type ControllerResponseType = {
  status: number;
  response: boolean;
  meta?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  message: string | null;
  errorMessage: string | null;
};

export const ServiceResponseJson: ServiceResponseType = {
  status: false,
  statusCode: httpStatus.INTERNAL_SERVER_ERROR,
  data: null,
  message: null,
};

export const ResponseJson: ControllerResponseType = {
  status: httpStatus.OK,
  response: true,
  meta: null,
  data: null,
  message: null,
  errorMessage: null,
};
