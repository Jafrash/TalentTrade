import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Users, Brain, Target, Sparkles } from "lucide-react";

const LandingPage = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Learn From Experts",
      description: "Gain insights and practical knowledge directly from experienced mentors who excel in their respective fields."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Share Your Expertise",
      description: "Become a mentor yourself and share your knowledge with others while building a strong community."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Environment",
      description: "Connect with like-minded individuals and participate in projects that fuel creativity and innovation."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Diverse Learning",
      description: "Explore a wide range of topics from traditional crafts to cutting-edge technologies, all free of cost."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Continuous Growth",
      description: "Support your lifelong learning journey whether you're a novice or a seasoned professional."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2D2D2D]">
        <motion.div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
        />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-[#3BB4A1] mb-6"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              TALENT TRADE
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Exchange skills, grow together, and build a community of lifelong learners
            </motion.p>
            <motion.button
              className="bg-[#3BB4A1] text-white px-8 py-4 rounded-full text-lg font-semibold 
                         hover:bg-[#028477] transition-all transform hover:scale-105 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#2D2D2D] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center text-[#3BB4A1] mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Talent Trade?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#242424] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-[#3BB4A1] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#3BB4A1] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Learning Journey?
          </motion.h2>
          <motion.p 
            className="text-lg text-white/90 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Join our community today and unlock a world of knowledge exchange
          </motion.p>
          <motion.button
            className="bg-white text-[#3BB4A1] px-8 py-4 rounded-full text-lg font-semibold 
                       hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Now <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;