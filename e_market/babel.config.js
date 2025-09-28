// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Mapeia ícones que o react-native-paper tenta buscar
            '@react-native-vector-icons/material-design-icons':
              '@expo/vector-icons/MaterialCommunityIcons',
            '@react-native-vector-icons/MaterialCommunityIcons':
              '@expo/vector-icons/MaterialCommunityIcons',
            '@react-native-vector-icons/MaterialIcons':
              '@expo/vector-icons/MaterialIcons',

            // Variações antigas/comuns
            'react-native-vector-icons/MaterialCommunityIcons':
              '@expo/vector-icons/MaterialCommunityIcons',
            'react-native-vector-icons/MaterialIcons':
              '@expo/vector-icons/MaterialIcons',
          },
        },
      ],

      // ⚠️ Deve ser SEMPRE o último plugin
      'react-native-reanimated/plugin',
    ],
  };
};
