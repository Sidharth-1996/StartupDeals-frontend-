"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { api, FetchError } from "@/lib/api";
import Link from "next/link";

type Deal = {
  _id: string;
  title: string;
  description: string;
  category: string;
  isLocked: boolean;
};

type VerificationStatus = "unverified" | "pending" | "verified";

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimStatus, setClaimStatus] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [userVerificationStatus, setUserVerificationStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const dealData = await api.get<Deal>(`/deals/${id}`);
        setDeal(dealData);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const verificationData = await api.get<{ verificationStatus: VerificationStatus }>(
              "/verification/status",
              token
            );
            setUserVerificationStatus(verificationData.verificationStatus);
          } catch (err) {
            console.error("Failed to fetch verification status");
          }
        }
      } catch (err: any) {
        setError(err.message || "Could not load deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    setClaimStatus("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await api.post(`/claims/${id}`, {}, token);
      setClaimStatus("Deal claimed successfully! Check your dashboard.");
    } catch (err: any) {
      if (err instanceof FetchError) {
        setClaimStatus(err.data.message || "Claim failed");
      } else {
        setClaimStatus("Something went wrong");
      }
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-10 bg-gray-50">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Deal not found"}</p>
          <button
            onClick={() => router.push("/deals")}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const canClaimDeal = () => {
    if (!deal.isLocked) return true;
    return userVerificationStatus === "verified";
  };

  const getClaimButtonContent = () => {
    if (claiming) return "Claiming...";
    if (!deal.isLocked) return "Claim Deal";
    
    if (userVerificationStatus === "verified") {
      return "Claim Deal";
    } else if (userVerificationStatus === "pending") {
      return "Verification Pending";
    } else {
      return "Verification Required";
    }
  };

  const renderLockedDealGuidance = () => {
    if (!deal.isLocked) return null;

    if (userVerificationStatus === "verified") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-sm text-green-800">
            ✓ You're verified and can claim this exclusive deal!
          </p>
        </motion.div>
      );
    }

    if (userVerificationStatus === "pending") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800 mb-2">
            ⏳ Your verification is pending review.
          </p>
          <p className="text-xs text-yellow-700">
            You'll be able to claim this deal once your verification is approved.
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-red-600 text-xl">🔒</div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900 mb-2">
              Verification Required
            </h4>
            <p className="text-sm text-red-800 mb-3">
              This is an exclusive deal available only to verified users. Get verified to unlock premium benefits and locked deals.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Get Verified
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-10 bg-gray-50"
    >
      <div className="max-w-2xl mx-auto">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => router.push("/deals")}
          className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <span>←</span> Back to Deals
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
            {deal.isLocked && (
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                🔒 Locked
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{deal.description}</p>

          <div className="flex items-center gap-2 mb-6 pb-6 border-b">
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              {deal.category}
            </span>
          </div>

          {renderLockedDealGuidance()}

          <motion.button
            whileHover={canClaimDeal() ? { scale: 1.02 } : {}}
            whileTap={canClaimDeal() ? { scale: 0.98 } : {}}
            onClick={handleClaim}
            disabled={claiming || !canClaimDeal()}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              canClaimDeal()
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } disabled:opacity-60`}
          >
            {getClaimButtonContent()}
          </motion.button>

          {claimStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-sm text-center ${
                claimStatus.includes("successfully")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {claimStatus}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
