import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import API_BASE_URL from "../config";

// =================== STYLES ===================

const PageContainer = styled.div`
  max-width: 800px;
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
  text-align: center;
  color: #a07a3f;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 0.9rem;
  color: #333;
  display: block;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #a07a3f;
  }

  &[readonly] {
    background: #f6f4f1;
    color: #666;
  }
`;

const ItemsContainer = styled.div`
  margin-top: 1rem;
`;

const ItemBox = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f8f6f2;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SubItemsContainer = styled.div`
  margin-top: 1rem;
  background: #fff;
  border: 1px dashed #ccc;
  border-radius: 8px;
  padding: 1rem;
`;

const SubItemRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AddButton = styled.button`
  background: #f3f1ec;
  color: #6a5a3f;
  border: 1px dashed #a07a3f;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eae4d8;
  }
`;

const RemoveButton = styled.button`
  background: #fff5f5;
  color: #c0392b;
  border: 1px solid #e0b4b4;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #ffecec;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-family: "Helvetica-Bold", sans-serif;
  font-size: 0.95rem;
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
      case "secondary":
        return `
          background: #f7f6f4;
          color: #444;
          border: 1px solid #ccc;
          &:hover { background: #eee; }
        `;
      default:
        return ``;
    }
  }}
`;

// =================== COMPONENT ===================

export default function NewQuotation() {
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState({
    uniqueQuotationId: uuidv4(),
    clientName: "",
    email: "",
    phone: "",
    quotationDate: new Date().toISOString().split("T")[0],
    items: [
      { name: "", qty: 1, days: 1, unitPrice: 0, amount: 0, subItems: [""] },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuotation({ ...quotation, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...quotation.items];
    newItems[index][field] = value;

    if (["qty", "days", "unitPrice"].includes(field)) {
      newItems[index].amount =
        (newItems[index].qty || 0) *
        (newItems[index].days || 0) *
        (newItems[index].unitPrice || 0);
    }

    setQuotation({ ...quotation, items: newItems });
  };

  const handleSubItemChange = (itemIndex, subIndex, value) => {
    const newItems = [...quotation.items];
    newItems[itemIndex].subItems[subIndex] = value;
    setQuotation({ ...quotation, items: newItems });
  };

  const addSubItem = (itemIndex) => {
    const newItems = [...quotation.items];
    newItems[itemIndex].subItems.push("");
    setQuotation({ ...quotation, items: newItems });
  };

  const removeSubItem = (itemIndex, subIndex) => {
    const newItems = [...quotation.items];
    newItems[itemIndex].subItems.splice(subIndex, 1);
    setQuotation({ ...quotation, items: newItems });
  };

  const addItem = () => {
    setQuotation({
      ...quotation,
      items: [
        ...quotation.items,
        { name: "", qty: 1, days: 1, unitPrice: 0, amount: 0, subItems: [""] },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      uniqueQuotationId: quotation.uniqueQuotationId,
      clientName: quotation.clientName,
      email: quotation.email,
      phone: quotation.phone,
      quotationDate: quotation.quotationDate,
      items: quotation.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        days: item.days,
        unitPrice: item.unitPrice,
        amount: item.amount,
        subItems: item.subItems.filter((s) => s.trim() !== ""),
      })),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create quotation");

      navigate("/");
    } catch (err) {
      console.error("Error creating quotation:", err);
      alert("Could not create quotation.");
    }
  };

  return (
    <PageContainer>
      <Card>
        <Title>Create New Quotation</Title>

        <Form onSubmit={handleSubmit}>
          {/* Client Info */}
          <FormRow>
            <div>
              <Label>Client Name</Label>
              <Input
                type="text"
                name="clientName"
                value={quotation.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Quotation Date</Label>
              <Input
                type="date"
                name="quotationDate"
                value={quotation.quotationDate}
                onChange={handleChange}
              />
            </div>
          </FormRow>

          <FormRow>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={quotation.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="text"
                name="phone"
                value={quotation.phone}
                onChange={handleChange}
                required
              />
            </div>
          </FormRow>

          {/* Items */}
          <ItemsContainer>
            <h3
              style={{
                fontFamily: "Helvetica-Bold",
                fontSize: "1rem",
                color: "#444",
                marginBottom: "0.75rem",
              }}
            >
              Items
            </h3>

            {quotation.items.map((item, i) => (
              <ItemBox key={i}>
                <ItemGrid>
                  <div>
                    <Label>Item Name</Label>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(i, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(i, "qty", Number(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Days</Label>
                    <Input
                      type="number"
                      value={item.days}
                      onChange={(e) =>
                        handleItemChange(i, "days", Number(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(i, "unitPrice", Number(e.target.value))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" value={item.amount} readOnly />
                  </div>
                </ItemGrid>

                <SubItemsContainer>
                  <h4
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontSize: "0.9rem",
                      color: "#555",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Sub Items
                  </h4>
                  {item.subItems.map((sub, subIndex) => (
                    <SubItemRow key={subIndex}>
                      <Input
                        type="text"
                        placeholder="Sub item name"
                        value={sub}
                        onChange={(e) =>
                          handleSubItemChange(i, subIndex, e.target.value)
                        }
                      />
                      <RemoveButton
                        type="button"
                        onClick={() => removeSubItem(i, subIndex)}
                      >
                        Remove
                      </RemoveButton>
                    </SubItemRow>
                  ))}
                  <AddButton type="button" onClick={() => addSubItem(i)}>
                    + Add Sub Item
                  </AddButton>
                </SubItemsContainer>
              </ItemBox>
            ))}

            <AddButton type="button" onClick={addItem}>
              + Add Item
            </AddButton>
          </ItemsContainer>

          <ActionRow>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Quotation
            </Button>
          </ActionRow>
        </Form>
      </Card>
    </PageContainer>
  );
}
