import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, setCredentials, setLoading } from '../../features/auth/authSlice.js';
import { useRefreshTokenSilentMutation } from '../../services/authApi.js';
import { userApi } from '../../services/userApi.js';
import Loader from '../Loader.jsx';

const PersistLogin = ({ children }) => {
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const [refreshSilent] = useRefreshTokenSilentMutation();
  const [triggerGetProfile] = userApi.useLazyGetProfileQuery();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        // Attempt silent refresh using HTTP Only cookie
        const refreshResult = await refreshSilent().unwrap();
        const newAccessToken = refreshResult.accessToken;

        // Fetch User profile to fully reconstruct session
        const profileResult = await triggerGetProfile().unwrap();
        
        if (isMounted) {
          dispatch(
            setCredentials({
              user: profileResult.data.user,
              token: newAccessToken,
            })
          );
        }
      } catch (err) {
        // Silent failure is fine: user is simply anonymous/unauthenticated
        if (isMounted) {
          dispatch(setLoading(false));
        }
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
          dispatch(setLoading(false));
        }
      }
    };

    // Only run verifyRefreshToken if token is missing
    if (!token) {
      verifyRefreshToken();
    } else {
      setIsRefreshing(false);
      dispatch(setLoading(false));
    }

    return () => {
      isMounted = false;
    };
  }, [token, refreshSilent, triggerGetProfile, dispatch]);

  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  return children || <Outlet />;
};

export default PersistLogin;
