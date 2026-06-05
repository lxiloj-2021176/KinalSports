// client-user/src/navigation/MainTabs.jsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../shared/constants/theme.js';

// Fields screens
import FieldsList from '../features/fields/screens/FieldsList.jsx';
import FieldDetail from '../features/fields/screens/FieldDetail.jsx';
import CreateReservation from '../features/fields/screens/CreateReservation.jsx';

// Teams screens
import TeamsList from '../features/teams/screens/TeamsList.jsx';
import TeamDetail from '../features/teams/screens/TeamDetail.jsx';
import MyTeams from '../features/teams/screens/MyTeams.jsx';
import CreateTeam from '../features/teams/screens/CreateTeam.jsx';

// Tournaments screens
import TournamentsList from '../features/tournaments/screens/TournamentsList.jsx';
import TournamentDetail from '../features/tournaments/screens/TournamentDetail.jsx';
import MyTournaments from '../features/tournaments/screens/MyTournaments.jsx';

// Reservations screens
import ReservationsList from '../features/reservations/screens/ReservationsList.jsx';

// Profile screen
import ProfileScreen from '../features/profile/screens/ProfileScreen.jsx';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Fields Stack
const FieldsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FieldsList" component={FieldsList} />
      <Stack.Screen name="FieldDetail" component={FieldDetail} />
      <Stack.Screen name="CreateReservationField" component={CreateReservation} />
    </Stack.Navigator>
  );
};

// Teams Stack
const TeamsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeamsList" component={TeamsList} />
      <Stack.Screen name="TeamDetail" component={TeamDetail} />
      <Stack.Screen name="MyTeams" component={MyTeams} />
      <Stack.Screen name="CreateTeam" component={CreateTeam} />
    </Stack.Navigator>
  );
};

// Tournaments Stack
const TournamentsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TournamentsList" component={TournamentsList} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetail} />
      <Stack.Screen name="MyTournaments" component={MyTournaments} />
    </Stack.Navigator>
  );
};

// Reservations Stack
const ReservationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReservationsList" component={ReservationsList} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'FieldsTab') {
            iconName = 'sports-soccer';
          } else if (route.name === 'TeamsTab') {
            iconName = 'groups';
          } else if (route.name === 'TournamentsTab') {
            iconName = 'emoji-events';
          } else if (route.name === 'ReservationsTab') {
            iconName = 'event';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="FieldsTab" component={FieldsStack} options={{ title: 'Canchas' }} />
      <Tab.Screen name="TeamsTab" component={TeamsStack} options={{ title: 'Equipos' }} />
      <Tab.Screen name="TournamentsTab" component={TournamentsStack} options={{ title: 'Torneos' }} />
      <Tab.Screen name="ReservationsTab" component={ReservationsStack} options={{ title: 'Reservas' }} />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          title: 'Perfil',
          headerShown: true,
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
