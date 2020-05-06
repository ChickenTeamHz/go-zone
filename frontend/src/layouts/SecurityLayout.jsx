import React, { useState, useEffect} from 'react';
import { Redirect } from 'umi';
import { stringify } from 'qs';
import { useDva } from 'utils/hooks';
import { getToken } from '../utils/authToken';
import Loading from '../components/Loading';

export default function(props) {
  const [isReady, setIsReady] = useState(false);
  const { dispatch, loadings: { loading }, data: { user: { currentUser } } } = useDva({ loading: 'user/fetchProfile' },['user']);
  useEffect(()=> {
    function fetchCurrent() {
      dispatch({
        type: 'user/fetchProfile',
      });
    }
    setIsReady(true);
    if(getToken()){
      fetchCurrent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const { children } = props;

  const isLogin = currentUser && currentUser.id;
  const queryString = stringify({
    redirect: window.location.href,
  });
  if(!getToken() && window.location.pathname !== '/user/login') {
    return <Redirect to={`/user/login?${queryString}`} />;
  }

  if ((!isLogin && loading) || !isReady) {
    return <Loading />;
  }

  if (!isLogin && window.location.pathname !== '/user/login') {
    return <Redirect to={`/user/login?${queryString}`} />;
  }
  return children;
}

