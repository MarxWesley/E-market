import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/features/favoriteSlice";
import { v4 as uuidv4 } from "uuid";

const { width, height } = Dimensions.get("window");

export default function ItemDetailScreen({ route }) {
  const [isSaved, setIsSaved] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const favorites = useSelector((state) => state.favorites || []);

  const dispatch = useDispatch();

  const { products } = route.params;
  const user = useSelector((state) => state.auth.user);

  const toggleFavorite = async () => {
    if (!user) return;

    const id = uuidv4();
    const userId = user.id;
    const productId = products.id;

    const alreadySaved = favorites.some(
      (fav) => fav.productId === productId && fav.userId === userId
    );

    if (alreadySaved) {
      await dispatch(removeFavorite({ userId, productId })); // id não precisa, JSON Server remove pelo filtro
      setIsSaved(false);
    } else {
      await dispatch(addFavorite({ id, userId, productId }));
      setIsSaved(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carrossel de imagens */}
      {products.images && products.images.length > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {products.images.map((imgUrl, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedIndex(index);
                setVisible(true);
              }}
            >
              <Image
                source={{ uri: imgUrl }}
                style={[styles.image, { width }]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal fullscreen — muda conforme a plataforma */}
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {products.images[selectedIndex] && (
            <Image
              source={{ uri: products.images[selectedIndex] }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* informações do produto */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{products.title}</Text>
        <Text style={styles.price}>R${products.price}</Text>
      </View>

      {/* ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="#333" />
          <Text style={styles.actionText}>Enviar{"\n"}mensagem</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={30} color="#333" />
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={30}
            color={isSaved ? "#319BE5" : "#319BE5"}
          />
          <Text style={styles.actionText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* descrição */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Descrição</Text>
        <Text style={styles.descriptionText}>{products.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { height: 300 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.8,
  },
  infoContainer: { marginTop: 10, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 18, color: "#008000", marginBottom: 12 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  actionButton: { alignItems: "center" },
  actionText: { fontSize: 12, textAlign: "center", color: "#333" },
  descriptionContainer: { padding: 16 },
  descriptionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  descriptionText: { fontSize: 14, color: "#444" },
});
