import HeroSection from '@/components/landing/HeroSection';
import DailyToursSection from '@/components/landing/DailyToursSection';
import HotelAccommodationSection from '@/components/landing/HotelAccommodationSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import FinalCTASection from '@/components/landing/FinalCTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Daily Tours Section */}
      <section id="tours">
        <DailyToursSection />
      </section>

      {/* Hotel Accommodation Section */}
      <section id="hotels">
        <HotelAccommodationSection />
      </section>

      {/* Features Section */}
      <section id="transfer">
        <FeaturesSection />
      </section>
      
      {/* Reviews Section */}
      <ReviewsSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Final CTA Section */}
      <FinalCTASection />
    </main>
  );
}