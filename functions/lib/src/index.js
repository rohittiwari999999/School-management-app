"use strict";
/**
 * EduPulse K-12 SMS — Firebase Cloud Functions
 *
 * Backend Data Aggregation & Server-side Trigger Engine
 *
 * Requirements:
 * Whenever a teacher submits attendance in `attendance/{attendanceId}`,
 * this Cloud Function silently increments a single `presentCount` integer
 * in the `dashboard_stats/today` document using FieldValue.increment().
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDailyStatsAtMidnight = exports.aggregateAttendanceOnWrite = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const firestore_2 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Cloud Function (Firestore 2nd Gen Trigger):
 * Listens to write events on `attendance/{attendanceId}`.
 *
 * Whenever a teacher submits or modifies daily roll-call attendance:
 * 1. Computes the net change (`delta`) in presentCount between before and after states.
 * 2. Silently increments the single `presentCount` integer in `dashboard_stats/today`
 *    using atomic FieldValue.increment(delta).
 * 3. Client devices (Principal console, Parent app) observe updated totals in real-time
 *    without requiring expensive collection scans or client-side calculation loops.
 */
exports.aggregateAttendanceOnWrite = (0, firestore_1.onDocumentWritten)({
    document: 'attendance/{attendanceId}',
    region: 'asia-east1', // Default project region
    memory: '256MiB',
    maxInstances: 10,
}, async (event) => {
    const attendanceId = event.params.attendanceId;
    const beforeSnap = event.data?.before;
    const afterSnap = event.data?.after;
    const beforeData = beforeSnap?.exists ? beforeSnap.data() : null;
    const afterData = afterSnap?.exists ? afterSnap.data() : null;
    // Determine the before and after presentCount
    const oldPresentCount = beforeData?.presentCount ?? 0;
    const newPresentCount = afterData?.presentCount ?? 0;
    // Calculate the difference to apply to the running total
    const delta = newPresentCount - oldPresentCount;
    // If there is no net change in present count, exit silently
    if (delta === 0) {
        console.log(`[aggregateAttendanceOnWrite] Document ${attendanceId} written with no change to presentCount (old: ${oldPresentCount}, new: ${newPresentCount}). Skipping.`);
        return;
    }
    console.log(`[aggregateAttendanceOnWrite] Detected attendance change for ${attendanceId}. Applying delta of ${delta > 0 ? `+${delta}` : delta} to dashboard_stats/today.`);
    const todayStatsRef = db.doc('dashboard_stats/today');
    try {
        // Perform atomic increment on the single integer field `presentCount`
        await todayStatsRef.set({
            presentCount: firestore_2.FieldValue.increment(delta),
            lastAggregatedRecordId: attendanceId,
            lastUpdated: firestore_2.FieldValue.serverTimestamp(),
            targetDate: afterData?.date || new Date().toISOString().split('T')[0],
            aggregationStrategy: 'Cloud Function onDocumentWritten (Silent Atomic Increment)',
        }, { merge: true });
        console.log(`[aggregateAttendanceOnWrite] Successfully incremented dashboard_stats/today by ${delta}. Target doc updated.`);
    }
    catch (error) {
        console.error(`[aggregateAttendanceOnWrite] Error incrementing dashboard_stats/today for ${attendanceId}:`, error);
        throw error;
    }
});
/**
 * Scheduled Cloud Function: Midnight Rollover
 * Runs every midnight (00:01 AM IST) to snapshot yesterday's aggregated stats
 * and cleanly reset dashboard_stats/today for the fresh academic school day.
 */
exports.resetDailyStatsAtMidnight = (0, scheduler_1.onSchedule)({
    schedule: '1 0 * * *',
    timeZone: 'Asia/Kolkata',
}, async () => {
    const todayDoc = await db.doc('dashboard_stats/today').get();
    if (todayDoc.exists) {
        const data = todayDoc.data();
        const archiveDate = data?.targetDate || new Date().toISOString().split('T')[0];
        // Archive previous day's metrics
        await db.doc(`dashboard_stats/history_${archiveDate}`).set({
            ...data,
            archivedAt: firestore_2.FieldValue.serverTimestamp(),
        });
        // Initialize fresh counter for the new day
        await db.doc('dashboard_stats/today').set({
            presentCount: 0,
            totalEnrolled: 1480,
            targetDate: new Date().toISOString().split('T')[0],
            lastUpdated: firestore_2.FieldValue.serverTimestamp(),
            lastAggregatedRecordId: 'INIT_MIDNIGHT_RESET',
            aggregationStrategy: 'Cloud Function onDocumentWritten (Silent Atomic Increment)',
        });
        console.log(`[resetDailyStatsAtMidnight] Successfully archived stats for ${archiveDate} and reset today's counter.`);
    }
});
//# sourceMappingURL=index.js.map