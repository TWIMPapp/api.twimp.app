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
    // Array form is unconditional ["uuid", ...]; object form is state-keyed
    // { STATE_NAME: ["uuid", ...] } and is resolved against session.state at
    // the moment the task is returned to the client.
    markers?: any;
    options?: any[];
    // Array form is unconditional; object form is state-keyed conditional
    // ({ STATE_NAME: ["setState -value FOO", ...] }) resolved against the
    // session state at the moment the task is advanced to.
    on_arrival?: any;
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
    // Single state name gates on exact match; array gates accept any-match.
    state?: string | string[];
    // Indices of steps that must already be in session.path before this step is
    // reachable. ANDed across the array, and ANDed with `state` if both are set.
    // Unset = no step prerequisite.
    requiredSteps?: number[];
    // Item keys that must already be in session.items before this step is
    // reachable. ANDed across the array, and ANDed with `state` / requiredSteps
    // if also set. Unset = no item prerequisite.
    requiredItems?: string[];
    on_search?: any;
    // Three forms:
    //   - { items_added, items_removed }      → legacy items, handled by updateItems
    //   - ["setState ...", ...]               → unconditional action array
    //   - { STATE_NAME: ["setState ..."], ... } → conditional by entry state
    on_arrival?: any;
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
