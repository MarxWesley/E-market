// screens/EditProfileScreen.jsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCredentials } from "../store/features/authSlice";
import userService from "../services/userService";

const PRIMARY = "#2F87E1";

export default function EditProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);

  const schema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().trim().min(2, "Mínimo 2 letras").required("Informe o nome"),
        email: Yup.string().email("Email inválido").required("Informe o email"),
        currentPassword: Yup.string().optional(),
        newPassword: Yup.string().when("currentPassword", (cur, sch) =>
          cur?.[0] ? sch.min(6, "Mín. 6").required("Informe a nova senha") : sch.optional()
        ),
        confirmPassword: Yup.string().when("newPassword", (npw, sch) =>
          npw?.[0] ? sch.oneOf([Yup.ref("newPassword")], "Senhas não conferem").required("Confirme a senha") : sch.optional()
        ),
      }),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || user?.nome || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      if (!user?.id && !user?._id && !user?.userId && !user?.uid) {
        throw new Error("ID do usuário não encontrado para atualizar.");
      }
      const userId = user.id ?? user._id ?? user.userId ?? user.uid;

      // 1) Atualiza nome/email por ID
      const payload = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
      };
      const updated = await userService.updateUser(userId, payload);

      // 2) Se informou senha atual + nova, tenta atualizar a senha (via /users/:id)
      if (values.currentPassword && values.newPassword) {
        try {
          await userService.updatePasswordById(userId, {
            newPassword: values.newPassword,
          });
        } catch (e) {
          console.log("Troca de senha indisponível:", e?.message);
          Alert.alert("Aviso", "Seu backend não possui endpoint para trocar senha. Nome e e-mail foram salvos.");
        }
      }

      // 3) Atualiza Redux + AsyncStorage
      const mergedUser = { ...(user || {}), ...updated, ...payload };
      dispatch(setCredentials({ token, user: mergedUser }));
      await AsyncStorage.setItem("@user", JSON.stringify(mergedUser));

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao atualizar perfil");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Dados */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          {/* Nome */}
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Seu nome"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
              </View>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* Senha */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Alterar senha (opcional)</Text>

          <Controller
            name="currentPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Senha atual</Text>
                <TextInput
                  style={[styles.input, errors.currentPassword && styles.inputError]}
                  placeholder="••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.currentPassword && <Text style={styles.error}>{errors.currentPassword.message}</Text>}
              </View>
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Nova senha</Text>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  placeholder="Mín. 6 caracteres"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.newPassword && <Text style={styles.error}>{errors.newPassword.message}</Text>}
              </View>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Confirmar nova senha</Text>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="Repita a nova senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* Ações */}
        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? "Salvando..." : "Salvar alterações"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryText}>Cancelar</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10, color: "#111827" },
  inputWrap: { marginBottom: 12 },
  label: { color: "#374151", marginBottom: 6, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#e74c3c" },
  error: { color: "#e74c3c", marginTop: 6, fontSize: 13 },

  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  secondaryButton: {
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: { color: PRIMARY, fontWeight: "700", fontSize: 16 },
});
