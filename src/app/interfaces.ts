export interface Student{
    id: string,
    name: string,
    hostel: string,
    room: string,
    card_status: boolean,
};

export interface RebateRequest{
    id: string
    roll: string,
    student: Student,
    start: string,
    end: string,
    request_date: string,
    reason: string,
    comment: string;
}

export interface RebateCategorised{
    accepted_rebate: RebateRequest[],
    pending_rebate: RebateRequest[],
    rejected_rebate: RebateRequest[]
}

export interface StudentData{
}