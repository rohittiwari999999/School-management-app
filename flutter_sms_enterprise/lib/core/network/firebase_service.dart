import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_app_check/firebase_app_check.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final firebaseServiceProvider = Provider<FirebaseService>((ref) {
  return FirebaseService();
});

class FirebaseService {
  FirebaseAuth get auth => FirebaseAuth.instance;
  FirebaseFirestore get firestore => FirebaseFirestore.instance;
  FirebaseStorage get storage => FirebaseStorage.instance;
  FirebaseMessaging get messaging => FirebaseMessaging.instance;
  FirebaseAppCheck get appCheck => FirebaseAppCheck.instance;

  /// Initialize Firebase App Check, Firestore offline persistence cache,
  /// and cloud messaging permissions safely.
  Future<void> initialize() async {
    try {
      await Firebase.initializeApp();
      debugPrint('Firebase Core initialized successfully.');
    } catch (e) {
      debugPrint('Firebase Core initialize bypassed / offline mode: $e');
    }

    try {
      // 1. Firebase App Check using Google Play Integrity & Apple DeviceCheck
      // Strictly safe fallback so side-loaded test APK does not crash
      await appCheck.activate(
        androidProvider: kReleaseMode
            ? AndroidProvider.playIntegrity
            : AndroidProvider.debug,
        appleProvider: kReleaseMode
            ? AppleProvider.deviceCheck
            : AppleProvider.debug,
      );
      debugPrint('Firebase App Check successfully activated');
    } catch (e) {
      debugPrint('Firebase App Check notice (bypassed for direct APK install): $e');
    }

    try {
      // 2. Offline persistence cache
      firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );
      debugPrint('Firestore offline persistence cache enabled');
    } catch (e) {
      debugPrint('Firestore settings notice: $e');
    }

    try {
      // 3. Notification permissions
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );
      debugPrint('FCM Notification authorization status: ${settings.authorizationStatus}');
    } catch (e) {
      debugPrint('FCM notification permission notice: $e');
    }
  }

  /// Get active Firebase App Check token for debugging / backend headers
  Future<String?> getAppCheckToken() async {
    try {
      return await appCheck.getToken();
    } catch (e) {
      debugPrint('Error getting App Check token: $e');
      return null;
    }
  }

  /// Get current user device FCM token for circulars/broadcasts
  Future<String?> getDeviceFCMToken() async {
    try {
      return await messaging.getToken();
    } catch (e) {
      debugPrint('Error fetching FCM token: $e');
      return null;
    }
  }

  /// Upload file to storage with progress callback
  Future<String> uploadAttachment({
    required String path,
    required Uint8List bytes,
    required String contentType,
  }) async {
    final ref = storage.ref().child(path);
    final metadata = SettableMetadata(contentType: contentType);
    final uploadTask = ref.putData(bytes, metadata);
    final snapshot = await uploadTask.whenComplete(() {});
    return await snapshot.ref.getDownloadURL();
  }
}
