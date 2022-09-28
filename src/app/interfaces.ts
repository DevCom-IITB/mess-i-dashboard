export interface Student{
    id: string,
    name: string,
    hostel: string,
    room: string,
    card_status: boolean,
};

export interface RebateRequest{
    student: Student,
    recieve_date: Date,
    rebate_duration_start: Date,
    rebate_duration_end: Date,
}

export interface StudentData{
}