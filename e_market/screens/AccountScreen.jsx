// screens/AccountScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Switch, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Serviços (ajuste os paths se necessário)
import authService from '../services/authService';
import userService from '../services/userService';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ listings: 0, sold: 0, favorites: 0 });

  // Carrega preferências e dados do usuário ao focar na tela
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const theme = await AsyncStorage.getItem('@theme');
          setDarkMode(theme === 'dark');

          // Buscar perfil
          // Esperado: userService.getProfile() -> { name, email, avatarUrl }
          const profile = await userService?.getProfile?.();
          setUser(profile || { name: 'Usuário', email: 'email@exemplo.com' });

          // Estatísticas (opcional)
          // Ajuste para o que existir no seu back/productService
          const myStats = await userService?.getStats?.();
          if (myStats) setStats(myStats);
        } catch (e) {
          console.log('Erro ao carregar perfil:', e);
        }
      };
      load();
    }, [])
  );

  const onToggleTheme = async (value) => {
    try {
      setDarkMode(value);
      await AsyncStorage.setItem('@theme', value ? 'dark' : 'light');
      // Aqui você pode disparar um contexto/Redux para aplicar tema global
    } catch (e) {
      console.log('Erro ao salvar tema:', e);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            // Se existir endpoint de logout, chame:
            if (authService?.logout) await authService.logout();

            // Limpa tokens/sessão
            await AsyncStorage.multiRemove(['@token', '@refreshToken', '@user']);

            // Reseta a navegação para a tela de Login
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (e) {
            console.log('Erro no logout:', e);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        },
      },
    ]);
  };

  // Itens da lista de ações
  const menu = [
    { key: 'myClassifieds', icon: 'pricetags-outline', label: 'Meus classificados', onPress: () => navigation.navigate('MyClassifieds') },
    { key: 'sell',         icon: 'add-circle-outline', label: 'Vender um item',     onPress: () => navigation.navigate('Sell') },
    { key: 'favorites',    icon: 'heart-outline',      label: 'Favoritos',          onPress: () => navigation.navigate('Favorites') },
    { key: 'edit',         icon: 'person-outline',     label: 'Editar perfil',      onPress: () => navigation.navigate('EditProfile') },
    { key: 'address',      icon: 'home-outline',       label: 'Endereços',          onPress: () => navigation.navigate('Addresses') },
    { key: 'notifications',icon: 'notifications-outline', label: 'Notificações',   onPress: () => navigation.navigate('Notifications') },
    { key: 'help',         icon: 'chatbubbles-outline',label: 'Ajuda e suporte',    onPress: () => navigation.navigate('Message') },
    { key: 'about',        icon: 'information-circle-outline', label: 'Sobre o E-market', onPress: () => Alert.alert('Sobre', 'E-market v1.0') },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={item.onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={item.icon} size={22} color="#3B82F6" style={{ marginRight: 12 }} />
        <Text style={styles.rowText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#0B1220' }]}>
      {/* Cabeçalho */}
      <View style={[styles.header, darkMode && { backgroundColor: '#111827', borderColor: '#1F2937' }]}>
        <View style={styles.avatarWrap}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>
                {user?.name ? user.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, darkMode && { color: '#F9FAFB' }]} numberOfLines={1}>
            {user?.name || 'Usuário'}
          </Text>
          <Text style={[styles.email, darkMode && { color: '#9CA3AF' }]} numberOfLines={1}>
            {user?.email || 'email@exemplo.com'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Estatísticas (opcional) */}
      <View style={styles.statsRow}>
        <StatCard label="Anúncios" value={stats.listings} />
        <StatCard label="Vendidos" value={stats.sold} />
        <StatCard label="Favoritos" value={stats.favorites} />
      </View>

      {/* Preferências rápidas */}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="moon-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.switchText}>Tema escuro</Text>
          </View>
          <Switch value={darkMode} onValueChange={onToggleTheme} />
        </View>
      </View>

      {/* Menu principal */}
      <View style={styles.card}>
        <FlatList
          data={menu}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* Botão Sair */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value ?? 0}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: { backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#1D4ED8', fontWeight: '700', fontSize: 18 },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  row: { paddingVertical: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 15, color: '#111827' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 14 },

  switchRow: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchText: { fontSize: 15, color: '#111827' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 'auto',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
