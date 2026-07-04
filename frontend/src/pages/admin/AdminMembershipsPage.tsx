import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useMembershipPlans } from '../../hooks/useMemberships';
import type { MembershipPlan } from '../../types/membership';

const AdminMembershipsPage: React.FC = () => {
  const { data: membershipPlans, isLoading, isError, error } = useMembershipPlans();

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Manage Membership Plans</h1>

      <div className="mb-6">
        <button className="bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200">
          Add New Plan
        </button>
      </div>

      {isLoading && (
        <div className="text-gray-700">Loading membership plans...</div>
      )}

      {isError && (
        <div className="text-red-600">Error loading membership plans: {error?.message}</div>
      )}

      {!isLoading && !isError && (!membershipPlans || membershipPlans.length === 0) && (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700">
          <p className="text-lg font-semibold mb-2">No membership plans found.</p>
          <p>Click "Add New Plan" to create your first membership plan.</p>
        </div>
      )}

      {!isLoading && !isError && membershipPlans && membershipPlans.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {membershipPlans.map((plan: MembershipPlan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {plan.durationMonths} months
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{plan.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {plan.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#DFFF00] hover:text-[#333333] transition-colors duration-200 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                      Delete
                    </button>
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

export default AdminMembershipsPage;