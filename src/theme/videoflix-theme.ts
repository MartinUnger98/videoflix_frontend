import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const VideoflixTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eceeff',
      100: '#c3c7ff',
      200: '#9ca3ff',
      300: '#6c7cff',
      400: '#4b5dfc',
      500: '#2E3EDF',
      600: '#2633c5',
      700: '#1d29a6',
      800: '#151e85',
      900: '#0e1363',
      DEFAULT: '#2E3EDF',
      color: '#2E3EDF',
      inverseColor: '#ffffff'
    }
  },
  components: {
    button: {
      borderRadius: '40px',
      paddingY: '12px',
      paddingX: '24px'
    },
    inputtext: {
      borderRadius: '40px',
      background: '#1C1A20CC',
      color: '#FFFFFF',
      borderColor: '#FFFFFF',
      placeholderColor: '#FFFFFF',
      focusBackground: '#1C1A20CC',
    }
  }
});

export default VideoflixTheme;
