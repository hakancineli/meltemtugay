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
import { Yolcu } from '../../types';

interface YolcuCardProps {
  yolcu: Yolcu;
  onPress: (yolcu: Yolcu) => void;
}

const YolcuCard: React.FC<YolcuCardProps> = ({ yolcu, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.yolcuCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={() => onPress(yolcu)}
    >
      <View style={styles.yolcuHeader}>
        <View style={styles.yolcuInfo}>
          <Text style={[styles.yolcuAdi, { color: theme.colors.primary }]}>
            {yolcu.adi} {yolcu.soyadi}
          </Text>
          <Text style={[styles.yolcuTc, { color: theme.colors.text }]}>
            {yolcu.tcKimlikPasaportNo}
          </Text>
        </View>
        <View style={styles.yolcuActions}>
          {yolcu.koltukNo && (
            <View style={[
              styles.koltukBadge,
              { backgroundColor: theme.colors.primary }
            ]}>
              <Text style={styles.koltukText}>
                {yolcu.koltukNo}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.yolcuDetails}>
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {yolcu.telefonNo || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="public" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {yolcu.uyrukUlke}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {yolcu.cinsiyet === 'E' ? 'Erkek' : 'Kadın'}
          </Text>
        </View>
        
        {yolcu.hesKodu && (
          <View style={styles.detailRow}>
            <Icon name="health-and-safety" size={16} color={theme.colors.text} />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              HES: {yolcu.hesKodu}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const YolcularScreen: React.FC = ({ navigation }: any) => {
  const { 
    yolcular, 
    seferler,
    isLoading, 
    loadYolcular,
    loadSeferler
  } = useUetds();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSefer, setSelectedSefer] = useState<string | null>(null);
  
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadYolcular(),
      loadSeferler()
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleYolcuPress = (yolcu: Yolcu) => {
    navigation.navigate('YolcuDetay', { yolcuId: yolcu.id });
  };

  const handleYeniYolcu = () => {
    navigation.navigate('YolcuDetay', { mode: 'new' });
  };

  const filteredYolcular = yolcular.filter(yolcu => {
    const matchesSearch = searchText === '' || 
      yolcu.adi.toLowerCase().includes(searchText.toLowerCase()) ||
      yolcu.soyadi.toLowerCase().includes(searchText.toLowerCase()) ||
      yolcu.tcKimlikPasaportNo.includes(searchText);
    
    const matchesSefer = !selectedSefer || yolcu.uetdsSeferReferansNo.toString() === selectedSefer;
    
    return matchesSearch && matchesSefer;
  });

  const getSeferPlaka = (seferId: number) => {
    const sefer = seferler.find(s => s.uetdsSeferReferansNo === seferId);
    return sefer ? sefer.aracPlaka : 'Bilinmeyen Sefer';
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
          placeholder="Yolcu ara..."
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
              backgroundColor: !selectedSefer ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.outline,
            }
          ]}
          onPress={() => setSelectedSefer(null)}
        >
          <Text style={[
            styles.filterButtonText,
            { color: !selectedSefer ? 'white' : theme.colors.text }
          ]}>
            Tümü ({yolcular.length})
          </Text>
        </TouchableOpacity>
        
        {seferler.slice(0, 3).map(sefer => (
          <TouchableOpacity
            key={sefer.id}
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedSefer === sefer.uetdsSeferReferansNo?.toString() 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.outline,
              }
            ]}
            onPress={() => setSelectedSefer(sefer.uetdsSeferReferansNo?.toString() || null)}
          >
            <Text style={[
              styles.filterButtonText,
              { 
                color: selectedSefer === sefer.uetdsSeferReferansNo?.toString() 
                  ? 'white' 
                  : theme.colors.text 
              }
            ]}>
              {sefer.aracPlaka}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredYolcular}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <YolcuCard
            yolcu={item}
            onPress={handleYolcuPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon 
              name="people" 
              size={64} 
              color={theme.colors.placeholder} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              {searchText || selectedSefer ? 'Eşleşen yolcu bulunamadı' : 'Yolcu bulunamadı'}
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleYeniYolcu}
            >
              <Text style={styles.emptyButtonText}>Yeni Yolcu Ekle</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          filteredYolcular.length > 0 ? (
            <Text style={[styles.resultCount, { color: theme.colors.text }]}>
              {filteredYolcular.length} yolcu bulundu
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
  yolcuCard: {
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
  yolcuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  yolcuInfo: {
    flex: 1,
  },
  yolcuAdi: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  yolcuTc: {
    fontSize: 14,
  },
  yolcuActions: {
    alignItems: 'flex-end',
  },
  koltukBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  koltukText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yolcuDetails: {
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

export default YolcularScreen;