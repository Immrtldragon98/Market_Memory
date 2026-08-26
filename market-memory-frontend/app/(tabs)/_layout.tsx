import { Tabs } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function TabLayout() {
  const colors = Colors.dark;
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
    }}>
      <Tabs.Screen name="discovery" options={{ title: 'Market Memory' }} />
      <Tabs.Screen name="theses" options={{ title: 'Theses' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
