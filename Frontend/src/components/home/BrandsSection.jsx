import React from 'react';
import './BrandsSection.css';
import skfImage from '../../assets/Logo/skf.jpg';
import yukenImage from '../../assets/Logo/Yuken.gif';
import fagImage from '../../assets/Logo/fag.webp';
import hiwinImage from '../../assets/Logo/hiwin.jpg';
import finhyImage from '../../assets/Logo/finhy.png';
import ntnImage from '../../assets/Logo/ntn.jpeg';
import nachiImage from '../../assets/Logo/nachi.png';
import arbImage from '../../assets/Logo/arb.jpeg';
import polyhydronImage from '../../assets/Logo/Polyhydron.png';
import alpImage from '../../assets/Logo/alp.png';
import kluberImage from '../../assets/Logo/kluber.png';
import loctiteImage from '../../assets/Logo/loctit.jpeg';
import nskImage from '../../assets/Logo/nsk.png';
import oksImage from '../../assets/Logo/oks.png';
import schaefflerImage from '../../assets/Logo/schaffler.png';
import walvoilImage from '../../assets/Logo/walvoil.jpeg';
import pmiImage from '../../assets/Logo/PMI.png';
import nbcImage from '../../assets/Logo/NBC.png';


const brands = [
  { id: 1, name: "SKF", src: skfImage, bgColor: "#EBF4FA" }, // Blue tint
  { id: 2, name: "Yuken", src: yukenImage, bgColor: "#EBF4FA" },
  { id: 3, name: "FAG", src: fagImage, bgColor: "#FDF2F2" }, // Red tint
  { id: 4, name: "HIWIN", src: hiwinImage, bgColor: "#EEF9F1" }, // Green tint
  { id: 5, name: "FINHY", src: finhyImage, bgColor: "#EBF4FA" },
  { id: 6, name: "NTN", src: ntnImage, bgColor: "#EBF4FA" },
  { id: 7, name: "NACHI", src: nachiImage, bgColor: "#FDF2F2" },
  { id: 8, name: "ARB", src: arbImage, bgColor: "#F5F7F9" }, // Gray tint
  { id: 9, name: "Polyhydron", src: polyhydronImage, bgColor: "#EBF4FA" },
  { id: 10, name: "ALP", src: alpImage, bgColor: "#F5F7F9" },
  { id: 11, name: "KLUBER", src: kluberImage, bgColor: "#F5F7F9" },
  { id: 12, name: "PMI", src: pmiImage, bgColor: "#F5F7F9" },
  { id: 13, name: "Loctite", src: loctiteImage, bgColor: "#FDF2F2" },
  { id: 14, name: "NSK", src: nskImage, bgColor: "#EBF4FA" },
  { id: 15, name: "OKS", src: oksImage, bgColor: "#F5F7F9" },
  { id: 16, name: "Schaeffler", src: schaefflerImage, bgColor: "#EEF9F1" },
  { id: 17, name: "Walvoil", src: walvoilImage, bgColor: "#FDF2F2" },
  { id: 18, name: "NBC", src: nbcImage, bgColor: "#FDF2F2" },
];

const BrandsSection = () => {
  return (
    <section className="brands-section">
      <div className="container">
        <div className="brands-header">
          <h2 className="section-title">Brands We Deal In</h2>
          <p className="section-subtitle">Partnering with global leaders in manufacturing and machinery.</p>
        </div>

        <div className="brands-marquee-wrapper">
          <div className="brands-track">
            {/* Double the array for seamless endless scrolling */}
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="brand-logo-card" style={{ backgroundColor: brand.bgColor }}>
                <img src={brand.src} alt={brand.name} className="brand-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
