# 🛒 E-Market

[![React Native](https://img.shields.io/badge/React%20Native-0.76.0-61dafb?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52.0.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.3-764abc?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-0.17.4-orange?logo=json)](https://github.com/typicode/json-server)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

E-Market é um aplicativo de marketplace desenvolvido com **React Native** e **Expo**, onde qualquer usuário registrado pode criar, visualizar, editar, excluir e favoritar anúncios de produtos e veículos. É uma plataforma simples e intuitiva para facilitar a compra e venda de itens de forma prática.

---

## ✨ Funcionalidades

- 👤 Registro e autenticação de usuários  
- 🛍️ Criar, editar e excluir classificados  
- ⭐ Favoritar produtos  
- 🔍 Visualizar detalhes dos produtos e veículos  
- 🚗 Diferenciação entre categorias de itens  
- 💬 Em desenvolvimento:
  - Sistema de mensagens  
  - Notificações  
  - Endereços  

---

## 🧠 Tecnologias utilizadas

- **Front-end:** React Native, Expo  
- **Gerenciamento de estado:** Redux, Redux Toolkit  
- **Back-end / API fake:** JSON Server  
- **Bibliotecas auxiliares:**
  - React Navigation
  - Lucide React Native (ícones)
  - React Native Paper
  - React Hook Form
  - DropDownPicker
  - react-native-mask-text
  - CurrencyInput

---

## 🗂️ Estrutura do projeto

```bash
E_MARKET/
├─ .expo
├─ assets
├─ components
│ └─ ui
│ └─ Card.jsx
├─ contexts
├─ node_modules
├─ screens
├─ services
├─ store
│ └─ features
│ └─ index.js
├─ styles
├─ utils
├─ App.js
├─ app.json
├─ babel.config.js
├─ db.json
├─ index.js
├─ package.json
└─ package-lock.json
```

🧩 **Principais diretórios:**
- **components**: componentes reutilizáveis, como cards de produtos  
- **screens**: telas da aplicação (criar produto, detalhes, favoritos, etc.)  
- **services**: chamadas à API e integração com JSON Server  
- **store**: Redux slices e configuração da store  
- **styles**: estilos globais  
- **utils**: funções utilitárias  

---

## ⚙️ Pré-requisitos

- Node.js >= 18
- Expo CLI
- Visual Studio Code ou outro editor de código de sua preferência
- Emulador de iOS/Android ou dispositivo físico

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd E_MARKET
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Inicie o JSON Server:
```bash
npm run server
```

### 4. Inicie o aplicativo com Expo:
```bash
npm run start
```

### 5. Abra no emulador ou dispositivo físico (iOS/Android) via QR code ou Expo Go.

## 💾 Estrutura de dados
Exemplo de objeto de produto/veículo:
```bash
{
  "id": "uuid",
  "title": "Nome do Produto",
  "category": "veiculos",
  "type": "Carros e caminhões",
  "year": 2020,
  "brand": "Toyota",
  "model": "Corolla",
  "mileage": 12000,
  "price": 50000,
  "description": "Descrição do produto",
  "images": ["url_da_imagem1", "url_da_imagem2"],
  "userId": "id_do_usuario"
}
```

🧩 **Funcionalidades futuras**
- 💬 Sistema interno de mensagens
- 🔔 Notificações push
- 📍 Endereços dos usuários

## 🤝 Contribuindo
Contribuições são bem-vindas!
Abra uma issue ou envie um pull request com melhorias, correções de bugs ou novas funcionalidades.

## 👨‍💻 Autor

- **Wesley Marques**
- 📦 GitHub: [@MarxWesley](https://github.com/MarxWesley)