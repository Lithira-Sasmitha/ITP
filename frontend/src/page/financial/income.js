import { motion } from "framer-motion";
import Header from "../../components/header/header";

function Income() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Income" />
      <main className="'w-full px-4 lg:px-6 py-16'">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
              {/* Add chart or content for Category Distribution */}
            </motion.div>
          </div>
          <div>
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
              {/* Add chart or content for Category Distribution */}
            </motion.div>
          </div>

          <div className="col-span-2">
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
              {/* Add chart or content for Category Distribution */}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Income;
