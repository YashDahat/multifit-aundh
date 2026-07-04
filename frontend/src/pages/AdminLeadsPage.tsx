import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTrialLeads } from '../hooks/useTrialLeads';

const AdminLeadsPage: React.FC = () => {
  const { data: leads, isLoading, isError } = useTrialLeads();

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Trial Leads</h1>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading trial leads...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg">Error loading trial leads. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && (!leads || leads.length === 0) && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No trial leads found.</p>
            </div>
          )}

          {!isLoading && !isError && leads && leads.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
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
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership Interest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {lead.membershipInterest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {new Date(lead.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminLeadsPage;