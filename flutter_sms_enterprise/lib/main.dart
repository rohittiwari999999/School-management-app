import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';
import 'package:edupulse_sms/core/router/app_router.dart';
import 'package:edupulse_sms/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Core Firebase Services & Offline Cache
  final container = ProviderContainer();
  final firebaseService = container.read(firebaseServiceProvider);
  await firebaseService.initialize();

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const EduPulseApp(),
    ),
  );
}

class EduPulseApp extends ConsumerWidget {
  const EduPulseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
