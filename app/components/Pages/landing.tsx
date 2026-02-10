import { useState, useEffect } from 'react';
import { BaseBoundIcon } from '../Icons/BaseBoundIcon';
import { Link } from 'react-router';

const features = [
  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Always Free", desc: "Zero fees. Zero subscriptions. Zero hidden costs. Just service members helping each other.", color: "blue-600", span: "md:col-span-2 lg:row-span-2", large: true },
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Verified Only", desc: "All users verified through military email. On-base rides only.", color: "green-600" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant Updates", desc: "Real-time notifications when rides are posted or accepted.", color: "orange-600" },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "Community First", desc: "Built by service members, for service members. Every ride strengthens our base community.", color: "purple-600", span: "md:col-span-2", gradient: true },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", title: "Dead Simple", desc: "Post or find a ride in seconds. No complexity, no confusion.", color: "indigo-600" },
  { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Built to Help", desc: "No profit motive. Just airmen helping airmen get around.", color: "yellow-600" }
];

const steps = [
  { num: "1", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: "Create Account", desc: "Quick verification with your .mil email. You'll be approved and ready to ride in minutes.", color: "blue-600" },
  { num: "2", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Post or Browse", desc: "Need a ride? Post where you're going. Have time to drive? Check who needs help.", color: "indigo-600" },
  { num: "3", icon: "M5 13l4 4L19 7", title: "Connect & Go", desc: "Get matched instantly. Coordinate pickup details and you're on your way.", color: "green-600" }
];

const benefits = [
  { color: "blue", title: "No profit motive", desc: "Built to serve, not to sell" },
  { color: "green", title: "Your data stays yours", desc: "No selling, no tracking, no ads" },
  { color: "purple", title: "Open feedback welcome", desc: "We're improving based on your input" }
];

const trustItems = ["No Credit Card", "No Hidden Fees", "Always Free"];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      
      <div className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <BaseBoundIcon />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 block leading-none">Base Bound</span>
              <span className="text-xs text-gray-500 block leading-none mt-0.5 hidden sm:block">Community Rideshare</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:block px-4 sm:px-5 py-2 text-sm text-gray-700 font-semibold hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 sm:px-5 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">Get Started</Link>
          </div>
        </div>
      </div>

      <section id="hero" className="pt-20 sm:pt-28 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-48 h-48 sm:w-96 sm:h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md border border-blue-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-gray-700">Available Now</span>
                </div>

                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-none mb-3 sm:mb-4">
                    Free Rides<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">For Our<br />Community</span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
                    Volunteer-powered ridesharing connecting service members across base. No apps to download, no fees to pay—just community helping community.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link to="/register" className="group px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                    Start for Free
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link to="/login" className="px-6 py-2.5 sm:py-3 bg-white text-gray-900 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-300 text-center">Sign In</Link>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                  {[{ icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", color: "green", title: "100% Free", subtitle: "Always" }, { icon: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", color: "blue", title: "Secure", subtitle: "Verified Only" }].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                        <svg className={`w-4 h-4 text-${item.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 relative mt-6 lg:mt-0">
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 relative z-10 border border-gray-100">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg flex-shrink-0">SJ</div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">SSgt Johnson</h3>
                          <p className="text-xs text-gray-500">60 AMW • Phoenix Spark</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap">Available Now</span>
                        <span className="text-xs text-gray-500">5 min away</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 mb-4">
                      <div className="space-y-3">
                        {[{ loc: "BX Parking Lot", sub: "Building 650", time: "Now", color: "blue" }, { loc: "Main Gate", sub: "North Entrance", time: "1:30 PM", color: "orange" }].map((item, i) => (
                          <div key={i}>
                            {i === 1 && <div className="pl-1.5 border-l-2 border-dashed border-gray-300 ml-1.5 py-1"><div className="text-xs text-gray-500 ml-3">~8 min drive</div></div>}
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-3 h-3 bg-${item.color}-500 rounded-full ring-2 ring-${item.color}-100`}></div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-sm">{item.loc}</div>
                                <div className="text-xs text-gray-500">{item.sub}</div>
                              </div>
                              <div className={`text-xs font-semibold ${item.color === 'blue' ? 'text-gray-400' : 'text-blue-600'} flex-shrink-0`}>{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">Request Ride</button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">View Profile</button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
                      {[{ num: "142", label: "Rides Given" }, { num: "4.9", label: "Rating" }, { num: "2yr", label: "Member" }].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.num}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[{ icon: "M5 13l4 4L19 7", color: "green-emerald", num: "23", label: "Active Drivers", pos: "-right-2 -top-3" }, { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "orange-red", num: "3m", label: "Avg Wait", pos: "-left-2 bottom-6" }].map((card, i) => (
                    <div key={i} className={`absolute ${card.pos} bg-white rounded-xl shadow-xl p-3 border border-gray-100 z-20`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 bg-gradient-to-br from-${card.color.split('-')[0]}-400 to-${card.color.split('-')[1]}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{card.num}</div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{card.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block px-3 py-1.5 bg-blue-100 rounded-full text-blue-700 font-semibold text-xs mb-3">Why Base Bound?</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">Built Different</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">Not your typical rideshare. This is community-driven, military-focused, and 100% free.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div key={i} className={`${feature.span || ''} ${feature.gradient ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' : feature.large ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white' : 'bg-white text-gray-900'} rounded-2xl p-5 sm:p-6 ${feature.gradient || feature.large ? '' : 'shadow-lg border border-gray-100 hover:shadow-2xl'} transition-all ${feature.large || feature.gradient ? 'hover:scale-[1.02]' : ''} group`}>
                <div className={`w-${feature.large ? '12' : '11'} h-${feature.large ? '12' : '11'} sm:w-${feature.large ? '14' : '12'} sm:h-${feature.large ? '14' : '12'} ${feature.gradient || feature.large ? 'bg-white/20 backdrop-blur-sm' : `bg-gradient-to-br from-${feature.color.replace('-600', '-500')} to-${feature.color}`} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className={`w-${feature.large ? '6' : '5'} h-${feature.large ? '6' : '5'} sm:w-${feature.large ? '7' : '6'} sm:h-${feature.large ? '7' : '6'} ${feature.gradient || feature.large ? 'text-white' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className={`${feature.large ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'} font-bold mb-${feature.large ? '3' : '2'}`}>{feature.title}</h3>
                <p className={`${feature.gradient || feature.large ? (feature.gradient ? 'text-purple-100' : 'text-blue-100') : 'text-gray-600'} text-xs sm:text-sm leading-relaxed ${feature.large ? 'mb-4' : ''}`}>{feature.desc}</p>
                {feature.large && (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {["No Payment Required", "Forever"].map((text) => (
                      <div key={text} className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 lg:transform lg:-skew-y-3"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-300 font-semibold text-xs mb-3">Getting Started</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Three Steps to Rolling</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4">From sign-up to pickup in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-700 group-hover:border-blue-500 transition-colors">
                  <div className="absolute -top-3 left-5">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-${step.color.replace('-600', '-500')} to-${step.color} rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-2xl ring-2 ring-gray-900`}>{step.num}</div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <div className={`w-11 h-11 sm:w-13 sm:h-13 bg-${step.color.replace('-600', '-500')}/10 rounded-xl flex items-center justify-center mb-4`}>
                      <svg className={`w-5 h-5 sm:w-6 sm:h-6 text-${step.color.replace('-600', '-400')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div>
              <div className="inline-block px-3 py-1.5 bg-purple-100 rounded-full text-purple-700 font-semibold text-xs mb-3">Phoenix Spark</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
                Built by<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">60 AMW Airmen</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 sm:mb-6">
                Base Bound is a Phoenix Spark innovation project—created by service members at Travis AFB who understand the transportation challenges our community faces. We're not a startup trying to make money. We're your fellow airmen building tools to make base life better.
              </p>
              
              <div className="space-y-3 mb-5 sm:mb-6">
                {benefits.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-4 h-4 text-${item.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                      <div className="text-gray-600 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://www.travisspark.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <span>Learn About Phoenix Spark</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 text-center">
                  <a href="https://www.travisspark.com" target="_blank" rel="noopener noreferrer" className="inline-block mb-5 sm:mb-6">
                    <img src="/phoenix-spark.jpeg" alt="Phoenix Spark" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover mx-auto shadow-2xl ring-4 ring-white/20" />
                  </a>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Innovation from Within</h3>
                  <p className="text-purple-100 text-sm sm:text-base leading-relaxed">Phoenix Spark is 60 AMW's innovation cell at Travis AFB, empowering airmen to build solutions for real base challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight px-4">
            Your Base.<br />Your Community.<br /><span className="text-blue-200">Your Free Ride.</span>
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
            Join service members getting where they need to go—together, for free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <Link to="/register" className="group px-8 sm:px-10 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-bold text-sm sm:text-base shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2">
              <span>Get Started Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/login" className="px-8 sm:px-10 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-sm sm:text-base border-2 border-white/30 hover:bg-white/20 transition-all">I Have an Account</Link>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/80 text-xs px-4">
            {trustItems.map((text) => (
              <div key={text} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BaseBoundIcon />
              </div>
              <div>
                <div className="text-white font-bold text-base">Base Bound</div>
                <div className="text-xs text-gray-500">Powered by Phoenix Spark</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs">© 2025 Base Bound</p>
              <p className="text-xs text-gray-600 mt-1">Volunteer-driven community service • Built by 60 AMW at Travis AFB</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}