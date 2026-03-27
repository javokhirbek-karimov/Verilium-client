import { toast } from "sonner";
import { Messages } from "./config";

export const sweetErrorHandling = async (err: any) => {
  toast.error(err?.message || "Something went wrong");
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  toast.success(msg.replace("Definer: ", ""), {
    duration,
  });
};

export const sweetContactAlert = async (
  msg: string,
  duration: number = 10000,
) => {
  toast(msg, {
    duration,
  });
};

export const sweetConfirmAlert = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(msg, {
      action: {
        label: "Confirm",
        onClick: () => resolve(true),
      },
      cancel: {
        label: "Cancel",
        onClick: () => resolve(false),
      },
      duration: 10000,
    });
  });
};

export const sweetLoginConfirmAlert = (msg: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(msg, {
      action: {
        label: "Login",
        onClick: () => resolve(true),
      },
      cancel: {
        label: "Cancel",
        onClick: () => resolve(false),
      },
    });
  });
};

export const sweetMixinErrorAlert = async (
  msg: string,
  duration: number = 3000,
) => {
  toast.error(msg, { duration });
};

export const sweetMixinSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  toast.success(msg, { duration });
};

export const sweetBasicAlert = async (text: string) => {
  toast(text);
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
  const errorMessage = err?.message ?? Messages.error1;
  toast.error(errorMessage);
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
  enable_forward: boolean = false,
) => {
  toast.success(msg, {
    duration,
    onAutoClose: () => {
      if (enable_forward) {
        window.location.reload();
      }
    },
  });
};
