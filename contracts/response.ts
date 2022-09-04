import { ResponsePayload } from 'Config/commons';
declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    sendResponse(response: ResponsePayload): this;
  }
}
