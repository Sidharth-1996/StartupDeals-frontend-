"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { api } from "@/lib/api";

type Deal = {
  _id: string;
  title: string;
  description: string;
  category: string;
  isLocked: boolean;
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await api.get<Deal[]>("/deals");
        setDeals(data);
      } catch (err: any) {
        setError(err.message || "Could not load deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">Available Deals</h1>
          <p className="text-gray-600">
            Discover exclusive offers to accelerate your startup journey
          </p>
        </div>

        {deals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-200"
          >
            <p className="text-gray-600">No deals available at the moment</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                className={`rounded-xl border p-6 bg-white shadow-sm transition-all ${
                  deal.isLocked ? "opacity-90" : "opacity-100"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                    {deal.title}
                  </h2>
                  {deal.isLocked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0 ml-2"
                    >
                      🔒 Locked
                    </motion.span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                  {deal.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    {deal.category}
                  </span>

                  <Link href={`/deals/${deal._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-sm px-5 py-2 rounded-lg font-medium transition-colors ${
                        deal.isLocked
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
