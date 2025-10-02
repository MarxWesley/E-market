import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Card";

export default function MarketplaceScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/product")
      .then(response => {
        setProducts(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
      });
  }, []);

  return (
    <View style={styles.container}>
      {products && products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              images={item.images}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 2, gap: 2 }}
        />
      ) : (
        <Text>Carregando produtos...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
  },
});
