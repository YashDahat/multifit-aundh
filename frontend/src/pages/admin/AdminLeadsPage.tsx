import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { leadService } from '@/services/leadService';
import { TrialLead } from '@/types/lead';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';

const AdminLeadsPage: React.FC = () => {
  const { data: leads, isLoading, isError, error } = useQuery<TrialLead[]>({
    queryKey: ['adminLeads'],
    queryFn: leadService.getAllTrialLeads,
  });

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Manage Trial Leads</h1>

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            )}

            {isError && (
              <div className="text-red-500 text-center py-10">
                Error loading leads: {error?.message || 'An unknown error occurred.'}
              </div>
            )}

            {!isLoading && !isError && (!leads || leads.length === 0) && (
              <div className="text-center py-10 text-gray-600">
                <p>No trial leads found.</p>
              </div>
            )}

            {!isLoading && !isError && leads && leads.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#333333] text-[#F5F5F5]">
                    <TableRow>
                      <TableHead className="text-[#F5F5F5]">Name</TableHead>
                      <TableHead className="text-[#F5F5F5]">Email</TableHead>
                      <TableHead className="text-[#F5F5F5]">Phone</TableHead>
                      <TableHead className="text-[#F5F5F5]">Submission Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{format(new Date(lead.submissionDate), 'PPP p')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminLeadsPage;