import { use, useEffect } from "react";
import {
  fetchFavoritesByUserId,
  selectFavorites,
} from "../store/features/favoriteSlice";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ProductCard from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../store/features/productSlice";

export default function FavoriteScreen() {
  const user = useSelector((state) => state.auth.user);
  const userFavorites = useSelector(selectFavorites);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFavoritesByUserId(user.id));
    }
  }, [dispatch, user]);

  const myFavorites = userFavorites.filter((fav) => fav.userId === user.id);

  const allProducts = useSelector(selectAllProducts);

  const favoriteProducts = myFavorites
    .map((fav) => allProducts.find((prod) => prod.id === fav.productId))
    .filter((prod) => prod); // remove undefined se produto não existir mais

  return (
    <View style={styles.container}>
      {favoriteProducts && favoriteProducts.length > 0 ? (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              images={item.images}
              onPress={() =>
                navigation.navigate("ItemDetailScreen", { products: item })
              }
            />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 2,
            gap: 2,
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, fontWeight: 500 }}>
            Sem classificados no momento!
          </Text>
        </View>
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
