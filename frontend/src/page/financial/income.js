import { motion } from "framer-motion";
import IncomeForm from "../../components/form/incomeform";
import Header from "../../components/header/header";
import IncomeChart from "../../components/Chart/incomechart";
import IncomeList from "../../components/list/incomelist";

function Income() {
  return (
    <div className="relative z-10 overflow-y-auto p-4"> 
      <Header title={"Income"} />

      {/* First row: Transaction Form and Chart (2 columns) */}
      <div className="grid md:grid-cols-2 gap-4 mt-16"> 
        {/* Income Transaction Form */}
        <div className="col-span-1">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-green-900 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-bold pb-4 text-xl text-green-400">Add Income</h1>
            <IncomeForm />
          </motion.div>
        </div>

        {/* Income Chart */}
        <div className="col-span-1">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-green-900 h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 text-green-400">Income Overview</h2>
            <div className="flex justify-center">
              <div className="w-full">
                 <IncomeChart /> 
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Second row: Income History (full width) */}
      <div className="mt-4">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-green-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <IncomeList /> 
        </motion.div>
      </div>
    </div>
  );
}

export default Income;