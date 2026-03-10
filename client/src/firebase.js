// Placeholder configuration for Firebase.
// The user needs to create a .env file locally with these variables.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDSduyQc1RUWPoksFRjzo1RPNFB7Aio8sA",
    authDomain: "queue-management-system-59e4b.firebaseapp.com",
    projectId: "queue-management-system-59e4b",
    appId: "1:139979340194:web:444fcd6c755cc10dc31afb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
