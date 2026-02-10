import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (could use service role for more permissions)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, proposalId } = await request.json();

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Payment verified! Update proposal as paid
        const { data: proposal, error } = await supabase
            .from('proposals')
            .update({ is_paid: true })
            .eq('id', proposalId)
            .select('slug')
            .single();

        if (error) {
            console.error('Error updating proposal:', error);
            return NextResponse.json(
                { error: 'Failed to update proposal' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            slug: proposal.slug,
            message: 'Payment verified successfully',
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        );
    }
}
