import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import * as Icon from "react-native-vector-icons"

export default function ItemScreen() {
  const [images, setImages] = useState([]);
  const [focusedField, setFocusedField] = useState(null); // controla qual campo está focado

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      price: "",
      category: "",
      condition: "",
      description: "",
    }
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const onSubmit = async (data) => {
    const newItem = {
      id: uuidv4(),
      ...data,
      price: parseFloat(data.price),
      images,
    };

    // try {
    //   const response = await fetch("http://localhost:3000/items", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newItem),
    //   });

    //   if (response.ok) {
    //     Alert.alert("Sucesso", "Item publicado!");
    //     navigation.goBack();
    //   } else {
    //     Alert.alert("Erro", "Não foi possível publicar.");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert("Erro", "Verifique o servidor.");
    // }

    console.log(newItem);
    alert("Item criado! Confira o console.");
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
            <Text style={styles.addPhotoText}>+</Text>
            <Text>
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
              style={styles.input}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
        {/* Preço */}
        <Controller
          control={control}
          name="price"
          rules={{
            required: "O preço é obrigatório",
            pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Digite um preço válido" }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Preço"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}
        {/* Categoria */}
        <Controller
          control={control}
          name="category"
          rules={{ required: "A categoria é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Selecione uma categoria" value="" />
                <Picker.Item label="Roupas" value="Roupas" />
                <Picker.Item label="Eletrônicos" value="Eletrônicos" />
                <Picker.Item label="Móveis" value="Móveis" />
                <Picker.Item label="Entretenimento" value="Entretenimento" />
                <Picker.Item label="Esporte" value="Esporte" />
                <Picker.Item label="Casa e jardim" value="Casa e jardim" />
              </Picker>
            </View>
          )}
        />
        {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
        {/* Condição */}
        <Controller
          control={control}
          name="condition"
          rules={{ required: "A condição é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Selecione a condição" value="" />
                <Picker.Item label="Novo" value="Novo" />
                <Picker.Item label="Usado - estado de novo" value="Usado - estado de novo" />
                <Picker.Item label="Usado - em boas condições" value="Usado - em boas condições" />
                <Picker.Item label="Usado - em condições razoáveis" value="Usado - em condições razoáveis" />
              </Picker>
            </View>
          )}
        />
        {errors.condition && <Text style={styles.errorText}>{errors.condition.message}</Text>}
        {/* Descrição */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Descrição (opcional)"
              style={[styles.input, { height: 100, marginBottom: 170 }]}
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
        />
        <TouchableOpacity style={styles.publishButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flexWrap: "wrap"
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center", marginBottom: 10
  },
  addPhotoText: {
    fontSize: 30,
    color: "#333"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  publishButton: {
    backgroundColor: "#319BE5",
    padding: 15,
    borderRadius: 8,
    lignItems: "center",
    marginTop: 10
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  errorText: {
    color: "red",
    marginBottom: 10
  },
});