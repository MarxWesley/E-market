// screens/AccountScreen.jsx
import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Alert, Switch, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { logout } from '../store/features/authSlice';
import DialogComponent from '../components/ui/DialogComponent';
import userService from '../services/userService';

const getInitials = (name) =>
  (name || 'U')
    .trim()
    .split(/\s+/)
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function AccountScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Redux primeiro
  const authUser = useSelector((s) => s.auth.user);

  const [user, setUser] = useState(authUser || null);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ listings: 0, sold: 0, favorites: 0 });
  const [dialogVisible, setDialogVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          // tema salvo
          const theme = await AsyncStorage.getItem('@theme');
          setDarkMode(theme === 'dark');

          // 1) Redux
          if (authUser?.email) {
            setUser(authUser);
          } else {
            // 2) AsyncStorage
            const raw = await AsyncStorage.getItem('@user');
            if (raw) {
              const stored = JSON.parse(raw);
              setUser(stored);
            } else {
              // 3) API (fallback)
              const profile = await userService?.getProfile?.();
              setUser(profile || { name: 'Usuário', email: 'email@exemplo.com' });
            }
          }

          // estatísticas (se existir no back)
          const myStats = await userService?.getStats?.();
          if (myStats) setStats(myStats);
        } catch (e) {
          console.log('Erro ao carregar perfil:', e);
        }
      };
      load();
    }, [authUser])
  );

  const onToggleTheme = async (value) => {
    try {
      setDarkMode(value);
      await AsyncStorage.setItem('@theme', value ? 'dark' : 'light');
    } catch (e) {
      console.log('Erro ao salvar tema:', e);
    }
  };

  const handleConfirmLogout = async () => {
    dispatch(logout());
    setDialogVisible(false);
    
  };

  const menu = [
    { key: 'myClassifieds', icon: 'pricetags-outline', label: 'Meus classificados', onPress: () => navigation.navigate('MyClassifieds') },
    { key: 'favorites', icon: 'heart-outline', label: 'Favoritos', onPress: () => navigation.navigate('FavoriteScreen') },
    { key: 'edit', icon: 'person-outline', label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile') },
    { key: 'address', icon: 'home-outline', label: 'Endereços', onPress: () => navigation.navigate('Addresses') },
  
  ];

  return (
    <SafeAreaView style={[styles.container, darkMode && { backgroundColor: '#0B1220' }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={[styles.header, darkMode && { backgroundColor: '#111827', borderColor: '#1F2937' }]}>
          <View style={styles.avatarWrap}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitials}>{getInitials(user?.name)}</Text>
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

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <StatCard label="Anúncios" value={stats.listings} />
          <StatCard label="Vendidos" value={stats.sold} />
          <StatCard label="Favoritos" value={stats.favorites} />
        </View>


        {/* Menu principal */}
        <View style={styles.card}>
          {menu.map((item, index) => (
            <View key={item.key}>
              <TouchableOpacity style={styles.row} onPress={item.onPress}>
                <View style={styles.rowLeft}>
                  <Ionicons name={item.icon} size={22} color="#3B82F6" style={{ marginRight: 12 }} />
                  <Text style={styles.rowText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {index < menu.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER fixo com respeito ao safe area + tab bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setDialogVisible(true)}>
          <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <DialogComponent
        visible={dialogVisible}
        icon="account-remove"
        title="Deseja realmente sair?"
        onConfirm={handleConfirmLogout}
        onDismiss={() => setDialogVisible(false)}
        textConfirm="Sim"
        textCancel="Cancelar"
      />
    </SafeAreaView>
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { padding: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 14, padding: 14, marginBottom: 12,
  },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: { backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#1D4ED8', fontWeight: '700', fontSize: 18 },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB',
  },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  row: { paddingVertical: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 15, color: '#111827' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 14 },

  switchRow: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchText: { fontSize: 15, color: '#111827' },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16, backgroundColor: 'transparent',
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
