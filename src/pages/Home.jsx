import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiZap, FiUsers, FiTrendingUp, FiClock, FiHeadphones, 
  FiCheckCircle, FiUserCheck, FiDollarSign, FiStar
} from 'react-icons/fi';
import { FaHandHoldingUsd, FaQuoteLeft } from 'react-icons/fa';

const Home = () => {
  // Smooth scroll function for internal links
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    { icon: FiShield, title: 'Secure & Reliable', description: 'Bank-grade security with encrypted transactions and secure data storage. Your data is protected 24/7.' },
    { icon: FiZap, title: 'Fast Processing', description: 'Instant loan approvals and real-time transaction processing. No more waiting days for decisions.' },
    { icon: FiUsers, title: 'Member Management', description: 'Comprehensive member profiles with credit scoring, loan history, and savings tracking.' },
    { icon: FiTrendingUp, title: 'Smart Analytics', description: 'Real-time reports and insights for better decision making. Know your SACCO\'s health at a glance.' },
    { icon: FiClock, title: '24/7 Access', description: 'Access your account anytime, anywhere. Members can check balances and make payments round the clock.' },
    { icon: FiHeadphones, title: 'Dedicated Support', description: 'Expert support team ready to assist you 24/7 via phone, email, or live chat.' },
  ];

  const benefits = [
    'Complete end-to-end SACCO management solution',
    'Seamless MPESA integration for payments',
    'Real-time financial reports and analytics',
    'Automated loan processing and repayment tracking',
    'Secure cloud-based platform with 99.9% uptime',
    'Dedicated customer support and training',
  ];

  const stats = [
    { value: '10K+', label: 'Active Members', icon: FiUsers },
    { value: 'KES 500M+', label: 'Loans Disbursed', icon: FaHandHoldingUsd },
    { value: '98%', label: 'Satisfaction Rate', icon: FiStar },
    { value: '24/7', label: 'Support Available', icon: FiHeadphones },
  ];

  const testimonials = [
    { name: 'John Mwangi', role: 'SACCO Manager', content: 'SaccoFlow has transformed how we manage our members. The loan processing time has reduced by 70%!', rating: 5 },
    { name: 'Sarah Wanjiku', role: 'Member', content: 'Applying for loans is now so easy. I love the MPESA integration - payments are seamless!', rating: 5 },
    { name: 'Peter Omondi', role: 'Admin Officer', content: 'The reporting features are incredible. I can generate any report I need in seconds.', rating: 5 },
  ];

  const pricingPlans = [
    { name: 'Starter', price: 'KES 5,000', features: ['Up to 500 members', 'Basic reporting', 'Email support', 'Loan management'], popular: false },
    { name: 'Professional', price: 'KES 15,000', features: ['Up to 2,000 members', 'Advanced reporting', 'Priority support', 'MPESA integration', 'Savings accounts'], popular: true },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited members', 'Full analytics', 'Dedicated account manager', 'API access', 'Custom features'], popular: false },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 to-blue-900 text-white min-h-[700px] flex items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')" }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-blue-500/20 rounded-full px-4 py-1 mb-6">
              <span className="text-sm font-medium">🚀 Trusted by 100+ SACCOs</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Modern SACCO Management Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Empower your SACCO with our all-in-one platform. Manage members, loans, savings, and payments effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center shadow-lg">
                Get Started Free
              </Link>
              <button 
                onClick={(e) => handleScroll(e, 'features')} 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Icons */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern SACCOs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to run your SACCO efficiently in one integrated platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                  <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get started in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your account and get verified', icon: FiUsers },
              { step: '02', title: 'Setup Profile', description: 'Complete your member profile', icon: FiUserCheck },
              { step: '03', title: 'Apply for Loans', description: 'Submit loan applications online', icon: FaHandHoldingUsd },
              { step: '04', title: 'Manage Savings', description: 'Track savings and investments', icon: FiDollarSign },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                  {index < 3 && <div className="hidden md:block absolute -right-10 top-1/2 w-8 h-0.5 bg-blue-200" />}
                </div>
                <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose SaccoFlow?</h2>
              <p className="text-gray-600 mb-6">We understand the unique needs of SACCOs and have built a platform that addresses every aspect of your operations.</p>
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center mt-8 text-blue-600 font-semibold hover:text-blue-700">
                Start Free Trial <FiArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white">
              <div className="flex items-center space-x-2 mb-4">
                <FaQuoteLeft className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-xl leading-relaxed mb-6">"SaccoFlow has revolutionized how we manage our SACCO. The loan processing time has reduced by 70%, and our members love the convenience."</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">John Mwangi</p>
                  <p className="text-sm text-blue-200">SACCO Manager, Unity SACCO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your SACCO's needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-md overflow-hidden ${plan.popular ? 'ring-2 ring-blue-600 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-500">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block text-center bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your SACCO?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of SACCOs already using SaccoFlow to manage their operations efficiently.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Start Free Trial
            </Link>
            <button 
              onClick={(e) => handleScroll(e, 'features')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">Subscribe to our newsletter for the latest updates and features.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 bg-white" 
              required 
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-gray-400 text-sm mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;