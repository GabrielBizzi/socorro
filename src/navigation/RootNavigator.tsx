import 'react-native-gesture-handler';
import React, { memo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './interfaces';
import {
  HomeScreen,
  CameraScreen,
  ProductWithoutSuggestions,
  AddressWithoutSuggestions,
  AddressWithSuggestions,
  ProductWithSuggestion,
} from 'features/storage/screens';

import Connection from 'components/Connection';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const deepLinking = {
    prefixes: ['pdastorage://'],
    config: {
      screens: {
        HomeScreen: ':token',
      },
    },
  };

  return (
    <NavigationContainer linking={deepLinking}>
      <Stack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: '#312e38',
          },
        }}
        initialRouteName="HomeScreen">
        <Stack.Screen
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
          name="HomeScreen"
        />
        <Stack.Screen
          component={CameraScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Câmera',
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'RobotoSlab-Medium',
            },
            headerTintColor: '#999591',
            headerStyle: {
              backgroundColor: '#312e38',
              elevation: 0,
            },
          }}
          name="CameraScreen"
        />
        <Stack.Screen
          component={ProductWithoutSuggestions}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Produto',
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'RobotoSlab-Medium',
            },
            headerTintColor: '#999591',
            headerStyle: {
              backgroundColor: '#312e38',
              elevation: 0,
            },
            headerRight: () => <Connection />,
          }}
          name="ProductWithoutSuggestions"
        />
        <Stack.Screen
          component={ProductWithSuggestion}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Produto',
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'RobotoSlab-Medium',
            },
            headerTintColor: '#999591',
            headerStyle: {
              backgroundColor: '#312e38',
              elevation: 0,
            },
          }}
          name="ProductWithSuggestion"
        />
        <Stack.Screen
          component={AddressWithoutSuggestions}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Endereço',
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'RobotoSlab-Medium',
            },
            headerTintColor: '#999591',
            headerStyle: {
              backgroundColor: '#312e38',
              elevation: 0,
            },
          }}
          name="AddressWithoutSuggestions"
        />
        <Stack.Screen
          component={AddressWithSuggestions}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Endereço',
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'RobotoSlab-Medium',
            },
            headerTintColor: '#999591',
            headerStyle: {
              backgroundColor: '#312e38',
              elevation: 0,
            },
          }}
          name="AddressWithSuggestions"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(RootNavigator);
