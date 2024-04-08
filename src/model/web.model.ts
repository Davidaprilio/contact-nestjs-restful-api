export class WebResponse<T> {
    message: string;
    data: T;
    errors?: { [key: string]: string }
    paging?: Paging
}

export class Paging {
    current_page: number
    pages: number;
    size: number;
}