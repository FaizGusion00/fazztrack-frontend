import React, { useState } from 'react';
import { mockOrders } from './Orders/OrdersPage';
import { Order } from '../types';
import { TruckIcon, CheckCircleIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Modal from '../components/UI/Modal';

const statusColors: Record<string, string> = {
  completed: 'bg-blue-100 text-blue-700',
  in_delivery: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
};

const DeliveryTrackingPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const initialOrders = mockOrders.filter(o => (o.status === 'completed' || o.status === 'in_delivery'));
  const initialDeliveryData = Object.fromEntries(
    initialOrders.map((order, idx) => [
      order.id,
      {
        deliveryTrackingId: order.deliveryTrackingId || `MYTRACK${1000 + idx}`,
        courier: idx % 2 === 0 ? 'GDex' : 'J&T',
      },
    ])
  );
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [deliveryData, setDeliveryData] = useState<Record<string, { deliveryTrackingId: string; courier: string }>>(initialDeliveryData);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [showSelfCollectModal, setShowSelfCollectModal] = useState(false);

  const filtered = orders.filter(order =>
    order.jobName.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = (orderId: string, newStatus: 'in_delivery' | 'delivered') => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      )
    );
  };

  const handleMarkInDelivery = (order: Order) => {
    if (order.deliveryMethod === 'shipping') {
      setDeliveryOrder(order);
      setCourierInput('');
      setTrackingInput('');
      setShowDeliveryModal(true);
    } else {
      setDeliveryOrder(order);
      setShowSelfCollectModal(true);
    }
  };
  const handleSubmitDelivery = () => {
    if (!deliveryOrder) return;
    setDeliveryData(prev => ({
      ...prev,
      [deliveryOrder.id]: {
        courier: courierInput,
        deliveryTrackingId: trackingInput,
      },
    }));
    setOrders(prev =>
      prev.map(order =>
        order.id === deliveryOrder.id ? { ...order, status: 'in_delivery' as Order['status'] } : order
      )
    );
    setShowDeliveryModal(false);
    setDeliveryOrder(null);
  };
  const handleSelfCollect = () => {
    if (!deliveryOrder) return;
    setOrders(prev =>
      prev.map(order =>
        order.id === deliveryOrder.id ? { ...order, status: 'delivered' as Order['status'] } : order
      )
    );
    setShowSelfCollectModal(false);
    setDeliveryOrder(null);
  };

  return (
    <div className="min-h-screen bg-white font-sans py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <TruckIcon className="h-7 w-7 text-blue-400" /> Delivery Tracking
          </h1>
          <input
            type="text"
            placeholder="Search by job name, order ID, or client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 text-base w-full sm:w-80"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 divide-y divide-blue-50 overflow-hidden">
          <div className="px-6 py-4 font-semibold text-gray-700 text-sm flex items-center justify-between bg-blue-50">
            <span>Order / Client</span>
            <span>Status</span>
            <span>Tracking</span>
            <span>Courier</span>
            <span className="text-right">Actions</span>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">No orders found for delivery tracking.</div>
          )}
          {filtered.map(order => (
            <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 hover:bg-blue-50 transition-all duration-100 group border-l-4 border-transparent hover:border-blue-400 focus-within:bg-blue-50">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{order.jobName}</div>
                <div className="text-sm text-gray-500 truncate">{order.client?.name}</div>
              </div>
              <div className="w-32 flex-shrink-0 flex items-center justify-center my-2 sm:my-0">
                <span className={`px-3 py-1 text-xs rounded-xl font-semibold ${statusColors[order.status as string] || 'bg-gray-100 text-gray-700'}`}>
                  {(order.status as string) === 'completed' && 'Ready for Delivery'}
                  {(order.status as string) === 'in_delivery' && 'In Delivery'}
                  {(order.status as string) === 'delivered' && 'Delivered'}
                </span>
              </div>
              <div className="w-40 flex-shrink-0 text-gray-700 text-sm text-center">
                {deliveryData[order.id]?.deliveryTrackingId || <span className="text-gray-400">-</span>}
              </div>
              <div className="w-32 flex-shrink-0 text-gray-700 text-sm text-center">
                {deliveryData[order.id]?.courier || <span className="text-gray-400">-</span>}
              </div>
              <div className="flex space-x-2 ml-auto mt-2 sm:mt-0">
                {order.status === 'completed' && (
                  <button
                    onClick={() => handleMarkInDelivery(order)}
                    className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-200 transition"
                  >
                    {order.deliveryMethod === 'shipping' ? 'Mark as In Delivery' : 'Mark as Collected'}
                  </button>
                )}
                {order.status === 'in_delivery' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold hover:bg-green-200 transition"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delivery Modal for shipping */}
      <Modal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} size="sm">
        <Modal.Header>
          <h3 className="text-lg font-semibold">Enter Delivery Details</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Courier Name</label>
              <input
                type="text"
                value={courierInput}
                onChange={e => setCourierInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. GDex, J&T, PosLaju"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. MYTRACK1234"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setShowDeliveryModal(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitDelivery}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            disabled={!courierInput || !trackingInput}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
      {/* Self Collect Modal */}
      <Modal isOpen={showSelfCollectModal} onClose={() => setShowSelfCollectModal(false)} size="sm">
        <Modal.Header>
          <h3 className="text-lg font-semibold">Confirm Self Collection</h3>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-700">Are you sure this order has been collected by the customer?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setShowSelfCollectModal(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSelfCollect}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Confirm Collected
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeliveryTrackingPage; 