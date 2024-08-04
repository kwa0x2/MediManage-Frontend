// import { removeMyBook } from "@/app/_api/services/readingService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EventEmitter from "events";
import { toast } from "sonner";
import { EmployeeTableModel } from "../table/columns";
import { deleteEmployees } from "@/app/api/services/employee.Service";
import axios from "axios";

export const deleteEmployeeEmitter = new EventEmitter();

interface DeleteEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employee: EmployeeTableModel;
}

const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({
  isOpen,
  setIsOpen,
  employee,
}) => {
  const deleteEmployee = async (employee_id: number) => {
    try {
      const res = await deleteEmployees(employee_id);
      if (res.status == 200) {
        deleteEmployeeEmitter.emit("updateGrid");
        toast.success("Personel başarıyla silindi!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`deleteEmployee try&catch hata -> ${error}`);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {employee.employee_name} {employee.employee_surname} adlı personeli
            silmek istediğinize emin misiniz?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            onClick={() => deleteEmployee(employee.employee_id)}
          >
            Kaldır
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEmployeeDialog;
