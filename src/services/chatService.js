import { db } from "../keys/FirebaseAuth";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

export async function addMessage(userId, sender, text) {
  await addDoc(collection(db, "chats", userId, "messages"), {
    sender,
    text,
    timestamp: serverTimestamp()
  });
}

export function listenToMessages(userId, callback) {
  const q = query(
    collection(db, "chats", userId, "messages"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
}
