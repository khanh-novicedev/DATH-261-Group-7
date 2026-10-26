export type ReportFlag = 'Spam' | 'Repeated disruption' | 'Harassment';
export type ReportStatus = 'Pending' | 'Resolved' | 'Dismissed';
// export type ReportedPage = 'Q&A comment' | 'Live Room Chat';
export interface ReportItem {
  id: number;
  name: string;
  date: Date;
  flag: ReportFlag;
  reportedContent: string;
  reportedPage: string; // Note: may limit to some pages
  reason: string;
  status: ReportStatus;
}

export interface ReportFilterState {
  status: 'All' | ReportStatus;
  search: string;
  startDate: Date;
  endDate: Date;
  flag: 'All' | ReportFlag;
  // reportedPage: 'All' | ReportedPage;
}
