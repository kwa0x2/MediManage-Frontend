import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TbDots } from "react-icons/tb";
import DeleteMyBookDialog from "../delete-dialog/delete-dialog";
// import EditMyBookDialog from "../edit-dialog/edit-dialog";
import { EmployeeTableModel } from "./columns";
import AddOrEditEmployeeDialog from "../add-or-edit-dialog/add-or-edit-dialog";

interface ActionsTableCellProps {
  employee: EmployeeTableModel;
}

const ActionsTableCell: React.FC<ActionsTableCellProps> = ({ employee }) => {
  const [removeBookDialog, setRemoveBookDialog] = useState(false);
  const [openReadingDialog, setOpenReadingDialog] = useState(false);
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
          <DropdownMenuItem onClick={() => setOpenReadingDialog(true)}>
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRemoveBookDialog(true)}>
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit reading dialog */}
      {openReadingDialog && (
        <AddOrEditEmployeeDialog
          isOpen={openReadingDialog}
          setIsOpen={setOpenReadingDialog}
          employee={employee}
        />
      )}

      {/* delete book dialog */}
      {removeBookDialog && (
        <DeleteMyBookDialog
          isOpen={removeBookDialog}
          setIsOpen={setRemoveBookDialog}
          employee={employee}
        />
      )}
    </>
  );
};

export default ActionsTableCell;
