export class ErrorResponse {
  errorCode: number;
  devMessage: string;
  data: object;

  constructor(errorCode: number, devMessage: string, data: object) {
    this.errorCode = errorCode;
    this.devMessage = devMessage;
    this.data = data;
  }
}
