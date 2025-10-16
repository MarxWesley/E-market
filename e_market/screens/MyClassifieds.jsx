import { useDispatch, useSelector } from "react-redux";
import { fetchProductByUserId, removeProduct, selectLoading } from "../store/features/productSlice";
import { useEffect, useState } from "react";
import ProductCard from "../components/Card";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DialogComponent from "../components/ui/DialogComponent";

export default function MyClassifieds() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userProducts = useSelector((state) => state.products.userProducts);
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); // 👈 armazena o ID do produto clicado

  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProductByUserId(user.id));
    }
  }, [dispatch, user]);

  const handleOpenDialog = (productId) => {
    setSelectedProductId(productId); // 👈 salva o produto a ser excluído
    setDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      await dispatch(removeProduct(selectedProductId));
      setDialogVisible(false);
      setSelectedProductId(null);
      dispatch(fetchProductByUserId(user.id)); // 👈 recarrega lista após exclusão
    }
  };

  const handleEdit = (item) => {
    if (item.category === "veiculos") {
      navigation.navigate("CreateVehicleScreen", { mode: "edit", data: item });
    } else {
      navigation.navigate("CreateItemScreen", { mode: "edit", data: item });
    }
  };

  return (
    <View style={styles.container}>
      {userProducts && userProducts.length > 0 ? (
        <FlatList
          data={userProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              title={item.title}
              price={item.price}
              images={item.images}
              showActions
              onEdit={() => handleEdit(item)}
              onDelete={() => handleOpenDialog(item.id)} // 👈 passa o ID certo
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

      <DialogComponent
        visible={dialogVisible}
        icon="delete-forever"
        title="Deseja realmente excluir esse classificado?"
        onConfirm={handleConfirmDelete}
        onDismiss={() => setDialogVisible(false)}
        textConfirm="Sim"
        textCancel="Não"
      />
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