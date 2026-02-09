// Razorpay integration helper
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayResponse) => void;
    modal?: {
        ondismiss?: () => void;
    };
}

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
    if (typeof window === "undefined" || !window.Razorpay) {
        console.error("Razorpay not loaded");
        return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
}

export function createRazorpayOptions(
    orderId: string,
    amount: number,
    proposalId: string,
    onSuccess: (response: RazorpayResponse) => void,
    onDismiss?: () => void
): RazorpayOptions {
    return {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount,
        currency: "INR",
        name: "OnlyYes 💖",
        description: "Valentine Proposal - Make them say YES!",
        order_id: orderId,
        theme: {
            color: "#f43f5e",
        },
        handler: onSuccess,
        modal: {
            ondismiss: onDismiss,
        },
    };
}
