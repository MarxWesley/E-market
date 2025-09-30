// screens/SellScreen.js
import { StyleSheet, View } from "react-native";
import CustomButton from "../components/ui/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default function SellScreen() {
  const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <CustomButton text="Um Item" icon="bag-outline" onPress={() => {navigation.navigate("ItemScreen")}} />
            <CustomButton text="Veículo" icon="car-outline" onPress={() => {navigation.navigate("VehicleScreen")}} />
            <CustomButton text="Meus classificados" icon="pricetag-outline" onPress={() => {navigation.navigate("MyClassifieds")}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        width: "100%",
    },
});