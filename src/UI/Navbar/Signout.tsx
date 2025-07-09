import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateGithubTokenInDatabase } from "@/app/utils/helpers.util";
interface AlertDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, setOpen }) => {
    const router = useRouter();
    const handleClose = () => {
        setOpen(false);
    };

    const handleSignout = async () => {
        setOpen(false);
        //await signOut();
        // await updateGithubTokenInDatabase("");
        // document.cookie =
        //     "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        // document.cookie =
        //     "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        router.push("/cross-signout");
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="w-full"
            >
                <div className="flex justify-between items-center px-5 py-5">
                    <p className="font-normal text-[#202020] text-base pr-40">
                        {"Are you sure you want to sign out?"}
                    </p>
                    <CloseIcon
                        onClick={handleClose}
                        fontSize="small"
                        htmlColor="#727271"
                        className="cursor-pointer hover:text-gray-300"
                    />
                </div>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        className="text-gray-800 font-semibold"
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleSignout}
                        autoFocus
                        className="text-[#5c6ae4] font-semibold"
                    >
                        Yes, Sign Out
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AlertDialog;
