import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    primary: '#1e40af',
    secondary: '#64748b',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    placeholder: '#94a3b8',
  info: '#0ea5e9',
  // UETDS Specific Colors
    uetdsBlue: '#2563eb',
    uetdsGreen: '#22c55e',
    uetdsOrange: '#f59e0b',
    uetdsRed: '#ef4444',
  uetdsGray: '#6b7280',
  uetdsLightGray: '#f3f4f6',
  uetdsDarkGray: '#374151',
  // Status Colors
    active: '#22c55e',
    inactive: '#ef4444',
    pending: '#f59e0b',
    completed: '#6b7280',
    cancelled: '#ef4444'
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    semiBold: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
  roundness: {
    small: 4,
    medium: 8,
    large: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // Component specific styles
  components: {
    Button: {
      style: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
    },
    Card: {
      style: {
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    TextInput: {
      style: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
      },
    },
    Surface: {
      style: {
        borderRadius: 12,
        elevation: 1,
      },
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    placeholder: '#6b7280',
    uetdsLightGray: '#374151',
    uetdsDarkGray: '#f3f4f6',
  },
  components: {
    ...theme.components,
    Card: {
      style: {
        ...theme.components.Card.style,
        backgroundColor: theme.colors.surface,
      },
    },
    TextInput: {
      style: {
        ...theme.components.TextInput.style,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
      },
    },
  },
};