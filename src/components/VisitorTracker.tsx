'use client';

import { useEffect } from 'react';
import apiClient from '@/api/client';

export default function VisitorTracker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const trackVisitor = async () => {
            try {
                let visitorId = localStorage.getItem('athlion_visitor_id');
                const urlParams = new URLSearchParams(window.location.search);
                const utmSource = urlParams.get('utm_source') || urlParams.get('source') || 'direct';
                const utmMedium = urlParams.get('utm_medium') || '';
                const utmCampaign = urlParams.get('utm_campaign') || '';
                const gymReferralCode = urlParams.get('gym') || urlParams.get('gym_code') || '';

                const res = await apiClient.post('analytics/track-visit', {
                    visitorId,
                    utmSource,
                    utmMedium,
                    utmCampaign,
                    gymReferralCode,
                });

                if (res.data?.visitorId) {
                    localStorage.setItem('athlion_visitor_id', res.data.visitorId);
                }
            } catch (err) {
                console.error('Visitor tracking error:', err);
            }
        };

        trackVisitor();
    }, []);

    return null;
}
