(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/utils/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/events/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function EventDetailPage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // --- ATHLION REGISTRATION STATE ---
    const [event, setEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [bookingLoading, setBookingLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [regData, setRegData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        level: '',
        height: '',
        weight: '',
        category: 'Single',
        batchTime: ''
    });
    // --- DISCOUNT STATE ---
    const [discountInfo, setDiscountInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [couponCode, setCouponCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [couponApplied, setCouponApplied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [couponError, setCouponError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [couponLoading, setCouponLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [spotsRemaining, setSpotsRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventDetailPage.useEffect": ()=>{
            const fetchEvent = {
                "EventDetailPage.useEffect.fetchEvent": async ()=>{
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`events/${id}`);
                        setEvent(res.data.data);
                    } catch (error) {
                        console.error('Failed to fetch event', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["EventDetailPage.useEffect.fetchEvent"];
            if (id) fetchEvent();
        }
    }["EventDetailPage.useEffect"], [
        id
    ]);
    // Fetch early bird discount info when user reaches payment step
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventDetailPage.useEffect": ()=>{
            const fetchDiscount = {
                "EventDetailPage.useEffect.fetchDiscount": async ()=>{
                    if (!user || !id || couponApplied) return;
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`registrations/check-discount/${id}`);
                        if (res.data.discount && res.data.discount.type !== 'none') {
                            setDiscountInfo(res.data.discount);
                            setSpotsRemaining(res.data.spotsRemaining);
                        }
                    } catch (error) {
                        console.error('Failed to fetch discount', error);
                    }
                }
            }["EventDetailPage.useEffect.fetchDiscount"];
            if (step === 4) {
                fetchDiscount();
            }
        }
    }["EventDetailPage.useEffect"], [
        step,
        user,
        id,
        couponApplied
    ]);
    const steps = [
        {
            id: 1,
            title: 'SELECT LEVEL'
        },
        {
            id: 2,
            title: 'PHYSICAL DETAILS'
        },
        {
            id: 3,
            title: 'CATEGORY'
        },
        {
            id: 4,
            title: 'WAVE & PAY'
        }
    ];
    const generateWaveTimes = ()=>{
        const times = [];
        let current = new Date();
        current.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setHours(17, 0, 0, 0);
        while(current <= end){
            const timeStr = `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`;
            const isDefaultSoldOut = timeStr === '09:00' || timeStr === '09:10' || timeStr === '09:20' || timeStr === '09:30' || timeStr === '09:40' || timeStr === '09:50';
            times.push({
                time: timeStr,
                isSoldOut: isDefaultSoldOut
            });
            current.setMinutes(current.getMinutes() + 10);
        }
        return times;
    };
    const handleApplyCoupon = async ()=>{
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('sponsors/coupons/validate', {
                code: couponCode.trim()
            });
            if (res.data.success) {
                const couponData = res.data.data;
                let discountValue = 0;
                if (couponData.type === 'percentage') {
                    discountValue = Math.round(event.price * couponData.value / 100);
                } else {
                    discountValue = Math.min(couponData.value, event.price);
                }
                setDiscountInfo({
                    type: 'coupon',
                    value: discountValue,
                    label: `Coupon ${couponData.code} (${couponData.type === 'percentage' ? `${couponData.value}%` : `₹${couponData.value}`} off)`
                });
                setCouponApplied(true);
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
            setCouponApplied(false);
        } finally{
            setCouponLoading(false);
        }
    };
    const handleRemoveCoupon = ()=>{
        setCouponCode('');
        setCouponApplied(false);
        setCouponError('');
        setDiscountInfo(null);
        // Re-fetch early bird discount
        const fetchDiscount = async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`registrations/check-discount/${id}`);
                if (res.data.discount && res.data.discount.type !== 'none') {
                    setDiscountInfo(res.data.discount);
                    setSpotsRemaining(res.data.spotsRemaining);
                }
            } catch (error) {
                console.error('Failed to re-fetch discount', error);
            }
        };
        fetchDiscount();
    };
    const getFinalPrice = ()=>{
        if (!event) return 0;
        if (discountInfo && discountInfo.value > 0) {
            return Math.max(event.price - discountInfo.value, 0);
        }
        return event.price;
    };
    const handleBooking = async ()=>{
        if (!user) {
            router.push('/login');
            return;
        }
        if (!regData.batchTime) {
            alert('Please select a wave timing');
            return;
        }
        setBookingLoading(true);
        try {
            const bookingPayload = {
                ...regData
            };
            if (couponApplied && couponCode.trim()) {
                bookingPayload.couponCode = couponCode.trim();
            }
            // --- TEST MODE BYPASS ---
            if ("TURBOPACK compile-time truthy", 1) {
                console.log('--- TEST MODE: BYPASSING RAZORPAY ---');
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`registrations/test-register/${id}`, bookingPayload);
                    setShowSuccessOverlay(true);
                    setTimeout(()=>router.push('/dashboard'), 2000);
                    return;
                } catch (err) {
                    console.error('Test registration failed', err);
                    const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Test registration failed';
                    alert(err.response?.status ? `Error ${err.response.status}: ${msg}` : msg);
                    setBookingLoading(false);
                    return;
                }
            }
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`registrations/book/${id}`, bookingPayload);
            const { order } = res.data;
            const options = {
                key: ("TURBOPACK compile-time value", "rzp_test_placeholder"),
                amount: order.amount,
                currency: order.currency,
                name: "ATHLiON",
                description: `Registration for ${event?.name}`,
                order_id: order.id,
                handler: async function(response) {
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('registrations/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setShowSuccessOverlay(true);
                        setTimeout(()=>router.push('/dashboard'), 2000);
                    } catch (err) {
                        console.error('Payment verification failed', err);
                        alert('Payment verified on gateway but failed on our server. Please contact support.');
                        router.push('/dashboard');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ''
                },
                theme: {
                    color: "#f82506"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Booking failed', error);
            alert(error.response?.data?.message || 'Failed to initialize booking');
        } finally{
            setBookingLoading(false);
        }
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            className: "animate-spin text-[#f82506]",
            size: 40
        }, void 0, false, {
            fileName: "[project]/src/app/events/[id]/page.tsx",
            lineNumber: 268,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/events/[id]/page.tsx",
        lineNumber: 267,
        columnNumber: 9
    }, this);
    if (!event) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-white font-black italic uppercase tracking-widest text-xl",
            children: "Event Not Found"
        }, void 0, false, {
            fileName: "[project]/src/app/events/[id]/page.tsx",
            lineNumber: 274,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/events/[id]/page.tsx",
        lineNumber: 273,
        columnNumber: 9
    }, this);
    if (!event) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col items-center justify-center bg-black text-gray-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                size: 60,
                className: "mb-4 text-zinc-800"
            }, void 0, false, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 280,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xl font-black italic uppercase italic",
                children: "Event Not Found"
            }, void 0, false, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 281,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>router.back(),
                className: "mt-6 text-white hover:text-[#f82506] transition-colors flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                        size: 20
                    }, void 0, false, {
                        fileName: "[project]/src/app/events/[id]/page.tsx",
                        lineNumber: 283,
                        columnNumber: 17
                    }, this),
                    " Go Back"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 282,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/events/[id]/page.tsx",
        lineNumber: 279,
        columnNumber: 9
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-97dc56839d3ac4c6" + " " + "min-h-screen pt-32 pb-24 bg-black px-4 lg:px-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "https://checkout.razorpay.com/v1/checkout.js"
            }, void 0, false, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 290,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-97dc56839d3ac4c6" + " " + "max-w-7xl mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase text-xs font-black tracking-widest group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 16,
                                className: "group-hover:-translate-x-1 transition-transform"
                            }, void 0, false, {
                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                lineNumber: 294,
                                columnNumber: 21
                            }, this),
                            " Back to Calender"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/events/[id]/page.tsx",
                        lineNumber: 293,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-97dc56839d3ac4c6" + " " + "grid grid-cols-1 lg:grid-cols-12 gap-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-97dc56839d3ac4c6" + " " + "lg:col-span-7",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        x: -20
                                    },
                                    animate: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-8 leading-none",
                                            children: [
                                                event.name?.split(' ')[0],
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                                    children: event.name?.split(' ').slice(1).join(' ')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 61
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 304,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex flex-wrap gap-4 mb-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            size: 14,
                                                            className: "text-[#f82506]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 37
                                                        }, this),
                                                        " ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(event.date)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            size: 14,
                                                            className: "text-[#f82506]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 37
                                                        }, this),
                                                        " ",
                                                        event.startTime,
                                                        " Start"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            size: 14,
                                                            className: "text-[#f82506]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 316,
                                                            columnNumber: 37
                                                        }, this),
                                                        " ",
                                                        event.venue.address.split(',')[0]
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 308,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "space-y-8 text-gray-400 text-lg leading-relaxed mb-12",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-97dc56839d3ac4c6",
                                                    children: event.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "glass-card p-8 border-l-4 border-l-[#f82506] bg-zinc-950/30",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-white text-xl font-black italic uppercase mb-4 tracking-tight",
                                                            children: "Race Format"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 323,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 325,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 1km Run x 8 Sections"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 325,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 326,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 1000m Ski Erg"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 326,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 327,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 50m Sled Push"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 327,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 50m Sled Pull"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 328,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 329,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 80m Burpee Broad Jumps"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 329,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 330,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 1000m Row"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 330,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 331,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 200m Farmers Carry"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                            size: 16,
                                                                            className: "text-[#f82506]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 332,
                                                                            columnNumber: 81
                                                                        }, this),
                                                                        " 100 Wall Balls"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 320,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 300,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                lineNumber: 299,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-97dc56839d3ac4c6" + " " + "lg:col-span-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 20
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    className: "sticky top-32 glass-card p-8 md:p-10 border-[#f82506]/20 bg-zinc-950/80",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex justify-between items-center mb-10",
                                            children: steps.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex flex-col items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + `w-10 h-1 md:w-16 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-[#f82506]' : 'bg-gray-800'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + `text-[8px] font-black tracking-tighter ${step === s.id ? 'text-[#f82506]' : 'text-gray-600'}`,
                                                            children: s.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, s.id, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 37
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 347,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: (e)=>e.preventDefault(),
                                            className: "jsx-97dc56839d3ac4c6",
                                            children: [
                                                step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-3xl font-black italic uppercase tracking-tighter",
                                                            children: [
                                                                "PICK YOUR ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                                                    children: "LEVEL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 360,
                                                                    columnNumber: 121
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 360,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "grid grid-cols-1 gap-4",
                                                            children: [
                                                                {
                                                                    id: 'elite',
                                                                    label: 'Elite (VIP)',
                                                                    desc: 'For experienced athletes'
                                                                },
                                                                {
                                                                    id: 'classical',
                                                                    label: 'Classical (regular)',
                                                                    desc: 'For regular fitness enthusiasts'
                                                                }
                                                            ].map((lvl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setRegData({
                                                                            ...regData,
                                                                            level: lvl.id
                                                                        });
                                                                        setStep(2);
                                                                    },
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + `glass-card-hover p-6 rounded-2xl text-left border transition-all ${regData.level === lvl.id ? 'border-[#f82506] bg-[#f82506]/10' : 'border-white/5'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "block text-xl font-black italic uppercase",
                                                                            children: lvl.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 372,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-xs text-gray-500 uppercase font-bold tracking-widest",
                                                                            children: lvl.desc
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 373,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, lvl.id, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 366,
                                                                    columnNumber: 49
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 37
                                                }, this),
                                                step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-3xl font-black italic uppercase tracking-tighter",
                                                            children: [
                                                                "PHYSICAL ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                                                    children: "DETAILS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 383,
                                                                    columnNumber: 120
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "grid grid-cols-2 gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block",
                                                                            children: "Height (CM)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 386,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            placeholder: "175",
                                                                            value: regData.height,
                                                                            onChange: (e)=>setRegData({
                                                                                    ...regData,
                                                                                    height: e.target.value
                                                                                }),
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#f82506] transition-all outline-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 387,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 385,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block",
                                                                            children: "Weight (KG)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 396,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            placeholder: "70",
                                                                            value: regData.weight,
                                                                            onChange: (e)=>setRegData({
                                                                                    ...regData,
                                                                                    weight: e.target.value
                                                                                }),
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#f82506] transition-all outline-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 397,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 395,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setStep(1),
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex-1 p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5",
                                                                    children: "Back"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    disabled: !regData.height || !regData.weight,
                                                                    onClick: ()=>setStep(3),
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex-[2] btn-primary p-4 disabled:bg-zinc-800 disabled:text-zinc-500 py-4 font-black italic tracking-widest",
                                                                    children: "CONTINUE"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 408,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 37
                                                }, this),
                                                step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-3xl font-black italic uppercase tracking-tighter",
                                                            children: [
                                                                "PICK ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                                                    children: "CATEGORY"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 116
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 422,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setStep(4),
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "w-full glass-card-hover p-10 rounded-2xl text-center border border-[#f82506] bg-[#f82506]/10 transition-all group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                                    className: "mx-auto mb-4 text-[#f82506] group-hover:scale-110 transition-transform",
                                                                    size: 48
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 428,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "block text-4xl font-black italic uppercase tracking-tighter mb-2",
                                                                    children: "SINGLE"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-xs text-gray-300 uppercase font-black tracking-[0.2em]",
                                                                    children: "Standard Solo Entry"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 430,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setStep(2),
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "w-full p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5",
                                                            children: "Back"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 37
                                                }, this),
                                                step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-97dc56839d3ac4c6" + " " + "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-3xl font-black italic uppercase tracking-tighter",
                                                            children: [
                                                                "WAVE ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                                                    children: "SELECTION"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 116
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar",
                                                            children: generateWaveTimes().map((wave)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    disabled: wave.isSoldOut,
                                                                    onClick: ()=>setRegData({
                                                                            ...regData,
                                                                            batchTime: wave.time
                                                                        }),
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + `p-3 rounded-lg text-xs font-black italic transition-all border ${wave.isSoldOut ? 'bg-zinc-900 border-white/5 text-zinc-700 cursor-not-allowed opacity-50' : regData.batchTime === wave.time ? 'bg-[#f82506] border-[#f82506] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#f82506]/50'}`,
                                                                    children: [
                                                                        wave.time,
                                                                        wave.isSoldOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "block text-[8px] mt-1 text-red-900",
                                                                            children: "SOLD OUT"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 453,
                                                                            columnNumber: 72
                                                                        }, this)
                                                                    ]
                                                                }, wave.time, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 442,
                                                                    columnNumber: 49
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 440,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "pt-4 border-t border-white/5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                            size: 12,
                                                                            className: "inline mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 461,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        " Have a Coupon Code?"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 460,
                                                                    columnNumber: 45
                                                                }, this),
                                                                couponApplied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                    size: 18,
                                                                                    className: "text-green-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 466,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-97dc56839d3ac4c6",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-green-400 font-mono font-bold text-sm",
                                                                                            children: couponCode.toUpperCase()
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                            lineNumber: 468,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-[10px] text-green-500/70 font-bold",
                                                                                            children: "Coupon applied successfully!"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                            lineNumber: 469,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 467,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 465,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: handleRemoveCoupon,
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-red-500",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                size: 16
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                lineNumber: 477,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 472,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 49
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            placeholder: "Enter coupon code...",
                                                                            value: couponCode,
                                                                            onChange: (e)=>{
                                                                                setCouponCode(e.target.value.toUpperCase());
                                                                                setCouponError('');
                                                                            },
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm uppercase font-mono outline-none focus:border-[#f82506] transition-all"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 482,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: handleApplyCoupon,
                                                                            disabled: couponLoading || !couponCode.trim(),
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "px-6 py-3 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#f82506] transition-all disabled:opacity-50",
                                                                            children: couponLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                size: 14,
                                                                                className: "animate-spin"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                lineNumber: 495,
                                                                                columnNumber: 74
                                                                            }, this) : 'Apply'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 489,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 49
                                                                }, this),
                                                                couponError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider",
                                                                    children: couponError
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 500,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-97dc56839d3ac4c6" + " " + "pt-6 border-t border-white/5 space-y-4",
                                                            children: [
                                                                discountInfo && discountInfo.type !== 'none' && discountInfo.type !== 'coupon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                    initial: {
                                                                        opacity: 0,
                                                                        y: -10
                                                                    },
                                                                    animate: {
                                                                        opacity: 1,
                                                                        y: 0
                                                                    },
                                                                    className: "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                            size: 16,
                                                                            className: "text-amber-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 513,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-97dc56839d3ac4c6",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-amber-400 text-[10px] font-black uppercase tracking-widest",
                                                                                    children: discountInfo.label
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 515,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                spotsRemaining !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-amber-500/50 text-[9px] font-bold",
                                                                                    children: [
                                                                                        spotsRemaining,
                                                                                        " super early spot",
                                                                                        spotsRemaining !== 1 ? 's' : '',
                                                                                        " remaining!"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 517,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 514,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex justify-between items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-xs font-bold text-gray-500 uppercase tracking-widest",
                                                                                    children: "Entry Fee"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 526,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + `text-lg font-black italic ${discountInfo && discountInfo.value > 0 ? 'text-gray-500 line-through' : 'text-white'}`,
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(event.price)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 527,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 525,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        discountInfo && discountInfo.value > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                            initial: {
                                                                                opacity: 0,
                                                                                x: 20
                                                                            },
                                                                            animate: {
                                                                                opacity: 1,
                                                                                x: 0
                                                                            },
                                                                            className: "flex justify-between items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                                            size: 12
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                            lineNumber: 539,
                                                                                            columnNumber: 61
                                                                                        }, this),
                                                                                        " Discount"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 538,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-lg font-black italic text-green-500",
                                                                                    children: [
                                                                                        "- ",
                                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(discountInfo.value)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 541,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 533,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex justify-between items-end pt-3 border-t border-white/5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-xs font-bold text-gray-500 uppercase tracking-widest",
                                                                                    children: "Total"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 546,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "text-4xl font-black italic text-white",
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(getFinalPrice())
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                    lineNumber: 547,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 545,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 524,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-97dc56839d3ac4c6" + " " + "flex gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setStep(3),
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex-1 p-4 rounded-xl border border-white/10 font-bold text-xs uppercase hover:bg-white/5",
                                                                            children: "Back"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 552,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: handleBooking,
                                                                            disabled: bookingLoading || !regData.batchTime,
                                                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex-[2] btn-primary p-4 py-4 font-black italic tracking-widest text-lg disabled:bg-zinc-800 disabled:text-zinc-500",
                                                                            children: bookingLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                className: "animate-spin mx-auto",
                                                                                size: 24
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                                lineNumber: 558,
                                                                                columnNumber: 71
                                                                            }, this) : 'PAY & REGISTER'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                            lineNumber: 553,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                                    lineNumber: 551,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 356,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "mt-8 flex items-center justify-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 33
                                                }, this),
                                                " Official Athlion Payment Gateway"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 341,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                lineNumber: 340,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/events/[id]/page.tsx",
                        lineNumber: 297,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 292,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "97dc56839d3ac4c6",
                children: ".custom-scrollbar.jsx-97dc56839d3ac4c6::-webkit-scrollbar{width:4px}.custom-scrollbar.jsx-97dc56839d3ac4c6::-webkit-scrollbar-track{background:0 0}.custom-scrollbar.jsx-97dc56839d3ac4c6::-webkit-scrollbar-thumb{background:#333;border-radius:10px}.custom-scrollbar.jsx-97dc56839d3ac4c6.jsx-97dc56839d3ac4c6::-webkit-scrollbar-thumb:hover{background:#f82506}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showSuccessOverlay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            animate: {
                                scale: [
                                    1,
                                    1.2,
                                    1
                                ],
                                opacity: [
                                    0.1,
                                    0.2,
                                    0.1
                                ]
                            },
                            transition: {
                                duration: 3,
                                repeat: Infinity
                            },
                            className: "absolute w-[800px] h-[800px] bg-[#f82506] rounded-full blur-[150px] pointer-events-none"
                        }, void 0, false, {
                            fileName: "[project]/src/app/events/[id]/page.tsx",
                            lineNumber: 591,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-97dc56839d3ac4c6" + " " + "relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        scale: 0.5,
                                        opacity: 0,
                                        rotate: -10
                                    },
                                    animate: {
                                        scale: 1,
                                        opacity: 1,
                                        rotate: 0
                                    },
                                    transition: {
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 20
                                    },
                                    className: "mb-8 inline-block p-8 bg-[#f82506] rounded-[2.5rem] shadow-[0_0_50px_rgba(248,37,6,0.5)]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                        size: 80,
                                        className: "text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[id]/page.tsx",
                                        lineNumber: 604,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 598,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h2, {
                                    initial: {
                                        y: 50,
                                        opacity: 0
                                    },
                                    animate: {
                                        y: 0,
                                        opacity: 1
                                    },
                                    transition: {
                                        delay: 0.2
                                    },
                                    className: "text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-4",
                                    children: [
                                        "SUCCESSFUL",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-[#f82506]",
                                            children: "!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 613,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 607,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0
                                    },
                                    animate: {
                                        opacity: 1
                                    },
                                    transition: {
                                        delay: 0.4
                                    },
                                    className: "bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full inline-block mb-12",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-97dc56839d3ac4c6" + " " + "text-xs font-black uppercase tracking-[0.4em] text-gray-400",
                                        children: "Registration Confirmed"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[id]/page.tsx",
                                        lineNumber: 622,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 616,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        y: 20,
                                        opacity: 0
                                    },
                                    animate: {
                                        y: 0,
                                        opacity: 1
                                    },
                                    transition: {
                                        delay: 0.6
                                    },
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-97dc56839d3ac4c6" + " " + "text-gray-500 font-bold uppercase tracking-widest text-xs",
                                            children: "Redirecting to your dashboard"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 631,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            title: "Redirecting...",
                                            className: "jsx-97dc56839d3ac4c6" + " " + "flex gap-1 justify-center",
                                            children: [
                                                0,
                                                1,
                                                2
                                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    animate: {
                                                        scale: [
                                                            1,
                                                            1.5,
                                                            1
                                                        ],
                                                        opacity: [
                                                            0.3,
                                                            1,
                                                            0.3
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        delay: i * 0.2
                                                    },
                                                    className: "w-1.5 h-1.5 bg-[#f82506] rounded-full"
                                                }, i, false, {
                                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 41
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/events/[id]/page.tsx",
                                            lineNumber: 632,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/events/[id]/page.tsx",
                                    lineNumber: 625,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/events/[id]/page.tsx",
                            lineNumber: 597,
                            columnNumber: 25
                        }, this),
                        [
                            ...Array(20)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    opacity: 1,
                                    rotate: 0,
                                    scale: Math.random() * 2
                                },
                                animate: {
                                    x: (Math.random() - 0.5) * 1000,
                                    y: (Math.random() - 0.5) * 1000,
                                    opacity: 0,
                                    rotate: Math.random() * 360
                                },
                                transition: {
                                    duration: 1.5,
                                    ease: 'easeOut',
                                    delay: 0.1
                                },
                                className: "absolute w-2 h-8 bg-[#f82506] rounded-full pointer-events-none"
                            }, i, false, {
                                fileName: "[project]/src/app/events/[id]/page.tsx",
                                lineNumber: 647,
                                columnNumber: 29
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/events/[id]/page.tsx",
                    lineNumber: 584,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/events/[id]/page.tsx",
                lineNumber: 582,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/events/[id]/page.tsx",
        lineNumber: 289,
        columnNumber: 9
    }, this);
}
_s(EventDetailPage, "eS95Y+mYj7qAS8V0d+tqMu2XVwg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EventDetailPage;
var _c;
__turbopack_context__.k.register(_c, "EventDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_805504be._.js.map