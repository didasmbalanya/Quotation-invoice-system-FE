import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_BASE_URL from "../config";

// ======= Styled components (same theme as QuotationList) =======

const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Helvetica", sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
`;

const Title = styled.h2`
  color: #a07a3f;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-family: "Helvetica-Bold", sans-serif;
  margin-top: 1rem;
  color: #444;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  font-family: "Helvetica-Bold", sans-serif;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 0.5rem;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return `
          background: #a07a3f;
          color: white;
          &:hover { background: #8b693a; }
        `;
      case "danger":
        return `
          background: #c0392b;
          color: white;
          &:hover { background: #a93226; }
        `;
      default:
        return `
          background: #f3f1ec;
          color: #444;
          border: 1px solid #ccc;
          &:hover { background: #eee; }
        `;
    }
  }}
`;

const ActionRow = styled.div`
  margin-top: 1.5rem;
`;

// ================== Component ==================

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/quotations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch quotation");
        const data = await res.json();
        setQuotation(data);
      } catch (err) {
        console.error(err);
        alert("Could not load quotation");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id]);

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (!quotation) return <PageContainer>No quotation found.</PageContainer>;

  const handleDownloadPDF = (invoice) => {
    window.open(`${API_BASE_URL}/quotations/${invoice}/pdf`, "_blank");
  };

  return (
    <PageContainer>
      <Card>
        <Title>Quotation Details</Title>
        <Label>Client Name: {quotation.clientName}</Label>
        <Label>Email: {quotation.email}</Label>
        <Label>Phone: {quotation.phone}</Label>
        <Label>
          Date: {new Date(quotation.quotationDate).toLocaleDateString()}
        </Label>
        <Label>Total Amount: ${quotation.totalAmount?.toLocaleString()}</Label>

        <Table>
          <thead>
            <tr>
              <Th>Item Name</Th>
              <Th>Qty</Th>
              <Th>Days</Th>
              <Th>Unit Price</Th>
              <Th>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, idx) => (
              <tr key={idx}>
                <Td>{item.name}</Td>
                <Td>{item.qty}</Td>
                <Td>{item.days}</Td>
                <Td>${item.unitPrice}</Td>
                <Td>${item.amount}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ActionRow>
          <Button
            variant="primary"
            onClick={() => handleDownloadPDF(quotation.id)}
          >
            Download Quotation PDF
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              fetch(`${API_BASE_URL}/invoices/${id}`, { method: "POST" })
                .then(() => navigate("/invoices"))
                .catch(() => alert("Failed to create invouce"));
            }}
          >
            Generate Invoice
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/quotation/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (window.confirm("Delete this quotation?")) {
                try {
                  const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();

                  if (!res.ok)
                    throw new Error(data.error || "Failed to delete quotation");
                } catch (err) {
                  console.error(err);
                  alert(
                    err.message ||
                      "Could not delete quotation. Please try again."
                  );
                }
              }
            }}
          >
            Delete
          </Button>
        </ActionRow>
      </Card>
    </PageContainer>
  );
}
