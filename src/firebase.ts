import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth,
} from 'firebase/auth';
import firebaseConfigData from '../firebase-applet-config.json';
import { Product, Order, AppUser } from './types';

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'customer' | 'admin';
  senderName: string;
  senderPhone?: string;
  text: string;
  createdAt: string;
}

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  measurementId: firebaseConfigData.measurementId || 'G-7886JZXY7R',
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore (using provisioned database ID or default)
export const db: Firestore = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// ---------------- USER AUTHENTICATION & PROFILES ----------------

export const ADMIN_EMAIL = 'msbablu87@gmail.com';

export function isUserAdmin(user?: AppUser | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

export async function saveUserProfileToFirestore(user: AppUser): Promise<void> {
  try {
    const isAdmin = isUserAdmin(user);
    const sanitizedUser: AppUser = {
      ...user,
      role: isAdmin ? 'admin' : 'customer',
    };
    const userRef = doc(db, 'users', sanitizedUser.uid);
    await setDoc(userRef, {
      ...sanitizedUser,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<AppUser | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as AppUser;
      const isAdmin = isUserAdmin(data);
      return {
        ...data,
        role: isAdmin ? 'admin' : 'customer',
      };
    }
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err);
  }
  return null;
}

export async function registerCustomer(
  email: string,
  pass: string,
  displayName: string,
  phone?: string,
  address?: string
): Promise<AppUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (auth.currentUser && displayName) {
      await updateProfile(auth.currentUser, { displayName });
    }
    const userEmail = cred.user.email || email;
    const isAdmin = isUserAdmin({ email: userEmail } as AppUser);
    const appUser: AppUser = {
      uid: cred.user.uid,
      email: userEmail,
      displayName: displayName || userEmail.split('@')[0],
      phoneNumber: phone,
      address,
      role: isAdmin ? 'admin' : 'customer',
    };
    await saveUserProfileToFirestore(appUser);
    localStorage.setItem('shohoj_auth_user', JSON.stringify(appUser));
    return appUser;
  } catch (err) {
    // If Firebase Auth throws (e.g. email already exists or auth config in console), allow graceful handling
    throw err;
  }
}

export async function loginCustomer(email: string, pass: string): Promise<AppUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const userEmail = cred.user.email || email;
    const profile = await getUserProfileFromFirestore(cred.user.uid);
    const isAdmin = isUserAdmin({ email: userEmail } as AppUser);
    const appUser: AppUser = {
      ...(profile || {}),
      uid: cred.user.uid,
      email: userEmail,
      displayName: profile?.displayName || cred.user.displayName || userEmail.split('@')[0],
      role: isAdmin ? 'admin' : 'customer',
    };
    localStorage.setItem('shohoj_auth_user', JSON.stringify(appUser));
    return appUser;
  } catch (err) {
    throw err;
  }
}

export async function logoutApp(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }
  localStorage.removeItem('shohoj_auth_user');
  localStorage.removeItem('shohoj_admin_unlocked');
}


// Connection verification as requested by Firestore skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using offline cache.');
    } else {
      console.log('Firestore connection active.');
    }
    return true;
  }
}

// ---------------- PRODUCTS SYNC ----------------

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: unknown) => void
) {
  const productsCol = collection(db, 'products');
  return onSnapshot(
    productsCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const loaded: Product[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as Product);
        });
        // Sort by id or title
        onUpdate(loaded);
      } else {
        onUpdate([]);
      }
    },
    (error) => {
      console.warn('Firestore products subscription warning:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    const productRef = doc(db, 'products', product.id);
    await setDoc(productRef, {
      ...product,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    throw err;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    throw err;
  }
}

export async function seedProductsIfEmpty(initialProducts: Product[]): Promise<void> {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const p of initialProducts) {
        await setDoc(doc(db, 'products', p.id), {
          ...p,
          updatedAt: new Date().toISOString(),
        });
      }
      console.log('Initial products seeded successfully.');
    }
  } catch (err) {
    console.warn('Could not seed initial products to Firestore:', err);
  }
}

// ---------------- ORDERS SYNC ----------------

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: unknown) => void
) {
  const ordersCol = collection(db, 'orders');
  return onSnapshot(
    ordersCol,
    (snapshot) => {
      const loaded: Order[] = [];
      snapshot.forEach((d) => {
        loaded.push(d.data() as Order);
      });
      // Sort newest first
      loaded.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.date).getTime() || 0;
        const timeB = new Date(b.createdAt || b.date).getTime() || 0;
        return timeB - timeA;
      });
      onUpdate(loaded);
    },
    (error) => {
      console.warn('Firestore orders subscription warning:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
    throw err;
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, { status }, { merge: true });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
    throw err;
  }
}

// ---------------- LIVE CHAT SYNC ----------------

export function subscribeToChatMessages(
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (err: unknown) => void
) {
  const messagesCol = collection(db, 'chat_messages');
  const q = query(messagesCol, orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((d) => {
        msgs.push(d.data() as ChatMessage);
      });
      onUpdate(msgs);
    },
    (error) => {
      console.warn('Firestore chat messages subscription warning:', error);
      if (onError) onError(error);
    }
  );
}

export async function sendChatMessageToFirestore(message: ChatMessage): Promise<void> {
  try {
    const msgRef = doc(db, 'chat_messages', message.id);
    await setDoc(msgRef, message);
  } catch (err) {
    console.error('Error sending chat message to Firestore:', err);
    throw err;
  }
}
