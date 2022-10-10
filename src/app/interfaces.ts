export interface Student{
    id: string,
    name: string,
    hostel: string,
    room: string,
    card_status: boolean,
};

export interface RebateRequest{
    student: Student,
    roll: string,
    start: string,
    end: string,
    request_date: string,
    reason: string,
    id: string
}

export interface RebateCategorised{
    accepted_rebate: RebateRequest[],
    pending_rebate: RebateRequest[],
    rejected_rebate: RebateRequest[]
}

export interface StudentData{
}