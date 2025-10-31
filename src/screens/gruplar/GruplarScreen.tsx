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
import { Grup } from '../../types';

interface GrupCardProps {
  grup: Grup;
  onPress: (grup: Grup) => void;
}

const GrupCard: React.FC<GrupCardProps> = ({ grup, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.grupCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={() => onPress(grup)}
    >
      <View style={styles.grupHeader}>
        <View style={styles.grupInfo}>
          <Text style={[styles.grupAdi, { color: theme.colors.primary }]}>
            {grup.grupAdi}
          </Text>
          <Text style={[styles.grupKodu, { color: theme.colors.text }]}>
            Kod: {grup.grupKodu}
          </Text>
        </View>
        <View style={[
          styles.kisiBadge,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={styles.kisiText}>
            {grup.kisiSayısı} Kişi
          </Text>
        </View>
      </View>
      
      <View style={styles.grupDetails}>
        <View style={styles.detailRow}>
          <Icon name="person" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            Sorumlu: {grup.sorumluKisi}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {grup.sorumluTelefon || 'Belirtilmemiş'}
          </Text>
        </View>
        
        {grup.aciklama && (
          <View style={styles.detailRow}>
            <Icon name="info" size={16} color={theme.colors.text} />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              {grup.aciklama}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const GruplarScreen: React.FC = ({ navigation }: any) => {
  const { 
    gruplar, 
    seferler,
    isLoading, 
    loadGruplar,
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
      loadGruplar(),
      loadSeferler()
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGrupPress = (grup: Grup) => {
    navigation.navigate('GrupDetay', { grupId: grup.id });
  };

  const handleYeniGrup = () => {
    navigation.navigate('GrupDetay', { mode: 'new' });
  };

  const filteredGruplar = gruplar.filter(grup => {
    const matchesSearch = searchText === '' || 
      grup.grupAdi.toLowerCase().includes(searchText.toLowerCase()) ||
      grup.grupKodu.toLowerCase().includes(searchText.toLowerCase()) ||
      grup.sorumluKisi.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesSefer = !selectedSefer || grup.uetdsSeferReferansNo?.toString() === selectedSefer;
    
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
          placeholder="Grup ara..."
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
            Tümü ({gruplar.length})
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
        data={filteredGruplar}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GrupCard
            grup={item}
            onPress={handleGrupPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon 
              name="group" 
              size={64} 
              color={theme.colors.placeholder} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              {searchText || selectedSefer ? 'Eşleşen grup bulunamadı' : 'Grup bulunamadı'}
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleYeniGrup}
            >
              <Text style={styles.emptyButtonText}>Yeni Grup Oluştur</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          filteredGruplar.length > 0 ? (
            <Text style={[styles.resultCount, { color: theme.colors.text }]}>
              {filteredGruplar.length} grup bulundu
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
  grupCard: {
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
  grupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  grupInfo: {
    flex: 1,
  },
  grupAdi: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  grupKodu: {
    fontSize: 14,
  },
  kisiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kisiText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grupDetails: {
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

export default GruplarScreen;