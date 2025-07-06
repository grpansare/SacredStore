import React, { useState } from 'react';
import { Heart, Star, Users, Shield, Gift, ChevronDown, ChevronUp } from 'lucide-react';

export default function AboutUs() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Faith & Devotion",
      description: "We honor the sacred traditions and spiritual practices that bring meaning to your life."
    },
    {
      icon: <Star className="w-8 h-8 text-amber-500" />,
      title: "Quality & Authenticity",
      description: "Each product is carefully selected for its craftsmanship and spiritual significance."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Community & Service",
      description: "We serve diverse faith communities with respect, understanding, and dedication."
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      title: "Trust & Integrity",
      description: "We conduct our business with honesty, transparency, and ethical practices."
    }
  ];

  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      content: "To provide sacred and meaningful religious products that inspire faith, foster spiritual growth, and connect people with their divine purpose. We believe that the right spiritual tools can transform lives and strengthen communities."
    },
    {
      id: 'story',
      title: 'Our Story',
      content: "Founded in 2010 by a family of faith, Sacred Treasures began as a small local shop serving our community's spiritual needs. What started as a calling to share beautiful religious artifacts has grown into a trusted source for sacred items across multiple faith traditions."
    },
    {
      id: 'commitment',
      title: 'Our Commitment',
      content: "We are committed to sourcing authentic products from artisans and suppliers who share our values. Every item in our collection is chosen with care, ensuring it meets our high standards for quality, authenticity, and spiritual significance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
            <Gift className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Sacred Treasures
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            "Enriching lives through faith, one sacred treasure at a time"
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-50 rounded-full">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Sections */}
        <div className="max-w-4xl mx-auto mb-16">
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {section.title}
                </h2>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="bg-white mx-2 p-6 rounded-b-xl shadow-md border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-600 mb-2">1000+</div>
              <div className="text-gray-600">Sacred Products</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Spiritual Journey
          </h2>
          <p className="text-lg mb-6 text-orange-100">
            Discover sacred treasures that will enrich your faith and spiritual practice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-600">
          <p className="italic">
            "May your spiritual journey be filled with peace, love, and divine blessings."
          </p>
        </div>
      </div>
    </div>
  );
}