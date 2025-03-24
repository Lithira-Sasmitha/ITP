import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IncomeForm from "../../components/form/incomeform";
import IncomeChart from "../../components/Chart/incomechart";
import IncomeList from "../../components/list/incomelist";
import 'boxicons';

function Income() {
  const [activeTab, setActiveTab] = useState("add");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const tabVariants = {
    inactive: { scale: 1 },
    active: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Background patterns and shapes
  const BgPattern = () => (
    <div className="fixed inset-0 z-0 opacity-5">
      <div className="absolute top-0 left-0 w-full h-full">
        <svg width="100%" height="100%" className="text-green-500">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="8" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
    </div>
  );

  const FloatingElements = () => (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-green-500 rounded-full opacity-10"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <BgPattern />
      <FloatingElements />
      
      <motion.div 
        className="relative z-10 overflow-y-auto p-6 text-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with glass morphism */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-lg bg-white bg-opacity-10 rounded-3xl p-6 mb-8 border border-white border-opacity-20 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-500 mb-2 flex items-center">
                <box-icon name="sparkles" type="solid" size="32px" color="#10b981"></box-icon>
                <span className="ml-2">Income Dashboard</span>
              </h1>
              <p className="text-black max-w-2xl">
                Track, manage, and visualize your income streams with our beautifully designed tools.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <motion.div 
                className="inline-flex bg-black bg-opacity-30 backdrop-blur-md rounded-full p-1 mt-4 md:mt-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "add" ? "active" : "inactive"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("add")}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === "add" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="flex items-center">
                    <box-icon name="dollar" size="20px" color="currentColor"></box-icon>
                    <span className="ml-1">Add</span>
                  </span>
                </motion.button>
                
                
                
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "history" ? "active" : "inactive"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === "history" 
                      ? "bg-green-500 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="flex items-center">
                    <box-icon name="history" size="20px" color="currentColor"></box-icon>
                    <span className="ml-1">History</span>
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Content Based on Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "add" && (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Add Income Form */}
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-white bg-opacity-5 rounded-3xl p-6 border border-white border-opacity-10 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <box-icon name="dollar" size="24px" color="#10b981"></box-icon>
                  <span className="ml-2">Add New Income</span>
                </h2>
                <div className="transform transition hover:scale-[1.01]">
                  <IncomeForm />
                </div>
              </motion.div>
              
              {/* Right side preview + tips */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-6"
              >
                <div className="backdrop-blur-xl bg-white bg-opacity-5 rounded-3xl p-6 border border-white border-opacity-10 shadow-xl h-full">
                  <h2 className="text-2xl font-bold mb-4 text-green-400">Income Overview</h2>
                  <div className="h-[250px] flex items-center justify-center">
                    <IncomeChart />
                  </div>
                </div>
                
                <div className="backdrop-blur-xl bg-white bg-opacity-5 rounded-3xl p-6 border border-white border-opacity-10 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center">
                    <box-icon name="bulb" size="20px" color="#10b981"></box-icon>
                    <span className="ml-2">Pro Tips</span>
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-400">•</div>
                      <p>Categorize your income for better financial insights</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-400">•</div>
                      <p>Set up recurring income items to save time</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-400">•</div>
                      <p>Review your income patterns monthly for better planning</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-white bg-opacity-5 rounded-3xl p-8 border border-white border-opacity-10 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <box-icon name="trending-up" size="24px" color="#10b981"></box-icon>
                  <span className="ml-2">Income Overview</span>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                      <IncomeChart />
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-black bg-opacity-30 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-green-400">Income Breakdown</h3>
                      <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {/* This will be filled by the IncomeLabels component inside IncomeChart */}
                        <IncomeList />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-white bg-opacity-5 rounded-3xl p-6 border border-white border-opacity-10 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <box-icon name="history" size="24px" color="#10b981"></box-icon>
                  <span className="ml-2">Income History</span>
                </h2>
                <IncomeList />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default Income;