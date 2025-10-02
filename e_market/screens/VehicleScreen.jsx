import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller, set } from "react-hook-form";
import { ImagePlus } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

export default function VehicleScren(params) {
  const [images, setImages] = useState([]);
  const [focusedField, setFocusedField] = useState(null); // controla qual campo está focado

  const [typeOpen, setTypeOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [typeItems, setTypeItems] = useState([
    { label: "Carros e caminhões", value: "Carros e caminhões" },
    { label: "Motocicletas", value: "Motocicletas" },
    { label: "Barcos", value: "Barcos" },
    { label: "Outro", value: "Outro" },
  ]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => currentYear - i
  );

  const [yearItems, setYearItems] = useState(
    years.map((year) => ({ label: year.toString(), value: year }))
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      type: "",
      year: "",
      brand: "",
      model: "",
      mileage: "",
      price: "",
      description: "",
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [
        ImagePicker.MediaTypeOptions.Images,
        ImagePicker.MediaTypeOptions.Videos,
      ],
      allowsEditing: true,
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const user = useSelector(state => state.auth.user);

  const onSubmit = async (data) => {
    const newVehicle = {
      id: uuidv4(),
      ...data,
      price: parseFloat(data.price),
      category: "veiculos",
      images,
      userId: user.id,
    };

    try {
      const response = await axios.post("http://localhost:3000/product");

      if (response.ok) {
        Alert.alert("Sucesso", "Veículo publicado!");
        reset();
        setImages([]);
      } else {
        Alert.alert("Erro", "Não foi possível publicar.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Verifique o servidor.");
    }

    console.log(newVehicle);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* adicionar imagem */}
        <View style={styles.imagesContainer}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Text style={styles.addPhotoText}>
              <ImagePlus />
            </Text>
            <Text style={{ fontSize: 13, color: "#333", textAlign: "center" }}>
              Adicionar foto
            </Text>
          </TouchableOpacity>
        </View>
        {/* Título */}
        <Controller
          control={control}
          name="title"
          rules={{ required: "O título é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Título"
              style={[
                styles.input,
                focusedField === "title" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}
        {/* Tipo */}
        <Controller
          control={control}
          name="type"
          rules={{ required: "O tipo de veículo é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <View>
              <DropDownPicker
                style={styles.pickerContainer}
                open={typeOpen}
                value={value} // ✅ pega valor direto do form
                items={typeItems}
                setOpen={setTypeOpen}
                setValue={onChange} // ✅ atualiza o react-hook-form
                setItems={setTypeItems}
                placeholder="Selecione o tipo de veículo"
                listMode="MODAL" // não abre modal, abre inline
                modalProps={{
                  animationType: "slide",
                }}
                modalAnimationType="slide" // Tipo de animação do modal
                modalContentContainerStyle={{
                  height: "50%",
                  marginTop: "auto", // faz aparecer na parte inferior
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
          )}
        />
        {errors.type && (
          <Text style={styles.errorText}>{errors.type.message}</Text>
        )}
        {/* Ano */}
        <Controller
          control={control}
          name="year"
          rules={{ required: "O ano é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <View>
              <DropDownPicker
                style={styles.pickerContainer}
                open={yearOpen}
                value={value}
                items={yearItems}
                setOpen={setYearOpen}
                setValue={onChange}
                setItems={setYearItems}
                placeholder="Selecione o ano"
                listMode="MODAL" // não abre modal, abre inline
                modalProps={{
                  animationType: "slide",
                }}
                modalAnimationType="slide" // Tipo de animação do modal
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          )}
        />
        {errors.year && (
          <Text style={styles.errorText}>{errors.year.message}</Text>
        )}
        {/* Fabricante */}
        <Controller
          control={control}
          name="brand"
          rules={{ required: "O fabricante é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Fabricante"
              style={[
                styles.input,
                focusedField === "brand" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("brand")}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.brand.message}</Text>
        )}
        {/* Modelo */}
        <Controller
          control={control}
          name="model"
          rules={{ required: "O modelo é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Modelo"
              style={[
                styles.input,
                focusedField === "model" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("model")}
              onBlur={() => setFocusedField(null)}
            />
          )}
        />
        {errors.model && (
          <Text style={styles.errorText}>{errors.model.message}</Text>
        )}
        {/* Quilometragem */}
        <Controller
          control={control}
          name="mileage"
          rules={{
            required: "A quilometragem é obrigatória",
            pattern: {
              value: /^\d+$/,
              message: "Digite uma quilometragem válida",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Quilometragem"
              style={[
                styles.input,
                focusedField === "mileage" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("mileage")}
              onBlur={() => setFocusedField(null)}
              keyboardType="numeric"
            />
          )}
        />
        {errors.mileage && (
          <Text style={styles.errorText}>{errors.mileage.message}</Text>
        )}
        {/* Preço */}
        <Controller
          control={control}
          name="price"
          rules={{
            required: "O preço é obrigatório",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Digite um preço válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Preço"
              style={[
                styles.input,
                focusedField === "price" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("price")}
              onBlur={() => setFocusedField(null)}
              keyboardType="numeric"
            />
          )}
        />
        {errors.price && (
          <Text style={styles.errorText}>{errors.price.message}</Text>
        )}
        {/* Descrição */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Descrição (opcional)"
              style={[
                styles.input,
                { height: 100, textAlignVertical: "top" },
                focusedField === "description" && { borderColor: "#319BE5" },
              ]}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              multiline
            />
          )}
        />
        {/* Botão Publicar */}
        <View style={{ marginBottom: 30 }}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.publishButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addPhotoText: {
    fontSize: 30,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  publishButton: {
    backgroundColor: "#319BE5",
    padding: 15,
    borderRadius: 8,
    lignItems: "center",
    marginTop: 10,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
