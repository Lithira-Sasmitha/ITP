import { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";
import Header from "../../components/header/header";

function Salary() {  
 
  return (
    <div className="relative z-10">
      <Header title='Salary' />
      <main className="w-full px-4 lg:px-1 py-20">
             <table
                  className="min-w-full divide-y divide-gray-200"
                  style={{ marginLeft: "350px" }}
                >
                  <thead className="bg-green-300">
                    <tr>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Employee No.
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-[17px] font-sans font-semibold text-blue-950 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-300">
                    
                      <tr key=''>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="px-3" onClick=''>
                            <box-icon
                              data-id={ ""}
                              color={"#b91c1c"}
                              size="20px"
                              name="trash"
                            ></box-icon>
                          </button>
                          
                          <button className="px-3" onClick=''> 
                            <box-icon
                              data-id={ ""}
                              color="#030712"
                              size="20px"
                              name="edit-alt"
                            ></box-icon>
                          </button>
                          
                        </td>
                      </tr>
                    
                  </tbody>
                </table> 
      </main>

  

      
      
    </div>
    
  );
}

export default Salary;
