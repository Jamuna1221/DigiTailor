//import { useState } from 'react'
import { Link } from 'react-router-dom'
import heroBg from '../assets/images/hero-bg.png'
import kurti1 from '../assets/images/kurti1.jpg'
import kurti2 from '../assets/images/kurti2.jpg'
import saree from '../assets/images/saree.jpg'
import RecentlyViewed from '../components/product/RecentlyViewed'
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Background decorative elements (now with reduced opacity) */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-200 rounded-full opacity-15"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            {/* AI-Powered Fashion Design Badge */}
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>A FASHION ATELIER STUDIO</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              Where every <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--theme-gradient)' }}>Stitch</span> tells <abbr title=""></abbr>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--theme-gradient)' }}>Story</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover the art of fashion with our personalized studio. Design, customize, and create garments crafted uniquely to your style and vision
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                to="/ai-studio" 
                className="inline-flex items-center space-x-3 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ background: 'var(--theme-gradient)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Start Creating</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-200 font-medium">Happy Customers</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                <div className="text-gray-200 font-medium">Designs Created</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-200 font-medium">Satisfaction Rate</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-200 font-medium">AI Assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Tailored Excellence, Modern Craftsmanship
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Experience styling, precision fitting, and rapid garment creation with our advanced tailoring studio. Unlock fashion made for you, by you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-400/30 transition-all duration-300 bg-white dark:bg-slate-950/40">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--theme-gradient)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Style Consultation</h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                Get personalized style recommendations to help you discover your best look and fabric choices 
              </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-400/30 transition-all duration-300 bg-white dark:bg-slate-950/40">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--theme-gradient)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Perfect Fit Technology</h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
               Advanced digital measurements ensure every garment fits beautifully and comfortably 
               </p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:border-green-200 dark:hover:border-green-400/30 transition-all duration-300 bg-white dark:bg-slate-950/40">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--theme-gradient)' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Rapid Custom Creation	</h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                Swift design-to-delivery process brings your unique ideas to life in record time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">Featured Creations</h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover stunning designs created by us and brought to life by expert craftspeople
            </p>
          </div>
          
          {/* Simple Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={kurti1}                alt="Elegant Silk Saree" 
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={kurti2} 
                alt="Designer Kurta" 
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={saree}
                alt="Modern Cotton Kurti" 
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Explore All Designs Button - KEPT as requested */}
          <div className="text-center">
            <Link 
              to="/catalog" 
              className="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ background: 'var(--theme-gradient)' }}
            >
              <span>Explore All Designs</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 dark:text-slate-300">Real experiences from satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--theme-primary)08 0%, var(--theme-secondary)08 100%)' }}>
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100" 
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:!text-slate-900">Priya Sharma</h4>
                  <p className="text-gray-600 text-sm dark:!text-slate-700">Fashion Designer</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed dark:!text-slate-900">
               "The team understood my style perfectly! The designs matched what I envisioned, and the quality is outstanding" </p>
            </div>
            
            <div className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--theme-primary)08 0%, var(--theme-accent)08 100%)' }}>
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" 
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:!text-slate-900">Raj Patel</h4>
                  <p className="text-gray-600 text-sm dark:!text-slate-700">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed dark:!text-slate-900">
                "I received a perfectly fitted suit in just 5 days. The tailoring suggestions were exactly right."</p>
            </div>
            
            <div className="p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--theme-secondary)08 0%, var(--theme-accent)08 100%)' }}>
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" 
                  alt="Customer"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:!text-slate-900">Anita Singh</h4>
                  <p className="text-gray-600 text-sm dark:!text-slate-700">Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed dark:!text-slate-900">
                "Amazing experience! Beautiful ethnic wear designs tailored to my preferences. Highly recommended!" </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ background: 'var(--theme-gradient)' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Discover Your Signature Style?
          </h2>
          <p className="text-xl mb-10 leading-relaxed opacity-90">
            Join thousands of fashion lovers already enjoying unique, beautifully tailored garments made just for them</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/ai-studio" 
              className="inline-flex items-center space-x-3 bg-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              style={{ color: 'var(--theme-primary)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Start Creating Now</span>
            </Link>
            <Link 
              to="/catalog" 
              className="inline-flex items-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all duration-300"
              style={{ 
                '--hover-text-color': 'var(--theme-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--theme-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'white'
              }}
            >
              <span>Browse Designs</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
