import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const KEY = (userId) => `@addresses:${userId}`;


let HAS_ADDRESS_API = true;


const localGet = async (userId) => {
  const raw = await AsyncStorage.getItem(KEY(userId));
  return raw ? JSON.parse(raw) : [];
};
const localSet = async (userId, items) =>
  AsyncStorage.setItem(KEY(userId), JSON.stringify(items));

// ------------ Tenta API, com fallback silencioso ------------
const tryApi = async (fn, fallback) => {
  if (!HAS_ADDRESS_API) return fallback();
  try {
    return await fn();
  } catch (e) {
    const status = e?.response?.status;
    // Se 404, desativa API para próximas chamadas
    if (status === 404) {
      HAS_ADDRESS_API = false;
      return fallback();
    }
    // outros erros (500, 401, etc.) propagam
    throw e;
  }
};

// ------------ Métodos públicos ------------
const getAll = async (userId) => {
  return tryApi(
    () => api.get(`/users/${userId}/addresses`).then((r) => r.data),
    () => localGet(userId)
  );
};

const create = async (userId, addr) => {
  return tryApi(
    () => api.post(`/users/${userId}/addresses`, addr).then((r) => r.data),
    async () => {
      const list = await localGet(userId);
      const id = Date.now().toString();
      const item = { id, ...addr };
      const next =
        list.length === 0
          ? [{ ...item, isPrimary: true }]
          : [...list, item];
      await localSet(userId, next);
      return item;
    }
  );
};

const update = async (userId, id, addr) => {
  return tryApi(
    () => api.put(`/users/${userId}/addresses/${id}`, addr).then((r) => r.data),
    async () => {
      const list = await localGet(userId);
      const next = list.map((i) => (i.id === id ? { ...i, ...addr } : i));
      await localSet(userId, next);
      return next.find((i) => i.id === id);
    }
  );
};


// src/services/addressService.js
// src/services/addressService.js  → SUBSTITUA APENAS A FUNÇÃO remove
const remove = async (userId, id) => {
    return tryApi(
      () => api.delete(`/users/${userId}/addresses/${id}`).then((r) => r.data),
      async () => {
        let list = await localGet(userId);
  
        // acha pelo id aceitando string/number
        const idx = list.findIndex((i) => String(i.id) === String(id));
        if (idx === -1) return id;
  
        const [removed] = list.splice(idx, 1);
  
        // se removeu principal, promove o primeiro
        if (removed?.isPrimary && list.length > 0) {
          list = list.map((item, i) => ({ ...item, isPrimary: i === 0 }));
        } else {
          // garante unicidade de principal se sobrou mais de um marcado
          let found = false;
          list = list.map((item) => {
            if (item.isPrimary && !found) {
              found = true;
              return item;
            }
            return { ...item, isPrimary: false };
          });
          if (!found && list[0]) list[0].isPrimary = true;
        }
  
        await localSet(userId, list);
        return id;
      }
    );
  };
  
  
  

const setPrimary = async (userId, id) => {
  return tryApi(
    () => api.post(`/users/${userId}/addresses/${id}/primary`).then((r) => r.data),
    async () => {
      const list = await localGet(userId);
      const next = list.map((i) => ({ ...i, isPrimary: i.id === id }));
      await localSet(userId, next);
      return id;
    }
  );
};

export default { getAll, create, update, remove, setPrimary };
