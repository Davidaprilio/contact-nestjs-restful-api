export class WebResponse<T> {
    message: string;
    data: T;
    errors?: { [key: string]: string }
}