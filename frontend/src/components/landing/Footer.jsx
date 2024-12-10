import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react'; // Import available social media icons
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 pt-10 bg-white" id="contact">
      <div className="container-padding py-12 md:py-16 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-start">
            <a href="/"><img src="./NeoAegis.png" alt="" width={'220px'} /></a>
            <p className="text-neutral-600 text-normal font-semibold mt-2">
              Your Trusted Personal Safety Companion
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="font-semibold my-4 text-lg">Features</h4>
            <ul className="space-y-3 text-sm text-neutral-600 font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">SOS Button</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety Check-Ins</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Geo-Fencing</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-semibold my-4 text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-600 font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold my-4 text-lg">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-600 font-semibold">
              <li><a href="mailto:support@neoaegis.com" className="hover:text-primary transition-colors">support@neoaegis.com</a></li>
              <li><a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className='flex flex-col md:flex-row justify-between mt-12'>
          <div className="mt-6 md:w-1/3">
            <h4 className="font-semibold mb-4 text-xl">Get in Touch</h4>
            <form className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition" 
                required 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition" 
                required 
              />
              <textarea 
                rows="4" 
                placeholder="Your Message" 
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition" 
                required 
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-white p-2 rounded hover:bg-secondary transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-6 md:w-1/3">
            <h4 className="font-semibold mb-4 text-lg">Subscribe to Our Newsletter</h4>
            <form className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="flex-1 p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition" 
                required 
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white p-2 rounded hover:bg-secondary transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <div className="flex gap-6 mt-6 justify-center">
                <a href="https://www.facebook.com/" target='_blank' rel="noopener noreferrer" className="text-neutral-600 hover:text-secondary transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com/?lang=en" target='_blank' rel="noopener noreferrer" className="text-neutral-600 hover:text-secondary transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/?hl=en" target='_blank' rel="noopener noreferrer" className="text-neutral-600 hover:text-secondary transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://wa.me/" target='_blank' rel="noopener noreferrer" className="text-neutral-600 hover:text-secondary transition-colors">
                  <FaWhatsapp className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
  
          {/* Bottom Section */}
          <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-md font-semibold text-neutral-600 mx-auto">
              © 2024 <span className='text-primary'>Neo<span className='text-secondary'>Aegis</span></span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;