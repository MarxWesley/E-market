import React, { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { ImagePlus } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProduct } from "../store/features/productSlice";
import { useNavigation } from "@react-navigation/native";
import DialogComponent from "../components/ui/DialogComponent"

export default function CreateItemScreen({ route }) {
  const { mode, data } = route.params || {};

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [focusedField, setFocusedField] = useState(null); // controla qual campo está focado
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);

  const [category, setCategory] = useState([
    { label: "Roupas", value: "Roupas" },
    { label: "Eletrônicos", value: "Eletrônicos" },
    { label: "Móveis", value: "Móveis" },
    { label: "Entretenimento", value: "Entretenimento" },
    { label: "Esporte", value: "Esporte" },
    { label: "Casa e jardim", value: "Casa e jardim" },
    { label: "Outro", value: "Outro" },
  ]);

  const [condition, setCondition] = useState([
    { label: "Novo", value: "Novo" },
    { label: "Usado - estado de novo", value: "Usado - estado de novo" },
    { label: "Usado - em boas condições", value: "Usado - em boas condições" },
    {
      label: "Usado - em condições razoáveis",
      value: "Usado - em condições razoáveis",
    },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      category: "",
      condition: "",
      description: "",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    console.log(result);

    if (!result.canceled) {
      const asset = result.assets[0].uri;
      setImages((prev) => [...prev, asset]); // direto, sem FileSystem
    }
  };

  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const user = useSelector((state) => state.auth.user); // Pega o usuário logado do Redux

  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        title: data.title,
        price: data.price.toString(),
        category: data.category,
        condition: data.condition,
        description: data.description,
        userId: data.userId,
        createdAt: data.createdAt,
        id: data.id,
      });
      setImages(data.images || []);
    }
  }, [mode, data, reset]);

  const onSubmit = async (data) => {
    const itemData = {
      id: mode === "edit" ? data.id : uuidv4(),
      ...data,
      price: parseFloat(data.price),
      images,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      if (mode === "edit") {
        await dispatch(editProduct({id: itemData.id, ...itemData}));
      }else {
        await dispatch(addProduct(itemData));
        reset();
        setImages([]); 
      }

      setDialogVisible(true);
      navigation.goBack();
    } catch (error) {
      console.error("Erro", "Houve um erro ao salvar o item. Tente novamente.");
    }
    console.log(itemData);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
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
        {/* Categoria */}
        <Controller
          control={control}
          name="category"
          rules={{ required: "A categoria é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <DropDownPicker
              style={styles.pickerContainer}
              open={categoryOpen}
              value={value}
              items={category}
              setOpen={setCategoryOpen}
              setValue={(callback) => {
                const newValue = callback(value);
                onChange(newValue); // <-- aqui atualiza o react-hook-form
              }}
              setItems={setCategory}
              placeholder="Selecione a categoria"
              listMode="MODAL"
              modalProps={{ animationType: "slide" }}
              modalAnimationType="slide"
              zIndex={2000}
              zIndexInverse={2000}
            />
          )}
        />
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}
        {/* Condição */}
        <Controller
          control={control}
          name="condition"
          rules={{ required: "A condição é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <DropDownPicker
              style={styles.pickerContainer}
              open={conditionOpen}
              value={value}
              items={condition}
              setOpen={setConditionOpen}
              setValue={(callback) => {
                const newValue = callback(value);
                onChange(newValue);
              }}
              setItems={setCondition}
              placeholder="Selecione a condição"
              listMode="MODAL" // não abre modal, abre inline
              modalProps={{
                animationType: "slide",
              }}
              modalAnimationType="slide" // Tipo de animação do modal
              zIndex={2000}
              zIndexInverse={2000}
            />
          )}
        />
        {errors.condition && (
          <Text style={styles.errorText}>{errors.condition.message}</Text>
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
        <View style={{ marginBottom: 30, justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.publishButtonText}>
              {mode === "edit" ? "Salvar Alterações" : "Publicar"}
            </Text>
          </TouchableOpacity>

          <DialogComponent 
            visible={dialogVisible}
            onDismiss={hideDialog}
            title={
              mode === "edit"
                ? "Item alterado com sucesso."
                : "Item criado com sucesso."
            }
            onConfirm={hideDialog}
          />
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
    alignItems: "center",
    marginTop: 10,
    textAlign: "center",
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
