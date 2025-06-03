// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <>
    <Header />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default Layout;
