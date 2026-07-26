import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrainerDto } from "@/types/content";
import { PencilIcon, Trash2Icon } from "lucide-react";

interface TrainerTableProps {
  trainers: TrainerDto[];
  onEdit: (trainer: TrainerDto) => void;
  onDelete: (trainerId: string) => void;
}

export function TrainerTable({ trainers, onEdit, onDelete }: TrainerTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No trainers found.
              </TableCell>
            </TableRow>
          ) : (
            trainers.map((trainer) => (
              <TableRow key={trainer.id}>
                <TableCell className="font-medium">{trainer.name}</TableCell>
                <TableCell>{trainer.specialization}</TableCell>
                <TableCell className="max-w-xs truncate">{trainer.bio}</TableCell>
                <TableCell className="max-w-xs truncate">{trainer.imageUrl}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(trainer)}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => trainer.id && onDelete(trainer.id)}
                      className="hover:opacity-90 transition-all duration-200"
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}