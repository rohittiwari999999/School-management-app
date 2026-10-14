import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/widgets/role_switcher_bar.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';

class StaffCredentialItem {
  final String id;
  final String fullName;
  final UserRole role;
  final String email;
  final String password;
  final String phoneNumber;
  final String employeeId;
  final String departmentOrClass;
  final String qualification;
  final bool isAccepted;
  final DateTime acceptedAt;

  const StaffCredentialItem({
    required this.id,
    required this.fullName,
    required this.role,
    required this.email,
    required this.password,
    required this.phoneNumber,
    required this.employeeId,
    required this.departmentOrClass,
    required this.qualification,
    required this.isAccepted,
    required this.acceptedAt,
  });
}

class SuperAdminDashboardScreen extends ConsumerStatefulWidget {
  const SuperAdminDashboardScreen({super.key});

  @override
  ConsumerState<SuperAdminDashboardScreen> createState() =>
      _SuperAdminDashboardScreenState();
}

class _SuperAdminDashboardScreenState
    extends ConsumerState<SuperAdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Initial staff credentials accepted by Super Admin
  final List<StaffCredentialItem> _credentials = [
    StaffCredentialItem(
      id: 'CRED_PRIN_01',
      fullName: 'Dr. Rajesh Sharma',
      role: UserRole.principal,
      email: 'principal@edupulse.org',
      password: 'Principal@Edu2026!',
      phoneNumber: '+91 98765 43210',
      employeeId: 'EMP-PRIN-001',
      departmentOrClass: 'Head of School & Administration',
      qualification: 'Ph.D in Education, M.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    StaffCredentialItem(
      id: 'CRED_TCH_01',
      fullName: 'Mrs. Anjali Verma',
      role: UserRole.teacher,
      email: 'teacher@edupulse.org',
      password: 'Teacher@Physics2026!',
      phoneNumber: '+91 98112 77889',
      employeeId: 'EMP-TCH-102',
      departmentOrClass: 'Senior Physics & Science Labs',
      qualification: 'M.Sc Physics, B.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    StaffCredentialItem(
      id: 'CRED_CT_01',
      fullName: 'Ms. Priya Sharma',
      role: UserRole.classTeacher,
      email: 'classteacher@edupulse.org',
      password: 'ClassTeacher@11A!',
      phoneNumber: '+91 98112 23344',
      employeeId: 'EMP-CT-204',
      departmentOrClass: 'Class 10-A In-Charge & English Dept.',
      qualification: 'M.A English, B.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
    StaffCredentialItem(
      id: 'CRED_ACC_01',
      fullName: 'Mr. Sunil Gupta',
      role: UserRole.accountant,
      email: 'accountant@edupulse.org',
      password: 'Accountant@Bursar2026!',
      phoneNumber: '+91 97654 32109',
      employeeId: 'EMP-ACC-301',
      departmentOrClass: 'Accounts Desk & Fee Bursar',
      qualification: 'M.Com, CA-Inter',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 15)),
    ),
  ];

  // Form Controllers
  final _formKey = GlobalKey<FormState>();
  UserRole _selectedRole = UserRole.principal;
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _empIdController = TextEditingController(text: 'EMP-PRIN-002');
  final _deptController = TextEditingController(text: 'Head of School / Administration');
  final _qualController = TextEditingController();

  bool _obscurePassword = true;
  final Set<String> _revealedPasswords = {};
  String _rosterFilter = 'all';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _empIdController.dispose();
    _deptController.dispose();
    _qualController.dispose();
    super.dispose();
  }

  void _onRoleSelected(UserRole role) {
    setState(() {
      _selectedRole = role;
      switch (role) {
        case UserRole.principal:
          _empIdController.text = 'EMP-PRIN-00${_credentials.where((c) => c.role == UserRole.principal).length + 1}';
          _deptController.text = 'Head of School / Administration';
          break;
        case UserRole.teacher:
          _empIdController.text = 'EMP-TCH-${100 + _credentials.where((c) => c.role == UserRole.teacher).length + 1}';
          _deptController.text = 'Senior Faculty (Mathematics & Physics)';
          break;
        case UserRole.classTeacher:
          _empIdController.text = 'EMP-CT-${200 + _credentials.where((c) => c.role == UserRole.classTeacher).length + 1}';
          _deptController.text = 'Class 11-A In-Charge & Student Mentor';
          break;
        case UserRole.accountant:
          _empIdController.text = 'EMP-ACC-${300 + _credentials.where((c) => c.role == UserRole.accountant).length + 1}';
          _deptController.text = 'Finance & Fee Collection Desk';
          break;
        default:
          break;
      }
    });
  }

  void _generateStrongPassword() {
    final prefix = _selectedRole == UserRole.principal
        ? 'Prin'
        : _selectedRole == UserRole.classTeacher
            ? 'ClsTch'
            : _selectedRole == UserRole.teacher
                ? 'Teach'
                : 'Acc';
    final rand = 1000 + (DateTime.now().millisecond * 9);
    setState(() {
      _passwordController.text = '$prefix@Edu$rand!';
    });
  }

  void _acceptAndSaveCredential() {
    if (!_formKey.currentState!.validate()) return;

    final newCred = StaffCredentialItem(
      id: 'CRED_${DateTime.now().millisecondsSinceEpoch}',
      fullName: _nameController.text.trim(),
      role: _selectedRole,
      email: _emailController.text.trim().toLowerCase(),
      password: _passwordController.text.trim(),
      phoneNumber: _phoneController.text.trim().isEmpty
          ? '+91 98000 00000'
          : _phoneController.text.trim(),
      employeeId: _empIdController.text.trim(),
      departmentOrClass: _deptController.text.trim().isEmpty
          ? 'School Faculty'
          : _deptController.text.trim(),
      qualification: _qualController.text.trim().isEmpty
          ? 'Qualified Specialist'
          : _qualController.text.trim(),
      isAccepted: true,
      acceptedAt: DateTime.now(),
    );

    setState(() {
      _credentials.insert(0, newCred);
      _nameController.clear();
      _emailController.clear();
      _passwordController.clear();
      _phoneController.clear();
      _qualController.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Login credentials accepted for ${newCred.fullName} (${newCred.role.displayName})!',
        ),
        backgroundColor: const Color(0xFF059669),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'View in Roster',
          textColor: Colors.white,
          onPressed: () {
            _tabController.animateTo(1);
          },
        ),
      ),
    );
  }

  void _copyCredentials(StaffCredentialItem item) {
    Clipboard.setData(
      ClipboardData(text: 'Email: ${item.email}\nPassword: ${item.password}'),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Credentials for ${item.fullName} copied to clipboard!'),
        backgroundColor: const Color(0xFF1E293B),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;

    final filteredList = _credentials.where((c) {
      if (_rosterFilter == 'all') return true;
      if (_rosterFilter == 'principal') return c.role == UserRole.principal;
      if (_rosterFilter == 'teacher') return c.role == UserRole.teacher;
      if (_rosterFilter == 'class_teacher') return c.role == UserRole.classTeacher;
      if (_rosterFilter == 'accountant') return c.role == UserRole.accountant;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF881337), // Rose/Burgundy Super Admin header
        foregroundColor: Colors.white,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Super Admin Console',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              user?.fullName ?? 'Shri Vikramaditya Roy (Board Trustee)',
              style: const TextStyle(fontSize: 12, color: Color(0xFFFECDD3)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign Out to Login',
            onPressed: () {
              ref.read(authControllerProvider.notifier).signOut();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: const Color(0xFFFECDD3),
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: [
            Tab(
              icon: const Icon(Icons.person_add_alt_1_rounded, size: 20),
              text: 'Accept Credentials (${_credentials.length})',
            ),
            const Tab(
              icon: Icon(Icons.vpn_key_rounded, size: 20),
              text: 'Staff Login Roster',
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const RoleSwitcherBar(),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  // TAB 1: ACCEPT NEW STAFF CREDENTIALS FORM
                  _buildAcceptCredentialsTab(),

                  // TAB 2: STAFF LOGIN ROSTER DIRECTORY
                  _buildStaffRosterTab(filteredList),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAcceptCredentialsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Governance Info Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF881337), Color(0xFF4C0519)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF881337).withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.security_rounded, color: Colors.white, size: 20),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Text(
                        'Super Admin Authority Desk',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Accept and authorize new login credentials for Principal, Teacher, Class Teacher, and Accountant. Credentials become active immediately.',
                  style: TextStyle(color: Color(0xFFFEE2E2), fontSize: 12),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Card Form
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '1. Select Role to Authorize *',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: Color(0xFF334155),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Role Chips Selector
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildRoleSelectChip(
                        role: UserRole.principal,
                        label: 'Principal',
                        icon: Icons.admin_panel_settings_rounded,
                        color: const Color(0xFFB45309),
                      ),
                      _buildRoleSelectChip(
                        role: UserRole.teacher,
                        label: 'Teacher',
                        icon: Icons.co_present_rounded,
                        color: const Color(0xFF2563EB),
                      ),
                      _buildRoleSelectChip(
                        role: UserRole.classTeacher,
                        label: 'Class Teacher',
                        icon: Icons.assignment_ind_rounded,
                        color: const Color(0xFF0D9488),
                      ),
                      _buildRoleSelectChip(
                        role: UserRole.accountant,
                        label: 'Accountant',
                        icon: Icons.account_balance_wallet_rounded,
                        color: const Color(0xFFE11D48),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Text(
                    '2. Staff Profile & Login Details *',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: Color(0xFF334155),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Full Name
                  TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: 'Full Name of Staff Member *',
                      hintText: _selectedRole == UserRole.principal
                          ? 'e.g. Dr. Ramesh Chander'
                          : _selectedRole == UserRole.classTeacher
                              ? 'e.g. Ms. Shweta Roy'
                              : _selectedRole == UserRole.teacher
                                  ? 'e.g. Mrs. Sunita Rao'
                                  : 'e.g. Mr. Amit Goenka',
                      prefixIcon: const Icon(Icons.person_outline, size: 20),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                    validator: (val) =>
                        (val == null || val.trim().isEmpty) ? 'Please enter staff full name' : null,
                  ),

                  const SizedBox(height: 12),

                  // Email Address (Login ID)
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'Official Email (Login ID) *',
                      hintText: 'staff.name@edupulse.org',
                      prefixIcon: const Icon(Icons.email_outlined, size: 20),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Please enter official email';
                      }
                      if (!val.contains('@')) {
                        return 'Enter a valid email address';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 12),

                  // Password with generator
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            labelText: 'Login Password / Access Key *',
                            hintText: 'Enter or generate password',
                            prefixIcon: const Icon(Icons.lock_outline, size: 20),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                size: 20,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                          validator: (val) =>
                              (val == null || val.trim().isEmpty) ? 'Please enter a password' : null,
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton.filledTonal(
                        onPressed: _generateStrongPassword,
                        icon: const Icon(Icons.auto_awesome_rounded),
                        tooltip: 'Generate Strong Password',
                        style: IconButton.styleFrom(
                          backgroundColor: const Color(0xFFFECDD3),
                          foregroundColor: const Color(0xFF881337),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Phone & Employee ID in a row
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          decoration: InputDecoration(
                            labelText: 'Phone Number',
                            hintText: '+91 98765 00000',
                            prefixIcon: const Icon(Icons.phone_outlined, size: 20),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: TextFormField(
                          controller: _empIdController,
                          decoration: InputDecoration(
                            labelText: 'Staff ID',
                            prefixIcon: const Icon(Icons.badge_outlined, size: 20),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Department / Class
                  TextFormField(
                    controller: _deptController,
                    decoration: InputDecoration(
                      labelText: 'Department / Assigned Section',
                      prefixIcon: const Icon(Icons.school_outlined, size: 20),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Submit Button
                  ElevatedButton.icon(
                    onPressed: _acceptAndSaveCredential,
                    icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                    label: const Text(
                      'Accept & Issue Login Credentials',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF881337),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleSelectChip({
    required UserRole role,
    required String label,
    required IconData icon,
    required Color color,
  }) {
    final isSelected = _selectedRole == role;
    return InkWell(
      onTap: () => _onRoleSelected(role),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? color : color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? color : color.withOpacity(0.2),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: isSelected ? Colors.white : color),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStaffRosterTab(List<StaffCredentialItem> items) {
    return Column(
      children: [
        // Filter Chips Bar
        Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('all', 'All Staff (${_credentials.length})'),
                const SizedBox(width: 8),
                _buildFilterChip('principal', 'Principal'),
                const SizedBox(width: 8),
                _buildFilterChip('teacher', 'Teachers'),
                const SizedBox(width: 8),
                _buildFilterChip('class_teacher', 'Class Teachers'),
                const SizedBox(width: 8),
                _buildFilterChip('accountant', 'Accountants'),
              ],
            ),
          ),
        ),

        const Divider(height: 1, color: Color(0xFFE2E8F0)),

        // Roster List
        Expanded(
          child: items.isEmpty
              ? const Center(
                  child: Text(
                    'No staff credentials found.',
                    style: TextStyle(color: Color(0xFF94A3B8)),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = items[index];
                    final isPasswordVisible = _revealedPasswords.contains(item.id);

                    Color roleColor;
                    switch (item.role) {
                      case UserRole.principal:
                        roleColor = const Color(0xFFB45309);
                        break;
                      case UserRole.teacher:
                        roleColor = const Color(0xFF2563EB);
                        break;
                      case UserRole.classTeacher:
                        roleColor = const Color(0xFF0D9488);
                        break;
                      case UserRole.accountant:
                        roleColor = const Color(0xFFE11D48);
                        break;
                      default:
                        roleColor = const Color(0xFF64748B);
                    }

                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: roleColor.withOpacity(0.12),
                                child: Text(
                                  item.fullName.isNotEmpty ? item.fullName[0] : 'S',
                                  style: TextStyle(
                                    color: roleColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.fullName,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${item.departmentOrClass} • ${item.employeeId}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: roleColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: roleColor.withOpacity(0.2)),
                                ),
                                child: Text(
                                  item.role.displayName.split('(')[0].trim(),
                                  style: TextStyle(
                                    color: roleColor,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 12),
                          const Divider(height: 1, color: Color(0xFFF1F5F9)),
                          const SizedBox(height: 10),

                          // Credentials block
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.email_outlined, size: 14, color: Color(0xFF64748B)),
                                    const SizedBox(width: 6),
                                    Expanded(
                                      child: Text(
                                        item.email,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF1E293B),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const Icon(Icons.lock_outline, size: 14, color: Color(0xFF64748B)),
                                    const SizedBox(width: 6),
                                    Text(
                                      isPasswordVisible ? item.password : '••••••••••••',
                                      style: const TextStyle(
                                        fontFamily: 'monospace',
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                    const Spacer(),
                                    InkWell(
                                      onTap: () {
                                        setState(() {
                                          if (isPasswordVisible) {
                                            _revealedPasswords.remove(item.id);
                                          } else {
                                            _revealedPasswords.add(item.id);
                                          }
                                        });
                                      },
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 4),
                                        child: Icon(
                                          isPasswordVisible ? Icons.visibility_off : Icons.visibility,
                                          size: 16,
                                          color: const Color(0xFF64748B),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    InkWell(
                                      onTap: () => _copyCredentials(item),
                                      child: const Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 4),
                                        child: Icon(
                                          Icons.copy_rounded,
                                          size: 16,
                                          color: Color(0xFF881337),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 10),

                          // Quick Test Sign In Button
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton.icon(
                              onPressed: () {
                                ref.read(authControllerProvider.notifier).loginAsDemoRole(item.role);
                              },
                              icon: const Icon(Icons.login_rounded, size: 14),
                              label: Text(
                                'Test Login as ${item.role.displayName.split('(')[0].trim()}',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                              style: TextButton.styleFrom(
                                foregroundColor: roleColor,
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final isSelected = _rosterFilter == value;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.white : const Color(0xFF475569),
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFF881337),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) {
        setState(() {
          _rosterFilter = value;
        });
      },
      showCheckmark: false,
    );
  }
}
