
export interface Student{
    id: string,
    name: string,
    hostel: string,
    room: string,
    card_status: boolean,
};

export interface Guest{
    id: string,
    name: string,
    hostel:string
}

export interface DialogData{
  accepted_rebates: RebateRequest[],
  rejected_rebates: RebateRequest[],
  pending_rebates: RebateRequest[]
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
    official: boolean;
    rebate_docname:string;
    fullname: string,
    room: string,

}

export interface RebateCategorised{
    accepted_rebate: RebateRequest[],
    pending_rebate: RebateRequest[],
    rejected_rebate: RebateRequest[]
}

export interface StudentData{}

// ── Menu Stats interfaces ──

export interface MenuStatsOverview {
  success: boolean;
  total_uploads: number;
  by_status: {
    pending_approval: number;
    approved: number;
    rejected: number;
  };
  last_7_days: number;
  last_30_days: number;
}

export interface HostelStat {
  hostel: string;
  total_uploads: number;
  approved: number;
  rejected: number;
  pending: number;
  last_upload_at: string | null;
  avg_approval_time_seconds: number | null;
}

export interface MenuStatsByHostel {
  success: boolean;
  by_hostel: HostelStat[];
}

export interface TimelineEntry {
  period: string;
  count: number;
}

export interface MenuStatsTimeline {
  success: boolean;
  granularity: string;
  hostel: string | null;
  timeline: TimelineEntry[];
}

export interface InactiveHostel {
  hostel: string;
  last_upload_at: string | null;
}

export interface MenuStatsInactiveHostels {
  success: boolean;
  days: number;
  inactive_hostels: InactiveHostel[];
}

export interface HostelFailures {
  hostel: string | null;
  failed_attempts: number;
}

export interface MenuStatsFailures {
  success: boolean;
  total_attempts: number;
  total_failed: number;
  by_hostel: HostelFailures[];
}