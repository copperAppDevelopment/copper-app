import { atom } from 'nanostores';
import type { Testimonial } from '../types';

export const isDarkStore = atom<boolean>(false);
export const isLoginOpenStore = atom<boolean>(false);
export const activeTestimonialStore = atom<Testimonial | null>(null);
export const selectedPlanStore = atom<string>("");
