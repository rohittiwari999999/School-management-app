import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/features/fees/domain/fee_calculator.dart';

class AccountantDashboardScreen extends ConsumerStatefulWidget {
  const AccountantDashboardScreen({super.key});

  @override
  ConsumerState<AccountantDashboardScreen> createState() =>
      _AccountantDashboardScreenState();
}

class _AccountantDashboardScreenState extends ConsumerState<AccountantDashboardScreen> {
  String _selectedStatus = 'all';
  String _searchQuery = '';

  // Initial mock invoice ledger for demonstration
  final List<InvoiceModel> _invoices = [
    InvoiceModel(
      invoiceId: 'INV-2026-001',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_CLASS11_01',
      studentName: 'Aarav Sharma',
      classId: 'CLS_11',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().add(const Duration(days: 5)),
      status: 'pending',
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Senior Secondary Tuition (PCM)', amount: 18000),
        FeeItem(feeType: 'lab', title: 'Physics & Chemistry Lab Fee', amount: 4500),
        FeeItem(feeType: 'transport', title: 'Route 14 AC Bus Service', amount: 3500),
        FeeItem(feeType: 'sports', title: 'Cricket & Swimming Academy', amount: 1500),
      ],
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-002',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_CLASS5_01',
      studentName: 'Rhea Sharma',
      classId: 'CLS_5',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().subtract(const Duration(days: 10)),
      status: 'paid',
      amountPaid: 16500,
      transactionRef: 'RZP_TXN_9876543210',
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Primary Tuition (Class 5)', amount: 12000),
        FeeItem(feeType: 'lab', title: 'Computer STEM Lab', amount: 2500),
        FeeItem(feeType: 'activity', title: 'Annual Co-Curricular & Arts', amount: 2000),
      ],
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-003',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_NURSERY_01',
      studentName: 'Ananya Sharma',
      classId: 'CLS_NURSERY',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().add(const Duration(days: 12)),
      status: 'paid',
      amountPaid: 14000,
      transactionRef: 'UPI_TXN_1122334455',
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Pre-Primary Tuition & Care', amount: 9000),
        FeeItem(feeType: 'activity', title: 'Sensory Play & Materials', amount: 3000),
        FeeItem(feeType: 'meals', title: 'Nutrition & Hot Meal Care', amount: 2000),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

    final totalBilled = _invoices.fold(0.0, (acc, i) => acc + i.totalPayable);
    final totalCollected = _invoices.fold(0.0, (acc, i) => acc + i.amountPaid);
    final totalOutstanding = totalBilled - totalCollected;

    final filtered = _invoices.where((inv) {
      final matchesStatus = _selectedStatus == 'all' || inv.status == _selectedStatus;
      final matchesSearch = inv.studentName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          inv.invoiceId.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bursar & Accounts Terminal'),
        backgroundColor: Colors.indigo.shade900,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            tooltip: 'Export Ledger CSV',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Ledger exported to downloads!')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary Row
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildKpiCard('Total Billed', currencyFormat.format(totalBilled), Colors.indigo),
                        _buildKpiCard('Realized', currencyFormat.format(totalCollected), Colors.green),
                        _buildKpiCard('Outstanding', currencyFormat.format(totalOutstanding), Colors.red),
                      ],
                    ),
                    const SizedBox(height: 12),
                    LinearProgressIndicator(
                      value: totalBilled > 0 ? (totalCollected / totalBilled) : 0,
                      backgroundColor: Colors.grey.shade200,
                      color: Colors.green,
                      minHeight: 6,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Search & Filter
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search),
                      hintText: 'Search student or invoice...',
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 8),
                DropdownButton<String>(
                  value: _selectedStatus,
                  items: const [
                    DropdownMenuItem(value: 'all', child: Text('All')),
                    DropdownMenuItem(value: 'pending', child: Text('Pending')),
                    DropdownMenuItem(value: 'paid', child: Text('Paid')),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedStatus = val);
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Invoices List
            Text(
              'Student Invoices (${filtered.length})',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            ...filtered.map((inv) {
              final isPaid = inv.status == 'paid';
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isPaid ? Colors.green.shade100 : Colors.amber.shade100,
                    child: Icon(
                      isPaid ? Icons.check_circle : Icons.pending,
                      color: isPaid ? Colors.green.shade800 : Colors.amber.shade800,
                    ),
                  ),
                  title: Text(inv.studentName, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${inv.invoiceId} • ${inv.term}\nDue: ${DateFormat('dd MMM yyyy').format(inv.dueDate)}'),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        currencyFormat.format(inv.totalPayable),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      Text(
                        inv.status.toUpperCase(),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isPaid ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                  isThreeLine: true,
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard(String label, String value, MaterialColor color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color.shade800)),
      ],
    );
  }
}
