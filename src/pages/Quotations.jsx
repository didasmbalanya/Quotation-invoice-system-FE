import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_BASE_URL from "../config";

// =================== STYLES ===================

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

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #a07a3f;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 1.8rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

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
      case "info":
        return `
          background: #2980b9;
          color: white;
          &:hover { background: #21618c; }
        `;
      case "edit":
        return `
          background: #f1c40f;
          color: #333;
          &:hover { background: #d4ac0d; }
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

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #ddd;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Thead = styled.thead`
  background: #f6f4f1;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  font-family: "Helvetica-Bold", sans-serif;
  color: #444;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const Row = styled.tr`
  &:hover {
    background: #faf9f7;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const MessageBox = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const LoadingBox = styled.div`
  text-align: center;
  padding: 3rem;
  color: #a07a3f;
  font-weight: bold;
`;

// =================== COMPONENT ===================

export default function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/quotations`);
        if (!res.ok) throw new Error("Failed to fetch quotations");
        const data = await res.json();
        setQuotations(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load quotations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?"))
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/quotations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();


      if (!res.ok) throw new Error(data.error || "Failed to delete quotation");
      setQuotations((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete quotation. Please try again.");
    }
  };

  if (loading) return <LoadingBox>Loading quotations...</LoadingBox>;
  if (error)
    return (
      <MessageBox style={{ color: "red", fontStyle: "normal" }}>
        {error}
      </MessageBox>
    );

  return (
    <PageContainer>
      <Card>
        <TitleRow>
          <Title>Quotations</Title>
          <Button variant="primary" onClick={() => navigate("/quotation/new")}>
            + New Quotation
          </Button>
        </TitleRow>

        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th>Client Name</Th>
                <Th>Date</Th>
                <Th>Total Amount</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {quotations.length > 0 ? (
                quotations.map((q) => (
                  <Row key={q.id}>
                    <Td>{q.clientName}</Td>
                    <Td>
                      {q.quotationDate
                        ? new Date(q.quotationDate).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      {q.totalAmount
                        ? `$${q.totalAmount.toLocaleString()}`
                        : "$0"}
                    </Td>
                    <Td>
                      <ActionRow>
                        <Button
                          variant="info"
                          onClick={() => navigate(`/quotation/${q.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="edit"
                          onClick={() => navigate(`/quotation/edit/${q.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(q.id)}
                        >
                          Delete
                        </Button>
                      </ActionRow>
                    </Td>
                  </Row>
                ))
              ) : (
                <tr>
                  <Td colSpan="4">
                    <MessageBox>No quotations found.</MessageBox>
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
    </PageContainer>
  );
}
