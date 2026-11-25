import { ActivityCategory } from '@/lib/types';
import { CITIES } from '@/lib/data/cities';

type CityActivityVenueMap = Partial<Record<ActivityCategory, string[]>>;

const CITY_ACTIVITY_VENUES: Record<string, CityActivityVenueMap> = {
  chandigarh: {
    'coffee-chat': [
      'Third Wave Coffee, Sector 35',
      'Blue Tokai Coffee, Sector 8',
      'Back to Source Cafe, Sector 17',
      'Cafe JC\'s, Sector 10',
      'Brooklyn Central, Elante Mall',
    ],
    'movie-buddy': [
      'PVR Cinemas, Elante Mall',
      'Cinepolis, Jagat Mall Sector 17',
      'PVR Centra Mall, Industrial Area',
      'Piccadily Square Cinemas, Sector 34',
    ],
    'gym-partner': [
      'Gold\'s Gym, Sector 9',
      'Cult.fit Center, Sector 8',
      'Anytime Fitness, Sector 35',
      'Burn Gym, Sector 26',
    ],
    'shopping-buddy': [
      'Elante Mall Central Atrium',
      'Sector 17 Plaza Market',
      'Sector 22 Shastri Market Arcade',
      'Sector 9 Inner Market Boutiques',
    ],
    'city-guide': [
      'Sector 17 Plaza Fountain',
      'Capitol Complex Visitor Center, Sector 1',
      'Rock Garden Entrance Plaza',
      'Le Corbusier Centre, Sector 19',
    ],
    'event-plus-one': [
      'Tagore Theatre Courtyard, Sector 18',
      'Punjab Kala Bhawan, Sector 16',
      'Elante Mall Courtyard Events',
      'Kalagram Cultural Hub, Manimajra',
    ],
    'food-walk': [
      'Sector 15 Patel Market Food Street',
      'Sector 35 Cafe & Diner Lane',
      'Sector 17 Softy & Chaat Corner',
      'Sector 26 Madhya Marg Food Court',
    ],
    'study-buddy': [
      'Third Wave Coffee Study Tables, Sector 35',
      'Blue Tokai Quiet Roastery, Sector 8',
      'TS Central State Library Reading Plaza, Sector 17',
      'Coffee Bean & Tea Leaf, Sector 22',
    ],
    'photo-walk': [
      'Sukhna Lake Waterfront Promenade',
      'Zakir Hussain Rose Garden, Sector 16',
      'Rock Garden Sculptural Courtyard',
      'Sector 17 Brutalist Plaza',
    ],
    'comedy-and-shows': [
      'The Laugh Club, Sector 26',
      'Tagore Theatre Auditorium, Sector 18',
      'Social Open Mic Deck, Sector 7',
      'Underdoggs Comedy Stage, Elante Mall',
    ],
    'walk-and-talk': [
      'Sukhna Lake Waterfront Promenade',
      'Zakir Hussain Rose Garden, Sector 16',
      'Leisure Valley Green Trail, Sector 10',
      'Terraced Garden Walkway, Sector 33',
    ],
    'career-chat': [
      'Third Wave Coffee, Sector 35',
      'Starbucks, Elante Mall',
      'Blue Tokai Coffee, Sector 8',
      'Next57 Co-Working Cafe, Sector 17',
    ],
    'festival-buddy': [
      'Sector 17 Parade Ground Fair',
      'Elante Mall Festive Courtyard',
      'Sector 34 Exhibition Ground',
      'Sukhna Lake Festive Promenade',
    ],
    'sports-partner': [
      'Lake Sports Complex Courts, Sector 1',
      'Sector 42 Sports Complex Badminton Hall',
      'Sector 7 Athletics & Tennis Courts',
      'Chandigarh Golf Range Public Bays',
    ],
    'gaming-partner': [
      'Smaaash Arcade, Elante Mall',
      'Timezone Gaming Arena, Elante',
      'Social Board Games Lounge, Sector 7',
      'HopUp Gaming & Bowling, Zirakpur Highway',
    ],
    'settle-in-buddy': [
      'Sector 17 Central Market & Bus Hub',
      'Elante Mall Essentials Concierge',
      'Sector 35 Market & Cafe Hub',
      'Sector 22 Main Market Center',
    ],
    'travel-buddy': [
      'Sukhna Lake Morning Meetup Point',
      'Morni Hills Highway Cafe Stop',
      'Kasauli Timber Trail Base Cafe',
      'Pinjore Gardens Main Entrance Gate',
    ],
  },

  mohali: {
    'coffee-chat': [
      'Third Wave Coffee, CP67 Mall',
      'Blue Tokai Coffee, Phase 3B2',
      'Brew & Bake Cafe, Phase 7',
      'Starbucks, VR Punjab Mall',
    ],
    'movie-buddy': [
      'PVR Superplex, CP67 Mall',
      'PVR Cinemas, VR Punjab Mall',
      'Cinepolis, Bestech Square Mall',
      'Cinepolis, Jagat Mall (Nearby Sector 17)',
    ],
    'gym-partner': [
      'Anytime Fitness, Phase 3B2',
      'Cult.fit Center, Sector 70',
      'Gold\'s Gym, Phase 7',
      'Burn Gym, Sector 68',
    ],
    'shopping-buddy': [
      'CP67 Mall Atrium, Airport Road',
      'VR Punjab Mall Central Court',
      'Phase 3B2 High Street Market',
      'Bestech Square Mall',
    ],
    'city-guide': [
      'CP67 Mall Plaza, Airport Road',
      'Phase 3B2 Market Hub',
      'Fateh Burj Heritage Complex, Chappar Chiri',
      'PCA Stadium Outer Promenade',
    ],
    'event-plus-one': [
      'CP67 Mall Event Atrium',
      'VR Punjab Open Courtyard',
      'Bestech Business Tower Lounge',
    ],
    'food-walk': [
      'Phase 3B2 Food & Dessert Market',
      'Phase 7 High Street Eateries',
      'CP67 Food Court & Cafes',
    ],
    'study-buddy': [
      'Third Wave Coffee, CP67 Mall',
      'Phase 3B2 Quiet Study Cafe',
      'Starbucks Workspace Tables, VR Punjab',
    ],
    'photo-walk': [
      'Fateh Burj Heritage Promenade',
      'Silvi Park Green Walkways, Phase 10',
      'Nature Park Trails, Phase 8',
    ],
    'comedy-and-shows': [
      'Social Stage, CP67 Mall',
      'Brew Estate Live Nights, Phase 11',
      'VR Punjab Courtyard Live Stage',
    ],
    'walk-and-talk': [
      'Silvi Park Main Walkway, Phase 10',
      'Rose Garden Trail, Phase 3B1',
      'Leisure Valley Walkways, Sector 69',
    ],
    'career-chat': [
      'Third Wave Coffee, CP67 Mall',
      'Blue Tokai Coffee, Phase 3B2',
      'Starbucks, VR Punjab Mall',
    ],
    'festival-buddy': [
      'CP67 Festive Plaza',
      'VR Punjab Open Lawn Fair',
      'Dussehra Ground, Phase 8',
    ],
    'sports-partner': [
      'Sector 78 Multi-Sports Complex',
      'Sector 63 Sports & Badminton Hall',
      'Phase 9 Sports Complex Grounds',
    ],
    'gaming-partner': [
      'Timezone Gaming Arena, CP67 Mall',
      'Funky Island Arcade, VR Punjab',
      'HopUp Bowling & Gaming Hub',
    ],
    'settle-in-buddy': [
      'Phase 3B2 Central Market',
      'CP67 Airport Road Hub',
      'Phase 7 Market & Metro Feeder Point',
    ],
    'travel-buddy': [
      'Airport Road Highway Cafe Meetup',
      'Siswan Dam Morning Trailhead',
      'Kasauli Foothills Cafe Meetup',
    ],
  },

  panchkula: {
    'coffee-chat': [
      'Third Wave Coffee, Sector 5',
      'Cafe Coffee Day, Bella Vista Sector 5',
      'Nik Baker\'s Cafe, Sector 9',
      'Artisan Espresso Bar, MDC Sector 5',
    ],
    'movie-buddy': [
      'INOX Cinemas, NH-22 Mall (Nearby)',
      'PVR Elante Mall (15 min Tricity Drive)',
      'Fun Cinemas / Shalimar Plaza, Sector 5',
    ],
    'gym-partner': [
      'Anytime Fitness, Sector 9',
      'Gold\'s Gym, Sector 5',
      'Fit7 Fitness Club, Sector 11',
    ],
    'shopping-buddy': [
      'Sector 11 Main Market',
      'Sector 5 Bella Vista Promenade',
      'Sector 9 Inner Market',
    ],
    'city-guide': [
      'National Cactus Garden, Sector 5',
      'Town Park Promenade, Sector 5',
      'Mansa Devi Complex Heritage Entrance',
    ],
    'event-plus-one': [
      'Indradhanush Auditorium, Sector 5',
      'Bella Vista Courtyard, Sector 5',
      'Town Park Amphitheater',
    ],
    'food-walk': [
      'Sector 9 Cafe & Street Food Lane',
      'Sector 11 Evening Food Market',
      'Sector 5 Red Bishop Food Plaza',
    ],
    'study-buddy': [
      'Third Wave Coffee, Sector 5',
      'Sector 5 Public Library Reading Room',
      'Nik Baker\'s Quiet Corner, Sector 9',
    ],
    'photo-walk': [
      'Cactus Garden Botanical Walk, Sector 5',
      'Town Park Lake & Bridge Trail, Sector 5',
      'Yadavindra Gardens Promenade, Pinjore',
    ],
    'comedy-and-shows': [
      'Indradhanush Auditorium Events, Sector 5',
      'Red Bishop Open Lounge, Sector 1',
      'Bella Vista Acoustic Evenings, Sector 5',
    ],
    'walk-and-talk': [
      'Town Park Main Trail, Sector 5',
      'Yavanika Garden Walkway, Sector 5',
      'Cactus Garden Green Loop',
    ],
    'career-chat': [
      'Third Wave Coffee, Sector 5',
      'Nik Baker\'s Bistro, Sector 9',
      'MDC Sector 5 Work Cafe',
    ],
    'festival-buddy': [
      'Sector 5 Shalimar Ground Fair',
      'Town Park Festive Lights Walk',
      'Sector 11 Festive Market',
    ],
    'sports-partner': [
      'Tau Devi Lal Sports Complex, Sector 3',
      'Sector 5 Gymkhana Badminton Courts',
      'Sector 6 Tennis Courts',
    ],
    'gaming-partner': [
      'Sector 5 Mall Arcade Lounge',
      'Sector 9 Cafe Board Games Table',
      'Sector 11 Snooker & Gaming Den',
    ],
    'settle-in-buddy': [
      'Sector 5 Central Hub',
      'Sector 11 Daily Essentials Market',
      'Sector 9 Community Center',
    ],
    'travel-buddy': [
      'Morni Hills Foot Cafe Meetup',
      'Kalka Highway Point Cafe',
      'Pinjore Gardens Main Gate',
    ],
  },

  delhi: {
    'coffee-chat': [
      'Blue Tokai Coffee, Khan Market',
      'Starbucks, Connaught Place Inner Circle',
      'Third Wave Coffee, CyberHub Gurgaon',
      'Kunzum Travel Cafe, Hauz Khas Village',
      'Cafe Dori, Chhatarpur',
    ],
    'movie-buddy': [
      'PVR Director\'s Cut, Ambience Mall Vasant Kunj',
      'PVR Select Citywalk, Saket',
      'PVR Priya, Basant Lok Vasant Vihar',
      'INOX Insignia, Epicuria Nehru Place',
      'Cinepolis, DLF CyberHub Gurgaon',
    ],
    'gym-partner': [
      'Cult.fit Center, Hauz Khas / South Ex',
      'Anytime Fitness, GK1 M-Block',
      'Gold\'s Gym, Connaught Place',
      'Fitness First, CyberHub Gurgaon',
    ],
    'shopping-buddy': [
      'Select Citywalk Mall, Saket',
      'DLF Promenade, Vasant Kunj',
      'Khan Market Pedestrian Lane',
      'Connaught Place Outer Circle Arcades',
      'Sarojini Nagar Main Market Gate',
    ],
    'city-guide': [
      'India Gate Lawns Promenade',
      'Humayun\'s Tomb Visitor Plaza',
      'Hauz Khas Fort & Village Gate',
      'Qutub Minar Heritage Courtyard',
    ],
    'event-plus-one': [
      'India Habitat Centre Courtyard, Lodhi Road',
      'Bikaner House Cultural Lawn, Pandara Road',
      'DLF CyberHub Amphitheater',
    ],
    'food-walk': [
      'Chandni Chowk Paratha & Chaat Walk',
      'Majnu Ka Tilla Cafe Lane',
      'Connaught Place Outer Circle Eateries',
      'CyberHub Dining Promenade, Gurgaon',
    ],
    'study-buddy': [
      'Blue Tokai Roastery Tables, Saidulajab Saket',
      'Third Wave Coffee Work Lounge, GK2 M-Block',
      'Starbucks, Connaught Place',
      'Bahrisons Reading Corner, Khan Market',
    ],
    'photo-walk': [
      'Sunder Nursery Heritage Promenade',
      'Lodhi Art District Murals',
      'Hauz Khas Lakefront Ruins',
      'Connaught Place White Colonnades',
    ],
    'comedy-and-shows': [
      'The Laugh Store, Vegas / CyberHub',
      'Kamani Auditorium, Mandi House',
      'Canvas Laugh Club, Noida / Gurgaon',
      'Habitat Comedy Club, South Delhi',
    ],
    'walk-and-talk': [
      'Lodhi Gardens Heritage Trail',
      'Sunder Nursery Botanical Walk',
      'Nehru Park Walking Loop, Chanakyapuri',
      'Sanjay Van Main Promenade',
    ],
    'career-chat': [
      'Third Wave Coffee, CyberHub Gurgaon',
      'Blue Tokai Coffee, Khan Market',
      'Social Workspaces, Hauz Khas Village',
      'Starbucks, Noida Sector 18 Mall of India',
    ],
    'festival-buddy': [
      'Dilli Haat, INA Courtyard',
      'Chittaranjan Park Pujo Pandal Walk',
      'Select Citywalk Festive Plaza',
    ],
    'sports-partner': [
      'Siri Fort Sports Complex Badminton Courts',
      'DDA Squash & Badminton Stadium, Dwarka',
      'DLF Phase 4 Pickleball & Turf Courts, Gurgaon',
    ],
    'gaming-partner': [
      'Timezone & Smaaash, Mall of India Noida',
      'CyberHub Gaming Lounge, Gurgaon',
      'Unlocked Board Game Cafe, Gurgaon 32nd Avenue',
    ],
    'settle-in-buddy': [
      'Rajiv Chowk Metro Hub, Connaught Place',
      'South Extension Market Center',
      'DLF Phase 4 Galleria Market, Gurgaon',
    ],
    'travel-buddy': [
      'Dhaula Kuan Morning Meetup Cafe',
      'Surajkund Road Trailhead Cafe',
      'Gurgaon Expressway Pitstop (Neemrana Trips)',
    ],
  },

  mumbai: {
    'coffee-chat': [
      'Blue Tokai Coffee, Bandra Pali Hill',
      'Subko Specialty Coffee, Chapel Road Bandra',
      'Third Wave Coffee, Khar West',
      'Kala Ghoda Cafe, Fort',
      'Starbucks Reserve, Horniman Circle',
    ],
    'movie-buddy': [
      'Maison PVR, Jio World Drive BKC',
      'PVR Icon, Phoenix Palladium Lower Parel',
      'Regal / Eros Heritage Cinema, Churchgate',
      'PVR Juhu Dynamix Mall',
    ],
    'gym-partner': [
      'Cult.fit, Bandra West',
      'Gold\'s Gym, Pali Hill Bandra',
      'IThink Fitness, Worli / Lower Parel',
      'Anytime Fitness, Andheri Lokhandwala',
    ],
    'shopping-buddy': [
      'Phoenix Palladium Mall, Lower Parel',
      'Linking Road & Hill Road Market, Bandra',
      'Colaba Causeway Arcade',
      'Jio World Drive, BKC',
    ],
    'city-guide': [
      'Gateway of India Promenade',
      'Kala Ghoda Heritage Precinct',
      'Bandra Bandstand Waterfront',
      'Horniman Circle Gardens, Fort',
    ],
    'event-plus-one': [
      'NCPA Nariman Point Atrium',
      'NMACC Cultural Plaza, BKC',
      'Jehangir Art Gallery Steps, Kala Ghoda',
    ],
    'food-walk': [
      'Pali Hill & Carter Road Food Walk, Bandra',
      'Colaba Cafe & Irani Chai Trail',
      'Juhu Chowpatty Street Eats Plaza',
      'Lower Parel Kamala Mills Food Courtyard',
    ],
    'study-buddy': [
      'Third Wave Coffee, Khar West',
      'Doolally Work & Brew, Bandra / Kemps Corner',
      'Kitab Khana Reading Cafe, Fort',
    ],
    'photo-walk': [
      'Marine Drive Coastal Promenade',
      'Kala Ghoda Victorian Heritage Street',
      'Bandstand Seafront Fort Walk',
      'Powai Lakefront Walkways',
    ],
    'comedy-and-shows': [
      'The Habitat Comedy Club, Khar West',
      'Prithvi Theatre Cafe & Courtyard, Juhu',
      'NCPA Experimental Theatre, Nariman Point',
    ],
    'walk-and-talk': [
      'Marine Drive Promenade, Churchgate',
      'Carter Road Waterfront, Bandra',
      'Worli Sea Face Walkway',
      'Hiranandani Gardens Powai Lake Walk',
    ],
    'career-chat': [
      'Blue Tokai Coffee, BKC Maker Maxity',
      'Third Wave Coffee, Lower Parel',
      'Subko Cacao & Roasters, Bandra',
    ],
    'festival-buddy': [
      'Jio World Plaza Festive Atrium',
      'Bandra Mount Mary Promenade',
      'Girgaon Chowpatty Festive Coast',
    ],
    'sports-partner': [
      'Bandra Gymkhana / Turf Park',
      'Andheri Sports Complex Badminton Hall',
      'Lower Parel Rooftop Pickleball Courts',
    ],
    'gaming-partner': [
      'Timezone, Phoenix Marketcity Kurla',
      'Smaaash, Kamala Mills Lower Parel',
      'Doolally Board Games Tables, Bandra',
    ],
    'settle-in-buddy': [
      'Bandra West Linking Road Hub',
      'Andheri West Lokhandwala Circle',
      'Lower Parel Station Cafe Plaza',
    ],
    'travel-buddy': [
      'Gateway Ferry Point (Alibaug Trips)',
      'Dadar East Highway Meetup Point (Lonavala)',
      'Sanjay Gandhi National Park Main Gate',
    ],
  },

  bengaluru: {
    'coffee-chat': [
      'Third Wave Coffee, 12th Main Indiranagar',
      'Blue Tokai Coffee, 5th Block Koramangala',
      'Araku Coffee, Indiranagar',
      'Matteo Coffea, Church Street',
      'Subko Coffee, Indiranagar',
    ],
    'movie-buddy': [
      'PVR Director\'s Cut, Rex Walk Brigade Road',
      'PVR IMAX, Orion Mall Rajajinagar',
      'PVR Forum, Koramangala',
      'INOX Garuda Mall, Magrath Road',
    ],
    'gym-partner': [
      'Cult.fit, 100 Feet Road Indiranagar',
      'Cult.fit, HSR Layout Sector 2',
      'Gold\'s Gym, Koramangala',
      'Nitrro Wellness, Whitefield',
    ],
    'shopping-buddy': [
      'UB City Piazza, Vittal Mallya Road',
      'Commercial Street Pedestrian Plaza',
      'Orion Mall Lakeside Promenade',
      'Phoenix Marketcity Courtyard, Whitefield',
    ],
    'city-guide': [
      'Church Street Bookshop Walk',
      'Cubbon Park Metro Entrance Plaza',
      'Basavanagudi Heritage Corner',
      'Indiranagar 12th Main Lane',
    ],
    'event-plus-one': [
      'Ranga Shankara Courtyard, JP Nagar',
      'UB City Amphitheater',
      'Museum of Art & Photography (MAP), Ashok Nagar',
    ],
    'food-walk': [
      'VV Puram Iconic Food Street',
      'Indiranagar 12th Main Cafe & Microbrewery Walk',
      'Church Street Food & Dessert Walk',
      'Malleshwaram Heritage Tiffin Trail',
    ],
    'study-buddy': [
      'Dialogues Cafe, Koramangala',
      'Third Wave Coffee, Church Street',
      'Atta Galatta Book & Reading Cafe, Indiranagar',
    ],
    'photo-walk': [
      'Cubbon Park Red Library & Bamboo Grove',
      'Lalbagh Glass House Botanical Walk',
      'Ulsoor Lake Morning Promenade',
    ],
    'comedy-and-shows': [
      'Just BLR Comedy Club, Brigade Road',
      'Lahe Lahe Courtyard Stage, Indiranagar',
      'Good Shepherd Auditorium / Indiranagar Social',
    ],
    'walk-and-talk': [
      'Cubbon Park Central Walkway',
      'Lalbagh Botanical Garden Loop',
      'Sankey Tank Lakefront Path',
      'Agara Lake Trail, HSR Layout',
    ],
    'career-chat': [
      'Third Wave Coffee, 12th Main Indiranagar',
      'Blue Tokai, Koramangala 5th Block',
      'WeWork Galaxy Cafe Plaza, Residency Road',
      'Third Wave Coffee, HSR Layout 27th Main',
    ],
    'festival-buddy': [
      'Indiranagar Festive Market Walk',
      'Phoenix Marketcity Open Courtyard',
      'Malleshwaram Festive Street',
    ],
    'sports-partner': [
      'Play Arena, Sarjapur Road',
      'Padukone-Dravid Centre / Indiranagar Badminton Club',
      'HSR Layout Pickleball & Turf Courts',
    ],
    'gaming-partner': [
      'Victory Point Board Game Cafe, Indiranagar',
      'Timezone Gaming, Orion Mall',
      'Play Arena Bowling & Arcade, Sarjapur',
    ],
    'settle-in-buddy': [
      'Indiranagar Metro Station Plaza',
      'HSR Layout 27th Main Hub',
      'Koramangala Sony World Junction',
    ],
    'travel-buddy': [
      'Hebbal Flyover Morning Meetup (Nandi Hills)',
      'Silk Board / Nice Road Pitstop (Mysuru/Coorg)',
      'Yelahanka Coffee Stop',
    ],
  },

  pune: {
    'coffee-chat': [
      'Blue Tokai Coffee, Koregaon Park Lane 7',
      'Third Wave Coffee, Koregaon Park',
      'Cafe Peter / Vaishali, FC Road',
      'Zen Cafe, Koregaon Park',
    ],
    'movie-buddy': [
      'PVR IMAX, Phoenix Marketcity Viman Nagar',
      'Cinepolis, Westend Mall Aundh',
      'INOX Bund Garden Road',
      'PVR Pavillion Mall, SB Road',
    ],
    'gym-partner': [
      'Cult.fit, Koregaon Park / Viman Nagar',
      'Gold\'s Gym, Kalyani Nagar',
      'MultiFit Gym, Baner High Street',
    ],
    'shopping-buddy': [
      'Phoenix Marketcity Atrium, Viman Nagar',
      'FC Road Street Shopping Arcade',
      'MG Road Camp Plaza',
      'Pavillion Mall, Senapati Bapat Road',
    ],
    'city-guide': [
      'Shaniwar Wada Courtyard Plaza',
      'Koregaon Park Tree-Lined Lanes',
      'Aga Khan Palace Garden Entrance',
    ],
    'event-plus-one': [
      'Bal Gandharva Rang Mandir Courtyard',
      'Phoenix Marketcity Liberty Square',
      'Gyaan Adab Cultural Center, Kalyani Nagar',
    ],
    'food-walk': [
      'FC Road & JM Road Iconic Eateries',
      'Koregaon Park Lane 5 & 7 Cafe Trail',
      'Viman Nagar Bakeries & Street Eats',
    ],
    'study-buddy': [
      'Pagdandi Books & Chai Cafe, Baner',
      'Blue Tokai Study Lounge, Koregaon Park',
      'Waari Book Cafe, Kothrud',
    ],
    'photo-walk': [
      'Osho Teerth Park Garden Trail, KP',
      'Aga Khan Palace Gardens',
      'Pashan Lake Sunrise Promenade',
    ],
    'comedy-and-shows': [
      'Kothrud Comedy / Amphitheatre Events',
      'High Spirits Acoustic Courtyard, KP',
      'Classic Rock Coffee Co Stage, Kalyani Nagar',
    ],
    'walk-and-talk': [
      'Osho Teerth Park, Koregaon Park',
      'Empress Botanical Garden, Camp',
      'Vetal Tekdi Main Walkway',
    ],
    'career-chat': [
      'Third Wave Coffee, Koregaon Park',
      'Blue Tokai Coffee, Baner High Street',
      'Starbucks, Viman Nagar Phoenix Mall',
    ],
    'festival-buddy': [
      'Laxmi Road Heritage Festive Plaza',
      'Phoenix Marketcity Festive Court',
      'Camp MG Road Promenade',
    ],
    'sports-partner': [
      'Balewadi Sports Complex Courts',
      'Kalyani Nagar Turf & Badminton Arena',
      'Deccan Gymkhana Courts',
    ],
    'gaming-partner': [
      'Timezone Gaming, Phoenix Marketcity',
      'The Board Game Den, Baner / KP',
      'Smaaash Bowling, Amanora Mall',
    ],
    'settle-in-buddy': [
      'Koregaon Park Main Lane',
      'Baner High Street Center',
      'Viman Nagar Phoenix Junction',
    ],
    'travel-buddy': [
      'Chandni Chowk Meetup Point (Lavasa/Sinhagad)',
      'Hinjewadi Expressway Gate (Lonavala)',
      'Kothrud Morning Cafe Stop',
    ],
  },

  hyderabad: {
    'coffee-chat': [
      'Roastery Coffee House, Banjara Hills',
      'True Black Specialty Coffee, Jubilee Hills',
      'Third Wave Coffee, Jubilee Hills Road 36',
      'Autumn Leaf Cafe, Jubilee Hills',
    ],
    'movie-buddy': [
      'AMB Cinemas, Gachibowli',
      'Prasads Multiplex, Necklace Road',
      'PVR Inorbit Mall, Madhapur',
      'PVR Next Galleria, Panjagutta',
    ],
    'gym-partner': [
      'Cult.fit, Jubilee Hills / Madhapur',
      'Gold\'s Gym, Banjara Hills',
      'F45 Training, Gachibowli',
    ],
    'shopping-buddy': [
      'Inorbit Mall Cyberabad, Madhapur',
      'Sarath City Capital Mall Atrium, Kondapur',
      'GVK One Mall, Banjara Hills',
      'Laad Bazaar Courtyard, Charminar',
    ],
    'city-guide': [
      'Charminar Heritage Square',
      'Golconda Fort Main Gate Promenade',
      'Chowmahalla Palace Courtyard',
    ],
    'event-plus-one': [
      'Shilpakala Vedika Plaza, Hitec City',
      'Lamakaan Cultural Courtyard, Banjara Hills',
      'T-Hub / Sarath City Events Atrium',
    ],
    'food-walk': [
      'Charminar Irani Chai & Biryani Trail',
      'Jubilee Hills Road 45 Cafe & Diner Strip',
      'DLF Cyber City Night Street Food, Gachibowli',
    ],
    'study-buddy': [
      'Lamakaan Quiet Garden Cafe, Banjara Hills',
      'Third Wave Coffee Work Tables, Jubilee Hills',
      'The Coffee Cup Reading Lounge, Sainikpuri',
    ],
    'photo-walk': [
      'Durgam Cheruvu Cable Bridge Promenade',
      'Tank Bund & Hussain Sagar Lakefront',
      'KBR Park Morning Trail',
    ],
    'comedy-and-shows': [
      'The Street Comedy Club, Madhapur',
      'Heart Cup Coffee Live Stage, Jubilee Hills',
      'Lamakaan Evening Open Stage, Banjara Hills',
    ],
    'walk-and-talk': [
      'KBR National Park Outer & Inner Trail',
      'Necklace Road Lakefront Promenade',
      'Durgam Cheruvu Park Walk, Madhapur',
    ],
    'career-chat': [
      'Third Wave Coffee, Hitec City / Madhapur',
      'True Black Coffee, Jubilee Hills',
      'Roastery Coffee House, Banjara Hills',
    ],
    'festival-buddy': [
      'Necklace Road Festive Mela',
      'Sarath City Festive Courtyard',
      'Shilparamam Crafts Fair, Hitec City',
    ],
    'sports-partner': [
      'Gachibowli Stadium Badminton Complex',
      'Jubilee Hills Pickleball & Turf Courts',
      'Madhapur Sports Hub',
    ],
    'gaming-partner': [
      'Timezone Gaming, Sarath City Mall',
      'Smaaash Arena, Inorbit Mall Madhapur',
      'Boards & Brews Cafe, Jubilee Hills',
    ],
    'settle-in-buddy': [
      'Hitec City Metro Station Hub',
      'Jubilee Hills Checkpost Market',
      'Gachibowli Financial District Plaza',
    ],
    'travel-buddy': [
      'Gachibowli ORR Exit Cafe (Ananthagiri Hills)',
      'Sagar Ring Road Meetup Point',
      'Miyapur Highway Pitstop',
    ],
  },
};

const GENERIC_ACTIVITY_TEMPLATES: Record<ActivityCategory, (cityName: string) => string[]> = {
  'coffee-chat': (city) => [
    `Third Wave Coffee / Specialty Roastery, ${city}`,
    `Blue Tokai / Artisan Espresso Bar, ${city}`,
    `Starbucks Central Plaza, ${city}`,
    `Independent Quiet Garden Cafe, ${city}`,
  ],
  'movie-buddy': (city) => [
    `PVR Cinemas Multiplex, ${city}`,
    `INOX Cinema Hall, ${city}`,
    `Cinepolis City Center Mall, ${city}`,
  ],
  'gym-partner': (city) => [
    `Cult.fit Fitness Center, ${city}`,
    `Gold's Gym Main Branch, ${city}`,
    `Anytime Fitness Hub, ${city}`,
  ],
  'shopping-buddy': (city) => [
    `City Centre Mall Atrium, ${city}`,
    `Main High Street Market Arcade, ${city}`,
    `Central Lifestyle Plaza, ${city}`,
  ],
  'city-guide': (city) => [
    `Central Heritage Square, ${city}`,
    `Historic Landmark Visitor Gate, ${city}`,
    `City Cultural Museum Plaza, ${city}`,
  ],
  'event-plus-one': (city) => [
    `City Auditorium & Cultural Center, ${city}`,
    `Main Exhibition Lawn & Atrium, ${city}`,
    `Open-Air Arts Pavilion, ${city}`,
  ],
  'food-walk': (city) => [
    `Famous Evening Food Street, ${city}`,
    `Central Market Eateries Lane, ${city}`,
    `Mall Food Court & Dessert Strip, ${city}`,
  ],
  'study-buddy': (city) => [
    `Third Wave Coffee Study Tables, ${city}`,
    `Central Public Library Reading Hall, ${city}`,
    `Quiet Book Cafe Corner, ${city}`,
  ],
  'photo-walk': (city) => [
    `Waterfront / Lake Promenade, ${city}`,
    `Central Botanical Garden Trail, ${city}`,
    `Heritage Market Architecture Walk, ${city}`,
  ],
  'comedy-and-shows': (city) => [
    `Downtown Comedy Club & Lounge, ${city}`,
    `Performing Arts Theatre Courtyard, ${city}`,
    `Acoustic Open Mic Cafe, ${city}`,
  ],
  'walk-and-talk': (city) => [
    `Main Botanical / City Park Walkway, ${city}`,
    `Lakefront Walking Promenade, ${city}`,
    `Central Green Trail, ${city}`,
  ],
  'career-chat': (city) => [
    `Third Wave Coffee / Co-Work Cafe, ${city}`,
    `Starbucks Business District, ${city}`,
    `Tech Park / Central Plaza Cafe, ${city}`,
  ],
  'festival-buddy': (city) => [
    `City Mela & Cultural Ground, ${city}`,
    `Central Mall Festive Courtyard, ${city}`,
    `Heritage Festive Market Walk, ${city}`,
  ],
  'sports-partner': (city) => [
    `Municipal Sports & Badminton Complex, ${city}`,
    `Central Pickleball & Turf Courts, ${city}`,
    `City Tennis & Fitness Grounds, ${city}`,
  ],
  'gaming-partner': (city) => [
    `Timezone / Smaaash Arcade, ${city} Mall`,
    `Board Games Lounge & Cafe, ${city}`,
    `Bowling & VR Gaming Arena, ${city}`,
  ],
  'settle-in-buddy': (city) => [
    `Central Market & Metro Hub, ${city}`,
    `Main High Street Essentials Plaza, ${city}`,
    `City Center Transit Square, ${city}`,
  ],
  'travel-buddy': (city) => [
    `Highway Start Cafe Meetup, ${city}`,
    `Scenic Outskirts Trailhead Cafe, ${city}`,
    `Central Bus/Train Transit Coffee Point, ${city}`,
  ],
};

