import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthContext } from '../store/AuthContext';

// Import all Common Screens
import SplashScreen from '../screens/common/SplashScreen';
import OnboardingScreen from '../screens/common/OnboardingScreen';
import RoleSelectionScreen from '../screens/common/RoleSelectionScreen';
import AuthScreen from '../screens/common/AuthScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import QRScanScreen from '../screens/common/QRScanScreen';
import BatchDetailsScreen from '../screens/common/BatchDetailsScreen';

// Import all Role-Specific Screens
import FarmerHomeScreen from '../screens/farmer/FarmerHomeScreen';
import FarmerQRCodesScreen from '../screens/farmer/FarmerQRCodesScreen';
import AddProduceScreen from '../screens/farmer/AddProduceScreen';
import FarmerOrdersScreen from '../screens/farmer/FarmerOrdersScreen';
import AggregatorHomeScreen from '../screens/aggregator/AggregatorHomeScreen';
import AggregatorTransactionsScreen from '../screens/aggregator/AggregatorTransactionsScreen';
import TransporterHomeScreen from '../screens/transporter/TransporterHomeScreen';
import TransporterShipmentsScreen from '../screens/transporter/TransporterShipmentsScreen';
import TransporterDisputesScreen from '../screens/transporter/TransporterDisputesScreen';
import RetailerHomeScreen from '../screens/retailer/RetailerHomeScreen';
import RetailerInventoryScreen from '../screens/retailer/RetailerInventoryScreen';
import ConsumerOrdersScreen from '../screens/consumer/ConsumerOrdersScreen';
import ConsumerSupportFarmerScreen from '../screens/consumer/ConsumerSupportFarmerScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- ROLE-BASED TAB NAVIGATORS ---
// Each of these is a self-contained dashboard with its own tabs.

function FarmerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={FarmerHomeScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} /> }} />
      <Tab.Screen name="QR Codes" component={FarmerQRCodesScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode" color={color} size={size} /> }} />
      <Tab.Screen name="Orders" component={FarmerOrdersScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

function AggregatorTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={AggregatorHomeScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-group" color={color} size={size} /> }} />
      <Tab.Screen name="Scan" component={QRScanScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} /> }} />
      <Tab.Screen name="Transactions" component={AggregatorTransactionsScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

function TransporterTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={TransporterHomeScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="truck-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Scan" component={QRScanScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} /> }} />
            <Tab.Screen name="Shipments" component={TransporterShipmentsScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="truck-delivery-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Disputes" component={TransporterDisputesScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="alert-circle-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} /> }} />
        </Tab.Navigator>
    );
}

function RetailerTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={RetailerHomeScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="store-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Scan" component={QRScanScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} /> }} />
            <Tab.Screen name="Inventory" component={RetailerInventoryScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="package-variant-closed" color={color} size={size} /> }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} /> }} />
        </Tab.Navigator>
    );
}

function ConsumerTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Scan" component={QRScanScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={size} /> }} />
            <Tab.Screen name="My Orders" component={ConsumerOrdersScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="basket-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Support Farmer" component={ConsumerSupportFarmerScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="heart-outline" color={color} size={size} /> }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} /> }} />
        </Tab.Navigator>
    );
}

// This component selects which Tab Navigator to show based on the user's role
const AppTabs = ({ userRole }) => {
    switch (userRole) {
        case 'Farmer':      return <FarmerTabs />;
        case 'Aggregator':  return <AggregatorTabs />;
        case 'Transporter': return <TransporterTabs />;
        case 'Retailer':    return <RetailerTabs />;
        case 'Consumer':    return <ConsumerTabs />;
        default:            return <ConsumerTabs />; // Fallback to a default
    }
}

// --- FINAL ROOT NAVIGATOR ---

export default function AppNavigator() {
  const { isLoading, userToken, userRole, hasOnboarded } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
        ) : userToken == null ? (
          // --- THIS IS THE KEY LOGIC CHANGE ---
          // If the user has NOT onboarded yet, show Onboarding first.
          // Otherwise, go straight to RoleSelection.
          hasOnboarded ? (
            <>
              <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Auth" component={AuthScreen} options={({ route }) => ({ title: `${route.params.role} - Login/Register`, headerShown: true, })} />
            </>
          ) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Auth" component={AuthScreen} options={({ route }) => ({ title: `${route.params.role} - Login/Register`, headerShown: true, })} />
            </>
          )
        ) : (
          // State 3: User is logged in
          <>
            {/* The main screen is the user's tab-based dashboard */}
            <Stack.Screen name="AppTabs" options={{ headerShown: false }}>
              {() => <AppTabs userRole={userRole} />}
            </Stack.Screen>

            {/* Any screen you navigate to from the dashboard lives in the same stack */}
            <Stack.Screen
              name="BatchDetails"
              component={BatchDetailsScreen}
              options={{
                headerShown: true, // This makes the header and back arrow visible
                title: 'Produce Journey'
              }}
            />
            <Stack.Screen 
              name="AddProduce" 
              component={AddProduceScreen} 
              options={{ 
                headerShown: true, // This enables the header and back button
                title: 'Add Produce' 
              }}
            />
            {/* You can add more full-screen pages here, e.g., an "Edit Profile" screen */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}