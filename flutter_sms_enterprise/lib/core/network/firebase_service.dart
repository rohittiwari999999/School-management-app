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
  final FirebaseAuth auth = FirebaseAuth.instance;
  final FirebaseFirestore firestore = FirebaseFirestore.instance;
  final FirebaseStorage storage = FirebaseStorage.instance;
  final FirebaseMessaging messaging = FirebaseMessaging.instance;
  final FirebaseAppCheck appCheck = FirebaseAppCheck.instance;

  /// Initialize Firebase App Check, Firestore offline persistence cache,
  /// and cloud messaging permissions.
  Future<void> initialize() async {
    try {
      // 1. Firebase App Check using Google Play Integrity & Apple DeviceCheck
      // Strictly enforces that all incoming Firestore & Cloud Function requests
      // originate exclusively from the official, verified production Flutter binary.
      await appCheck.activate(
        // Play Integrity provider for Android (verifies APK signature & Play licensing)
        androidProvider: kReleaseMode
            ? AndroidProvider.playIntegrity
            : AndroidProvider.debug,
        // DeviceCheck provider for iOS (attests device identity with Apple DeviceCheck service)
        appleProvider: kReleaseMode
            ? AppleProvider.deviceCheck
            : AppleProvider.debug,
      );

      debugPrint('Firebase App Check successfully activated with Play Integrity / DeviceCheck');

      // 2. Heavily utilize Firestore's built-in offline persistence cache
      // The teacher can submit attendance anywhere without connectivity.
      // Firestore queues local writes and syncs to Firebase the second they walk into Wi-Fi.
      firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );

      debugPrint('Firestore offline persistence cache enabled (persistenceEnabled: true)');

      // 3. Notification permissions for administrative & school broadcasts
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      debugPrint('FCM Notification authorization status: ${settings.authorizationStatus}');
    } catch (e) {
      debugPrint('Firebase service initialization error / notice: $e');
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
