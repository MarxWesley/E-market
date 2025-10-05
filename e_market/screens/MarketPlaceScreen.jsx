import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { useEffect, useState } from "react";
import ProductCard from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectError,
  selectLoading,
} from "../store/features/productSlice";

export default function MarketplaceScreen() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [focusedField, setFocusedField] = useState(null); 

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts(products); // sem filtro, mostra todos
    } else {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <TextInput
        placeholder="Buscar produtos..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <Text>Carregando produtos...</Text>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              images={item.images}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "flex-start", marginBottom: 2, gap: 2 }}
        />
      ) : (
        <Text>Nenhum produto encontrado.</Text>
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
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});