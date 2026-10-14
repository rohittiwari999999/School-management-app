import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';

class RoleSwitcherBar extends ConsumerWidget {
  const RoleSwitcherBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;
    final currentRole = user?.role ?? UserRole.teacher;

    final roles = [
      {'role': UserRole.superAdmin, 'label': 'Super Admin', 'icon': Icons.shield_rounded, 'path': '/super_admin/dashboard'},
      {'role': UserRole.principal, 'label': 'Principal', 'icon': Icons.account_balance_rounded, 'path': '/principal/dashboard'},
      {'role': UserRole.teacher, 'label': 'Teacher', 'icon': Icons.school_rounded, 'path': '/teacher/dashboard'},
      {'role': UserRole.parentStudent, 'label': 'Parent', 'icon': Icons.family_restroom_rounded, 'path': '/family/dashboard'},
      {'role': UserRole.accountant, 'label': 'Clerk / Accounts', 'icon': Icons.receipt_long_rounded, 'path': '/accountant/dashboard'},
    ];

    final quickLinks = [
      {'label': 'Timetable', 'icon': Icons.calendar_month, 'path': '/timetable'},
      {'label': 'Exams & Grades', 'icon': Icons.analytics, 'path': '/exams'},
      {'label': 'Diary & Circulars', 'icon': Icons.menu_book, 'path': '/communication'},
      {'label': 'Live Class', 'icon': Icons.video_call, 'path': '/conference'},
    ];

    return Container(
      color: const Color(0xFF0F172A),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top row: App branding + current user indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2563EB), Color(0xFF4F46E5)],
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.school, color: Colors.white, size: 16),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'EduPulse K-12',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),
              if (user != null)
                Row(
                  children: [
                    CircleAvatar(
                      radius: 12,
                      backgroundImage: user.avatarUrl != null
                          ? NetworkImage(user.avatarUrl!)
                          : null,
                      child: user.avatarUrl == null
                          ? Text(user.fullName.isNotEmpty ? user.fullName[0] : 'U', style: const TextStyle(fontSize: 10))
                          : null,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      user.fullName.split(' ').first,
                      style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      onTap: () async {
                        await ref.read(authControllerProvider.notifier).signOut();
                        if (context.mounted) {
                          context.go('/login');
                        }
                      },
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF4444).withOpacity(0.18),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.4)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.logout_rounded, size: 12, color: Color(0xFFFCA5A5)),
                            SizedBox(width: 3),
                            Text(
                              'Sign Out',
                              style: TextStyle(color: Color(0xFFFCA5A5), fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                )
              else
                InkWell(
                  onTap: () => context.go('/login'),
                  borderRadius: BorderRadius.circular(6),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.login_rounded, size: 12, color: Colors.white),
                        SizedBox(width: 4),
                        Text(
                          'Sign In',
                          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),

          // Horizontal scrollable role buttons + Quick module links
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                const Padding(
                  padding: EdgeInsets.only(right: 6),
                  child: Text(
                    'Roles:',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
                ...roles.map((r) {
                  final role = r['role'] as UserRole;
                  final isSelected = currentRole == role;
                  final label = r['label'] as String;
                  final icon = r['icon'] as IconData;
                  final path = r['path'] as String;

                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: InkWell(
                      onTap: () {
                        if (!isSelected) {
                          ref.read(authControllerProvider.notifier).loginAsDemoRole(role);
                          context.go(path);
                        }
                      },
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF60A5FA) : const Color(0xFF334155),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(icon, size: 12, color: isSelected ? Colors.white : const Color(0xFF94A3B8)),
                            const SizedBox(width: 4),
                            Text(
                              label,
                              style: TextStyle(
                                color: isSelected ? Colors.white : const Color(0xFFCBD5E1),
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),

                // Divider separator between roles and modules
                Container(
                  height: 16,
                  width: 1,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  color: const Color(0xFF334155),
                ),

                const Padding(
                  padding: EdgeInsets.only(right: 6, left: 4),
                  child: Text(
                    'Modules:',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),

                ...quickLinks.map((q) {
                  final label = q['label'] as String;
                  final icon = q['icon'] as IconData;
                  final path = q['path'] as String;

                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: InkWell(
                      onTap: () => context.push(path),
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFF475569)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(icon, size: 12, color: const Color(0xFF38BDF8)),
                            const SizedBox(width: 4),
                            Text(
                              label,
                              style: const TextStyle(
                                color: Color(0xFFE2E8F0),
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
