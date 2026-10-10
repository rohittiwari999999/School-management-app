import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';
import 'package:edupulse_sms/features/auth/domain/models/app_user.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final firebaseService = ref.watch(firebaseServiceProvider);
  return AuthRepository(firebaseService);
});

class AuthRepository {
  final FirebaseService _firebase;

  AuthRepository(this._firebase);

  Stream<User?> get authStateChanges => _firebase.auth.authStateChanges();

  User? get currentUser => _firebase.auth.currentUser;

  /// Fetch full user profile with role claims from Firestore
  Future<AppUser?> getUserProfile(String uid) async {
    final doc = await _firebase.firestore
        .collection(AppConstants.colUsers)
        .doc(uid)
        .get();

    if (!doc.exists || doc.data() == null) {
      return null;
    }

    return AppUser.fromFirestore(doc.data()!, uid);
  }

  /// Sign in with email and password
  Future<AppUser> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    final credential = await _firebase.auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );

    final user = credential.user;
    if (user == null) {
      throw Exception('Authentication returned empty credential user');
    }

    // Update FCM token
    final fcmToken = await _firebase.getDeviceFCMToken();
    if (fcmToken != null) {
      await _firebase.firestore
          .collection(AppConstants.colUsers)
          .doc(user.uid)
          .set({
        'fcmTokens': FieldValue.arrayUnion([fcmToken]),
        'lastLoginAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    }

    final profile = await getUserProfile(user.uid);
    if (profile == null) {
      throw Exception('User profile record not found in system directory');
    }

    return profile;
  }

  /// Password reset mail dispatcher
  Future<void> sendPasswordResetEmail(String email) async {
    await _firebase.auth.sendPasswordResetEmail(email: email.trim());
  }

  /// Sign out and cleanup
  Future<void> signOut() async {
    final user = _firebase.auth.currentUser;
    if (user != null) {
      final fcmToken = await _firebase.getDeviceFCMToken();
      if (fcmToken != null) {
        await _firebase.firestore
            .collection(AppConstants.colUsers)
            .doc(user.uid)
            .update({
          'fcmTokens': FieldValue.arrayRemove([fcmToken]),
        }).catchError((_) {});
      }
    }
    await _firebase.auth.signOut();
  }
}
