import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { useTrialLeads } from '../hooks/useTrialLeads';
import { TrialLead } from '../types/trial';

export const AdminLeadsPage = (): JSX.Element => {
  const { data: leads, isLoading, isError } = useTrialLeads();

  // Sort leads by submittedAt in descending order (most recent first)
  const sortedLeads = React.useMemo(() => {
    if (!leads) return [];
    return [...leads].sort((a, b) => {
      // Assuming submittedAt is an ISO string or comparable date format
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [leads]);

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Trial Leads</h1>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Loading leads...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg">Error loading leads. Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && (!sortedLeads || sortedLeads.length === 0) && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">No trial leads found.</p>
            </div>
          )}

          {!isLoading && !isError && sortedLeads && sortedLeads.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100 p-6">
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
                  {sortedLeads.map((lead: TrialLead) => (
                    <tr key={lead.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.membershipInterest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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