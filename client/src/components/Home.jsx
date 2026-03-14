import React from 'react';
import Loader from './Loader';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import HowItWorks from './HowItWorks';
import { Feature as Features } from './ui/feature-section-with-bento-grid';
import Footer from './Footer';
import ClickSpark from './ui/ClickSpark';

const Home = () => {
    return (
        <ClickSpark
            sparkColor='#2563eb'
            sparkSize={10}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
        >
            <Loader />
            <Navbar />
            <Hero />
            <About />
            <HowItWorks />
            <Features />
            <Footer />
        </ClickSpark>
    );
};

export default Home;
