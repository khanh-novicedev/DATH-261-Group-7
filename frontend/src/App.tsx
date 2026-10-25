import { useState } from 'react';
import UserManagementPage from './Features Admin/user management';
import CourseManagementPage from './Features Admin/course management';
import AuditLogsPage from './Features Admin/audit logs/AuditLogsPage';
import ReportManagementPage from './Features Admin/report management/ReportManagementPage'
export function App() {
  const [activeTab, setActiveTab] = useState<string>('User Management');

  const renderPage = () => {
    if (activeTab.startsWith('User')) {
      return <UserManagementPage onTabChange={setActiveTab} />;
    }
    if (activeTab.startsWith('Course')) {
      return <CourseManagementPage onTabChange={setActiveTab} />;
    }
    if (activeTab.startsWith('Audit')) {
      return <AuditLogsPage onTabChange={setActiveTab} />;
    }
    if (activeTab.startsWith('Report')) {
      return <ReportManagementPage onTabChange={setActiveTab} />;
    }
    return null;
  };

  return (
    <>
      {renderPage()}
    </>
  );
}

export default App;
