// frontend/src/components/InvoicePDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'; // Install @react-pdf/renderer

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  title: { fontSize: 24, textAlign: 'center' },
});

const InvoicePDF = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Invoice</Text>
        <Text>Invoice ID: {invoice.invoiceID}</Text>
        <Text>Booking ID: {invoice.bookingID}</Text>
        <Text>Amount: ${invoice.amount}</Text>
        <Text>Date: {invoice.date.day}/{invoice.date.month}/{invoice.date.year}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;