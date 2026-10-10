# EduPulse K-12 SMS — GitHub Actions CI/CD Build Guide

This directory contains production-ready **GitHub Actions CI/CD workflows** and native project configurations to automatically build **Release APK**, **Android App Bundle (AAB)**, and **iOS App (IPA / Archive)**.

---

## 1. Automated GitHub Actions Workflows

| Workflow | File Path | Trigger | Generated Artifacts |
| :--- | :--- | :--- | :--- |
| **Android Build** | `.github/workflows/build_android_aab_apk.yml` | Push, Pull Request, or Manual Dispatch | • `app-armeabi-v7a-release.apk`<br>• `app-arm64-v8a-release.apk`<br>• `app-release.aab` (Play Store) |
| **iOS Build** | `.github/workflows/build_ios_app.yml` | Push, Pull Request, or Manual Dispatch | • `EduPulse_iOS_Release.ipa`<br>• `Runner.xcarchive` (Xcode) |

---

## 2. GitHub Repository Secrets Setup

Navigate to your GitHub repository: **Settings > Secrets and variables > Actions > New repository secret**.

### Android Secrets (For Signed APK & AAB)
| Secret Name | Value Description |
| :--- | :--- |
| `KEYSTORE_BASE64` | Base64-encoded string of your `upload-keystore.jks` file (`base64 -w 0 upload-keystore.jks`). |
| `KEYSTORE_PASSWORD` | Password of the upload keystore. |
| `KEY_ALIAS` | Alias name for the signing key (e.g. `edupulse-key`). |
| `KEY_PASSWORD` | Password for the key alias. |

> **Note:** If `KEYSTORE_BASE64` is not provided, the GitHub Action automatically falls back to an unsigned release build so CI never breaks.

### iOS Secrets (For Apple App Store / TestFlight Signing)
| Secret Name | Value Description |
| :--- | :--- |
| `BUILD_CERTIFICATE_BASE64` | Base64-encoded Apple Distribution Certificate `.p12` file. |
| `P12_PASSWORD` | Password for the `.p12` certificate. |
| `BUILD_PROVISION_PROFILE_BASE64` | Base64-encoded `.mobileprovision` file from Apple Developer portal. |
| `KEYCHAIN_PASSWORD` | Any temporary random string for CI keychain initialization. |

> **Note:** If iOS certificates are omitted, the workflow automatically builds an unsigned release IPA (`--no-codesign`) packaged into `Payload/` and exported as a test artifact.

---

## 3. Local CLI Build Commands

If building locally on your developer machine:

### Android
```bash
cd flutter_sms_enterprise

# Clean & fetch dependencies
flutter clean
flutter pub get

# 1. Build Split Release APKs (lightweight per architecture: arm64, armeabi, x86_64)
flutter build apk --release --split-per-abi

# 2. Build Universal Release APK
flutter build apk --release

# 3. Build Android App Bundle (AAB) for Google Play Console upload
flutter build appbundle --release
```
**Output paths:**
- APKs: `flutter_sms_enterprise/build/app/outputs/flutter-apk/`
- AAB: `flutter_sms_enterprise/build/app/outputs/bundle/release/app-release.aab`

---

### iOS (Requires macOS with Xcode)
```bash
cd flutter_sms_enterprise

# 1. Fetch Flutter & CocoaPods dependencies
flutter pub get
cd ios && pod install --repo-update && cd ..

# 2. Build Release Archive / Unsigned IPA
flutter build ios --release --no-codesign

# 3. Build Signed IPA for TestFlight / App Store
flutter build ipa --release --export-options-plist=ios/ExportOptions.plist
```
**Output paths:**
- IPA: `flutter_sms_enterprise/build/ios/archive/Runner.xcarchive` or `build/ios/ipa/*.ipa`

---

## 4. Hardware & Permissions Configured

- **Camera (`CAMERA`):** Live video classroom WebRTC participation and homework photo diary scans.
- **Microphone (`RECORD_AUDIO`):** Real-time audio conferencing and student doubt queries.
- **Push Notifications (`POST_NOTIFICATIONS`):** Emergency principal circulars and timetable changes.
- **Multidex Enabled:** Supports full Firebase Suite (Auth, Firestore, Cloud Messaging, Storage).
