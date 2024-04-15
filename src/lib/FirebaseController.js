import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

export class FirebaseController {
    constructor() {
        const useEmulator = false;

        const firebaseConfig = {
            apiKey: "AIzaSyD_zMBYqbREwqHXIjl23BJnnYKZgeGTOHM",
            authDomain: "hcmut232sephau.firebaseapp.com",
            projectId: "hcmut232sephau",
            storageBucket: "hcmut232sephau.appspot.com",
            messagingSenderId: "157198175036",
            appId: "1:157198175036:web:3aa247386c867bba4bec39",
            measurementId: "G-BDVJWBYBXM"
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.auth = getAuth(this.app);
        if (useEmulator) {
            connectAuthEmulator(this.auth, "http://127.0.0.1:9099");
        }
        this.db = getFirestore(this.app);
        if (useEmulator) {
            connectFirestoreEmulator(this.db, "127.0.0.1", 8080);
        }
    }
}
