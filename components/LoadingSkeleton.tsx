"use client";

import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "detail";
  count?: number;
}

export default function LoadingSkeleton({ 
  variant = "card", 
  count = 6 
}: LoadingSkeletonProps) {
  
  if (variant === "card") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border p-5 bg-white shadow-sm"
          >
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-9 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-xl shadow-sm border"
          >
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow"
    >
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
    </motion.div>
  );
}
