import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { MaskedTextInput } from "react-native-mask-text";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../assets/logo.svg";

const PRIMARY = "#2F87E1";

// validação
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
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { nome: "", email: "", cpf: "", senha: "", confirmarSenha: "" },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      // Aqui depois: chamada ao backend (service de auth/usuário)
      // ex: await userService.register({ ...values, cpf: values.cpf.replace(/\D/g,'') })
      await new Promise((r) => setTimeout(r, 600));
      Alert.alert("Conta criada!", "Bem-vindo(a) ao E-market.");
      navigation.replace("TaskHome");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível criar a conta.");
      console.log(e);
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

          {/* CPF (com máscara) */}
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

          {/* Botão Criar */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? "Criando..." : "Criar"}</Text>
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
  logoText: { fontSize: 28, fontWeight: "700" },
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
