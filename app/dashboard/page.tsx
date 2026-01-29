"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { api } from "@/lib/api";

type Claim = {
  _id: string;
  status: "pending" | "approved";
  deal: {
    title: string;
    category: string;
  };
};

type VerificationStatus = "unverified" | "pending" | "verified";

interface UserData {
  email: string;
  verificationStatus: VerificationStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingVerification, setRequestingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const [claimsData, verificationData] = await Promise.all([
          api.get<Claim[]>("/claims/me", token),
          api.get<{ verificationStatus: VerificationStatus }>("/verification/status", token),
        ]);

        setClaims(claimsData);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = { ...userData, verificationStatus: verificationData.verificationStatus };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRequestVerification = async () => {
    setRequestingVerification(true);
    setVerificationMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post("/verification/request-verification", {}, token);
      
      if (user) {
        const updatedUser = { ...user, verificationStatus: "pending" as VerificationStatus };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setVerificationMessage("Verification request submitted successfully!");
    } catch (err: any) {
      setVerificationMessage(err.message || "Failed to request verification");
    } finally {
      setRequestingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <LoadingSkeleton variant="list" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getVerificationBadge = () => {
    if (!user) return null;

    const badges = {
      verified: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        label: "✓ Verified",
      },
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        label: "⏳ Verification Pending",
      },
      unverified: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        label: "○ Unverified",
      },
    };

    const badge = badges[user.verificationStatus];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${badge.bg} ${badge.border} border-2 rounded-xl p-6 mb-8`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${badge.text} mb-2`}>
              {badge.label}
            </h3>
            {user.verificationStatus === "unverified" && (
              <p className="text-sm text-gray-600 mb-4">
                Get verified to unlock exclusive locked deals and premium benefits.
              </p>
            )}
            {user.verificationStatus === "pending" && (
              <p className="text-sm text-gray-600">
                Your verification is being reviewed. You'll be able to claim locked deals once approved.
              </p>
            )}
            {user.verificationStatus === "verified" && (
              <p className="text-sm text-gray-600">
                You have full access to all deals, including locked premium offers.
              </p>
            )}
          </div>
          {user.verificationStatus === "unverified" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRequestVerification}
              disabled={requestingVerification}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-60 hover:bg-gray-800 transition text-sm font-medium"
            >
              {requestingVerification ? "Requesting..." : "Request Verification"}
            </motion.button>
          )}
        </div>
        {verificationMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-gray-700"
          >
            {verificationMessage}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Dashboard</h1>
        <p className="text-gray-600 mb-8">
          {user?.email}
        </p>

        {getVerificationBadge()}

        <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Claims</h2>

        {claims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-200"
          >
            <p className="text-gray-600 mb-4">
              You haven't claimed any deals yet.
            </p>
            <button
              onClick={() => router.push("/deals")}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Browse Deals
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {claims.map((claim, index) => (
              <motion.div
                key={claim._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                className="bg-white p-5 rounded-xl shadow-sm border transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {claim.deal.title}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      claim.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {claim.deal.category}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
