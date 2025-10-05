import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ title, price, images }) => {
    const firstImage = images && images.length > 0 ? images[0] : null;

    return (
        <TouchableOpacity style={styles.card}>
            <View >
                {firstImage ? (
                    <Image source={{ uri: firstImage }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, styles.placeholder]} />
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.price}>R${price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "50%",
        height: 224,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#ffff',
        borderRadius: 4,
        overflow: 'hidden',
    },
    image: {
        width: "100%",
        height: 164,
    },
    placeholder: {
        backgroundColor: '#fff',
    },
    textContainer: {
        height: 10,
        paddingHorizontal: 8,
        paddingTop: 4,
    },
    title: {
        fontSize: 12,
        color: '#000000',
    },
    price: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
});

export default ProductCard;
