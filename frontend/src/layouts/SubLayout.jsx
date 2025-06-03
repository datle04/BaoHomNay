import React from 'react'
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SubLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default SubLayout
