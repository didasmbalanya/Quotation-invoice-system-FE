import { useEffect, useState } from "react";
import styled from "styled-components";
import API_BASE from "../config";

// =================== STYLES ===================

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  font-family: 'Helvetica', sans-serif;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: #a07a3f;
    font-family: 'Helvetica-Bold', sans-serif;
    font-size: 1.75rem;
    margin: 0 0 1rem 0;
    text-align: center;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th {
    background: #a07a3f;
    color: white;
    font-family: 'Helvetica-Bold', sans-serif;
    font-size: 0.9rem;
    text-align: left;
    padding: 1rem;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
  }

  tr:nth-child(even) {
    background: #f8f6f2;
  }
`;

const Button = styled.button`
  background: #a07a3f;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 4px;
  font-family: 'Helvetica-Bold', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #8b693a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// =================== COMPONENT ===================

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/invoices`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInvoices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setLoading(false);
      });
  }, []);

   const handleDownloadPDF = (invoiceId) => {
    window.open(`${API_BASE}/invoices/${invoiceId}/pdf`, "_blank");
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <h1>Invoices</h1>
        </PageHeader>
        <Card>
          <p>Loading invoices...</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <h1>Invoices</h1>
      </PageHeader>

      <Card>
        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total Amount(ksh)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.quotation.clientName}</td>
                  <td>{inv.invoiceDate}</td>
                  <td>{inv.quotation.totalAmount}</td>
                  <td>
                    <Button onClick={() => handleDownloadPDF(inv.id)}>
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}
