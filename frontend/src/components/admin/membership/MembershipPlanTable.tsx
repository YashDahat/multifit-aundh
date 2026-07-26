import { useState } from 'react';
import { MembershipPlanDto } from '@/types/membership';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MembershipPlanTableProps {
  plans: MembershipPlanDto[];
  onEdit: (plan: MembershipPlanDto) => void;
  onDelete: (planId: string) => void;
}

export function MembershipPlanTable({ plans, onEdit, onDelete }: MembershipPlanTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof MembershipPlanDto; direction: 'ascending' | 'descending' } | null>(null);

  const filteredPlans = plans.filter(plan =>
    plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
    if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'ascending' ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1);
    }
    return 0;
  });

  const requestSort = (key: keyof MembershipPlanDto) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof MembershipPlanDto) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search plans..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                Name {getSortIndicator('name')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('description')}>
                Description {getSortIndicator('description')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('price')}>
                Price {getSortIndicator('price')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('durationInMonths')}>
                Duration (Months) {getSortIndicator('durationInMonths')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('isActive')}>
                Active {getSortIndicator('isActive')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No membership plans found.
                </TableCell>
              </TableRow>
            ) : (
              sortedPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell>${plan.price?.toFixed(2)}</TableCell>
                  <TableCell>{plan.durationInMonths}</TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? 'default' : 'destructive'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(plan)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => plan.id && onDelete(plan.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}