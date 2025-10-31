import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfilScreen: React.FC = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  
  const theme = useTheme();

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Uygulamadan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await useAuth().logout();
          },
        },
      ]
    );
  };

  const InfoItem: React.FC<{
    label: string;
    value: string;
    icon: string;
    editable?: boolean;
    onChangeText?: (text: string) => void;
  }> = ({ label, value, icon, editable, onChangeText }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoLeft}>
        <Icon name={icon} size={20} color={theme.colors.primary} />
        <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
      </View>
      {isEditing && editable ? (
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {value}
        </Text>
      ) : (
        <Text style={[styles.infoValue, { color: theme.colors.placeholder }]}>
          {value}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={[
          styles.avatarContainer,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.placeholder }]}>
            {user?.email}
          </Text>
          <Text style={[styles.userRole, { color: theme.colors.primary }]}>
            {user?.role}
          </Text>
        </View>
        
        {!isEditing ? (
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleEdit}
          >
            <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#4CAF50' }
              ]}
              onPress={handleSave}
            >
              <Icon name="check" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#F44336' }
              ]}
              onPress={handleCancel}
            >
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Kişisel Bilgiler
        </Text>
        
        <InfoItem
          label="Ad Soyad"
          value={user?.name || ''}
          icon="person"
        />
        
        <InfoItem
          label="E-posta"
          value={user?.email || ''}
          icon="email"
        />
        
        <InfoItem
          label="Telefon"
          value={user?.phone || 'Belirtilmemiş'}
          icon="phone"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Şirket Bilgileri
        </Text>
        
        <InfoItem
          label="Şirket Adı"
          value={user?.companyName || ''}
          icon="business"
        />
        
        <InfoItem
          label="Departman"
          value={user?.department || 'Belirtilmemiş'}
          icon="apartment"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Yetkiler
        </Text>
        
        {user?.permissions?.map((permission, index) => (
          <View key={index} style={styles.permissionItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[styles.permissionText, { color: theme.colors.text }]}>
              {permission}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Hesap Bilgileri
        </Text>
        
        <InfoItem
          label="Kullanıcı ID"
          value={user?.id || ''}
          icon="fingerprint"
        />
        
        <InfoItem
          label="Kayıt Tarihi"
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : ''}
          icon="event"
        />
        
        <InfoItem
          label="Son Güncelleme"
          value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('tr-TR') : ''}
          icon="update"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: '#F44336' }
        ]}
        onPress={handleLogout}
      >
        <Icon name="logout" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfilScreen;