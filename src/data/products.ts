import { Product } from '../types/Product';

const allProducts: Product[] = [
  // ECU Control Units
  {
    id: 'ecu-eg24-4-basico',
    name: 'ECU SET EG24.4 BASICO',
    price: 72,
    category: 'ECU Control Units',
    description: 'Basic ECU control unit for 4-cylinder engines with essential functionality. Features advanced microprocessor control and compatibility with most vehicle models. Provides reliable performance and easy installation.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    isFeatured: true,
    features: ['4-cylinder compatibility', 'Basic functionality', 'Easy installation', 'Compact design', 'Diagnostic interface']
  },
  {
    id: 'ecu-eg32-6-basico',
    name: 'ECU SET EG32.6 BASICO',
    price: 130,
    category: 'ECU Control Units',
    description: 'Basic ECU control unit for 6-cylinder engines with essential functionality. Designed for larger engines requiring precise fuel management. Includes all necessary components for a complete installation.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['6-cylinder compatibility', 'Basic functionality', 'Easy installation', 'Comprehensive kit', 'Fuel mapping capability']
  },
  {
    id: 'ecu-eg32-4-avance',
    name: 'ECU SET EG32.4 AVANCE',
    price: 95,
    category: 'ECU Control Units',
    description: 'Advanced ECU control unit for 4-cylinder engines with improved performance. Features enhanced fuel mapping capabilities and better response times. Ideal for vehicles requiring more precise control.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Advanced functionality', 'Improved performance', 'Enhanced mapping', 'OBD compatibility']
  },
  {
    id: 'ecu-eg48-4-avance',
    name: 'ECU SET EG48.4 AVANCE',
    price: 130,
    category: 'ECU Control Units',
    description: 'Advanced ECU control unit for 4-cylinder engines with premium features. Includes advanced diagnostic capabilities and fine-tuning options for optimal performance in various conditions.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    isFeatured: true,
    features: ['4-cylinder compatibility', 'Advanced functionality', 'Premium features', 'Diagnostic software', 'Temperature compensation']
  },
  {
    id: 'ecu-eg48-6-avance',
    name: 'ECU SET EG48.6 AVANCE',
    price: 155,
    category: 'ECU Control Units',
    description: 'Advanced ECU control unit for 6-cylinder engines with premium features. Designed for high-performance vehicles requiring precise fuel management and optimal power delivery.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['6-cylinder compatibility', 'Advanced functionality', 'Premium features', 'Performance optimization', 'Extended warranty']
  },
  {
    id: 'ecu-eg48-8-avance',
    name: 'ECU SET EG48.8 AVANCE',
    price: 200,
    category: 'ECU Control Units',
    description: 'Advanced ECU control unit for 8-cylinder engines with premium features. Our top-of-the-line solution for large engines, providing exceptional control and performance optimization.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['8-cylinder compatibility', 'Advanced functionality', 'Premium features', 'Maximum performance', 'Professional installation recommended']
  },
  {
    id: 'ecu-eg48-4-superior',
    name: 'ECU SET EG48.4 SUPERIOR',
    price: 140,
    category: 'ECU Control Units',
    description: 'Superior ECU control unit for 4-cylinder engines with enhanced performance. Features the latest technology for optimal fuel efficiency and power delivery in all driving conditions.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Superior functionality', 'Enhanced performance', 'Fuel efficiency optimization', 'Advanced diagnostics']
  },
  {
    id: 'ecu-eg48-4-injecto',
    name: 'ECU SET EG48.4 INJECTO',
    price: 350,
    category: 'ECU Control Units',
    description: 'Specialized ECU control unit for 4-cylinder engines with direct injection support. Designed specifically for modern direct injection engines, providing optimal performance and compatibility.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Direct injection support', 'High precision', 'Modern engine compatibility', 'Professional calibration']
  },
  {
    id: 'ecu-eg48-6-injecto',
    name: 'ECU SET EG48.6 INJECTO',
    price: 450,
    category: 'ECU Control Units',
    description: 'Specialized ECU control unit for 6-cylinder engines with direct injection support. Our premium solution for larger direct injection engines, ensuring optimal performance and reliability.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['6-cylinder compatibility', 'Direct injection support', 'High precision', 'Premium components', 'Extended warranty']
  },
  {
    id: 'ecu-eg48-4-injecto-due',
    name: 'ECU SET EG48.4 INJECTO DUE',
    price: 420,
    category: 'ECU Control Units',
    description: 'Advanced dual ECU control unit for 4-cylinder engines with direct injection support. Features dual control systems for maximum precision and reliability in demanding applications.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Dual system support', 'Direct injection compatibility', 'Redundant safety systems', 'Professional installation required']
  },
  
  // Rail Injectors
  {
    id: 'railgas-4-cyl',
    name: 'RAILGAS 4 CYL.',
    price: 32,
    category: 'Rail Injectors',
    description: 'Standard rail injector for 4-cylinder engines with reliable performance. Designed for consistent fuel delivery and long-term reliability in various operating conditions.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    isFeatured: true,
    features: ['4-cylinder compatibility', 'Standard flow rate', 'Durable construction', 'Easy installation', 'Compatible with most ECU systems']
  },
  {
    id: 'railgas-3-cyl',
    name: 'RAILGAS 3 CYL.',
    price: 27,
    category: 'Rail Injectors',
    description: 'Standard rail injector for 3-cylinder engines with reliable performance. Specifically designed for smaller engines while maintaining optimal fuel delivery and efficiency.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['3-cylinder compatibility', 'Standard flow rate', 'Durable construction', 'Compact design', 'Fuel-efficient operation']
  },
  {
    id: 'rail-apache-4-cyl',
    name: 'RAIL APACHE 4 CYL.',
    price: 37,
    category: 'Rail Injectors',
    description: 'Apache series rail injector for 4-cylinder engines with improved flow rate. Features enhanced design for better fuel atomization and more consistent delivery across all cylinders.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Improved flow rate', 'Enhanced durability', 'Better atomization', 'Reduced maintenance']
  },
  {
    id: 'rail-apache-3-cyl',
    name: 'RAIL APACHE 3 CYL.',
    price: 32,
    category: 'Rail Injectors',
    description: 'Apache series rail injector for 3-cylinder engines with improved flow rate. Brings the advanced features of the Apache series to smaller engine configurations.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['3-cylinder compatibility', 'Improved flow rate', 'Enhanced durability', 'Compact design', 'Optimized for small engines']
  },
  {
    id: 'rail-dakota-4-cyl',
    name: 'RAIL DAKOTA 4 CYL.',
    price: 70,
    category: 'Rail Injectors',
    description: 'Premium Dakota series rail injector for 4-cylinder engines with high precision. Our top-tier injector featuring advanced materials and precision manufacturing for optimal performance.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    isFeatured: true,
    features: ['4-cylinder compatibility', 'High precision', 'Premium quality', 'Maximum efficiency', 'Extended lifespan']
  },
  {
    id: 'rail-dakota-3-cyl',
    name: 'RAIL DAKOTA 3 CYL.',
    price: 60,
    category: 'Rail Injectors',
    description: 'Premium Dakota series rail injector for 3-cylinder engines with high precision. Brings the premium features of the Dakota series to 3-cylinder engine applications.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['3-cylinder compatibility', 'High precision', 'Premium quality', 'Compact design', 'Optimal fuel delivery']
  },
  {
    id: 'rail-dakota-1-cyl',
    name: 'RAIL DAKOTA 1 CYL.',
    price: 17.5,
    category: 'Rail Injectors',
    description: 'Premium Dakota series rail injector for single-cylinder engines with high precision. Specialized solution for single-cylinder applications requiring precise fuel delivery.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Single-cylinder compatibility', 'High precision', 'Premium quality', 'Specialized design', 'Ideal for small engines']
  },
  {
    id: 'eg-2000-4-cyl',
    name: 'EG 2000 4 CYL.',
    price: 65,
    category: 'Rail Injectors',
    description: 'EG 2000 series rail injector for 4-cylinder engines with advanced features. The latest generation of injectors featuring improved technology and reliability.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['4-cylinder compatibility', 'Advanced features', 'Reliable performance', 'Modern design', 'Comprehensive warranty']
  },
  {
    id: 'eg-2000-3-cyl',
    name: 'EG 2000 3 CYL.',
    price: 55,
    category: 'Rail Injectors',
    description: 'EG 2000 series rail injector for 3-cylinder engines with advanced features. Brings the technology of the EG 2000 series to 3-cylinder applications.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['3-cylinder compatibility', 'Advanced features', 'Reliable performance', 'Efficient operation', 'Easy maintenance']
  },
  {
    id: 'eg-2000-1-cyl',
    name: 'EG 2000 1 CYL.',
    price: 17,
    category: 'Rail Injectors',
    description: 'EG 2000 series rail injector for single-cylinder engines with advanced features. Specialized solution for single-cylinder applications with the latest technology.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Single-cylinder compatibility', 'Advanced features', 'Reliable performance', 'Compact size', 'Versatile applications']
  },
  
  // Gas Reducers
  {
    id: 'eg-premo-150',
    name: 'EG PREMO 150',
    price: 50,
    category: 'Gas Reducers',
    description: 'Premium gas reducer with 150 HP capacity for efficient gas conversion. Features advanced pressure regulation and temperature compensation for optimal performance in all conditions.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    isFeatured: true,
    features: ['150 HP capacity', 'Premium quality', 'Efficient gas conversion', 'Temperature compensation', 'Durable construction']
  },
  {
    id: 'rail-uno',
    name: 'RAIL UNO',
    price: 45,
    category: 'Gas Reducers',
    description: 'Basic gas reducer with reliable performance for standard applications. Our entry-level reducer providing consistent performance for everyday use in most vehicle types.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Standard capacity', 'Reliable performance', 'Easy installation', 'Cost-effective', 'Wide compatibility']
  },
  {
    id: 'rail-due',
    name: 'RAIL DUE',
    price: 55,
    category: 'Gas Reducers',
    description: 'Intermediate gas reducer with enhanced performance for demanding applications. Features improved pressure regulation and better response to changing engine demands.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Enhanced capacity', 'Improved performance', 'Durable construction', 'Better response', 'Versatile applications']
  },
  {
    id: 'rail-tre',
    name: 'RAIL TRE',
    price: 90,
    category: 'Gas Reducers',
    description: 'Advanced gas reducer with high capacity for high-performance applications. Our premium reducer designed for vehicles requiring maximum power and efficiency.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['High capacity', 'Advanced performance', 'Premium quality', 'Maximum efficiency', 'Professional installation recommended']
  },
  {
    id: 'rail-tyrion',
    name: 'RAIL TYRION',
    price: 75,
    category: 'Gas Reducers',
    description: 'Specialized gas reducer with compact design for limited space applications. Features innovative design allowing installation in vehicles with restricted engine bay space.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Compact design', 'Versatile mounting', 'Reliable performance', 'Space-saving solution', 'Consistent pressure regulation']
  },
  {
    id: 'rail-stark',
    name: 'RAIL STARK',
    price: 110,
    category: 'Gas Reducers',
    description: 'Heavy-duty gas reducer for commercial and high-demand applications. Designed for continuous operation in demanding conditions with minimal maintenance requirements.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Heavy-duty construction', 'Commercial grade', 'Extended lifespan', 'High reliability', 'Continuous operation']
  },
  {
    id: 'rail-lannister',
    name: 'RAIL LANNISTER',
    price: 120,
    category: 'Gas Reducers',
    description: 'Premium gas reducer with gold-plated components for maximum durability. Our luxury model featuring corrosion-resistant components and premium materials throughout.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Premium materials', 'Corrosion resistance', 'Luxury design', 'Maximum durability', 'Lifetime warranty']
  },
  {
    id: 'rail-baratheon',
    name: 'RAIL BARATHEON',
    price: 95,
    category: 'Gas Reducers',
    description: 'High-performance gas reducer with reinforced components for racing applications. Designed for competitive use with enhanced flow rates and rapid response to throttle changes.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Racing specification', 'Reinforced components', 'High flow rate', 'Rapid response', 'Competition proven']
  },
  {
    id: 'rail-targaryen',
    name: 'RAIL TARGARYEN',
    price: 130,
    category: 'Gas Reducers',
    description: 'Advanced gas reducer with heat-resistant design for extreme conditions. Features special alloys and cooling systems for operation in high-temperature environments.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Heat-resistant design', 'Extreme condition operation', 'Advanced cooling', 'Special alloys', 'Temperature monitoring']
  },
  {
    id: 'rail-snow',
    name: 'RAIL SNOW',
    price: 85,
    category: 'Gas Reducers',
    description: 'Cold-weather optimized gas reducer for reliable performance in low temperatures. Specially designed for regions with harsh winters, ensuring consistent operation in freezing conditions.',
    imageUrl: '/images/products/productlogo.png',
    inStock: true,
    features: ['Cold-weather optimized', 'Low-temperature operation', 'Rapid heating', 'Freeze protection', 'Winter reliability']
  }
];

export default allProducts; 