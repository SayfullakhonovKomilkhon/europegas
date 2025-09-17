import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Testimonial } from '../../types/Product';

const TestimonialSlider: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch from Firebase
    // For now, we'll use mock data
    const mockTestimonials: Testimonial[] = [
      {
        id: '1',
        customerName: 'Alisher Karimov',
        rating: 5,
        comment: 'I installed the EuropeGAS system in my car last year, and I\'m extremely satisfied with the performance. The fuel economy is impressive, and the system works flawlessly.',
        date: new Date('2023-10-15'),
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: '2',
        customerName: 'Dilnoza Rakhimova',
        rating: 4.5,
        comment: 'The quality of EuropeGAS products is outstanding. Their ECU control unit has transformed my driving experience. The installation service at the Tashkent branch was professional and quick.',
        date: new Date('2023-11-22'),
        avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: '3',
        customerName: 'Rustam Khasanov',
        rating: 5,
        comment: 'I\'ve been using Rail injectors from EuropeGAS for over two years now. They are reliable, efficient, and have saved me a lot of money on fuel costs. Highly recommended!',
        date: new Date('2023-09-05'),
        avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
      },
      {
        id: '4',
        customerName: 'Nodira Azimova',
        rating: 4,
        comment: 'The customer service at EuropeGAS is exceptional. They helped me choose the right gas reducer for my vehicle and provided detailed instructions on maintenance.',
        date: new Date('2023-12-10'),
        avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setTestimonials(mockTestimonials);
      setIsLoading(false);
    }, 1000);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center space-y-4 w-full max-w-2xl">
          <div className="h-12 bg-gray-200 rounded-full w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[currentIndex];

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-8 mx-auto max-w-4xl">
      <div className="absolute top-4 left-4">
        <FaQuoteLeft className="text-blue-500 text-4xl opacity-20" />
      </div>
      
      <div className="flex flex-col items-center text-center">
        {testimonial.avatarUrl && (
          <img 
            src={testimonial.avatarUrl} 
            alt={testimonial.customerName} 
            className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-500"
          />
        )}
        
        <h3 className="text-xl font-semibold text-gray-800">{testimonial.customerName}</h3>
        
        <div className="flex my-2">
          {renderStars(testimonial.rating)}
        </div>
        
        <p className="text-gray-600 italic my-4">{testimonial.comment}</p>
        
        <p className="text-sm text-gray-500">
          {testimonial.date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button 
          onClick={prevTestimonial}
          className="bg-white rounded-full p-2 shadow-md text-blue-500 hover:text-blue-700 focus:outline-none transform -translate-x-1/2"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button 
          onClick={nextTestimonial}
          className="bg-white rounded-full p-2 shadow-md text-blue-500 hover:text-blue-700 focus:outline-none transform translate-x-1/2"
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider; 