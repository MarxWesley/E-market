// screens/AddressesScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ionicons } from "@expo/vector-icons";

import {
  fetchAddresses,
  createAddress,
  updateAddress,
  removeAddress,
  setPrimaryAddress,
} from "../store/features/addressSlice";

const PRIMARY = "#2F87E1";
const TYPES = [
  { label: "Casa", value: "home", icon: "home-outline" },
  { label: "Trabalho", value: "work", icon: "briefcase-outline" },
  { label: "Outro", value: "other", icon: "location-outline" },
];

export default function AddressesScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, loading } = useSelector((s) => s.address);

  const userId = user?.id ?? user?._id ?? user?.userId ?? user?.uid;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // ======= validação =======
  const schema = useMemo(
    () =>
      Yup.object({
        label: Yup.string().oneOf(TYPES.map((t) => t.value)).required(),
        street: Yup.string().trim().required("Informe a rua"),
        number: Yup.string().trim().required("Informe o número"),
        complement: Yup.string().trim().optional(),
        district: Yup.string().trim().required("Informe o bairro"),
        city: Yup.string().trim().required("Informe a cidade"),
        state: Yup.string().trim().required("Informe o estado"),
        zip: Yup.string().trim().required("Informe o CEP"),
      }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      label: "home",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  // ======= carregar endereços (Redux) =======
  useEffect(() => {
    if (userId) dispatch(fetchAddresses(userId));
  }, [dispatch, userId]);

  // ======= abrir criar =======
  const openCreate = () => {
    if ((items?.length || 0) >= 3) {
      Alert.alert("Limite atingido", "Você pode ter no máximo 3 endereços.");
      return;
    }
    setEditing(null);
    reset({
      label: "home",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      zip: "",
    });
    setOpen(true);
  };

  // ======= abrir editar =======
  const openEdit = (item) => {
    setEditing(item);
    reset({
      label: item.label ?? "home",
      street: item.street ?? "",
      number: item.number ?? "",
      complement: item.complement ?? "",
      district: item.district ?? "",
      city: item.city ?? "",
      state: item.state ?? "",
      zip: item.zip ?? "",
    });
    setOpen(true);
  };

  // ======= salvar (create/update) via Redux =======
  const onSubmit = async (values) => {
    try {
      if (editing) {
        await dispatch(
          updateAddress({ userId, id: editing.id, addr: values })
        ).unwrap();
      } else {
        await dispatch(
          createAddress({ userId, addr: { ...values, isPrimary: false } })
        ).unwrap();
      }
      setOpen(false);
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao salvar endereço");
    }
  };

  // ======= excluir (com web-friendly confirm) =======
  const removeItem = (id) => {
    const doDelete = async () => {
      try {
        await dispatch(removeAddress({ userId, id })).unwrap();
      } catch (e) {
        Alert.alert("Erro", e?.message || "Falha ao excluir endereço");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Deseja remover este endereço?")) doDelete();
      return;
    }

    Alert.alert("Excluir", "Deseja remover este endereço?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: doDelete },
    ]);
  };

  // ======= definir principal =======
  const setPrimary = async (id) => {
    try {
      await dispatch(setPrimaryAddress({ userId, id })).unwrap();
    } catch (e) {
      Alert.alert("Erro", e?.message || "Falha ao definir principal");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Lista */}
        {items.map((it) => (
          <View key={it.id} style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={
                    TYPES.find((t) => t.value === it.label)?.icon ||
                    "location-outline"
                  }
                  size={20}
                  color={PRIMARY}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.title}>
                  {TYPES.find((t) => t.value === it.label)?.label || "Endereço"}
                </Text>
              </View>
              {it.isPrimary && <Text style={styles.badge}>Principal</Text>}
            </View>

            <Text style={styles.line}>
              {it.street}, {it.number} {it.complement ? `- ${it.complement}` : ""}
            </Text>
            <Text style={styles.line}>
              {it.district} • {it.city}/{it.state} • CEP {it.zip}
            </Text>

            <View style={styles.actions}>
              {!it.isPrimary && (
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => setPrimary(it.id)}
                >
                  <Ionicons name="star-outline" size={16} color={PRIMARY} />
                  <Text style={styles.chipText}>Definir principal</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.chip} onPress={() => openEdit(it)}>
                <Ionicons name="create-outline" size={16} color={PRIMARY} />
                <Text style={styles.chipText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, { borderColor: "#EF4444" }]}
                onPress={() => removeItem(it.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={[styles.chipText, { color: "#EF4444" }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Vazio */}
        {!loading && items.length === 0 && (
          <View style={[styles.card, { alignItems: "center" }]}>
            <Text style={{ color: "#6B7280" }}>Nenhum endereço cadastrado.</Text>
          </View>
        )}

        {/* Espaço final */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botão fixo adicionar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, items.length >= 3 && { opacity: 0.5 }]}
          onPress={openCreate}
          disabled={items.length >= 3}
        >
          <Ionicons
            name="add-circle-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Adicionar endereço</Text>
        </TouchableOpacity>
      </View>

      {/* Modal formulário */}
      <Modal transparent visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? "Editar endereço" : "Novo endereço"}
            </Text>

            {/* Tipo */}
            <Controller
              name="label"
              control={control}
              render={({ field: { value, onChange } }) => (
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  {TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        styles.typeBtn,
                        value === t.value && {
                          backgroundColor: "#EEF6FF",
                          borderColor: PRIMARY,
                        },
                      ]}
                      onPress={() => onChange(t.value)}
                    >
                      <Ionicons
                        name={t.icon}
                        size={16}
                        color={PRIMARY}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={{ color: PRIMARY }}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />

            {/* Campos */}
            {[
              { name: "street", label: "Rua" },
              { name: "number", label: "Número" },
              { name: "complement", label: "Complemento (opcional)" },
              { name: "district", label: "Bairro" },
              { name: "city", label: "Cidade" },
              { name: "state", label: "Estado (UF)" },
              { name: "zip", label: "CEP" },
            ].map((f) => (
              <Controller
                key={f.name}
                name={f.name}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>{f.label}</Text>
                    <TextInput
                      style={[styles.input, errors[f.name] && styles.inputError]}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={f.label}
                    />
                    {errors[f.name] && (
                      <Text style={styles.error}>{errors[f.name]?.message}</Text>
                    )}
                  </View>
                )}
              />
            ))}

            {/* Ações modal */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, isSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryBtnText}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.secondaryBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    marginBottom: 12,
  },
  title: { fontWeight: "700", color: "#111827" },
  line: { color: "#374151", marginTop: 4 },
  badge: {
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 12,
  },
  actions: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipText: { color: PRIMARY, fontWeight: "600" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#F3F4F6",
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#111827" },

  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

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

  primaryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  secondaryBtnText: { color: PRIMARY, fontWeight: "700" },
});
