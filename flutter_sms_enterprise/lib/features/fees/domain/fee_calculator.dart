class FeeItem {
  final String feeType; // tuition, lab, sports, transportation, library
  final String title;
  final double amount;

  const FeeItem({
    required this.feeType,
    required this.title,
    required this.amount,
  });

  Map<String, dynamic> toMap() => {
        'feeType': feeType,
        'title': title,
        'amount': amount,
      };

  factory FeeItem.fromMap(Map<String, dynamic> map) => FeeItem(
        feeType: map['feeType'] ?? 'tuition',
        title: map['title'] ?? 'Fee Component',
        amount: (map['amount'] ?? 0.0).toDouble(),
      );
}

class InvoiceModel {
  final String invoiceId;
  final String schoolId;
  final String studentId;
  final String studentName;
  final String classId;
  final String term; // e.g. "Term 1 (April - July)", "Term 2"
  final List<FeeItem> lineItems;
  final DateTime dueDate;
  final double finePerDay;
  final double amountPaid;
  final String status; // 'pending', 'paid', 'partial'
  final String? transactionRef;
  final String? receiptPdfUrl;
  final DateTime? paymentDate;

  const InvoiceModel({
    required this.invoiceId,
    required this.schoolId,
    required this.studentId,
    required this.studentName,
    required this.classId,
    required this.term,
    required this.lineItems,
    required this.dueDate,
    this.finePerDay = 50.0,
    this.amountPaid = 0.0,
    required this.status,
    this.transactionRef,
    this.receiptPdfUrl,
    this.paymentDate,
  });

  double get subtotal =>
      lineItems.fold(0.0, (acc, item) => acc + item.amount);

  /// Calculate fine if overdue and not paid
  double calculateFine(DateTime currentDate) {
    if (status == 'paid') return 0.0;
    if (currentDate.isAfter(dueDate)) {
      final daysLate = currentDate.difference(dueDate).inDays;
      return daysLate > 0 ? (daysLate * finePerDay) : 0.0;
    }
    return 0.0;
  }

  double get totalPayable {
    final fine = calculateFine(DateTime.now());
    return subtotal + fine;
  }

  double get remainingBalance => totalPayable - amountPaid;
}
