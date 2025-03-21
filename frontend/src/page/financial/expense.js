import { motion } from "framer-motion";
import Expenseform from "../../components/form/expenseform";
import Header from "../../components/header/header";
import ExpenceChart from "../../components/Chart/expencechart";
import Expencelist from "../../components/list/expencelist";

function Expense() {
  return (
    <div className="relative z-10 overflow-y-auto p-4"> 
      <Header title={"Expenses"} />

      {/* First row: Transaction and Chart (2 columns) */}
      <div className="grid md:grid-cols-2 gap-4 mt-16"> 
        {/* Transaction Form */}
        <div className="col-span-1">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-bold pb-4 text-xl">Transaction</h1>
            <Expenseform />
          </motion.div>
        </div>

        {/* Expense Chart */}
        <div className="col-span-1">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Chart</h2>
            <div className="flex justify-center">
              <div className="w-full">
                <ExpenceChart />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Second row: Expense List (full width) */}
      <div className="mt-4">
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
  );
}

export default Expense;