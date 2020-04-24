
import { useCallback, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'dva';

/**
 * 控制body滚动是否可见 hook
 */
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

/**
 * 自定义dva hook
 * @param {Object} loadingPaths {loading: path}
 * @param { Array } user ["model"]
 */
export function useDva(loadingPaths = {}, users = []){
  const dispatch = useDispatch();
  const loadingEffect = useSelector(state => state.loading);
  const loadings = {};
  const data = useSelector(state => {
    const obj = {};
    users.forEach(m => {
      obj[m] = state[m];
    });
    return obj;
  })
  if(loadingPaths instanceof Object) {
    Object.keys(loadingPaths).forEach(key => {
      loadings[key] = loadingEffect.effects[loadingPaths[key]]
    })
  }
  return {
    dispatch,
    loadings,
    data,
  }
}

/**
 * 自定义modal hook
 */
export function useModal(){
  const [visible, setVisible] = useState(false);
  const hideModal = useCallback(()=> {
    setVisible(false);
  },[]);
  const showModal = useCallback(()=> {
    setVisible(true);
  },[]);
  return {
    hideModal,
    showModal,
    visible,
    modalProps: {
      visible,
      onCancel:hideModal,
      maskClosable: false,
      okText: '确认',
      cancelText: '取消',
      destroyOnClose: true,
      centered: true,
    },
  }
}

/**
 * reset form fields when modal is form, closed
 * @param {*} param0
 */
export function useResetFormOnCloseModal({ form, visible }){
  const prevVisibleRef = useRef();

  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);

  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
};
