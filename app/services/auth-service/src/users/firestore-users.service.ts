import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreUsersService {
  private firestore: admin.firestore.Firestore;
  private usersCollection: admin.firestore.CollectionReference;

  constructor() {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    this.firestore = admin.firestore();
    this.usersCollection = this.firestore.collection('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.usersCollection.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const updatedDoc = await this.ensureUserIdHash(doc);
    return this.documentToUser(updatedDoc);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const snapshot = await this.usersCollection.where('googleId', '==', googleId).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const updatedDoc = await this.ensureUserIdHash(doc);
    return this.documentToUser(updatedDoc);
  }

  // Migrate old documents that don't have userIdHash
  private async ensureUserIdHash(
    doc: admin.firestore.QueryDocumentSnapshot,
  ): Promise<admin.firestore.DocumentSnapshot> {
    const data = doc.data();
    if (!data.userIdHash) {
      const tempId = Date.now() + Math.floor(Math.random() * 1000);
      await doc.ref.update({ userIdHash: tempId });
      // Re-fetch the document to get the updated data
      return await doc.ref.get();
    }
    return doc;
  }

  async findById(id: number): Promise<User | null> {
    // Find by the stored userId field (which is the Firestore doc ID hash)
    const snapshot = await this.usersCollection.where('userIdHash', '==', id).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return this.documentToUser(doc);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    // Same as findByEmail, but includes passwordHash
    return this.findByEmail(email);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    // Generate a consistent numeric ID from document creation
    const tempId = Date.now() + Math.floor(Math.random() * 1000);

    const docRef = await this.usersCollection.add({
      ...userData,
      userIdHash: tempId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return this.documentToUser(doc);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    // Find user by hashed ID
    const snapshot = await this.usersCollection.where('userIdHash', '==', id).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.update({
      ...userData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return this.documentToUser(doc);
  }

  private documentToUser(doc: admin.firestore.DocumentSnapshot): User {
    const data = doc.data();
    const user = new User();

    // Use the stored userIdHash as the numeric user ID
    user.id = data.userIdHash || this.hashStringToNumber(doc.id);
    user.email = data.email;
    user.name = data.name;
    user.passwordHash = data.passwordHash;
    user.googleId = data.googleId;
    user.avatarUrl = data.avatarUrl;

    return user;
  }

  private hashStringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
