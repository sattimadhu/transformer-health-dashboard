import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  child,
} from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBv9yxV95IuWLSnmTHJg0taHRZe25a4OZc',
  authDomain: 'test-46ef0.firebaseapp.com',
  databaseURL: 'https://test-46ef0-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'test-46ef0',
  storageBucket: 'test-46ef0.firebasestorage.app',
  messagingSenderId: '1013656220217',
  appId: '1:1013656220217:web:898161fa7b81e1f6d893e8',
  measurementId: 'G-EQBF7YMT7E',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export const authService = {
  async register({ email, password, displayName = '' }) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      await set(ref(database, `users/${cred.user.uid}`), {
        email,
        isRole: 'normal',
        createdAt: Date.now(),
        lastLogin: Date.now(),
      });
      return { success: true, user: cred.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async login({ email, password }) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await set(ref(database, `users/${cred.user.uid}/lastLogin`), Date.now());
      return { success: true, user: cred.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async logout() {
    await signOut(auth);
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};

export const firebaseService = {
  database,

  subscribeToTransformerList(callback) {
    const listRef = ref(database, 'data');
    return onValue(listRef, (snap) => {
      const val = snap.val();
      callback(val ? Object.keys(val) : []);
    });
  },

  subscribeToTransformerData(transformerId, callback) {
    const path = ref(database, `data/${transformerId}`);
    return onValue(path, (snap) => {
      const raw = snap.val();
      if (raw) {
        callback({
          CH4: Number(raw.CH4 ?? 0),
          CO: Number(raw.CO ?? 0),
          H2: Number(raw.H2 ?? 0),
          OilLevel: Number(raw['Oil Level'] ?? 0),
          OilMoisture: Number(raw['Oil Moisture'] ?? 0),
          Current: Number(raw['Output Current'] ?? 0),
          Voltage: Number(raw['Output Voltage'] ?? 0),
          Temperature: Number(raw.Temperature ?? 0),
          city: typeof raw.city === 'string' ? raw.city : 'Unknown',
          timestamp: Date.now(),
        });
      } else {
        callback(null);
      }
    });
  },

  subscribeToPredictionData(transformerId, callback) {
    const predRef = ref(database, `predictions/${transformerId}`);
    return onValue(predRef, (snap) => {
      const val = snap.val();
      callback(val || { Status: 'Healthy' });
    });
  },

  async getUserRole(uid) {
    const snap = await get(child(ref(database), `users/${uid}`));
    const val = snap.val();
    return val?.isRole || 'normal';
  },
};

const services = { authService, firebaseService };
export default services;