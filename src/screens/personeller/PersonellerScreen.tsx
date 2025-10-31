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
import { Personel } from '../../types';

interface PersonelCardProps {
  personel: Personel;
  onPress: (personel: Personel) => void;
}

const PersonelCard: React.FC<PersonelCardProps> = ({ personel, onPress }) => {
  const theme = useTheme();
  
  const getGorevColor = (gorev: string) => {
    switch (gorev.toLowerCase()) {
      case 'sürücü':
        return '#2196F3';
      case 'rehber':
        return '#4CAF50';
      case 'hostes':
        return '#9C27B0';
      default:
        return '#FF9800';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.personelCard,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline
        }
      ]}
      onPress={() => onPress(personel)}
    >
      <View style={styles.personelHeader}>
        <View style={styles.personelInfo}>
          <Text style={[styles.personelAdi, { color: theme.colors.primary }]}>
            {personel.adi} {personel.soyadi}
          </Text>
          <Text style={[styles.personelTc, { color: theme.colors.text }]}>
            {personel.tcKimlikNo}
          </Text>
        </View>
        <View style={[
          styles.gorevBadge,
          { backgroundColor: getGorevColor(personel.gorev) }
        ]}>
          <Text style={styles.gorevText}>
            {personel.gorev}
          </Text>
        </View>
      </View>
      
      <View style={styles.personelDetails}>
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {personel.telefonNo || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="badge" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            {personel.surucuBelgeNo || 'Belirtilmemiş'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="event" size={16} color={theme.colors.text} />
          <Text style={[styles.detailText, { color: theme.colors.text }]}>
            Geçerlilik: {personel.belgeGecerlilikTarihi || 'Belirtilmemiş'}
          </Text>
        </View>
        
        {personel.adres && (
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color={theme.colors.text} />
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              {personel.adres}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const PersonellerScreen: React.FC = ({ navigation }: any) => {
  const { 
    personeller, 
    seferler,
    isLoading, 
    loadPersoneller,
    loadSeferler
  } = useUetds();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGorev, setSelectedGorev] = useState<string | null>(null);
  
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadPersoneller(),
      loadSeferler()
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePersonelPress = (personel: Personel) => {
    navigation.navigate('PersonelDetay', { personelId: personel.id });
  };

  const handleYeniPersonel = () => {
    navigation.navigate('PersonelDetay', { mode: 'new' });
  };

  const gorevler = ['Sürücü', 'Rehber', 'Hostes'];
  
  const filteredPersoneller = personeller.filter(personel => {
    const matchesSearch = searchText === '' || 
      personel.adi.toLowerCase().includes(searchText.toLowerCase()) ||
      personel.soyadi.toLowerCase().includes(searchText.toLowerCase()) ||
      personel.tcKimlikNo.includes(searchText);
    
    const matchesGorev = !selectedGorev || personel.gorev === selectedGorev;
    
    return matchesSearch && matchesGorev;
  });

  const getGorevCount = (gorev: string | null) => {
    if (!gorev) return personeller.length;
    return personeller.filter(personel => personel.gorev === gorev).length;
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
          placeholder="Personel ara..."
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
              backgroundColor: !selectedGorev ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.outline,
            }
          ]}
          onPress={() => setSelectedGorev(null)}
        >
          <Text style={[
            styles.filterButtonText,
            { color: !selectedGorev ? 'white' : theme.colors.text }
          ]}>
            Tümü ({getGorevCount(null)})
          </Text>
        </TouchableOpacity>
        
        {gorevler.map(gorev => (
          <TouchableOpacity
            key={gorev}
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedGorev === gorev ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.outline,
              }
            ]}
            onPress={() => setSelectedGorev(gorev)}
          >
            <Text style={[
              styles.filterButtonText,
              { color: selectedGorev === gorev ? 'white' : theme.colors.text }
            ]}>
              {gorev} ({getGorevCount(gorev)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPersoneller}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PersonelCard
            personel={item}
            onPress={handlePersonelPress}
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
              {searchText || selectedGorev ? 'Eşleşen personel bulunamadı' : 'Personel bulunamadı'}
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: theme.colors.primary }
              ]}
              onPress={handleYeniPersonel}
            >
              <Text style={styles.emptyButtonText}>Yeni Personel Ekle</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          filteredPersoneller.length > 0 ? (
            <Text style={[styles.resultCount, { color: theme.colors.text }]}>
              {filteredPersoneller.length} personel bulundu
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
  personelCard: {
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
  personelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  personelInfo: {
    flex: 1,
  },
  personelAdi: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  personelTc: {
    fontSize: 14,
  },
  gorevBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gorevText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  personelDetails: {
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

export default PersonellerScreen;