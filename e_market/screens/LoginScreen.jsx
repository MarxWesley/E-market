// screens/LoginScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/features/authSlice"; // thunk
import { Eye, EyeOff } from "lucide-react-native";
import { TextInput } from 'react-native-paper';

const PRIMARY = "#2F87E1";

const schema = Yup.object({
  email: Yup.string().email("Email inválido").required("Informe o email"),
  senha: Yup.string().min(6, "Mínimo 6 caracteres").required("Informe a senha"),
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", senha: "" },
    mode: "onChange",
  });

  const onSubmit = async ({ email, senha }) => {
    try {
      // dispara a thunk e aguarda; se falhar, lança (por causa do unwrap)
      await dispatch(loginUser({ email, senha })).unwrap();
      // sucesso: RootNavigator vai detectar token no Redux e trocar para AppTabs
    } catch (e) {
      // mostra erro nos campos (sem poluir a UI)
      setError("email", { message: "Credenciais inválidas" });
      setError("senha", { message: " " });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../assets/background.png")}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center" , alignItems: "center"}}
      >
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Image
              source={require("../assets/logo.png")}
              style={{ width: "100%", height: 100 }}
              resizeMode="contain"
            />
          </View>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[errors.email && styles.inputError]}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />
          {/* Senha */}
          <Controller
            name="senha"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[errors.senha && styles.inputError]}
                  placeholder="Senha"
                  secureTextEntry={!show}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                />
                <TouchableOpacity
                  onPress={() => setShow((s) => !s)}
                  style={styles.eye}
                  accessibilityRole="button"
                  accessibilityLabel={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Text style={{ fontSize: 16 }}>{show ? <EyeOff color={"#808080"}/> : <Eye color={"#808080"}/>}</Text>
                </TouchableOpacity>
                {errors.senha && (
                  <Text style={styles.errorText}>{errors.senha.message}</Text>
                )}
              </View>
            )}
          />
          {/* Erro global vindo do servidor */}
          {!!error && (
            <Text
              style={[
                styles.errorText,
                { textAlign: "center", marginBottom: 8 },
              ]}
            >
              {error}
            </Text>
          )}
          <TouchableOpacity>
            <Text style={styles.forgot}>Esqueci minha senha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    // Centraliza o card na tela
    alignSelf: "center",
    // Sombra (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // centraliza horizontalmente
    gap: 10,
    marginBottom: 18,
  },
  inputWrap: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    padding: 12,
    paddingRight: 44,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#e74c3c" },
  errorText: { color: "#e74c3c", marginTop: 6, fontSize: 13 },
  eye: { position: "absolute", right: 12, top: 12 },
  forgot: { alignSelf: "flex-end", color: "#666", marginBottom: 14 },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryText: { color: PRIMARY, fontWeight: "700", fontSize: 16 },
});
