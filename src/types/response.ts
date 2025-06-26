export interface ResponseBuilder<T = any, P = any> {
    data: T;
    message: string;
    code: string;
    meta: P;
    timestamp: string;
}