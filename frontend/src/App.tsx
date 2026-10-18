import { useState } from 'react';
import UserManagementPage from './Features Admin/user management';
import CourseManagementPage from './Features Admin/course management';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('Course Manager');

  const isCourseTab = activeTab.startsWith('Course');

  return (
    <>
      {isCourseTab ? (
        <CourseManagementPage onTabChange={setActiveTab} />
      ) : (
        <UserManagementPage onTabChange={setActiveTab} />
      )}
    </>
  );
}

export default App;
