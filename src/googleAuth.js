import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = (navigate) => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("Google Auth User:", user);

      const userRef = doc(db, 'users', user.uid);

      setDoc(userRef, {
        likedShows: [],
        watchlistShows: []
      }, { merge: true })
      .then(() => {
        console.log('User data initialized in Firestore!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error initializing user data in Firestore:', error);
      });
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google Auth Error", errorCode, errorMessage);
    });
};
