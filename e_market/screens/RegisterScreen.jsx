// screens/RegisterScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { MaskedTextInput } from "react-native-mask-text";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/features/authSlice";
import userService from "../services/userService";
import Logo from "../assets/logo.svg";

const PRIMARY = "#2F87E1";

// ✅ validação
const schema = Yup.object({
  nome: Yup.string().trim().min(3, "Mínimo 3 letras").required("Informe o nome"),
  email: Yup.string().email("Email inválido").required("Informe o email"),
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .required("Informe o CPF"),
  senha: Yup.string().min(6, "Mínimo 6 caracteres").required("Informe a senha"),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref("senha")], "Senhas não conferem")
    .required("Confirme a senha"),
});

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { nome: "", email: "", cpf: "", senha: "", confirmarSenha: "" },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        cpf: values.cpf.replace(/\D/g, ""), // remove máscara
        senha: values.senha,
      };

      // 1️⃣ Cria usuário no backend
      await userService.createUser(payload);

      // 2️⃣ Login automático → Redux guarda token e usuário
      await dispatch(loginUser({ email: payload.email, senha: payload.senha })).unwrap();

      // 🚀 O RootNavigator detecta o token e redireciona para AppTabs
    } catch (e) {
      const msg = typeof e === "string" ? e : e?.message || "Erro ao registrar";
      setError("email", { message: msg });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Logo width={330} height={100} />
          </View>

          {/* Nome */}
          <Controller
            name="nome"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, errors.nome && styles.inputError]}
                  placeholder="Nome completo"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          {/* CPF */}
          <Controller
            name="cpf"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputWrap}>
                <MaskedTextInput
                  mask="999.999.999-99"
                  keyboardType="numeric"
                  style={[styles.input, errors.cpf && styles.inputError]}
                  placeholder="CPF"
                  value={value}
                  onChangeText={(masked) => onChange(masked)}
                />
                {errors.cpf && <Text style={styles.errorText}>{errors.cpf.message}</Text>}
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
                  style={[styles.input, errors.senha && styles.inputError]}
                  placeholder="Senha"
                  secureTextEntry={!showPass}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity style={styles.eye} onPress={() => setShowPass((s) => !s)}>
                  <Text style={{ fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
                {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
              </View>
            )}
          />

          {/* Confirmar senha */}
          <Controller
            name="confirmarSenha"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, errors.confirmarSenha && styles.inputError]}
                  placeholder="Confirmar senha"
                  secureTextEntry={!showConf}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity style={styles.eye} onPress={() => setShowConf((s) => !s)}>
                  <Text style={{ fontSize: 16 }}>{showConf ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
                {errors.confirmarSenha && (
                  <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>
                )}
              </View>
            )}
          />

          {/* Erro global */}
          {!!error && <Text style={[styles.errorText, { textAlign: "center", marginBottom: 8 }]}>{error}</Text>}

          {/* Botão Criar */}
          <TouchableOpacity
            style={[styles.button, (isSubmitting || loading) && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || loading}
          >
            <Text style={styles.buttonText}>{isSubmitting || loading ? "Criando..." : "Criar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", paddingHorizontal: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
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
  button: { backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
