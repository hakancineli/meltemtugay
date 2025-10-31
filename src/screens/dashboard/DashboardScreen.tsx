import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUetds } from '../../contexts/UetdsContext';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.statCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          borderLeftColor: color,
          borderLeftWidth: 4
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statInfo}>
          <Text style={[styles.statTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {value}
          </Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </View>
    </TouchableOpacity>
  );
};

const DashboardScreen: React.FC = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { 
    seferler, 
    yolcular, 
    personeller, 
    gruplar, 
    araclar,
    isLoading,
    isSyncing,
    loadSeferler,
    loadYolcular,
    loadPersoneller,
    loadGruplar,
    loadAraclar,
    syncWithServer,
    testConnection
  } = useUetds();
  
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const theme = useTheme();

  useEffect(() => {
    loadData();
    checkConnection();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadSeferler(),
        loadYolcular(),
        loadPersoneller(),
        loadGruplar(),
        loadAraclar()
      ]);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    }
  };

  const checkConnection = async () => {
    setConnectionStatus('checking');
    const isConnected = await testConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await checkConnection();
    setRefreshing(false);
  };

  const handleSync = async () => {
    await syncWithServer();
    await loadData();
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4CAF50';
      case 'disconnected':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Bağlı';
      case 'disconnected':
        return 'Bağlantı Yok';
      default:
        return 'Kontrol Ediliyor...';
    }
  };

  const activeSeferler = seferler.filter(sefer => sefer.durum === 'aktif').length;
  const todaySeferler = seferler.filter(sefer => {
    const today = new Date().toDateString();
    const seferDate = new Date(sefer.hareketTarihi).toDateString();
    return today === seferDate;
  }).length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Hoş Geldiniz,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.primary }]}>
            {user?.name}
          </Text>
          <Text style={[styles.companyName, { color: theme.colors.text }]}>
            {user?.companyName}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.connectionStatus}>
            <Icon 
              name="wifi" 
              size={16} 
              color={getConnectionColor()} 
            />
            <Text style={[styles.statusText, { color: getConnectionColor() }]}>
              {getConnectionText()}
            </Text>
          </View>
          
          {isSyncing && (
            <View style={styles.syncStatus}>
              <Icon name="sync" size={16} color={theme.colors.primary} />
              <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                Senkronizasyon...
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Aktif Seferler"
          value={activeSeferler}
          icon="directions-bus"
          color="#2196F3"
          onPress={() => navigation.navigate('Seferler')}
        />
        
        <StatCard
          title="Bugünkü Seferler"
          value={todaySeferler}
          icon="today"
          color="#FF9800"
          onPress={() => navigation.navigate('Seferler')}
        />
        
        <StatCard
          title="Toplam Yolcu"
          value={yolcular.length}
          icon="people"
          color="#4CAF50"
          onPress={() => navigation.navigate('Yolcular')}
        />
        
        <StatCard
          title="Personel"
          value={personeller.length}
          icon="person"
          color="#9C27B0"
          onPress={() => navigation.navigate('Personeller')}
        />
        
        <StatCard
          title="Araçlar"
          value={araclar.length}
          icon="directions-car"
          color="#F44336"
          onPress={() => navigation.navigate('Araclar')}
        />
        
        <StatCard
          title="Gruplar"
          value={gruplar.length}
          icon="group"
          color="#00BCD4"
          onPress={() => navigation.navigate('Gruplar')}
        />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => navigation.navigate('SeferDetay', { mode: 'new' })}
        >
          <Icon name="add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Yeni Sefer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              borderWidth: 1
            }
          ]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Icon name="sync" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Senkronize Et
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DashboardScreen;