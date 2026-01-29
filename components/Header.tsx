"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-gray-900"
          >
            StartupDeals
          </motion.div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/deals">
            <motion.span
              whileHover={{ y: -2 }}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/deals")
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Deals
            </motion.span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <motion.span
                  whileHover={{ y: -2 }}
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </motion.span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </motion.span>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
