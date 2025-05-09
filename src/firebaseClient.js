import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDEHl9XsM1KHSbsc4s07GC2vcNhLydFsL0",
  authDomain: "baaja-509ba.firebaseapp.com",
  projectId: "baaja-509ba",
  storageBucket: "baaja-509ba.firebasestorage.app",
  messagingSenderId: "561013297053",
  appId: "1:561013297053:web:58de75b7ab10e90832e974",
  measurementId: "G-Q08XTW0KNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Function to get Firebase Cloud Messaging Token
export const getFirebaseToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'BBDNr6fs-LMuhUHFp9hFGjWHMRHgU3zsNkvLFX1LaV3Emt6Ah4RmjdPL4sMCpxx0rpBEE5Ez4031Yiv5yPXAaUM' }); // VAPID Key for Web Push Notifications
    if (currentToken) {
      console.log('Current token:', currentToken); // Store this token to send push notifications to this device
      return currentToken;
    } else {
      console.log('No registration token available.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error);
  }
};

// Function to handle incoming messages (when the app is in the foreground)
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
