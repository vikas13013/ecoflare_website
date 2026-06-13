import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";

const useAppDispatch = () => useDispatch<any>();
import { registerAsBulkBuyer } from "../features/product/productThunk";

const useBulkBuyerState = () => {
    return useSelector((state: any) => ({
        loading: state?.product?.bulkBuyer?.loading ?? false,
        error: state?.product?.bulkBuyer?.error ?? null,
        data: state?.product?.bulkBuyer?.data ?? null,
    }));
};

// ---- Page Component ----
const BulkBuyerRegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, error, data } = useBulkBuyerState();
    const navigate = useNavigate();
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);
    const [localError, setLocalError] = useState<any>(null); // ✅ Added local error state

    const [form, setForm] = useState({
        business_name: "",
        business_number: "",
        business_type: "Food_Processor",
        expected_monthly_volume: "",
        hst_number: "",
        sfcr_license: "",
        unit: "kg",
    });

    const setField = (name: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (localError) setLocalError(null);
    };

    const errors = useMemo(() => {
        const e: Partial<Record<keyof typeof form, string>> = {};
        if (!form.business_name.trim()) e.business_name = "Business name is required";

        if (!form.business_number.trim()) e.business_number = "Business number is required";
        else if (!/^\d{6,}$/.test(form.business_number.trim()))
            e.business_number = "Business number should be at least 6 digits";

        if (!form.expected_monthly_volume.trim()) e.expected_monthly_volume = "Expected monthly volume is required";
        else if (Number.isNaN(Number(form.expected_monthly_volume)))
            e.expected_monthly_volume = "Volume must be a number";

        if (!form.hst_number.trim()) e.hst_number = "HST number is required";
        if (!form.sfcr_license.trim()) e.sfcr_license = "SFCR license is required";

        if (!form.unit) e.unit = "Unit is required";

        return e;
    }, [form]);

    const hasErrors = Object.keys(errors).length > 0;

    const handleBlur = (name: keyof typeof form) => setTouched((t) => ({ ...t, [name]: true }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerSuccess(null);
        setLocalError(null); // ✅ Clear previous errors
        setTouched({
            business_name: true,
            business_number: true,
            business_type: true,
            expected_monthly_volume: true,
            hst_number: true,
            sfcr_license: true,
            unit: true,
        });

        if (hasErrors) {
            setLocalError("Please fix the validation errors above.");
            return;
        }

        const payload = {
            business_name: form.business_name.trim(),
            business_number: form.business_number.trim(),
            business_type: form.business_type,
            expected_monthly_volume: form.expected_monthly_volume.trim(),
            hst_number: form.hst_number.trim(),
            sfcr_license: form.sfcr_license.trim(),
            unit: form.unit,
        };

        try {
            const res = await dispatch(registerAsBulkBuyer(payload)).unwrap();
            setServerSuccess("Registered successfully.");
           navigate("/request-success", {
  state: { type: "buyer" },
});

            setForm({
                business_name: "",
                business_number: "",
                business_type: "Food_Processor",
                expected_monthly_volume: "",
                hst_number: "",
                sfcr_license: "",
                unit: "kg"
            });
        } catch (err: any) {
            console.log("🔥 Error from Redux:", err);
            setLocalError(err); // ✅ Use local error state
        }
    };

    const renderServerErrors = (err: any) => {
        if (!err) return null;

        // Check for different error formats
        if (err.message) {
            return <p className="text-sm">{err.message}</p>;
        }

        const messages =
            err?.messages ||
            err?.data?.messages ||
            err?.response?.data?.messages ||
            err?.error?.messages;

        if (messages && typeof messages === "object") {
            return Object.entries(messages).map(([field, msgs]) => (
                <p key={field} className="text-sm">
                    <span className="font-medium capitalize">
                        {field.replace(/_/g, " ")}:
                    </span>{" "}
                    {(msgs as string[]).join(", ")}
                </p>
            ));
        }

        if (typeof err === "string") {
            return <p className="text-sm">{err}</p>;
        }

        return <p className="text-sm">An unexpected error occurred</p>;
    };

    // Combine both errors - from Redux and local validation
    const displayError = localError || error;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4">
            <div className="mx-auto max-w-3xl">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6"
                >
                    Register as <span className="text-highlight">Bulk Buyer</span>
                </motion.h1>

                {/* Status Blocks */}
                {displayError && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
                    >
                        <FiXCircle className="mt-0.5" />
                        <div>
                            <p className="font-semibold">Submission failed</p>
                            <div className="mt-1 space-y-1">
                                {renderServerErrors(displayError)}
                            </div>
                        </div>
                    </motion.div>
                )}

                {serverSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
                    >
                        <FiCheckCircle className="mt-0.5" />
                        <div>
                            <p className="font-semibold">Success</p>
                            <p className="text-sm">{serverSuccess}</p>
                        </div>
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    {/* Business Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Business Name</label>
                        <input
                            type="text"
                            value={form.business_name}
                            onChange={(e) => setField("business_name", e.target.value)}
                            onBlur={() => handleBlur("business_name")}
                            placeholder="GreenLeaf Foods Inc."
                            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                        />
                        {touched.business_name && errors.business_name && (
                            <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                        )}
                    </div>

                    {/* Business Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Business Number</label>
                        <input
                            type="text"
                            value={form.business_number}
                            onChange={(e) => setField("business_number", e.target.value)}
                            onBlur={() => handleBlur("business_number")}
                            placeholder="123456789"
                            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                        />
                        {touched.business_number && errors.business_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.business_number}</p>
                        )}
                    </div>

                    {/* Business Type */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Business Type</label>
                            <select
                                value={form.business_type}
                                onChange={(e) => setField("business_type", e.target.value)}
                                onBlur={() => handleBlur("business_type")}
                                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                            >
                                <option value="">Select business type</option>
                                <option value="Restaurant/Food_Service">Restaurant / Food Service</option>
                                <option value="Retail_Store">Retail Store</option>
                                <option value="Food_Processor">Food Processor</option>
                                <option value="Distributor/Wholesaler">Distributor / Wholesaler</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Unit</label>
                            <select
                                value={form.unit}
                                onChange={(e) => setField("unit", e.target.value)}
                                onBlur={() => handleBlur("unit")}
                                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                            >
                                <option value="">Select unit</option>
                                <option value="kg">Kilogram</option>
                                <option value="g">Gram</option>
                                <option value="lb">Pound</option>
                                <option value="oz">Ounce</option>
                                <option value="l">Liter</option>
                                <option value="ml">Milliliter</option>
                                <option value="piece">Piece</option>
                                <option value="box">Box</option>
                                <option value="pack">Pack</option>
                                <option value="dozen">Dozen</option>
                            </select>
                            {touched.unit && errors.unit && (
                                <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                            )}
                        </div>

                    </div>

                    {/* Expected Monthly Volume */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Expected Monthly Volume</label>
                        <input
                            type="text"
                            value={form.expected_monthly_volume}
                            onChange={(e) => setField("expected_monthly_volume", e.target.value)}
                            onBlur={() => handleBlur("expected_monthly_volume")}
                            placeholder="1500.50"
                            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                        />
                        {touched.expected_monthly_volume && errors.expected_monthly_volume && (
                            <p className="mt-1 text-sm text-red-600">{errors.expected_monthly_volume}</p>
                        )}
                    </div>

                    {/* HST Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">HST Number</label>
                        <input
                            type="text"
                            value={form.hst_number}
                            onChange={(e) => setField("hst_number", e.target.value)}
                            onBlur={() => handleBlur("hst_number")}
                            placeholder="987654321RT0001"
                            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                        />
                        {touched.hst_number && errors.hst_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.hst_number}</p>
                        )}
                    </div>

                    {/* SFCR License */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">SFCR License</label>
                        <input
                            type="text"
                            value={form.sfcr_license}
                            onChange={(e) => setField("sfcr_license", e.target.value)}
                            onBlur={() => handleBlur("sfcr_license")}
                            placeholder="SFCR-2025-XYZ-123"
                            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none ring-0 focus:border-blue-500"
                        />
                        {touched.sfcr_license && errors.sfcr_license && (
                            <p className="mt-1 text-sm text-red-600">{errors.sfcr_license}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">All fields are required.</p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" /> Submitting
                                </>
                            ) : (
                                <>
                                    Submit <FiArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default BulkBuyerRegisterPage;