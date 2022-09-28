export interface Student{
    id: string,
    name: string,
};

export interface RebateRequest{
    student: Student,
    recieve_date: Date,
    rebate_duration_start: Date,
    rebate_duration_end: Date,
}