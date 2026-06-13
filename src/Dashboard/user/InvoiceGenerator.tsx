import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Download,
  FileText,
  Calendar,
  User,
  Package,
  Loader2,
  Store,
  Receipt
} from 'lucide-react';
import logo from '../../assets/images/mainlogo.png';

interface InvoiceProps {
  orderItem: any;
  user: any;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceProps> = ({ orderItem, user, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  console.log(orderItem, "orderItem in invoice generator");
  console.log(user, "user in invoice generator");

  const calculateTotals = () => {
    // Get actual amounts from the order data
    const amountWithoutTax = parseFloat(orderItem.amount_without_tax || orderItem.total_price || 0);
    const shipping = parseFloat(orderItem.shipping_charges || 0);
    const discount = parseFloat(orderItem.item_summary?.total_discount || 0);
    const taxAmount = parseFloat(orderItem.taxable_amount || 0);
    const totalWithTax = parseFloat(orderItem.amount_with_tax || 0);
    const totalPaid = parseFloat(orderItem.item_payment_amount_with_tax || orderItem.item_payment_amount || 0);
    
    // Tax breakdown
    const taxBreakdown = orderItem.tax_breakdown || null;

    return {
      amountWithoutTax,
      shipping,
      discount,
      taxAmount,
      totalWithTax,
      totalPaid,
      taxBreakdown,
      discountPercentage: parseFloat(orderItem.discount_percentage || 0),
    };
  };

  const totals = calculateTotals();

  // Get seller information
  const getSellerInfo = () => {
    if (orderItem.seller_user) {
      return {
        name: `${orderItem.seller_user.first_name} ${orderItem.seller_user.last_name}`,
        email: orderItem.seller_user.email,
        phone: orderItem.seller_user.phone_number,
        businessName: orderItem.seller_user.business_name || `${orderItem.seller_user.first_name} ${orderItem.seller_user.last_name}`,
        address: orderItem.seller_address || null,
        gst: orderItem.seller_user.gst_number || null
      };
    }
    return null;
  };

  // Get buyer information (order_user)
  const getBuyerInfo = () => {
    if (orderItem.order_user) {
      return {
        name: `${orderItem.order_user.first_name} ${orderItem.order_user.last_name}`,
        email: orderItem.order_user.email,
        phone: orderItem.order_user.phone_number,
        address: orderItem.order_address || null
      };
    }
    return {
      name: user ? `${user.first_name} ${user.last_name}` : 'Customer',
      email: user?.email || '',
      phone: user?.phone_number || '',
      address: orderItem.order_address || null
    };
  };

  const sellerInfo = getSellerInfo();
  const buyerInfo = getBuyerInfo();
  const isBulkBuyer = user?.roles === 'BulkBuyer';

  // EcoFlare default info
  const ecoFlareInfo = {
    name: 'EcoFlare Solutions Inc.',
    address: '123 Green Street',
    cityState: 'Toronto, ON M5H 2N2',
    country: 'Canada',
    gst: 'GST/HST #: 123456789RT0001'
  };

  // Download PDF
 const downloadPDF = async () => {
  if (!invoiceRef.current) return;

  setIsGenerating(true);
  try {
    await document.fonts.ready;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: invoiceRef.current.scrollWidth,
      windowHeight: invoiceRef.current.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pageHeight = pdf.internal.pageSize.getHeight();
let heightLeft = imgHeight;

let position = 10;

pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
heightLeft -= pageHeight;

while (heightLeft > 0) {
  position = heightLeft - imgHeight + 10;

  pdf.addPage();
  pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;
}

    pdf.save(`invoice_${orderItem.sub_order_number}_${Date.now()}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate invoice. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Invoice Details
              </h2>
              <p className="text-green-100">Order #{orderItem.sub_order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Invoice for printing/PDF */}
          <div 
            ref={invoiceRef} 
            className="bg-white p-8 border-2 border-gray-200 rounded-lg print:border-0 print:shadow-none"
            style={{ width: '210mm' }}
          >
            {/* Invoice Header */}
            <div className="mb-8 pb-8 border-b-2 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">Invoice Date:</span>
                      <span>{formatDate(orderItem.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">Order #:</span>
                      <span>{orderItem.sub_order_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">Payment Status:</span>
                      <span className="text-green-600 font-medium">{orderItem.item_payment_status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <img src={logo} alt="EcoFlare Logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* From/To Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* From Section - Conditional based on user role */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Store className="w-5 h-5 text-green-600" />
                  From:
                </h3>
                
                {isBulkBuyer && sellerInfo ? (
                  // For Bulk Buyer - Show Seller Information
                  <div className="space-y-1">
                    <p className="font-semibold">{sellerInfo.businessName}</p>
                    <p className="text-gray-600">{sellerInfo.email}</p>
                    <p className="text-gray-600">{sellerInfo.phone}</p>
                    {sellerInfo.address && (
                      <>
                        <p className="text-gray-600">{sellerInfo.address.address}</p>
                        <p className="text-gray-600">
                          {sellerInfo.address.city}, {sellerInfo.address.postal_code}
                        </p>
                        <p className="text-gray-600">{sellerInfo.address.country}</p>
                      </>
                    )}
                    {sellerInfo.gst && (
                      <p className="text-gray-600 mt-2">{sellerInfo.gst}</p>
                    )}
                  </div>
                ) : (
                  // For Regular Buyer - Show EcoFlare
                  <div className="space-y-1">
                    <p className="font-semibold">{ecoFlareInfo.name}</p>
                    <p className="text-gray-600">{ecoFlareInfo.address}</p>
                    <p className="text-gray-600">{ecoFlareInfo.cityState}</p>
                    <p className="text-gray-600">{ecoFlareInfo.country}</p>
                    <p className="text-gray-600 mt-2">{ecoFlareInfo.gst}</p>
                  </div>
                )}
              </div>

              {/* To Section - Always show order_user */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Bill To:
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold">{buyerInfo.name}</p>
                  <p className="text-gray-600">{buyerInfo.email}</p>
                  <p className="text-gray-600">{buyerInfo.phone}</p>
                  {buyerInfo.address && (
                    <>
                      <p className="text-gray-600">{buyerInfo.address.address}</p>
                      <p className="text-gray-600">
                        {buyerInfo.address.city}, {buyerInfo.address.postal_code}
                      </p>
                      <p className="text-gray-600">{buyerInfo.address.country}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-300">
                Order Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border">Description</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border">Quantity</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border">Unit Price</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border">Discount</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border">
                        <div>
                          <p className="font-semibold">{orderItem.product?.name}</p>
                          <p className="text-sm text-gray-600">{orderItem.product?.category?.name}</p>
                          <p className="text-xs text-gray-500">SKU: PROD-{orderItem.product?.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 border text-center">
                        {orderItem.quantity} {orderItem.product?.unit}
                      </td>
                      <td className="py-3 px-4 border">
                        CAD {parseFloat(orderItem.base_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 border">
                        {orderItem.discount_percentage}%
                      </td>
                      <td className="py-3 px-4 border font-semibold">
                        CAD {totals.amountWithoutTax.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary with Tax Breakdown */}
            <div className="mb-8">
              <div className="max-w-md ml-auto">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Payment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal (without tax):</span>
                      <span>CAD {totals.amountWithoutTax.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Charges:</span>
                      <span>CAD {totals.shipping.toFixed(2)}</span>
                    </div>
                    
                    {totals.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount ({totals.discountPercentage}%):</span>
                        <span className="text-green-600">- CAD {totals.discount.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Tax Breakdown Section */}
                    {totals.taxBreakdown && (
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                          <span>Tax Details:</span>
                          <span></span>
                        </div>
                        
                        {/* GST */}
                        {totals.taxBreakdown.gst && totals.taxBreakdown.gst.amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              GST ({totals.taxBreakdown.gst.rate}%):
                            </span>
                            <span>CAD {totals.taxBreakdown.gst.amount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {/* PST */}
                        {totals.taxBreakdown.pst && totals.taxBreakdown.pst.amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              PST ({totals.taxBreakdown.pst.rate}%):
                            </span>
                            <span>CAD {totals.taxBreakdown.pst.amount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {/* HST */}
                        {totals.taxBreakdown.hst && totals.taxBreakdown.hst.amount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              HST ({totals.taxBreakdown.hst.rate}%):
                            </span>
                            <span>CAD {totals.taxBreakdown.hst.amount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {/* Total Tax */}
                        <div className="flex justify-between text-sm pt-1 border-t border-gray-100 mt-1">
                          <span className="text-gray-600 font-medium">Total Tax:</span>
                          <span className="font-medium text-amber-600">
                            CAD {totals.taxAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Amount with Tax (if tax exists) */}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount with Tax:</span>
                        <span>CAD {totals.totalWithTax.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t-2 border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid:</span>
                        <span className="text-green-600">CAD {totals.totalPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Payment Method:</span>
                        <span>{orderItem.item_payment_method || 'N/A'}</span>
                      </div>
                      {orderItem.tax_breakdown?.province && (
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Tax Rate Applied:</span>
                          <span>{orderItem.tax_breakdown.province} - {orderItem.tax_breakdown.total_tax_rate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t-2 border-gray-300 pt-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Terms & Conditions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. This invoice is for the amount paid via {orderItem.item_payment_method || 'selected payment method'}.</p>
                <p>2. All prices are in Canadian Dollars (CAD).</p>
                <p>3. Goods are sold on a non-returnable basis unless defective.</p>
                <p>4. For any queries, contact support@ecoflaresolutions.com</p>
                <p>5. Payment reference: {orderItem.item_payment_data ? 'Payment ID: ' + JSON.parse(orderItem.item_payment_data)?.stripe_payment_intent?.substring(0, 15) + '...' : 'N/A'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-500">
              <p>Thank you for choosing EcoFlare Solutions!</p>
              <p className="mt-1">This is an electronically generated invoice, no signature required.</p>
              <p className="mt-1 text-xs">Invoice generated on: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Invoice generated: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={downloadPDF}
                disabled={isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;