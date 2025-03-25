import { motion } from "framer-motion";
import IncomeForm from "../../components/form/incomeform";
import IncomeChart from "../../components/Chart/incomechart";
import IncomeList from "../../components/list/incomelist";
import Fin_sidebar from "../../components/sidebar/fin_sidebar";
import { CreditCard, TrendingUp, Layers, Settings } from "lucide-react";

function Income() {
  // Animated variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Sidebar */}
      <Fin_sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-green-900">Income </h1>
            <p className="text-green-600 mt-2">Manage your income with ease</p>
          </div>
          
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Transaction Form Column */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border-2 border-green-100">
              <div className="flex items-center mb-4">
                <CreditCard className="mr-3 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Add Income</h2>
              </div>
              <IncomeForm />
            </div>
          </motion.div>

          {/* Chart Column */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border-2 border-green-100 h-full">
              <div className="flex items-center mb-4">
                <TrendingUp className="mr-3 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Income Overview</h2>
              </div>
              <div className="flex justify-center items-center h-full">
                <IncomeChart />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Income List */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border-2 border-green-100"
        >
          <div className="flex items-center mb-4">
            <Layers className="mr-3 text-green-600" />
            <h2 className="text-xl font-semibold text-green-900">Income History</h2>
          </div>
          <IncomeList />
        </motion.div>
      </div>
    </div>
  );
}

export default Income;