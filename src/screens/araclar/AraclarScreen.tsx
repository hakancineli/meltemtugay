import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useUetds } from '../../contexts/UetdsContext';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Arac } from '../../types';

interface AracCardProps {
  arac: Arac;
  onPress: (arac: Arac) => void;
}

const AracCard: React.FC<AracCardProps> = ({ arac, onPress }) => {
  const theme = useTheme();
  
  const getDurumColor = (durum: string) => {
    switch (durum.toLowerCase()) {
      case 'aktif':
        return '#4CAF50';
      case 'bakımda':
        return '#FF9800';
      case 'pasif':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.aracCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={() => onPress(arac)}
    >
      <View style={styles.aracHeader}>
        <View style={styles.aracInfo}>
          <Text style={[styles.aracPlaka, { color: theme.colors.primary }]}>
            {arac.plaka}
          </Text>
          <Text style={[styles.aracMarka, { color: theme.colors.text }]}>
            {arac.marka} {arac.model}
          </Text>
        </View>
        <View style={[
          styles.durumBadge,
          { backgroundColor: getDurumColor(arac.durum) }
        ]}>
          <Text style={styles.durumText}>
            {arac.durum}
          </Text>
        </View>
      </View>
      
      <View style={styles.aracDetails}>
        <View style={styles.detailRow}>
          <Icon name="directions-car" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {arac.tip} - {arac.yas} Yaşında
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="people" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {arac.kapasite} Yolcu
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="badge" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {arac.ruhsatNo}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="event" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            Muayene: {arac.muayeneTarihi}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AraclarScreen: React.FC = ({ navigation }: any) => {
  const { 
    araclar, 
    isLoading, 
    loadAraclar
  } = useUetds();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedDurum, setSelectedDurum] = useState<string | null>(null);
  
  const theme = useTheme();

  useEffect(() => {
    loadAraclar();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAraclar();
    setRefreshing(false);
  };

  const handleAracPress = (arac: Arac) => {
    // Araç detay sayfası henüz oluşturulmadı
    Alert.alert('Araç Bilgileri', `${arac.plaka} plakalı araç`);
  };

  const handleYeniArac = () => {
    // Yeni araç ekleme sayfası henüz oluşturulmadı
    Alert.alert('Yeni Araç', 'Yeni araç ekleme özelliği yakında eklenecek');
  };

  const durumlar = ['Aktif', 'Bakımda', 'Pasif'];
  
  const filteredAraclar = araclar.filter(arac => {
    const matchesSearch = searchText === '' || 
      arac.plaka.toLowerCase().includes(searchText.toLowerCase()) ||
      arac.marka.toLowerCase().includes(searchText.toLowerCase()) ||
      arac.model.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesDurum = !selectedDurum || arac.durum === selectedDurum;
    
    return matchesSearch && matchesDurum;
  });

  const getDurumCount = (durum: string | null) => {
    if (!durum) return araclar.length;
    return araclar.filter(arac => arac.durum === durum).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              color: theme.colors.text
            }
          ]}
          placeholder="Araç ara..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchText}
          onChangeText={setSearchText}
        />
        <Icon name="search" size={20} color={theme.colors.placeholder} style={styles.searchIcon} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: !selectedDurum ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.outline,
            }
          ]}
          onPress={() => setSelectedDurum(null)}
        >
          <Text style={[
            styles.filterButtonText,
            { color: !selectedDurum ? 'white' : theme.colors.text }
          ]}>
            Tümü ({getDurumCount(null)})
          </Text>
        </TouchableOpacity>
        
        {durumlar.map(durum => (
          <TouchableOpacity
            key={durum}
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedDurum === durum ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.outline,
              }
            ]}
            onPress={() => setSelectedDurum(durum)}
          >
            <Text style={[
              styles.filterButtonText,
              { color: selectedDurum === durum ? 'white' : theme.colors.text }
            ]}>
              {durum} ({getDurumCount(durum)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAraclar}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AracCard
            arac={item}
            onPress={handleAracPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon 
              name="directions-car" 
              size={64} 
              color={theme.colors.placeholder} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              {searchText || selectedDurum ? 'Eşleşen araç bulunamadı' : 'Araç bulunamadı'}
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleYeniArac}
            >
              <Text style={styles.emptyButtonText}>Yeni Araç Ekle</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          filteredAraclar.length > 0 ? (
            <Text style={[styles.resultCount, { color: theme.colors.text }]}>
              {filteredAraclar.length} araç bulundu
            </Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingRight: 44,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  aracCard: {
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
  aracHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  aracInfo: {
    flex: 1,
  },
  aracPlaka: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aracMarka: {
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
  aracDetails: {
    marginBottom: 8,
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

export default AraclarScreen;