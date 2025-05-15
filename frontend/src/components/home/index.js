import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";
import AOS from "aos";
import "aos/dist/aos.css";
import {FaCameraRetro} from 'react-icons/fa';
import {GiNotebook} from 'react-icons/gi';
import {SlNote} from 'react-icons/sl';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";


const NavLinks = [
  {
    id: "1",
    name: "SignIn",
    link: "/signin",
  },
  {
    id: "2",
    name: "SignUp",
    link: "/signup",
  },
];

const skillsData = [
  {
    name: "Coco Peat Grow Bags",
    image: "https://nbcoir.com/images/briquette1.jpg",
    description: "Coco Peat Briquettes come in small sizes and varying weights, including 650g, 500g, 315g, and 250g.",
    aosDelay: "0",
  },
  {
    name: "Coco Coir Discs",
    image: "https://nbcoir.com/images/coco-peat-discs1.webp",
    description: "CeyCoir is proud to offer a premium range of coco coir discs, specially designed to meet the needs of seed starting, cloning, and plant propagation enthusiasts.",
    aosDelay: "500",
  },
  {
    name: "Mix Fiber Bales",
    image: "https://nbcoir.com/images/fiber-bales.webp",
    description: "We are dedicated to providing superior quality mix fiber bales and coco coir products tailored to meet the diverse needs of our customers.",
    aosDelay: "1000",
  },
];

const Home = () => {
  // Dark mode state
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="bg-green-100 dark:bg-black dark:text-white duration-300">
      {/* Navbar */}
      <nav className="shadow-[0_4px_15px_rgba(0,0,0,0.4)] bg-gray-900 text-white dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Left Side: Logo */}
          <div>
            <h1 className="text-3xl font-bold font-serif">CeyCoir</h1>
          </div>

          {/* Right Side: SignIn, SignUp, and Sun/Moon Icon */}
          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {NavLinks.map((link) => (
                <li key={link.id} className="py-2">
                  <Link
                    to={link.link}
                    className="px-5 py-2 text-lg font-medium rounded-lg border border-green-400 text-green-400 transition-all duration-300 hover:bg-green-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Theme Toggle Icon */}
            {theme === "dark" ? (
              <BiSolidSun
                onClick={() => setTheme("light")}
                className="text-2xl cursor-pointer text-gray-300 hover:text-yellow-400 transition-colors duration-300"
              />
            ) : (
              <BiSolidMoon
                onClick={() => setTheme("dark")}
                className="text-2xl cursor-pointer text-gray-300 hover:text-yellow-400 transition-colors duration-300"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
     {/* Hero Section */}
<div
  className={`w-full min-h-screen flex items-center justify-center transition-colors duration-500 ${
    theme === "light" ? "bg-white" : "bg-black"
  }`}
>
  <div className="max-w-7xl w-full px-6 mx-auto grid place-items-center grid-cols-1 sm:grid-cols-2 gap-10">
    {/* Image */}
    <div
      className="flex justify-center items-center"
      data-aos="fade-up"
      data-aos-duration="1200"
      data-aos-delay="300"
      data-aos-once="true"
    >
      <img
        src="https://nbcoir.com/images/planter-bag2.webp"
        alt="Coco Peat Manufacturer"
        className="rounded-lg shadow-lg w-96 h-auto"
      />
    </div>

    {/* Text Content */}
    <div
      className="text-center sm:text-left flex flex-col justify-center"
      data-aos="fade-left"
      data-aos-duration="1200"
    >
      <h1 className="text-green-700 dark:text-green-400 text-1xl font-serif">
        <span className="font-semibold lg:text-7xl text-1xl block">
        Welcome To CeyCoir
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-800 dark:text-gray-300">
        CeyCoir, established in 2006, has proudly led the industry as a
        premier manufacturer and exporter of premium coco peat and coco
        coir bricks worldwide for over a decade.
      </p>
    </div>
  </div>
</div>


      {/* Second Section */}
<div className="flex items-center justify-center min-h-screen px-4">
  <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
    
    {/* Image Section */}
    <div className=" rounded-lg shadow-lg">
      <img
        src="https://nbcoir.com/images/planter-bag.webp"
        alt="Coco Peat Manufacturer"
        className="rounded-lg w-96 h-auto"
        data-aos="fade-up"
        data-aos-duration="1200"
      />
    </div>

    {/* Text Content */}
    <div data-aos="fade-left" data-aos-duration="1200">
      <h1 className="text-green-700 dark:text-green-400 text-3xl md:text-5xl font-bold">
        Coco Peat Manufacturer
      </h1>
      <p className="mt-4 text-lg text-gray-800 dark:text-gray-300 max-w-lg">
      We are registered exporting company based and operated from Sri Lanka.
      Our global reach extends to key regions, including Australia, New Zealand,
      Dubai & the Gulf area, Russia, and Finland, thanks to our dedicated representatives.
      Join our community of satisfied customers and discover the excellence of NB Coir today.
      </p>
    </div>
  </div>
</div>


<div className="py-14 bg-white dark:bg-black dark:text-white sm:min-h-[600px] sm:grid sm:place-items-center">
  <div className="container mx-auto px-6">
    <div className="pb-12 text-center">
      <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 font-serif">
        Our Products
      </h1>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {skillsData.map((skill, index) => (
        <div
          key={index}
          data-aos="fade-up"
          data-aos-delay={skill.aosDelay}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 transform hover:scale-105 transition-transform duration-300"
        >
          <div className="flex justify-center">
            <img
              src={skill.image}
              alt={skill.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300">
              {skill.name}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {skill.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


<footer className="bg-gray-900 text-white py-10 mt-10 dark:bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <h1 className="text-2xl font-bold text-green-400">CeyCoir</h1>
            <p className="mt-2 text-gray-400">
              Premium Coco Peat & Coir Products Manufacturer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-green-300">Quick Links</h2>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-green-400">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-green-400">About</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-green-400">Products</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-green-400">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold text-green-300">Follow Us</h2>
            <div className="mt-2 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-400 mt-6 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} CeyCoir. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
</div>
  );
};

export default Home;
