import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// ─── Generic helpers ───────────────────────────────────────────────────────────

const toData = (snap) =>
  snap.exists() ? { id: snap.id, ...snap.data() } : null;

const toDocs = (snap) =>
  snap.docs.map((d) => ({ id: d.id, ...d.data() }));

// ─── Posts ─────────────────────────────────────────────────────────────────────

export const postService = {
  async list(limitCount = 50) {
    const q = query(
      collection(db, 'posts'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async get(postId) {
    return toData(await getDoc(doc(db, 'posts', postId)));
  },

  async create(data, userId) {
    const ref = await addDoc(collection(db, 'posts'), {
      ...data,
      created_by: userId,
      likes_count: 0,
      comments_count: 0,
      created_at: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  },

  async delete(postId) {
    await deleteDoc(doc(db, 'posts', postId));
  },

  async listByUser(userId, limitCount = 20) {
    const q = query(
      collection(db, 'posts'),
      where('created_by', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },
};

// ─── Likes ─────────────────────────────────────────────────────────────────────

export const likeService = {
  /** Returns true if the user already liked the post */
  async hasLiked(postId, userId) {
    const likeId = `${postId}_${userId}`;
    const snap = await getDoc(doc(db, 'likes', likeId));
    return snap.exists();
  },

  async like(postId, userId) {
    const likeId = `${postId}_${userId}`;
    await setDoc(doc(db, 'likes', likeId), {
      post_id: postId,
      user_id: userId,
      created_at: serverTimestamp(),
    });
    await updateDoc(doc(db, 'posts', postId), { likes_count: increment(1) });
  },

  async unlike(postId, userId) {
    const likeId = `${postId}_${userId}`;
    await deleteDoc(doc(db, 'likes', likeId));
    await updateDoc(doc(db, 'posts', postId), { likes_count: increment(-1) });
  },
};

// ─── Comments ──────────────────────────────────────────────────────────────────

export const commentService = {
  async list(postId, limitCount = 100) {
    const q = query(
      collection(db, 'comments'),
      where('post_id', '==', postId),
      orderBy('created_at', 'asc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async create(postId, data) {
    const ref = await addDoc(collection(db, 'comments'), {
      post_id: postId,
      ...data,
      created_at: serverTimestamp(),
    });
    await updateDoc(doc(db, 'posts', postId), { comments_count: increment(1) });
    return { id: ref.id, ...data };
  },
};

// ─── Matches ───────────────────────────────────────────────────────────────────

export const matchService = {
  async list(limitCount = 20) {
    const q = query(
      collection(db, 'matches'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async listByUser(userId, limitCount = 20) {
    const q = query(
      collection(db, 'matches'),
      where('created_by', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async create(data, userId) {
    const ref = await addDoc(collection(db, 'matches'), {
      ...data,
      created_by: userId,
      filled_slots: 0,
      status: 'aberta',
      created_at: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  },

  async join(matchId) {
    await updateDoc(doc(db, 'matches', matchId), { filled_slots: increment(1) });
  },
};

// ─── Tournaments ───────────────────────────────────────────────────────────────

export const tournamentService = {
  async list(limitCount = 30) {
    const q = query(
      collection(db, 'tournaments'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async create(data, userId) {
    const ref = await addDoc(collection(db, 'tournaments'), {
      ...data,
      created_by: userId,
      created_at: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  },
};

// ─── Chat ──────────────────────────────────────────────────────────────────────

export const chatService = {
  /** Build a deterministic conversation ID from two UIDs */
  conversationId(uid1, uid2) {
    return [uid1, uid2].sort().join('___');
  },

  async sendMessage(conversationId, data) {
    const ref = await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      ...data,
      read: false,
      created_at: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  },

  async getMessages(conversationId, limitCount = 100) {
    const q = query(
      collection(db, 'messages'),
      where('conversation_id', '==', conversationId),
      orderBy('created_at', 'asc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async getConversations(userId) {
    const [sent, received] = await Promise.all([
      getDocs(
        query(
          collection(db, 'messages'),
          where('sender_id', '==', userId),
          orderBy('created_at', 'desc'),
          limit(50)
        )
      ),
      getDocs(
        query(
          collection(db, 'messages'),
          where('receiver_id', '==', userId),
          orderBy('created_at', 'desc'),
          limit(50)
        )
      ),
    ]);

    const all = [...toDocs(sent), ...toDocs(received)];
    const map = {};
    all.forEach((msg) => {
      const otherId =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      const otherName =
        msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
      if (!map[otherId]) {
        map[otherId] = {
          id: msg.conversation_id,
          name: otherName || otherId,
          photo: msg.sender_id === userId ? msg.receiver_photo || '' : msg.sender_photo || '',
          lastMessage: msg.message,
          time: '',
          unread: 0,
          other_uid: otherId,
        };
      }
    });
    return Object.values(map);
  },
};

// ─── Users ─────────────────────────────────────────────────────────────────────

export const userService = {
  async list(limitCount = 50) {
    const q = query(
      collection(db, 'users'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },

  async get(uid) {
    return toData(await getDoc(doc(db, 'users', uid)));
  },

  async update(uid, data) {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updated_at: serverTimestamp(),
    });
  },
};

// ─── Rankings / Stats ──────────────────────────────────────────────────────────

export const rankingService = {
  async getTopUsers(limitCount = 20) {
    const q = query(
      collection(db, 'users'),
      orderBy('posts_count', 'desc'),
      limit(limitCount)
    );
    return toDocs(await getDocs(q));
  },
};

// ─── File Upload ───────────────────────────────────────────────────────────────

export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path || `uploads/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