export function normalizeVenueCitySlug(cityInput?: string | null): string {
  const raw = (cityInput || '').trim().toLowerCase();
  if (!raw) return 'chandigarh';

  const bySlugOrName = CITIES.find(
    (c) => c.slug.toLowerCase() === raw || c.name.toLowerCase() === raw
  );
  if (bySlugOrName) return bySlugOrName.slug;

  if (raw.includes('delhi') || raw.includes('gurgaon') || raw.includes('gurugram') || raw.includes('noida') || raw.includes('ncr')) {
    return 'delhi';
  }
  if (raw.includes('bangalore') || raw.includes('bengaluru')) return 'bengaluru';
  if (raw.includes('bombay') || raw.includes('mumbai')) return 'mumbai';
  if (raw.includes('chandigarh')) return 'chandigarh';
  if (raw.includes('mohali')) return 'mohali';
  if (raw.includes('panchkula')) return 'panchkula';
  if (raw.includes('pune')) return 'pune';
  if (raw.includes('hyderabad')) return 'hyderabad';

  return raw;
}

export function getCityDisplayLabel(cityInput?: string | null): string {
  const slug = normalizeVenueCitySlug(cityInput);
  const found = CITIES.find((c) => c.slug === slug);
  if (found) return found.name;
  return cityInput ? cityInput.charAt(0).toUpperCase() + cityInput.slice(1) : 'your city';
}

export function getQuickVenuesForCityAndActivity(
  cityInput: string | null | undefined,
  activitySlug: ActivityCategory
): string[] {
  const citySlug = normalizeVenueCitySlug(cityInput);
  const cityDisplay = getCityDisplayLabel(citySlug);

  const cityMap = CITY_ACTIVITY_VENUES[citySlug];
  if (cityMap) {
    const exactVenues = cityMap[activitySlug];
    if (exactVenues && exactVenues.length > 0) {
      return exactVenues;
    }
  }

  const templateFn =
    GENERIC_ACTIVITY_TEMPLATES[activitySlug] || GENERIC_ACTIVITY_TEMPLATES['coffee-chat'];
  return templateFn(cityDisplay);
}
