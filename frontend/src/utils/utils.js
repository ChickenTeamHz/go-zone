import { useCallback } from "react";

export function useBodyScroll(){
  const showScroll = useCallback(()=> {
    document.body.style.overflowY = 'scroll';
  },[]);
  const hideScroll = useCallback(()=> {
    document.body.style.overflowY = 'hidden';
  },[]);
  return {
    showScroll,
    hideScroll,
  }
}
