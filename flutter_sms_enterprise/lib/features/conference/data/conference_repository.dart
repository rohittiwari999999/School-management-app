import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';

final conferenceRepositoryProvider = Provider<ConferenceRepository>((ref) {
  final firebaseService = ref.watch(firebaseServiceProvider);
  return ConferenceRepository(firebaseService);
});

class ConferenceRepository {
  final FirebaseService _firebase;

  ConferenceRepository(this._firebase);

  static const String colConferences = 'conferences';

  /// Stream of active live conferences
  Stream<List<LiveConferenceModel>> streamLiveConferences() {
    return _firebase.firestore
        .collection(colConferences)
        .where('status', isEqualTo: 'live')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => LiveConferenceModel.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  /// Create and start a new live classroom or all-hands assembly
  Future<String> createConference(LiveConferenceModel conference) async {
    final docRef = await _firebase.firestore
        .collection(colConferences)
        .add(conference.toFirestore());
    return docRef.id;
  }

  /// Mark conference as ended
  Future<void> endConference(String sessionId) async {
    await _firebase.firestore.collection(colConferences).doc(sessionId).update({
      'status': 'ended',
      'endedAt': FieldValue.serverTimestamp(),
    });
  }
}
