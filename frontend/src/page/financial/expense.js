import { motion } from "framer-motion";
import Expenseform from "../../components/form/expenseform";
import Header from "../../components/header/header";
import ExpenceChart from "../../components/Chart/expencechart";
import Expencelist from "../../components/list/expencelist";

function Expense() {
  return (
    <div className="relative z-10  overflow-y-auto p-4"> 
      <Header title={"Expenses"} />

      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-16"> 
        {/* Transaction Form */}
        <div className="overflow-y-auto px-4 sm:px-6"> 
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-bold pb-4 text-xl">Transaction</h1>
            <Expenseform />
          </motion.div>
        </div>

        {/* Expense Chart */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium mb-4 text-gray-100">Chart</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ExpenceChart />
            </div>
          </div>
        </motion.div>
        <div className="w-full mt-6"> 
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Expencelist />
          </motion.div>
        </div>
        </div>
        {/* Transaction Labels */}
       
      
    </div>
  );
}

export default Expense;