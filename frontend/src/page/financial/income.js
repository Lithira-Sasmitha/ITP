import { motion } from "framer-motion";
import IncomeForm from "../../components/form/incomeform";
import IncomeList from "../../components/list/incomelist";
import Fin_sidebar from "../../components/sidebar/fin_sidebar";
import { CreditCard, Layers, Plus } from "lucide-react";
import { useState } from "react";

function Income() {
  const [showAddForm, setShowAddForm] = useState(false);
  
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

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
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
            <h1 className="text-3xl font-bold text-green-900">Income</h1>
            <p className="text-green-600 mt-2">Manage your income with ease</p>
          </div>
          
          <motion.button
            onClick={toggleAddForm}
            className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg flex items-center shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} className="mr-2" />
            <span>Add Income</span>
          </motion.button>
        </motion.div>

        {/* Form Section - Only shown when showAddForm is true */}
        {showAddForm && (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border-2 border-green-100">
              <div className="flex items-center mb-4">
                <CreditCard className="mr-3 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Add Income</h2>
              </div>
              <IncomeForm />
            </div>
          </motion.div>
        )}

        {/* Income List */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border-2 border-green-100"
        >
          <div className="flex items-center mb-4">
            <Layers className="mr-3 text-green-600" />
            <h2 className="text-xl font-semibold text-green-900">Income History</h2>
          </div>
          <IncomeList showAddButton={false} />
        </motion.div>
      </div>
    </div>
  );
}

export default Income;