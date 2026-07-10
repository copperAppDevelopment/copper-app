export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  stars: number;
  image: string;
  avatar: string;
  stats: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Plan {
  id: string;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
