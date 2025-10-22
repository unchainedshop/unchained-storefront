// components/ProductSubscriptionForm.tsx
import React, { useState } from 'react';
import { useCreateEnrollment } from '../../modules/products/hooks/useCreateEnrollment';

const ProductSubscriptionForm = ({ product }: { product: any }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState('');

  // Billing info
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    company: '',
    addressLine: '',
    addressLine2: '',
    postalCode: '',
    regionCode: '',
    city: '',
    countryCode: '',
  });

  // Contact info
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Payment info
  const [paymentProvider, setPaymentProvider] = useState('card');
  const [deliveryProvider, setDeliveryProvider] = useState('digital');

  const { createEnrollment } = useCreateEnrollment();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in billing) {
      setBilling((prev) => ({ ...prev, [name]: value }));
    } else if (name in contact) {
      setContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setMessage('Please select a plan first.');
      return;
    }

    try {
      setLoadingState(true);
      setMessage('');

      const { data } = await createEnrollment({
        plan: {
          productId: product._id,
          quantity,
          configuration: [
            { key: 'planId', value: selectedPlan._id ?? 'unknown' },
          ],
        },
        billingAddress: billing,
        contact,
        payment: {
          paymentProviderId: paymentProvider,
          meta: { note: 'placeholder payment info' },
        },
        delivery: {
          deliveryProviderId: deliveryProvider,
          meta: {},
        },
        meta: { source: 'web-form' },
      });

      if (data?.createEnrollment) {
        setMessage('✅ Enrollment created successfully!');
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-200 space-y-8">
      <h2 className="text-3xl font-semibold text-center">
        Subscribe to {product?.name || 'Product'}
      </h2>

      {/* PLANS SECTION */}
      <section>
        <h3 className="text-lg font-medium mb-3">Select a Plan</h3>
        <div className="space-y-3">
          {(product?.plans || []).length > 0 ? (
            product.plans.map((plan: any) => (
              <button
                key={plan._id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedPlan?._id === plan._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{plan.name}</span>
                  <span className="text-sm text-gray-500">
                    {plan.price?.amount
                      ? `$${plan.price.amount}/${plan.billingInterval ?? 'mo'}`
                      : 'Custom Price'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {plan.description || 'Plan details not available.'}
                </p>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No plans available.</p>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 border border-gray-300 rounded-lg p-2 text-center"
          />
        </div>
      </section>

      {/* BILLING SECTION */}
      <section>
        <h3 className="text-lg font-medium mb-3">Billing Address</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            value={billing.firstName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={billing.lastName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="company"
            placeholder="Company (optional)"
            value={billing.company}
            onChange={handleChange}
            className="col-span-2 border rounded-lg p-2"
          />
          <input
            name="addressLine"
            placeholder="Address Line"
            value={billing.addressLine}
            onChange={handleChange}
            className="col-span-2 border rounded-lg p-2"
          />
          <input
            name="addressLine2"
            placeholder="Address Line 2"
            value={billing.addressLine2}
            onChange={handleChange}
            className="col-span-2 border rounded-lg p-2"
          />
          <input
            name="city"
            placeholder="City"
            value={billing.city}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="regionCode"
            placeholder="Region/State"
            value={billing.regionCode}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={billing.postalCode}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="countryCode"
            placeholder="Country Code (e.g. US)"
            value={billing.countryCode}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section>
        <h3 className="text-lg font-medium mb-3">Contact Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            value={contact.firstName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={contact.lastName}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            name="email"
            placeholder="Email"
            value={contact.email}
            onChange={handleChange}
            className="col-span-2 border rounded-lg p-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={contact.phone}
            onChange={handleChange}
            className="col-span-2 border rounded-lg p-2"
          />
        </div>
      </section>

      {/* PAYMENT SECTION */}
      <section>
        <h3 className="text-lg font-medium mb-3">Payment Method</h3>
        <select
          value={paymentProvider}
          onChange={(e) => setPaymentProvider(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </section>

      {/* DELIVERY SECTION */}
      <section>
        <h3 className="text-lg font-medium mb-3">Delivery Method</h3>
        <select
          value={deliveryProvider}
          onChange={(e) => setDeliveryProvider(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="digital">Digital Delivery</option>
          <option value="email">Email Delivery</option>
        </select>
      </section>

      {/* SUBMIT */}
      <button
        onClick={handleSubscribe}
        disabled={loadingState}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
      >
        {loadingState ? 'Processing...' : 'Subscribe Now'}
      </button>

      {message && (
        <p className="mt-3 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductSubscriptionForm;
