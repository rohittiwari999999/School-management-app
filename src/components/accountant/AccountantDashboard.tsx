import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Building,
} from 'lucide-react';

export const AccountantDashboard: React.FC = () => {
  const { invoices, payInvoice } = useSMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalPayable, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const totalFines = invoices.reduce((acc, i) => acc + i.fineAccumulated, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualReconcile = async (invId: string) => {
    setReconcilingId(invId);
    await payInvoice(invId, 'cash_counter');
    setReconcilingId(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Accountant Banner - Compact */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-rose-900/40">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold mb-1 border border-rose-400/30">
              <Receipt className="w-3 h-3" />
              <span>Accounts Desk</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Finance & Invoicing
            </h1>
            <p className="text-slate-300 text-xs">
              Fee collection, receipt generation, and dues ledger.
            </p>
          </div>

          <button
            onClick={() => alert('Generating full Q2 Ledger CSV export...')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center space-x-1 shadow-sm shrink-0 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Total Billed
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 font-mono">
            ₹{totalBilled.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Realized
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5 font-mono">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            {((totalCollected / totalBilled) * 100).toFixed(1)}% Collected
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Outstanding
          </div>
          <div className="text-lg sm:text-xl font-black text-rose-600 mt-0.5 font-mono">
            ₹{totalOutstanding.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Late Fines
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-600 mt-0.5 font-mono">
            ₹{totalFines.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-rose-600" />
              <span>Student Invoices Ledger</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target collection: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">invoices</code>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, class..."
                className="text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 w-44"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Subtotal</th>
                <th className="py-3 px-3">Fine</th>
                <th className="py-3 px-3">Total Payable</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredInvoices.map((inv) => {
                const isPending = inv.status === 'pending';
                return (
                  <tr key={inv.invoiceId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{inv.studentName}</td>
                    <td className="py-3 px-3 text-slate-600">{inv.className}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{inv.dueDate}</td>
                    <td className="py-3 px-3 font-mono">₹{inv.subtotal.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-rose-600">
                      {inv.fineAccumulated > 0 ? `+₹${inv.fineAccumulated}` : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{inv.totalPayable.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isPending
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isPending ? (
                        <button
                          onClick={() => handleManualReconcile(inv.invoiceId)}
                          disabled={reconcilingId === inv.invoiceId}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                        >
                          {reconcilingId === inv.invoiceId ? 'Settling...' : 'Counter Cash Settle'}
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">{inv.receiptNumber}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
