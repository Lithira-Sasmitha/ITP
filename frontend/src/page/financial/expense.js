import { motion } from "framer-motion";
import Expenseform from "../../components/form/expenseform";
//import Expencelist from "../../components/list/expenselist";
import Header from "../../components/header/header";

function Expense() {  
  return (
    <div className="relative z-10">
      <Header title="Expenses" />

      <div className="grid grid-cols-2 gap-4 mt-16">
        <div>
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
          </motion.div>
        </div>

        <div>
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Expense Form</h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                 <Expenseform /> 
                {/* <Expencelist /> */}
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Expense;
