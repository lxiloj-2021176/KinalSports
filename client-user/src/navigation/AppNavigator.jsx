// client-user/src/navigation/AppNavigator.jsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../shared/store/authStore.js';
import { LoadingSpinner } from '../shared/components/common/Common.jsx';
import AuthStack from './AuthStack.jsx';
import MainTabs from './MainTabs.jsx';

const AppNavigator = () => {
  const { _hasHydrated, isAuthenticated } = useAuthStore();

  if (!_hasHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
