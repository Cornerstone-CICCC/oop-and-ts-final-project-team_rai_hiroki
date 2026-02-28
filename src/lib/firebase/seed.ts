import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import type { UserDocument } from "@/types";
import { firebaseConfig } from "./config";
import { DUMMY_USERS } from "@/features/users/data/dummyUsers";

/**
 * Seed dummy users into Firebase Emulator.
 *
 * Uses a separate Firebase app instance so the main app's auth state
 * is not affected. For each user:
 *   1. createUserWithEmailAndPassword (also signs in on the seed app)
 *   2. Write Firestore user document (passes security rules as authenticated user)
 *
 * If a user already exists (EMAIL_EXISTS), it is silently skipped.
 * Only runs in development mode.
 */
export async function seedDummyData(): Promise<void> {
  if (!import.meta.env.DEV) {
    return;
  }

  // Create a separate Firebase app so we don't interfere with the main auth state
  const seedApp = initializeApp(firebaseConfig, "seed");
  const seedAuth = getAuth(seedApp);
  const seedDb = getFirestore(seedApp);

  try {
    connectAuthEmulator(seedAuth, "http://localhost:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(seedDb, "localhost", 8080);
  } catch {
    // Already connected — ignore
  }

  try {
    for (const user of DUMMY_USERS) {
      try {
        // Create auth user (signs in on seedAuth, NOT the main auth)
        const cred = await createUserWithEmailAndPassword(
          seedAuth,
          user.email,
          user.password,
        );

        // Write Firestore doc as this authenticated user
        const now = serverTimestamp();
        const userDoc: UserDocument = {
          email: user.email,
          displayName: user.displayName,
          bio: user.bio,
          photoURL: null,
          createdAt: now as unknown as Timestamp,
          updatedAt: now as unknown as Timestamp,
          lastLoginAt: now as unknown as Timestamp,
        };

        await setDoc(doc(seedDb, "users", cred.user.uid), userDoc);
        console.log(`[Seed] Created user: ${user.displayName}`);
      } catch (e: unknown) {
        // User already exists — skip
        if (
          e instanceof Error &&
          "code" in e &&
          (e as { code: string }).code === "auth/email-already-in-use"
        ) {
          continue;
        }
        throw e;
      }
    }

    console.log("[Seed] Done.");
  } catch (error) {
    console.warn("[Seed] Failed to seed dummy data:", error);
  } finally {
    await deleteApp(seedApp);
  }
}
