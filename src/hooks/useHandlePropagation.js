import { useCallback } from "react";

const useHandlePropagation = () => {
  const handleClose = useCallback((reference, setClose, callbackFunc) => {
    function handleClickOutside(event) {
      if (reference.current && !reference.current.contains(event.target)) {
        setClose(false);
        callbackFunc && callbackFunc();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return handleClose;
};

export default useHandlePropagation;
