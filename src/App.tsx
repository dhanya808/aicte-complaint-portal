import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { CaseList } from './components/cases/CaseList';
import { CaseDetailModal } from './components/cases/CaseDetailModal';
import { RegisterCaseModal } from './components/cases/RegisterCaseModal';
import { OverlapCenter } from './components/overlap/OverlapCenter';
import { JointResolutionRoom } from './components/overlap/JointResolutionRoom';
import { InstitutionDirectory } from './components/institutions/InstitutionDirectory';
import { InstitutionDetailModal } from './components/institutions/InstitutionDetailModal';
import { RegionalHeatmap } from './components/map/RegionalHeatmap';
import { ReportsView } from './components/reports/ReportsView';
import { BulkUploadView } from './components/bulk/BulkUploadView';
import { CitizenTracker } from './components/public/CitizenTracker';
import { AdminSettings } from './components/admin/AdminSettings';
import { LoginPage } from './components/auth/LoginPage';

export const AppContent: React.FC = () => {
  const { 
    isAuthenticated,
    activeTab, 
    setActiveTab, 
    selectedCaseId, 
    setSelectedCaseId,
    selectedInstitutionId,
    setSelectedInstitutionId,
    selectedOverlapId,
    setSelectedOverlapId
  } = useApp();

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // If not authenticated, display official Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenCase = (id: string) => {
    setSelectedCaseId(id);
  };

  const handleOpenJointRoom = (ovlId?: string) => {
    if (ovlId) setSelectedOverlapId(ovlId);
    setActiveTab('joint-room');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === 'dashboard' && <ExecutiveDashboard />}
          
          {activeTab === 'cases' && (
            <CaseList 
              onOpenCase={handleOpenCase}
              onOpenRegister={() => setShowRegisterModal(true)}
            />
          )}

          {activeTab === 'overlaps' && (
            <OverlapCenter 
              onOpenJointRoom={handleOpenJointRoom}
              onOpenCase={handleOpenCase}
            />
          )}

          {activeTab === 'joint-room' && (
            <JointResolutionRoom 
              overlapId={selectedOverlapId}
              onBack={() => setActiveTab('overlaps')}
              onOpenCase={handleOpenCase}
            />
          )}

          {activeTab === 'institutions' && (
            <InstitutionDirectory 
              onSelectInstitution={(id) => setSelectedInstitutionId(id)}
            />
          )}

          {activeTab === 'map' && (
            <RegionalHeatmap 
              onOpenCase={handleOpenCase}
            />
          )}

          {activeTab === 'reports' && <ReportsView />}
          
          {activeTab === 'bulk' && <BulkUploadView />}

          {activeTab === 'citizen-tracker' && <CitizenTracker />}

          {activeTab === 'admin' && <AdminSettings />}
        </main>
      </div>

      {/* Case Detail Modal */}
      {selectedCaseId && (
        <CaseDetailModal
          caseId={selectedCaseId}
          onClose={() => setSelectedCaseId(null)}
          onOpenJointRoom={handleOpenJointRoom}
        />
      )}

      {/* Institution Detail Modal */}
      {selectedInstitutionId && (
        <InstitutionDetailModal
          institutionId={selectedInstitutionId}
          onClose={() => setSelectedInstitutionId(null)}
          onOpenCase={handleOpenCase}
        />
      )}

      {/* Register Case Modal */}
      {showRegisterModal && (
        <RegisterCaseModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={(newId) => {
            setShowRegisterModal(false);
            setSelectedCaseId(newId);
          }}
        />
      )}
    </div>
  );
};
