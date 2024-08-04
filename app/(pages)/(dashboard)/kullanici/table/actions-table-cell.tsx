import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { TbDots } from "react-icons/tb";
import DeleteUserDialog from "../delete-dialog/delete-dialog";
import {  UserTableModel } from "./columns";
import AddOrEditUserDialog from "../add-or-edit-dialog/add-or-edit-dialog";

interface ActionsTableCellProps {
  user: UserTableModel;
}

const ActionsTableCell: React.FC<ActionsTableCellProps> = ({ user }) => {
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
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
          <DropdownMenuItem onClick={() => setOpenUserDialog(true)}>
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteUserDialog(true)}>
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openUserDialog && (
        <AddOrEditUserDialog
          isOpen={openUserDialog}
          setIsOpen={setOpenUserDialog}
          user={user}
        />
      )}

      {deleteUserDialog && (
        <DeleteUserDialog
          isOpen={deleteUserDialog}
          setIsOpen={setDeleteUserDialog}
          user={user}
        />
      )}
    </>
  );
};

export default ActionsTableCell;
