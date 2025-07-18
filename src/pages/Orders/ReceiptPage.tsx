import React from 'react';
import { Order } from '../../types';
import { DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ReceiptPageProps {
  order: Order;
}

const ReceiptPage: React.FC<ReceiptPageProps> = ({ order }) => {
  if (!order) return null;
  return (
    <div className="min-h-screen font-sans flex flex-col items-center py-10 px-2 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-blue-100 p-8 relative">
        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 print:hidden"
        >
          Print Receipt
        </button>
        {/* Company Info Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight mb-1">FazzPrint Sdn Bhd</h1>
            <div className="text-gray-600 text-sm leading-relaxed">
              22, 22-1 & 22-2 Jalan Bestari 6D,<br />
              Bandar Bestari, 41200 Klang,<br />
              Selangor.<br />
              <span className="block mt-1">+60104560817</span>
              <span className="block">fazzprint@gmail.com</span>
              <span className="block">Mon-Fri 9:00AM - 5:00PM</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-blue-700">Payment Receipt</span>
            <span className="text-xs text-gray-400">Order ID: <span className="font-semibold text-gray-700">{order.id}</span></span>
            <span className="text-xs text-gray-400">Date: {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : '-'}</span>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-blue-100 mb-8" />
        {/* Client & Delivery Info */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Billed To</h2>
            <div className="text-gray-900 font-medium">{order.client?.name}</div>
            <div className="text-gray-500 text-sm">{order.client?.email}</div>
            <div className="text-gray-500 text-sm">{order.client?.phone}</div>
            <div className="text-gray-500 text-sm">{order.client?.address || order.client?.billingAddress}</div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">Delivery</h2>
            <div className="text-gray-900 font-medium capitalize">{order.deliveryMethod.replace('_', ' ')}</div>
            <div className="text-gray-500 text-sm">{order.shippingAddress || order.client?.shippingAddress}</div>
          </div>
        </div>
        {/* Products Table */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Order Details</h2>
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-2 px-3 text-left font-semibold text-gray-700">Product</th>
                <th className="py-2 px-3 text-center font-semibold text-gray-700">Qty</th>
                <th className="py-2 px-3 text-right font-semibold text-gray-700">Unit Price</th>
                <th className="py-2 px-3 text-right font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-2 px-3 text-gray-900">{item.product.name}</td>
                  <td className="py-2 px-3 text-center">{item.quantity}</td>
                  <td className="py-2 px-3 text-right">RM {item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-semibold">RM {item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Payment Summary */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-2">Payment Summary</h2>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Design Deposit</span>
              <span>RM {order.designDeposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Production Deposit</span>
              <span>RM {order.productionDeposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Balance Payment</span>
              <span>RM {order.balancePayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold border-t pt-2 mt-2">
              <span>Total Paid</span>
              <span>RM {(order.designDeposit + order.productionDeposit + order.balancePayment).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end">
            <CheckCircleIcon className="h-10 w-10 text-green-500 mb-2" />
            <span className="text-green-700 font-semibold text-lg">Delivered</span>
          </div>
        </div>
        {/* Receipts */}
        {order.receipts && order.receipts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-2">Payment Receipts</h2>
            <div className="space-y-2">
              {order.receipts.map((file, idx) => (
                <div key={idx} className="flex items-center bg-gray-50 rounded px-3 py-2 text-sm">
                  <DocumentIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-xs"
                  >
                    {file.filename}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          Thank you for your business!<br />
          This is a system-generated receipt.
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage; 