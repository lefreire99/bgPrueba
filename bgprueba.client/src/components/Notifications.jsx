import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (message, flag) => {
  if (flag) {
    toast.success(message, {
      autoClose: false,
    });
  } else {
    toast.success(message);
  }
};

export const notifyError = (message, flag = false) => {  
  if(flag){
    toast.error(message, {
      autoClose: false,
      theme: "colored"
    });
  }else{
    toast.error(message)
  }  
}
