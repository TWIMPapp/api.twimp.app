export interface Game {
    ref: string;
    name: string;
    description: string;
    image_url: string;
    audio_url?: string;
    lat: number;
    lng: number;
    isFree: boolean;
}

export interface Location {
    type: 'Point';
    coordinates: [number, number];
}

export interface TrailTask {
    type: string;
    content?: string;
    hint?: string;
    answer?: string[];
    answerChoices?: string[];
    required?: boolean;
    id?: string | number;
    image?: string;
    image_url?: string;
    audio_url?: string;
    markers?: any[] | string[];
    options?: any[];
    on_arrival?: string[];
    on_answer?: string[];
    theme?: string;
    options_randomised?: boolean;
}

export interface Step {
    location?: { lat: number; lng: number };
    locationId?: string;
    type?: string;
    name: string;
    hidden?: boolean;
    tasks: TrailTask[];
    id?: string;
    state?: string;
    on_search?: any;
    can_revisit?: boolean;
    trackingEnabled?: boolean;
    index?: number;
}

export type TrailType = 'WALK' | 'EVENT';

export interface Trail {
    ref: string;
    name: string;
    type: TrailType;
    description?: string;
    ownerId: string | null;
    ageSuitability: string;
    attributes: string[];
    image_url?: string;
    audio_url?: string;
    items?: any[];
    steps: Step[];
    locations?: { id: string; lat: number; lng: number; name?: string; index?: number }[];
    price?: number;
    isFree?: boolean;
    content_pack?: boolean;  // True for location-agnostic games
    gradient?: string;       // Optional gradient for featured cards
    region?: string;
    tags?: string[];
    partner?: string;
    energy_expires?: number;
    tester?: boolean;
    isValidating?: boolean;
    start_node_caption?: string;
}
