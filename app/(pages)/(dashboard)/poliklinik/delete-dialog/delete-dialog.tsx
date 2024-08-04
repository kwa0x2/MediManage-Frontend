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
import { HospitalClinicTableModel } from "../table/columns";
import axios from "axios";
import { deleteUser } from "@/app/api/services/user.Service";
import { deleteHospitalClinicById } from "@/app/api/services/clinic.Service";

export const deleteClinicEmitter = new EventEmitter();

interface DeleteUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hospitalClinic: HospitalClinicTableModel;
}

const DeleteHospitalClinicDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  setIsOpen,
  hospitalClinic,
}) => {
  const deleteHospitalClinic = async (clinic_name: string) => {
    try {
      const res = await deleteHospitalClinicById(clinic_name);
      if (res.status == 200) {
        deleteClinicEmitter.emit("updateGrid");
        toast.success("Poliklinik başarıyla silindi!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`deleteClinic try&catch hata -> ${error}`);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hospitalClinic.clinic_name} adlı polikliniği hizmetinizden
            silmek istediğinize emin misiniz? bu poliklinikte bulunan personellerde silinecektir
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            onClick={() => deleteHospitalClinic(hospitalClinic.clinic_name)}
          >
            Kaldır
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteHospitalClinicDialog;
