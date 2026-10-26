import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ComplaintCase, 
  Institution, 
  OverlapGroup, 
  UserProfile, 
  NotificationItem, 
  CaseStatus, 
  BureauType, 
  PriorityLevel, 
  ActionLog, 
  GreenSheetNote 
} from '../types';
import { 
  INITIAL_CASES, 
  INITIAL_INSTITUTIONS, 
  INITIAL_OVERLAPS, 
  INITIAL_USERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { detectOverlaps } from '../services/overlapDetection';

interface AppContextType {
  cases: ComplaintCase[];
  institutions: Institution[];
  overlaps: OverlapGroup[];
  users: UserProfile[];
  currentUser: UserProfile;
  isAuthenticated: boolean;
  sessionTimeLeft: number;
  notifications: NotificationItem[];
  language: 'EN' | 'HI';
  theme: 'light' | 'dark';
  activeTab: string;
  globalSearch: string;
  selectedCaseId: string | null;
  selectedInstitutionId: string | null;
  selectedOverlapId: string | null;
  
  // Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  setGlobalSearch: (q: string) => void;
  setSelectedCaseId: (id: string | null) => void;
  setSelectedInstitutionId: (id: string | null) => void;
  setSelectedOverlapId: (id: string | null) => void;
  switchUserRole: (userId: string) => void;
  setLanguage: (lang: 'EN' | 'HI') => void;
  toggleTheme: () => void;
  
  // Case Operations
  addCase: (newCase: Partial<ComplaintCase>) => ComplaintCase;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, remarks: string) => void;
  transferCase: (caseId: string, toBureau: BureauType, toOfficer: string, mandatoryReason: string) => void;
  escalateCase: (caseId: string, mandatoryReason: string) => void;
  linkCases: (caseIdA: string, caseIdB: string) => void;
  addGreenSheetNote: (caseId: string, content: string) => void;
  
  // Overlap Operations
  addJointNote: (overlapId: string, message: string) => void;
  scheduleJointAction: (overlapId: string, actionType: 'JOINT_EVC' | 'JOINT_HEARING') => void;
  mergeOverlapCases: (overlapId: string, leadCaseId: string) => void;
  dismissOverlap: (overlapId: string) => void;
  
  // Bulk Ingestion
  bulkImportCases: (importedCases: ComplaintCase[]) => { importedCount: number; overlapsFound: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<ComplaintCase[]>(() => {
    const saved = localStorage.getItem('aicte_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem('aicte_institutions');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [overlaps, setOverlaps] = useState<OverlapGroup[]>(() => {
    const saved = localStorage.getItem('aicte_overlaps');
    return saved ? JSON.parse(saved) : INITIAL_OVERLAPS;
  });

  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aicte_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aicte_auth') === 'true';
  });
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(900); // 15 mins
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [selectedOverlapId, setSelectedOverlapId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('aicte_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('aicte_institutions', JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem('aicte_overlaps', JSON.stringify(overlaps));
  }, [overlaps]);

  // Dark mode effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Session countdown timer
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          logout();
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSessionTimeLeft(900);
    localStorage.setItem('aicte_auth', 'true');
    localStorage.setItem('aicte_current_user', JSON.stringify(user));

    // Role-based landing tab
    if (user.role === 'REGIONAL_OFFICER') {
      setActiveTab('map');
    } else if (user.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aicte_auth');
    localStorage.removeItem('aicte_current_user');
  };

  const switchUserRole = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('aicte_current_user', JSON.stringify(found));
    }
  };

  // Add Case
  const addCase = (newCaseData: Partial<ComplaintCase>): ComplaintCase => {
    const generatedId = `AICTE/2026/${newCaseData.assignedBureau || 'PGRC'}/${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingToken = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const fullCase: ComplaintCase = {
      id: generatedId,
      trackingToken,
      institutionId: newCaseData.institutionId || 'INST-001',
      institutionPermanentId: newCaseData.institutionPermanentId || '1-0000000000',
      institutionName: newCaseData.institutionName || 'Unknown Institution',
      institutionState: newCaseData.institutionState || 'Delhi',
      institutionRegion: newCaseData.institutionRegion || 'Northern (Kanpur)',
      receiptDate: new Date().toISOString().split('T')[0],
      category: newCaseData.category || 'FACULTY_IRREGULARITIES',
      subject: newCaseData.subject || 'New Complaint Received',
      description: newCaseData.description || '',
      complainantName: newCaseData.complainantName || 'Anonymous',
      complainantType: newCaseData.complainantType || 'Student',
      assignedBureau: newCaseData.assignedBureau || 'PGRC',
      assignedOfficer: currentUser.name,
      assignedOfficerDesignation: currentUser.designation,
      status: 'NEW',
      priority: newCaseData.priority || 'MEDIUM',
      slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysPending: 0,
      isSlaBreached: false,
      lastAction: 'Complaint registered and assigned for verification',
      lastActionDate: new Date().toISOString().split('T')[0],
      nextActionRequired: 'Initial preliminary scrutiny by dealing bureau',
      linkedCaseIds: [],
      isOverlapFlagged: false,
      supportingDocuments: newCaseData.supportingDocuments || [],
      actionHistory: [
        {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          officerName: currentUser.name,
          officerDesignation: currentUser.designation,
          bureau: currentUser.bureau,
          actionType: 'Registration',
          remarks: 'Initial complaint entered into Integrated Dashboard.'
        }
      ],
      greenSheetNotes: []
    };

    const updatedCases = [fullCase, ...cases];
    setCases(updatedCases);

    // Run overlap detection automatically!
    const detected = detectOverlaps(updatedCases, institutions);
    if (detected.length > overlaps.length) {
      setOverlaps(detected);
      
      // Update case flag
      fullCase.isOverlapFlagged = true;
      fullCase.overlapConfidence = 95;

      // Add notification
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        title: 'New Cross-Bureau Overlap Detected!',
        message: `Newly registered case ${fullCase.id} matched existing proceedings for ${fullCase.institutionName}.`,
        type: 'OVERLAP',
        timestamp: 'Just now',
        caseId: fullCase.id,
        read: false,
        severity: 'urgent'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return fullCase;
  };

  // Update Status
  const updateCaseStatus = (caseId: string, newStatus: CaseStatus, remarks: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const newAction: ActionLog = {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        officerName: currentUser.name,
        officerDesignation: currentUser.designation,
        bureau: currentUser.bureau,
        actionType: `Status Changed to ${newStatus}`,
        remarks: remarks || `Status updated to ${newStatus}.`
      };
      return {
        ...c,
        status: newStatus,
        lastAction: `Status moved to ${newStatus}`,
        lastActionDate: new Date().toISOString().split('T')[0],
        actionHistory: [newAction, ...c.actionHistory]
      };
    }));
  };

  // Transfer Case
  const transferCase = (caseId: string, toBureau: BureauType, toOfficer: string, mandatoryReason: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const transferLog: ActionLog = {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        officerName: currentUser.name,
        officerDesignation: currentUser.designation,
        bureau: currentUser.bureau,
        actionType: `Transferred to ${toBureau}`,
        remarks: `MANDATORY TRANSFER REASON: ${mandatoryReason} (Assigned to: ${toOfficer})`
      };
      return {
        ...c,
        assignedBureau: toBureau,
        assignedOfficer: toOfficer,
        status: 'TRANSFERRED',
        lastAction: `Transferred from ${c.assignedBureau} to ${toBureau}`,
        lastActionDate: new Date().toISOString().split('T')[0],
        actionHistory: [transferLog, ...c.actionHistory]
      };
    }));
  };

  // Escalate Case
  const escalateCase = (caseId: string, mandatoryReason: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const escLog: ActionLog = {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        officerName: currentUser.name,
        officerDesignation: currentUser.designation,
        bureau: currentUser.bureau,
        actionType: 'Escalated to Member Secretary',
        remarks: `ESCALATION JUSTIFICATION: ${mandatoryReason}`
      };
      return {
        ...c,
        priority: 'CRITICAL',
        status: 'ESCALATED',
        lastAction: 'Escalated to Member Secretary / Chairman Apex Committee',
        lastActionDate: new Date().toISOString().split('T')[0],
        actionHistory: [escLog, ...c.actionHistory]
      };
    }));
  };

  // Link Cases
  const linkCases = (caseIdA: string, caseIdB: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseIdA) {
        return { ...c, linkedCaseIds: Array.from(new Set([...c.linkedCaseIds, caseIdB])) };
      }
      if (c.id === caseIdB) {
        return { ...c, linkedCaseIds: Array.from(new Set([...c.linkedCaseIds, caseIdA])) };
      }
      return c;
    }));
  };

  // Add Digital Green Sheet Note (e-Office)
  const addGreenSheetNote = (caseId: string, content: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const noteCount = c.greenSheetNotes.length + 1;
      const newNote: GreenSheetNote = {
        id: `NOTE-${Date.now()}`,
        noteNumber: noteCount,
        timestamp: new Date().toLocaleString(),
        officerName: currentUser.name,
        designation: currentUser.designation,
        bureau: currentUser.bureau,
        content,
        signatureHash: `SHA256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`
      };
      return {
        ...c,
        greenSheetNotes: [...c.greenSheetNotes, newNote]
      };
    }));
  };

  // Overlap Operations
  const addJointNote = (overlapId: string, message: string) => {
    setOverlaps(prev => prev.map(o => {
      if (o.id !== overlapId) return o;
      const newNote = {
        id: `JN-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        author: `${currentUser.name} (${currentUser.bureau})`,
        bureau: currentUser.bureau,
        message
      };
      return {
        ...o,
        jointNotes: [...(o.jointNotes || []), newNote]
      };
    }));
  };

  const scheduleJointAction = (overlapId: string, actionType: 'JOINT_EVC' | 'JOINT_HEARING') => {
    setOverlaps(prev => prev.map(o => {
      if (o.id !== overlapId) return o;
      return {
        ...o,
        status: 'JOINT_ACTION_SCHEDULED',
        summary: o.summary + ` [Joint Action Scheduled: ${actionType.replace('_', ' ')}]`
      };
    }));
  };

  const mergeOverlapCases = (overlapId: string, leadCaseId: string) => {
    const overlap = overlaps.find(o => o.id === overlapId);
    if (!overlap) return;

    // Link all cases together
    const allIds = overlap.caseIds;
    setCases(prev => prev.map(c => {
      if (allIds.includes(c.id)) {
        return {
          ...c,
          linkedCaseIds: Array.from(new Set([...c.linkedCaseIds, ...allIds.filter(id => id !== c.id)])),
          jointActionStatus: 'CONSOLIDATED'
        };
      }
      return c;
    }));

    setOverlaps(prev => prev.map(o => o.id === overlapId ? { ...o, status: 'MERGED' } : o));
  };

  const dismissOverlap = (overlapId: string) => {
    setOverlaps(prev => prev.map(o => o.id === overlapId ? { ...o, status: 'DISMISSED' } : o));
  };

  // Bulk Ingestion
  const bulkImportCases = (importedCases: ComplaintCase[]) => {
    const combined = [...importedCases, ...cases];
    setCases(combined);
    const newOverlaps = detectOverlaps(combined, institutions);
    setOverlaps(newOverlaps);
    return {
      importedCount: importedCases.length,
      overlapsFound: newOverlaps.length
    };
  };

  return (
    <AppContext.Provider
      value={{
        cases,
        institutions,
        overlaps,
        users,
        currentUser,
        isAuthenticated,
        sessionTimeLeft,
        notifications,
        language,
        theme,
        activeTab,
        globalSearch,
        selectedCaseId,
        selectedInstitutionId,
        selectedOverlapId,
        login,
        logout,
        setActiveTab,
        setGlobalSearch,
        setSelectedCaseId,
        setSelectedInstitutionId,
        setSelectedOverlapId,
        switchUserRole,
        setLanguage,
        toggleTheme,
        addCase,
        updateCaseStatus,
        transferCase,
        escalateCase,
        linkCases,
        addGreenSheetNote,
        addJointNote,
        scheduleJointAction,
        mergeOverlapCases,
        dismissOverlap,
        bulkImportCases
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
