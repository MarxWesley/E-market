import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import ProductCard from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectAllProducts, selectError, selectLoading } from "../store/features/productSlice";

export default function MarketplaceScreen() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
