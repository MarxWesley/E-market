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
              // Redireciona os imports que o react-native-paper faz
              '@react-native-vector-icons/material-design-icons':
                '@expo/vector-icons/MaterialCommunityIcons',
              '@react-native-vector-icons/MaterialCommunityIcons':
                '@expo/vector-icons/MaterialCommunityIcons',
              '@react-native-vector-icons/MaterialIcons':
                '@expo/vector-icons/MaterialIcons',
  
              // Variações comuns em libs mais antigas
              'react-native-vector-icons/MaterialCommunityIcons':
                '@expo/vector-icons/MaterialCommunityIcons',
              'react-native-vector-icons/MaterialIcons':
                '@expo/vector-icons/MaterialIcons',
            },
          },
        ],
      ],
    };
  };
  