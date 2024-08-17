export interface CustomPagination {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface CustomPageRequest {
    size: number;
    page: number;
    sort: string;
}