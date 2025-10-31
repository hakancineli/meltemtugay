// UETDS API Constants
export const UETDS_CONFIG = {
  TEST_URL: 'https://servis.turkiye.gov.tr/services/g2g/kdgm/test/uetdsarizi?wsdl',
  PROD_URL: 'https://servis.turkiye.gov.tr/services/g2g/kdgm/uetdsarizi?wsdl',
  TEST_CREDENTIALS: {
    UNET_NO: '999999',
    SIFRE: '999999testtest',
    TEST_PLAKA: '06TARIFESIZ123'
  }
};

// App Constants
export const APP_CONFIG = {
  NAME: 'UETDS Mobil',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'destek@uetds.com',
  SUPPORT_PHONE: '+90 212 123 45 67'
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@uetds_user_token',
  USER_DATA: '@uetds_user_data',
  TENANT_DATA: '@uetds_tenant_data',
  UETDS_SETTINGS: '@uetds_uetds_settings',
  REMEMBER_ME: '@uetds_remember_me',
  USER: '@uetds_user',
  AUTH_TOKEN: '@uetds_auth_token',
  COMPANY_INFO: '@uetds_company_info',
  UETDS_CREDENTIALS: '@uetds_credentials',
  SETTINGS: '@uetds_app_settings',
  OFFLINE_SEFERLER: '@uetds_offline_seferler',
  OFFLINE_YOLCULAR: '@uetds_offline_yolcular',
  OFFLINE_PERSONELLER: '@uetds_offline_personeller',
  OFFLINE_ARACLAR: '@uetds_offline_araclar',
  OFFLINE_GRUPLAR: '@uetds_offline_gruplar',
  SYNC_STATUS: '@uetds_sync_status',
  LAST_SYNC_TIME: '@uetds_last_sync_time',
  APP_VERSION: '@uetds_app_version',
  IS_FIRST_LAUNCH: '@uetds_is_first_launch',
};

// Screen Names
export const SCREEN_NAMES = {
  AUTH: 'Auth',
  DASHBOARD: 'Dashboard',
  SEFERLER: 'Seferler',
  SEFER_DETAY: 'SeferDetay',
  YOLCULAR: 'Yolcular',
  YOLCU_DETAY: 'YolcuDetay',
  PERSONELLER: 'Personeller',
  PERSONEL_DETAY: 'PersonelDetay',
  GRUPLAR: 'Gruplar',
  GRUP_DETAY: 'GrupDetay',
  ARACLAR: 'Araclar',
  AYARLAR: 'Ayarlar',
  PROFIL: 'Profil'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh'
  },
  UETDS: {
    SERVIS_TEST: '/uetds/servis-test',
    SEFER_EKLE: '/uetds/sefer-ekle',
    SEFER_GUNCELLE: '/uetds/sefer-guncelle',
    SEFER_IPTAL: '/uetds/sefer-iptal',
    YOLCU_EKLE: '/uetds/yolcu-ekle',
    YOLCU_EKLE_COKLU: '/uetds/yolcu-ekle-coklu',
    PERSONEL_EKLE: '/uetds/personel-ekle',
    GRUP_EKLE: '/uetds/grup-ekle',
    BILDIRIM_OZETI: '/uetds/bildirim-ozeti'
  }
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+90|0)?[5][0-9]{9}$/,
  TCKN: /^\d{11}$/,
  PLAKA: /^[0-9]{2}[A-Za-z]{1,3}[0-9]{4}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  INVALID_CREDENTIALS: 'E-posta veya şifre hatalı.',
  SESSION_EXPIRED: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
  PERMISSION_DENIED: 'İzin reddedildi.',
  VALIDATION_ERROR: 'Lütfen tüm alanları doğru şekilde doldurun.',
  UNKNOWN_ERROR: 'Bilinmeyen bir hata oluştu.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Giriş başarılı.',
  REGISTER_SUCCESS: 'Kayıt başarılı.',
  SEFER_EKLE_SUCCESS: 'Sefer başarıyla eklendi.',
  YOLCU_EKLE_SUCCESS: 'Yolcu başarıyla eklendi.',
  PERSONEL_EKLE_SUCCESS: 'Personel başarıyla eklendi.',
  GRUP_EKLE_SUCCESS: 'Grup başarıyla eklendi.'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  DISPLAY_WITH_TIME: 'dd.MM.yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1
};

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf']
};