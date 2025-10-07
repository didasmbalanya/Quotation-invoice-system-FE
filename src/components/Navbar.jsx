import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 50px;
  }

  h1 {
    color: #a07a3f;
    font-family: "Helvetica-Bold", sans-serif;
    font-size: 1.5rem;
    margin: 0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-family: "Helvetica", sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f6f2;
    color: #a07a3f;
  }

  &.active {
    color: #a07a3f;
    font-family: "Helvetica-Bold", sans-serif;
  }
`;

const ContactInfo = styled.div`
  text-align: right;
  font-family: "Helvetica", sans-serif;
  font-size: 0.8rem;

  p {
    margin: 0;
    color: #666;
  }

  a {
    color: #a07a3f;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Navbar = () => {
  return (
    <NavContainer>
      <Logo>
        <h1>Quotations & Invoicing System</h1>
      </Logo>

      <NavLinks>
        <NavLink to="/quotation/new">Create Quotations</NavLink>
        <NavLink to="/">Quotations</NavLink>
        <NavLink to="/invoices">Invoices</NavLink>
      </NavLinks>
    </NavContainer>
  );
};
