import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TbDots } from "react-icons/tb";
import { HospitalClinicTableModel } from "./columns";
import AddOrEditEmployeeDialog from "../add-or-edit-dialog/add-or-edit-dialog";
import DeleteHospitalClinicDialog from "../delete-dialog/delete-dialog";

interface ActionsTableCellProps {
  hospitalClinic: HospitalClinicTableModel;
}

const ActionsTableCell: React.FC<ActionsTableCellProps> = ({ hospitalClinic }) => {
  const [removeBookDialog, setRemoveBookDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRemoveBookDialog(true)}>
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* delete book dialog */}
      {removeBookDialog && (
        <DeleteHospitalClinicDialog
          isOpen={removeBookDialog}
          setIsOpen={setRemoveBookDialog}
          hospitalClinic={hospitalClinic}
        />
      )}
    </>
  );
};

export default ActionsTableCell;
