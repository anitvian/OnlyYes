import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    try {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing Razorpay keys' },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        const body = await request.json();
        const { proposalId } = body;

        if (!proposalId) {
            return NextResponse.json(
                { error: 'Proposal ID is required' },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: 1000, // Amount in paise (₹10 = 1000 paise)
            currency: 'INR',
            receipt: proposalId.substring(0, 30),
            notes: {
                proposalId,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            proposalId,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
