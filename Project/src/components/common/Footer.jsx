import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-orange-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">DigiTailor</span>
            </Link>
            <p className="text-purple-200 leading-relaxed">
             Experience styling, precision fitting, and rapid garment creation with our advanced tailoring studio. Unlock fashion made for you, by you
              Creating perfect fits and stunning designs for the modern wardrobe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-300 hover:text-white transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/ai-design-studio" className="text-purple-200 hover:text-white transition-colors">Custom design Studio</Link></li>
              <li><Link to="/catalog" className="text-purple-200 hover:text-white transition-colors">Design Catalog</Link></li>
              <li><Link to="/gallery" className="text-purple-200 hover:text-white transition-colors">Customer Gallery</Link></li>
              <li><Link to="/services" className="text-purple-200 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/about" className="text-purple-200 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-300">Services</h3>
            <ul className="space-y-2">
              <li className="text-purple-200">Custom Blouses</li>
              <li className="text-purple-200">Designer Kurtis</li>
              <li className="text-purple-200">Traditional Dresses</li>
              <li className="text-purple-200">Kids Wear</li>
              <li className="text-purple-200">Alterations & Repairs</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-300">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-purple-200">+91 8608737147</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-purple-200">2312106@nec.edu.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-purple-200">Thoothukudi,Tamilnadu-628721</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-purple-300 text-sm">
            © 2025 DigiTailor. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-purple-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-purple-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-purple-300 hover:text-white text-sm transition-colors">
              Returns & Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;