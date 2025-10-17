import React, { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import '../../admin-dashboard.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  useEffect(() => {
    document.body.classList.add('admin-dashboard-body');
    return () => {
      document.body.classList.remove('admin-dashboard-body');
    };
  }, []);

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;