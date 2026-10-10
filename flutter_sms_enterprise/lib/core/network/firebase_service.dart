import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
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

  /// Initialize offline cache and cloud messaging permissions
  Future<void> initialize() async {
    try {
      // Enable offline persistence settings for Firestore
      firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );

      // Notification permissions
      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      debugPrint('FCM Notification authorization status: ${settings.authorizationStatus}');
    } catch (e) {
      debugPrint('Firebase service initialization notice: $e');
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
