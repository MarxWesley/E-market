import { Pencil, Trash } from 'lucide-react-native';
import { Dimensions, TouchableOpacity } from 'react-native';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ title, price, images, onPress, showActions, onEdit, onDelete }) => {
    const firstImage = images && images.length > 0 ? images[0] : null;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View >
                {firstImage ? (
                    <Image source={{ uri: firstImage }} style={styles.image} resizeMode="cover" alt='imagens de itens a venda' aria-hidden='true'/>
                ) : (
                    <View style={[styles.image, styles.placeholder]} />
                )}

                {showActions && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={onEdit}>
                            <Pencil size={22} color="#3f3f3fff"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete}>
                            <Trash size={22} color="#3f3f3fff"/>
                        </TouchableOpacity>
                    </View>
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
    actionsContainer: {
    position: "absolute",
    top: 10,
    right: 6,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#ffffffff",
    padding: 3,
    borderRadius: 5,
  },
});

export default ProductCard;
