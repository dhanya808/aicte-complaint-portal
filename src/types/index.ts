export type BureauType = 'RB' | 'PGRC' | 'RO' | 'APPROVAL' | 'VIGILANCE';

export type UserRole = 
  | 'ADMIN' 
  | 'MEMBER_SECRETARY' 
  | 'RB_OFFICER' 
  | 'PGRC_OFFICER' 
  | 'REGIONAL_OFFICER';

export type CaseStatus = 
  | 'NEW'
  | 'UNDER_PROCESS'
  | 'SHOW_CAUSE_ISSUED'
  | 'HEARING_SCHEDULED'
  | 'TRANSFERRED'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'DISPOSED'
  | 'REJECTED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintCategory =
  | 'FACULTY_IRREGULARITIES'
  | 'FEE_OVERCHARGE'
  | 'CERTIFICATE_WITHHELD'
  | 'INFRASTRUCTURE_DEFICIT'
  | 'RAGGING_HARASSMENT'
  | 'SALARY_NON_PAYMENT'
  | 'UNAPPROVED_COURSE'
  | 'FRAUD_ENROLLMENT'
  | 'GOVERNANCE_MALPRACTICE';

export type RegionType = 
  | 'Northern (Kanpur)'
  | 'Western (Mumbai)'
  | 'Southern (Chennai)'
  | 'South-Western (Bengaluru)'
  | 'Central (Bhopal)'
  | 'North-Western (Chandigarh)'
  | 'Eastern (Kolkata)'
  | 'South-Central (Hyderabad)';

export interface SupportingDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  fileType: string;
  url: string;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  officerName: string;
  officerDesignation: string;
  bureau: BureauType;
  actionType: string;
  remarks: string;
  documentName?: string;
  isConfidential?: boolean;
}

export interface GreenSheetNote {
  id: string;
  noteNumber: number;
  timestamp: string;
  officerName: string;
  designation: string;
  bureau: BureauType;
  content: string;
  signatureHash: string;
}

export interface ComplaintCase {
  id: string;
  trackingToken: string;
  institutionId: string;
  institutionPermanentId: string;
  institutionName: string;
  institutionState: string;
  institutionRegion: RegionType;
  receiptDate: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  complainantName: string;
  complainantType: 'Student' | 'Faculty' | 'Parent' | 'Public/Whistleblower' | 'Anonymous';
  assignedBureau: BureauType;
  assignedOfficer: string;
  assignedOfficerDesignation: string;
  status: CaseStatus;
  priority: PriorityLevel;
  slaDeadline: string;
  daysPending: number;
  isSlaBreached: boolean;
  lastAction: string;
  lastActionDate: string;
  nextActionRequired: string;
  linkedCaseIds: string[];
  isOverlapFlagged: boolean;
  overlapConfidence?: number;
  overlapReason?: string;
  jointActionStatus?: 'NOT_REQUIRED' | 'PENDING_COORDINATION' | 'JOINT_HEARING_SCHEDULED' | 'CONSOLIDATED';
  supportingDocuments: SupportingDocument[];
  actionHistory: ActionLog[];
  greenSheetNotes: GreenSheetNote[];
}

export interface Institution {
  id: string;
  permanentId: string; // AICTE Permanent ID (e.g. 1-3324567891)
  name: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  region: RegionType;
  type: 'Engineering & Tech' | 'Management' | 'Pharmacy' | 'Architecture' | 'Polytechnic';
  approvalStatus: 'Approved' | 'Under Scrutiny' | 'Show Cause Issued' | 'Approval Withheld';
  eoaStatus: 'Approved (2026-27)' | 'Conditional' | 'Under Hold';
  principalName: string;
  contactEmail: string;
  contactPhone: string;
  totalComplaints: number;
  activeComplaints: number;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface OverlapGroup {
  id: string;
  institutionPermanentId: string;
  institutionName: string;
  region: RegionType;
  riskScore: number;
  caseIds: string[];
  bureauInvolved: BureauType[];
  matchType: 'EXACT_PERMANENT_ID' | 'FUZZY_NAME_ADDRESS' | 'SEMANTIC_ISSUE_SIMILARITY';
  confidence: number; // 0 - 100%
  alertDate: string;
  summary: string;
  status: 'DETECTED' | 'UNDER_REVIEW' | 'JOINT_ACTION_SCHEDULED' | 'MERGED' | 'DISMISSED';
  jointNotes?: Array<{
    id: string;
    timestamp: string;
    author: string;
    bureau: BureauType;
    message: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: UserRole;
  bureau: BureauType;
  region?: RegionType;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'OVERLAP' | 'SLA_BREACH' | 'ESCALATION' | 'JOINT_NOTE' | 'NEW_CASE';
  timestamp: string;
  caseId?: string;
  read: boolean;
  severity: 'info' | 'warning' | 'urgent';
}
