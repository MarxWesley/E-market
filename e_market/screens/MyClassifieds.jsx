import { useDispatch, useSelector } from "react-redux";
import { fetchProductByUserId, selectAllProducts } from "../store/features/productSlice";
import { useEffect } from "react";
import ProductCard from "../components/Card";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function MyClassifieds() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userProducts = useSelector((state) => state.products.userProducts);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchProductByUserId(user.id));
        }
    }, [dispatch, user]);

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
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 2, gap: 2 }}
                />
            ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 500}}>Sem classificados no momento!</Text>
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