export class ErrorResponse {
  errorCode: string;
  devMessage: string;
  data: object;

  constructor(errorCode: string, devMessage: string, data: object) {
    this.errorCode = errorCode;
    this.devMessage = devMessage;
    this.data = data;
  }
}
