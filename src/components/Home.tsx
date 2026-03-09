import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, ShieldCheck, Utensils } from 'lucide-react';

interface HomeProps {
  onOrderClick: () => void;
}

export default function Home({ onOrderClick }: HomeProps) {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1920" 
            alt="Delicious Indian Food" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-transparent to-emerald-950/60" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-semibold"
          >
            <Star size={16} />
            <span>Best Home Cooked Food in Town</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-white leading-tight"
          >
            Ghar Ka Khana, <br />
            <span className="text-emerald-400">Har Roz Naya.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100/80 max-w-2xl mx-auto font-medium"
          >
            Experience the warmth of home-cooked meals with our daily rotating menu. 
            Fresh ingredients, traditional recipes, and lots of love.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onOrderClick}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              Order Now
              <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-2xl font-bold text-lg transition-all active:scale-95">
              View Menu
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Clock, title: 'Daily Specials', desc: 'A unique menu for every day of the week, so you never get bored.' },
              { icon: ShieldCheck, title: 'Hygienic & Fresh', desc: 'Prepared in a clean home kitchen using the freshest local ingredients.' },
              { icon: Utensils, title: 'Authentic Taste', desc: 'Traditional recipes passed down through generations for that real home taste.' },
            ].map((feature, i) => (
              <div key={i} className="space-y-4 text-center md:text-left">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-sans font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Highlight */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-sans font-bold tracking-tight text-gray-900">Why Choose Our Cloud Kitchen?</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                We believe that food is more than just fuel. It's an emotion. 
                Our cloud kitchen brings you the comfort of home-cooked meals 
                without the hassle of cooking. Perfect for busy professionals, 
                students, and anyone missing home.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                'No preservatives or artificial colors',
                'Customizable spice levels',
                'Eco-friendly packaging',
                'Timely delivery across the city'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000" 
                alt="Authentic Indian Thali" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-black/5 hidden sm:block">
              <p className="text-3xl font-sans font-bold text-emerald-600">500+</p>
              <p className="text-sm font-medium text-gray-500">Happy Customers Daily</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
