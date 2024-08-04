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
import { UserTableModel } from "../table/columns";
import axios from "axios";
import { deleteUser } from "@/app/api/services/user.Service";

export const deleteUserEmitter = new EventEmitter();

interface DeleteUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserTableModel;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  setIsOpen,
  user,
}) => {
  const deleteUserById = async (user_id: number) => {
    try {
      const res = await deleteUser(user_id);
      if (res.status == 200) {
        deleteUserEmitter.emit("updateGrid");
        toast.success("Kullanıcı başarıyla silindi!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`deleteUser try&catch hata -> ${error}`);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {user.user_name} {user.user_surname} adlı personeli
            silmek istediğinize emin misiniz?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            onClick={() => deleteUserById(user.user_id)}
          >
            Kaldır
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
