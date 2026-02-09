// API client using Supabase
import { supabase } from './supabase';
import { nanoid } from 'nanoid';

export interface ProposalData {
    yourName: string;
    partnerName: string;
    specialDate: string;
    loveMessage: string;
    favoriteMemory: string;
    futureDreams: string;
    photos: string[];
    musicUrl?: string;
}

export interface Proposal extends ProposalData {
    id: string;
    slug: string;
    isPaid: boolean;
    isAccepted: boolean;
    acceptedAt: string | null;
    viewsCount: number;
    createdAt: string;
}

export interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    proposalId: string;
}

export interface AdminStats {
    totalProposals: number;
    paidProposals: number;
    totalRevenue: number;
    totalViews: number;
}

// Status info for creators to check their proposal
export interface ProposalStatus {
    id: string;
    slug: string;
    partnerName: string;
    isPaid: boolean;
    isAccepted: boolean;
    acceptedAt: string | null;
    viewsCount: number;
}

// Generate a unique slug for the proposal
function generateSlug(): string {
    return nanoid(10); // 10 character unique ID
}

// Create a new proposal (draft)
export async function createProposal(data: ProposalData): Promise<{ id: string }> {
    const slug = generateSlug();

    const { data: proposal, error } = await supabase
        .from('proposals')
        .insert({
            slug,
            your_name: data.yourName,
            partner_name: data.partnerName,
            special_date: data.specialDate || null,
            love_message: data.loveMessage,
            favorite_memory: data.favoriteMemory || null,
            future_dreams: data.futureDreams || null,
            photos: data.photos,
            music_url: data.musicUrl || null,
            is_paid: false,
            views_count: 0,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating proposal:', error);
        throw new Error('Failed to create proposal');
    }

    return { id: proposal.id };
}

// Get a proposal by slug (only paid ones are accessible)
export async function getProposal(slug: string): Promise<Proposal> {
    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('slug', slug)
        .eq('is_paid', true)
        .single();

    if (error || !proposal) {
        throw new Error('Proposal not found');
    }

    return mapProposalFromDb(proposal);
}

// Increment view count
export async function incrementViewCount(slug: string): Promise<void> {
    const { error } = await supabase.rpc('increment_views', { proposal_slug: slug });

    if (error) {
        console.error('Error incrementing view count:', error);
    }
}

// Mark proposal as accepted (when partner clicks YES)
export async function markProposalAccepted(slug: string): Promise<void> {
    const { error } = await supabase
        .from('proposals')
        .update({
            is_accepted: true,
            accepted_at: new Date().toISOString()
        })
        .eq('slug', slug);

    if (error) {
        console.error('Error marking proposal as accepted:', error);
    }
}

// Get proposal status by ID (for creators to check their proposal)
export async function getProposalStatus(id: string): Promise<ProposalStatus> {
    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('id, slug, partner_name, is_paid, is_accepted, accepted_at, views_count')
        .eq('id', id)
        .single();

    if (error || !proposal) {
        throw new Error('Proposal not found');
    }

    return {
        id: proposal.id,
        slug: proposal.slug,
        partnerName: proposal.partner_name,
        isPaid: proposal.is_paid,
        isAccepted: proposal.is_accepted ?? false,
        acceptedAt: proposal.accepted_at,
        viewsCount: proposal.views_count ?? 0,
    };
}

// Create Razorpay payment order (stub for now - will be implemented with Razorpay)
export async function createPaymentOrder(proposalId: string): Promise<PaymentOrder> {
    // TODO: Implement with Razorpay when domain is ready
    console.log('Creating payment order for proposal:', proposalId);

    // For now, return a mock order for testing
    return {
        orderId: `order_${nanoid(16)}`,
        amount: 1000, // ₹10 in paise
        currency: 'INR',
        proposalId,
    };
}

// Verify payment and activate proposal (stub for now)
export async function verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    proposalId: string;
}): Promise<{ slug: string }> {
    // TODO: Implement proper Razorpay verification when domain is ready
    // For now, just mark the proposal as paid

    const { data: proposal, error } = await supabase
        .from('proposals')
        .update({ is_paid: true })
        .eq('id', data.proposalId)
        .select('slug')
        .single();

    if (error || !proposal) {
        throw new Error('Payment verification failed');
    }

    return { slug: proposal.slug };
}

// Get admin stats
export async function getAdminStats(): Promise<AdminStats> {
    const { data: proposals, error } = await supabase
        .from('proposals')
        .select('is_paid, views_count');

    if (error) {
        throw new Error('Failed to fetch admin stats');
    }

    const totalProposals = proposals?.length || 0;
    const paidProposals = proposals?.filter(p => p.is_paid).length || 0;
    const totalViews = proposals?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const totalRevenue = paidProposals * 10; // ₹10 per proposal

    return {
        totalProposals,
        paidProposals,
        totalRevenue,
        totalViews,
    };
}

// Get all proposals (admin)
export async function getAdminProposals(): Promise<Proposal[]> {
    const { data: proposals, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error('Failed to fetch proposals');
    }

    return proposals?.map(mapProposalFromDb) || [];
}

// Upload photos (Base64 for MVP)
export async function uploadPhotos(files: File[]): Promise<string[]> {
    const base64Promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    return Promise.all(base64Promises);
}

// Helper to map database row to Proposal interface
function mapProposalFromDb(row: Record<string, unknown>): Proposal {
    return {
        id: row.id as string,
        slug: row.slug as string,
        yourName: row.your_name as string,
        partnerName: row.partner_name as string,
        specialDate: row.special_date as string,
        loveMessage: row.love_message as string,
        favoriteMemory: row.favorite_memory as string,
        futureDreams: row.future_dreams as string,
        photos: (row.photos as string[]) || [],
        musicUrl: row.music_url as string,
        isPaid: row.is_paid as boolean,
        isAccepted: row.is_accepted as boolean ?? false,
        acceptedAt: row.accepted_at as string | null,
        viewsCount: row.views_count as number,
        createdAt: row.created_at as string,
    };
}
