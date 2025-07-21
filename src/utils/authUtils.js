import {useDispatch} from 'react-redux';
import {logoutUser} from '../redux/Slices/authSlice';
import {CommonActions} from '@react-navigation/native';
import {SCREENS} from '../Constants/Screens';
import {removeToken} from './tokenStorage';

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = (navigation = null) => {
    dispatch(logoutUser());
    removeToken();

    if (navigation) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: SCREENS.WELCOME}],
        }),
      );
    }
  };

  return logout;
};

export const useLogoutWithCallback = () => {
  const dispatch = useDispatch();

  const logout = (navigation = null, callback = null) => {
    dispatch(logoutUser());
    removeToken();

    if (navigation) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: SCREENS.WELCOME}],
        }),
      );
    }

    if (callback) {
      setTimeout(callback, 100);
    }
  };

  return logout;
};

export const useSimpleLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
    removeToken();
  };

  return logout;
};

export const useAuthNavigation = () => {
  const navigateToLogin = navigation => {
    if (navigation) {
      navigation.navigate(SCREENS.LOGIN);
    }
  };

  const navigateToWelcome = navigation => {
    if (navigation) {
      navigation.navigate(SCREENS.WELCOME);
    }
  };

  return {
    navigateToLogin,
    navigateToWelcome,
  };
};

export const useAuthBackHandler = () => {
  const handleBackPress = () => {
    return true;
  };

  return handleBackPress;
};

export const clearUserSession = () => {
  console.log('User session cleared');
};
