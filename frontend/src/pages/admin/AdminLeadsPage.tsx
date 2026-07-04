import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminLeads } from '../hooks/useLeads';

// Define the expected structure of a TrialLeadDto based on the instruction
interface TrialLeadDto {
  id: string; // Assuming an ID for unique keys in the list
  name: string;
  email: string;
  phoneNumber: string;
  submissionDate: string; // Assuming an ISO string or similar date format
}

const AdminLeadsPage: React.FC = () => {
  const { data: leads, isLoading, isError, error } = useAdminLeads();

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Trial Leads</h1>

      {isLoading && (
        <div className="text-gray-700 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          Loading trial leads...
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          Error loading trial leads: {error?.message || 'Unknown error'}
        </div>
      )}

      {!isLoading && !isError && (!leads || leads.length === 0) && (
        <div className="text-gray-700 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          No trial leads found.
        </div>
      )}

      {!isLoading && !isError && leads && leads.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(lead.submissionDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLeadsPage;