import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/images/Pricewise.png";
import logo2 from "../../assets/images/logo.png";

interface Props {
  buyer: string;
  seller: string;
  amount: string;
  buyerTime: string;
  sellerTime: string;
  buyerSignature?: string | null;
  sellerSignature?: string | null;
  transaction?: any;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },

  watermark: {
    position: "absolute",
    top: "35%",
    left: "25%",
    width: 300,
    opacity: 0.08,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoSmall: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 4,
  },

  label: {
    width: 120,
    fontWeight: "bold",
  },

  value: {
    flex: 1,
  },

  sectionTitle: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 5,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 5,
  },

  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 9,
  },

  summaryBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  signatureImage: {
    width: 100,
    height: 40,
    marginBottom: 5,
  },

  taxBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    fontSize: 9,
  },

  highlightText: {
    fontWeight: "bold",
    color: "#166534",
  },
});

const AgreementPDFDocument = ({
  buyer,
  seller,
  buyerTime,
  sellerTime,
  buyerSignature,
  sellerSignature,
  transaction,
}: Props) => {
  const product = transaction?.price_negotiation?.negotiation?.product;
  const quantity = transaction?.price_negotiation?.expected_quantity || 0;
  const price = transaction?.price_negotiation?.expected_price || 0;
  const grade = transaction?.price_negotiation?.grade || "Standard";
  const paymentSchedule = transaction?.payment_schedule || [];
  const taxInfo = transaction?.payment_info?.summary?.tax;

  // Filter out advance payments for regular installments
  const installments = paymentSchedule.filter(
    (i: any) => i.installment_number > 0
  );

  const finalInstallment =
    installments.length > 0
      ? installments[installments.length - 1]
      : null;

  const contractTotal = transaction?.payment_info?.summary?.contract_total_cad || 0;
  const contractTotalWithTax = transaction?.payment_info?.summary?.contract_total_with_tax || contractTotal;
  const totalPaid = transaction?.payment_info?.summary?.total_paid_cad || 0;
  const totalDue = transaction?.payment_info?.summary?.total_due_cad || 0;

  // Format currency
  const formatCurrency = (amount: number) => `${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`;

  // Get delivery start and end dates
  const deliveryStartDate = transaction?.price_negotiation?.delivery_start_date;
  const deliveryEndDate = transaction?.price_negotiation?.delivery_end_date;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* WATERMARK */}
        <Image src={logo2} style={styles.watermark} />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logo} style={styles.logoSmall} />
            <Image src={logo2} style={styles.logoSmall} />
          </View>
          <Text style={styles.title}>DIGITAL AGREEMENT</Text>
        </View>

        <View style={styles.divider} />

        {/* DEAL DETAILS */}
        <Text style={styles.sectionTitle}>1. Deal Details</Text>

        <View>
          <View style={styles.row}>
            <Text style={styles.label}>Agreement ID:</Text>
            <Text style={styles.value}>#{transaction?.id || "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>RFQ ID:</Text>
            <Text style={styles.value}>{transaction?.rfq_id || "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Buyer:</Text>
            <Text style={styles.value}>{buyer}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Seller:</Text>
            <Text style={styles.value}>{seller}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Product:</Text>
            <Text style={styles.value}>{product?.name || "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Product Type:</Text>
            <Text style={styles.value}>
              {product?.category === 2 ? "Vegetable/Fruit" : "Other"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Grade:</Text>
            <Text style={styles.value}>{grade}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{quantity} kg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price per Unit:</Text>
            <Text style={styles.value}>{formatCurrency(price)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivery Period:</Text>
            <Text style={styles.value}>
              {deliveryStartDate && deliveryEndDate 
                ? `${new Date(deliveryStartDate).toLocaleDateString()} - ${new Date(deliveryEndDate).toLocaleDateString()}`
                : "To be determined"}
            </Text>
          </View>
        </View>

        {/* PAYMENT SUMMARY */}
        <Text style={styles.sectionTitle}>2. Payment Summary</Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Subtotal (without tax):</Text>
            <Text>{formatCurrency(contractTotal)}</Text>
          </View>

          {/* Tax Breakdown */}
          {taxInfo && taxInfo.total_tax_amount > 0 && (
            <>
              <View style={styles.taxBox}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Tax Details ({taxInfo.province || "Canada"})</Text>
                
                {taxInfo.gst_rate > 0 && (
                  <View style={styles.taxRow}>
                    <Text>GST ({taxInfo.gst_rate}%):</Text>
                    <Text>{formatCurrency(taxInfo.gst_amount)}</Text>
                  </View>
                )}
                
                {taxInfo.pst_rate > 0 && (
                  <View style={styles.taxRow}>
                    <Text>PST ({taxInfo.pst_rate}%):</Text>
                    <Text>{formatCurrency(taxInfo.pst_amount)}</Text>
                  </View>
                )}
                
                {taxInfo.hst_rate > 0 && (
                  <View style={styles.taxRow}>
                    <Text>HST ({taxInfo.hst_rate}%):</Text>
                    <Text>{formatCurrency(taxInfo.hst_amount)}</Text>
                  </View>
                )}
                
                <View style={[styles.taxRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#e2e8f0", fontWeight: "bold" }]}>
                  <Text>Total Tax:</Text>
                  <Text style={styles.highlightText}>{formatCurrency(taxInfo.total_tax_amount)}</Text>
                </View>
              </View>
            </>
          )}

          <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#e2e8f0" }]}>
            <Text style={{ fontWeight: "bold" }}>Total Contract Value (incl. Tax):</Text>
            <Text style={{ fontWeight: "bold", fontSize: 11 }}>{formatCurrency(contractTotalWithTax)}</Text>
          </View>
        </View>

        {/* PAYMENT SCHEDULE */}
        <Text style={styles.sectionTitle}>3. Payment Schedule</Text>

        {installments.map((item: any, index: number) => {
          const isAdvance = item.payment_type === "advance";
          const isFinal = index === installments.length - 1 && item.payment_type === "final";
          
          return (
            <View key={item.installment_id || index} style={styles.summaryBox}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                {isAdvance ? "ADVANCE PAYMENT" : isFinal ? "FINAL PAYMENT" : `INSTALLMENT ${item.installment_number}`}
              </Text>

              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Due Date</Text>
                <Text style={styles.tableCell}>Amount (excl. Tax)</Text>
                <Text style={styles.tableCell}>Tax</Text>
                <Text style={styles.tableCell}>Total Amount</Text>
                <Text style={styles.tableCell}>Status</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {item.due_date ? new Date(item.due_date).toLocaleDateString() : "N/A"}
                </Text>
                <Text style={styles.tableCell}>{formatCurrency(item.amount_cad)}</Text>
                <Text style={styles.tableCell}>
                  {item.tax_amount > 0 ? formatCurrency(item.tax_amount) : "-"}
                </Text>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                  {formatCurrency(item.amount_with_tax)}
                </Text>
                <Text style={[
                  styles.tableCell, 
                  { 
                    color: item.payment_status === "Paid" ? "#166534" : "#9a3412",
                    fontWeight: "bold"
                  }
                ]}>
                  {item.payment_status === "Paid" ? "✓ PAID" : "PENDING"}
                </Text>
              </View>

              {/* Delivery Status for this installment */}
              {item.delivery_status && (
                <View style={{ marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#e2e8f0" }}>
                  <View style={styles.taxRow}>
                    <Text>Delivery Status:</Text>
                    <Text style={{ 
                      color: item.delivery_status === "Delivered" ? "#166534" : 
                             item.delivery_status === "Dispatched" ? "#1e40af" : "#9a3412"
                    }}>
                      {item.delivery_status}
                    </Text>
                  </View>
                  {item.paid_at && (
                    <View style={styles.taxRow}>
                      <Text>Paid On:</Text>
                      <Text>{new Date(item.paid_at).toLocaleString()}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* TOTAL PAID SUMMARY */}
        <View style={styles.summaryBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Payment Status Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text>Total Contract Value (incl. Tax):</Text>
            <Text>{formatCurrency(contractTotalWithTax)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Total Paid:</Text>
            <Text style={{ color: "#166534", fontWeight: "bold" }}>{formatCurrency(totalPaid)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Total Remaining:</Text>
            <Text style={{ color: "#9a3412", fontWeight: "bold" }}>{formatCurrency(totalDue)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Payment Completion:</Text>
            <Text>
              {contractTotalWithTax > 0 ? Math.round((totalPaid / contractTotalWithTax) * 100) : 0}%
            </Text>
          </View>

          <View style={[styles.summaryRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: "#e2e8f0" }]}>
            <Text>Agreement Created:</Text>
            <Text>{transaction?.created_at ? new Date(transaction.created_at).toLocaleString() : "N/A"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Blockchain Status:</Text>
            <Text style={{ color: transaction?.blockchain_status === "CONFIRMED" ? "#166534" : "#9a3412" }}>
              {transaction?.blockchain_status || "N/A"}
            </Text>
          </View>
        </View>

        {/* TERMS & CONDITIONS */}
        {/* <Text style={styles.sectionTitle}>4. Terms & Conditions</Text>
        
        <View style={styles.summaryBox}>
          <Text style={{ marginBottom: 5 }}>
            1. Payment must be made according to the schedule above. Late payments may incur additional charges.
          </Text>
          <Text style={{ marginBottom: 5 }}>
            2. Delivery will be processed only after the respective installment payment is completed.
          </Text>
          <Text style={{ marginBottom: 5 }}>
            3. The seller is responsible for ensuring product quality meets the agreed grade standards.
          </Text>
          <Text style={{ marginBottom: 5 }}>
            4. Any disputes shall be resolved through arbitration as per the platform's policies.
          </Text>
          <Text>
            5. This agreement is legally binding and recorded on the blockchain for transparency.
          </Text>
        </View> */}

        {/* SIGNATURES */}
        <View style={styles.signatureRow}>
          <View style={{ alignItems: "center" }}>
            {buyerSignature && (
              <Image src={buyerSignature} style={styles.signatureImage} />
            )}
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>Buyer</Text>
            <Text style={{ fontSize: 8 }}>{buyer}</Text>
            <Text style={{ fontSize: 8 }}>{buyerTime}</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            {sellerSignature && (
              <Image src={sellerSignature} style={styles.signatureImage} />
            )}
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>Seller</Text>
            <Text style={{ fontSize: 8 }}>{seller}</Text>
            <Text style={{ fontSize: 8 }}>{sellerTime}</Text>
          </View>
        </View>

        {/* BLOCKCHAIN FOOTER */}
        <View style={{ marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#e2e8f0", alignItems: "center" }}>
          <Text style={{ fontSize: 8, color: "#64748b" }}>
            This agreement is secured on the blockchain with transaction hash: {transaction?.blockchain_tx_hash?.substring(0, 20)}...
          </Text>
          <Text style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>
            Block #{transaction?.blockchain_block_number} • {transaction?.blockchain_timestamp ? new Date(transaction.blockchain_timestamp * 1000).toLocaleString() : "N/A"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AgreementPDFDocument;