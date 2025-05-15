import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import download from "downloadjs";
import { toPng } from "html-to-image";
import WarehouseLayout from "../../components/sidebar/warehouseLayout";

const FinalProductQR = () => {
  const [finalProducts, setFinalProducts] = useState([]);

  useEffect(() => {
    const fetchFinalProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finalProduct");
        setFinalProducts(res.data);
      } catch (error) {
        console.error("Error fetching final products:", error);
      }
    };

    fetchFinalProducts();
  }, []);

  const downloadQR = (id) => {
    const qrElement = document.getElementById(`qr-${id}`);
    toPng(qrElement)
      .then((dataUrl) => {
        download(dataUrl, `FinalProductQR-${id}.png`);
      })
      .catch((err) => {
        console.error("Failed to download QR code:", err);
      });
  };

  return (
    <WarehouseLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Final Product QR Code Generator</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {finalProducts.map((product) => (
            <div
              key={product._id}
              className="p-4 transition bg-white shadow rounded-xl hover:shadow-lg"
            >
              <div id={`qr-${product._id}`} className="flex flex-col items-center space-y-2">
                <QRCodeCanvas
                  value={JSON.stringify({
                    id: product._id,
                    name: product.name,
                    type: product.type,
                    quantity: product.quantity,
                    location: product.location,
                  })}
                  size={160}
                  level="H"
                  includeMargin
                />
                <div className="text-center">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.type}</p>
                  <p className="text-sm">Qty: {product.quantity}</p>
                  <p className="text-sm">Loc: {product.location}</p>
                </div>
              </div>
              <button
                onClick={() => downloadQR(product._id)}
                className="w-full px-4 py-2 mt-4 text-sm font-semibold text-white rounded bg-emerald-600 hover:bg-emerald-500"
              >
                Download QR
              </button>
            </div>
          ))}
        </div>
      </div>
    </WarehouseLayout>
  );
};

export default FinalProductQR;
