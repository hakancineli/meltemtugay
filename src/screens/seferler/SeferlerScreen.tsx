import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useUetds } from '../../contexts/UetdsContext';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Sefer, SeferDurum } from '../../types';

interface SeferCardProps {
  sefer: Sefer;
  onPress: (sefer: Sefer) => void;
}

const SeferCard: React.FC<SeferCardProps> = ({ sefer, onPress }) => {
  const theme = useTheme();
  
  const getDurumColor = (durum: SeferDurum) => {
    switch (durum) {
      case SeferDurum.AKTIF:
        return '#4CAF50';
      case SeferDurum.TAMAMLANDI:
        return '#2196F3';
      case SeferDurum.IPTAL:
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getDurumText = (durum: SeferDurum) => {
    switch (durum) {
      case SeferDurum.AKTIF:
        return 'Aktif';
      case SeferDurum.TAMAMLANDI:
        return 'Tamamlandı';
      case SeferDurum.IPTAL:
        return 'İptal';
      default:
        return 'Bilinmiyor';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.seferCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={() => onPress(sefer)}
    >
      <View style={styles.seferHeader}>
        <View style={styles.seferInfo}>
          <Text style={[styles.seferPlaka, { color: theme.colors.primary }]}>
            {sefer.aracPlaka}
          </Text>
          <Text style={[styles.seferTarih, { color: theme.colors.text }]}>
            {formatDate(sefer.hareketTarihi)} {sefer.hareketSaati}
          </Text>
        </View>
        <View style={[
          styles.durumBadge,
          { backgroundColor: getDurumColor(sefer.durum) }
        ]}>
          <Text style={styles.durumText}>
            {getDurumText(sefer.durum)}
          </Text>
        </View>
      </View>
      
      <View style={styles.seferDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {sefer.nereden} → {sefer.nereye}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {sefer.surucuAdiSoyadi}
          </Text>
        </View>
        
        {sefer.seferAciklama && (
          <View style={styles.detailRow}>
            <Icon name="info" size={16} color={theme.colors.text} />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              {sefer.seferAciklama}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.seferFooter}>
        <Text style={[styles.yolcuCount, { color: theme.colors.text }]}>
          {sefer.yolcular?.length || 0} Yolcu
        </Text>
        <Icon name="chevron-right" size={20} color={theme.colors.placeholder} />
      </View>
    </TouchableOpacity>
  );
};

const SeferlerScreen: React.FC = ({ navigation }: any) => {
  const { 
    seferler, 
    isLoading, 
    loadSeferler,
    seferIptal
  } = useUetds();
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<SeferDurum | 'hepsi'>('hepsi');
  
  const theme = useTheme();

  useEffect(() => {
    loadSeferler();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSeferler();
    setRefreshing(false);
  };

  const handleSeferPress = (sefer: Sefer) => {
    navigation.navigate('SeferDetay', { seferId: sefer.id });
  };

  const handleYeniSefer = () => {
    navigation.navigate('SeferDetay', { mode: 'new' });
  };

  const handleSeferIptal = (sefer: Sefer) => {
    Alert.alert(
      'Seferi İptal Et',
      `${sefer.aracPlaka} plakalı seferi iptal etmek istediğinize emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            if (sefer.uetdsSeferReferansNo) {
              const result = await seferIptal(
                sefer.uetdsSeferReferansNo,
                'Mobil uygulama üzerinden iptal edildi'
              );
              
              if (result.sonucKodu === 0) {
                Alert.alert('Başarılı', 'Sefer başarıyla iptal edildi');
                await loadSeferler();
              } else {
                Alert.alert('Hata', result.sonucMesaji);
              }
            }
          },
        },
      ]
    );
  };

  const filteredSeferler = filter === 'hepsi' 
    ? seferler 
    : seferler.filter(sefer => sefer.durum === filter);

  const getFilterCount = (durum: SeferDurum | 'hepsi') => {
    if (durum === 'hepsi') return seferler.length;
    return seferler.filter(sefer => sefer.durum === durum).length;
  };

  const FilterButton: React.FC<{ 
    title: string; 
    value: SeferDurum | 'hepsi'; 
    isActive: boolean; 
    onPress: () => void; 
  }> = ({ title, value, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.outline,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterButtonText,
        { color: isActive ? 'white' : theme.colors.text }
      ]}>
        {title} ({getFilterCount(value)})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        <FilterButton
          title="Hepsi"
          value="hepsi"
          isActive={filter === 'hepsi'}
          onPress={() => setFilter('hepsi')}
        />
        <FilterButton
          title="Aktif"
          value={SeferDurum.AKTIF}
          isActive={filter === SeferDurum.AKTIF}
          onPress={() => setFilter(SeferDurum.AKTIF)}
        />
        <FilterButton
          title="Tamamlandı"
          value={SeferDurum.TAMAMLANDI}
          isActive={filter === SeferDurum.TAMAMLANDI}
          onPress={() => setFilter(SeferDurum.TAMAMLANDI)}
        />
        <FilterButton
          title="İptal"
          value={SeferDurum.IPTAL}
          isActive={filter === SeferDurum.IPTAL}
          onPress={() => setFilter(SeferDurum.IPTAL)}
        />
      </View>

      <FlatList
        data={filteredSeferler}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SeferCard
            sefer={item}
            onPress={handleSeferPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon 
              name="directions-bus" 
              size={64} 
              color={theme.colors.placeholder} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              Sefer bulunamadı
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleYeniSefer}
            >
              <Text style={styles.emptyButtonText}>Yeni Sefer Oluştur</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    padding: 10,
  },
  seferCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  seferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  seferInfo: {
    flex: 1,
  },
  seferPlaka: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  seferTarih: {
    fontSize: 14,
  },
  durumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durumText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seferDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  seferFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yolcuCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SeferlerScreen;