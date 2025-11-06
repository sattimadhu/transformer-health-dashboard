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
  apiKey: "AIzaSyCCFmL57OFUIMT11_J-pWIe1Kukx9BYTqw",
  authDomain: "transformer-data-2a29c.firebaseapp.com",
  databaseURL: "https://transformer-data-2a29c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "transformer-data-2a29c",
  storageBucket: "transformer-data-2a29c.firebasestorage.app",
  messagingSenderId: "539631810253",
  appId: "1:539631810253:web:31bb29458aba6efcfe1b84",
  measurementId: "G-Y6JC0NTKTY"
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

  // Get list of all transformers
  subscribeToTransformerList(callback) {
    const listRef = ref(database, 'data');
    return onValue(listRef, (snap) => {
      const val = snap.val();
      callback(val ? Object.keys(val) : []);
    });
  },

  // Subscribe to specific transformer data - CORRECTED for your Firebase structure
  subscribeToTransformerData(transformerId, callback) {
    const path = ref(database, `data/${transformerId}`);
    return onValue(path, (snap) => {
      const raw = snap.val();
      if (raw) {
        // Map to expected component structure
        callback({
          // Direct mappings
          CH4: Number(raw.CH4 ?? 0),
          CO: Number(raw.CO ?? 0),
          H2: Number(raw.H2 ?? 0),
          OilLevel: Number(raw.OilLevel ?? 0),
          OutputCurrent: Number(raw.OutputCurrent ?? 0),
          OutputVoltage: Number(raw.OutputVoltage ?? 0),
          Temperature: Number(raw.Temperature ?? 0),
          city: raw.city || 'Unknown',
          
          // Aliases for component compatibility
          temperature: Number(raw.Temperature ?? 0),
          oilLevel: Number(raw.OilLevel ?? 0),
          outputCurrent: Number(raw.OutputCurrent ?? 0),
          outputVoltage: Number(raw.OutputVoltage ?? 0),
          h2: Number(raw.H2 ?? 0),
          co: Number(raw.CO ?? 0),
          ch4: Number(raw.CH4 ?? 0),
          
          timestamp: Date.now(),
        });
      } else {
        callback(null);
      }
    });
  },

  // Subscribe to prediction data
  subscribeToPredictionData(transformerId, callback) {
    const predRef = ref(database, `predictions/${transformerId}`);
    return onValue(predRef, (snap) => {
      const val = snap.val();
      callback(val || { Status: 'Unknown' });
    });
  },

  // Get user role
  async getUserRole(uid) {
    try {
      const snap = await get(child(ref(database), `users/${uid}`));
      const val = snap.val();
      return val?.isRole || 'normal';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'normal';
    }
  },

  // Get user data
  async getUserData(uid) {
    try {
      const snap = await get(child(ref(database), `users/${uid}`));
      return snap.val();
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Get all transformers data at once
  subscribeToAllTransformersData(callback) {
    const dataRef = ref(database, 'data');
    return onValue(dataRef, (snap) => {
      const transformersData = snap.val();
      callback(transformersData || {});
    });
  },

  // Get all predictions at once
  subscribeToAllPredictions(callback) {
    const predRef = ref(database, 'predictions');
    return onValue(predRef, (snap) => {
      const predictions = snap.val();
      callback(predictions || {});
    });
  },
};

// Utility function to format transformer data for display
export const formatTransformerData = (rawData) => {
  if (!rawData) return null;
  
  return {
    CH4: Number(rawData.CH4 ?? 0),
    CO: Number(rawData.CO ?? 0),
    H2: Number(rawData.H2 ?? 0),
    OilLevel: Number(rawData.OilLevel ?? 0),
    OutputCurrent: Number(rawData.OutputCurrent ?? 0),
    OutputVoltage: Number(rawData.OutputVoltage ?? 0),
    Temperature: Number(rawData.Temperature ?? 0),
    city: rawData.city || 'Unknown',
    timestamp: Date.now(),
  };
};

const services = { authService, firebaseService, formatTransformerData };
export default services;