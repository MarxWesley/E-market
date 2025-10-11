import { View, Text, StyleSheet, Image } from "react-native";

export default function MessageScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/image_in_dev.png")}
            />
            {/* Titulo */}
            <Text style={styles.title}>
                Tela em desenvolvimento
            </Text>
            {/* Subtitulo */}
            <Text style={styles.subtitle}>
                Em breve você poderá trocar mensagens com outros usuários.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 5    
    },  
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    }
});