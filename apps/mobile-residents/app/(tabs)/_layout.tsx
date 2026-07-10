import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    // @ts-expect-error - React 18/19 type collision in Monorepo
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f8fafc',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
        },
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          headerTitle: 'Panel de Residente',
        }}
      />
    </Tabs>
  );
}
