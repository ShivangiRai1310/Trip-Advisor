-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: dbms
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `package_id` int NOT NULL,
  `user_id` int NOT NULL,
  `count` int NOT NULL,
  `total_price` int NOT NULL,
  `booking_date` date NOT NULL,
  `travel_date` date NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking_id_UNIQUE` (`booking_id`),
  KEY `package_id_idx` (`package_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `package_id` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,2,5,4,32000,'2020-05-20','2020-06-05','approved'),(2,1,6,2,24000,'2020-06-01','2020-06-25','approved'),(3,2,6,6,48000,'2020-06-04','2020-06-26','approved'),(5,1,16,5,60000,'2020-06-09','2020-06-26','pending'),(6,2,16,2,16000,'2020-06-09','2020-06-17','pending'),(7,1,16,2,24000,'2020-07-12','2020-07-22','pending'),(8,1,16,2,24000,'2020-07-12','2020-07-22','pending'),(9,3,3,1,23000,'2020-07-13','2020-08-02','pending'),(10,3,4,3,69000,'2020-07-14','2020-08-15','pending'),(11,5,3,1,13000,'2020-07-14','2020-07-29','pending'),(12,6,3,1,9000,'2020-07-14','2020-07-24','pending'),(13,1,18,2,24000,'2020-07-15','2020-07-30','pending');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `bookmark_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `place_id` int NOT NULL,
  PRIMARY KEY (`bookmark_id`),
  UNIQUE KEY `bookmark_id_UNIQUE` (`bookmark_id`),
  KEY `user_id_idx` (`userid`),
  KEY `place_id_idx` (`place_id`),
  CONSTRAINT `place_id` FOREIGN KEY (`place_id`) REFERENCES `places` (`place_id`),
  CONSTRAINT `usersid` FOREIGN KEY (`userid`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
INSERT INTO `bookmarks` VALUES (1,5,1),(2,5,2),(3,5,3),(4,16,4),(5,16,5),(6,16,8),(7,16,1),(8,3,4),(9,3,6),(10,3,1),(11,7,1),(12,7,3),(13,7,6),(14,16,2),(15,7,4),(16,7,5),(17,4,2),(18,4,3),(19,4,4),(20,4,5),(21,4,6),(22,6,4),(23,6,5),(24,16,6);
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `location` varchar(45) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE KEY `city_id_UNIQUE` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Varanasi','Uttar Pradesh, India','Varanasi, the spiritual capital of India, is full of soul, history, and significance. For Hindus, it is the ultimate pilgrimage spot. Located on the western bank of the Ganges (Ganga) River, Varanasi is the oldest living city in the world with history dating back to 11th century BC.'),(2,'Kolkata','West Bengal, India','Kolkata (formerly Calcutta) is the capital of India\'s West Bengal state. Founded as an East India Company trading post, it was India\'s capital under the British Raj from 1773–1911. Today it’s known for its grand colonial architecture, art galleries and cultural festivals. It’s also home to Mother House, headquarters of the Missionaries of Charity, founded by Mother Teresa, whose tomb is on site.'),(3,'Srinagar','Jammu and kashmir, India','Ringed by an arc of green mountains, Srinagar\'s greatest drawcard is mesmerisingly placid Dal Lake, on which a bright array of stationary houseboats and shikara (gondola-like boats) add a splash of colour and a unique opportunity for romantic chill-outs. Charming Mughal gardens dot the lake\'s less urbanised eastern shore; while the old town bustles with fascinating Central Asian–style bazaars and a collection of soulful Sufi shrines, as well as a fortress and many historic wooden mosques. Add in a mild summer climate, feisty Kashmiri cuisine and famous local apples, walnuts and almonds, and you have one of India’s top tourist draws.'),(4,'Delhi','Delhi, India','Steeped in history yet overflowing with modern life, colourful, cacophonous Delhi pulsates with the relentless rhythms of humanity like few other cities on Earth.'),(5,'Chandigarh','Chandigarh, India','When Swiss architect Le Corbusier was commissioned with the job of designing Chandigarh from scratch in 1950, he conceived a people-oriented city of sweeping boulevards, lakes, gardens and grand civic buildings, executed in his favourite material: reinforced concrete. Seventy years on and the parks, monuments and civic squares are all still here, albeit somewhat aged.'),(6,'Mumbai','Maharashtra, India','Mumbai, formerly Bombay, is big. It’s full of dreamers and hard-labourers, starlets and gangsters, stray dogs and exotic birds, artists and servants, fisherfolk and crorepatis (millionaires), and lots and lots of people. It has India’s most prolific film industry, some of Asia’s biggest slums (as well as the world’s most expensive home) and the largest tropical forest in an urban zone. Mumbai is India’s financial powerhouse, fashion epicentre and a pulse point of religious tension.'),(7,'Bangalore','Rajasthan, India','mdddddd');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiries` (
  `enquiry_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `contact` bigint NOT NULL,
  `email` varchar(45) NOT NULL,
  `subject` varchar(45) DEFAULT NULL,
  `message` varchar(200) NOT NULL,
  `enquiry_date` date NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`enquiry_id`),
  UNIQUE KEY `enquiry_id_UNIQUE` (`enquiry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiries`
--

LOCK TABLES `enquiries` WRITE;
/*!40000 ALTER TABLE `enquiries` DISABLE KEYS */;
INSERT INTO `enquiries` VALUES (1,'GEETA RAI',9876543210,'abc@gmail.com','abdr','egregreghreh','2020-06-04','reviewed'),(2,'alice',9876543210,'abc@gmail.com','abdr','egregreghreherahetj','2020-06-04','reviewed'),(3,'bob',1122334455,'h@gmail.com','GWEH5H','hjhlagrehhhhhhhhhhhhhhhhhhhhhhhhhh','2020-06-04','pending'),(4,'GEETA RAI',9876543210,'abc@gmail.com','abdr','ffffffffffffffffffffffffffffffffffffff','2020-06-08','pending'),(5,'GEETA RAI',9988675423,'niyati@gmail.com','GWEH5H','fgtejytktk','2020-06-09','pending'),(6,'GEETA RAI',9876543210,'abc@gmail.com','abdr','message','2020-07-15','pending');
/*!40000 ALTER TABLE `enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `cityid` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `location` varchar(45) NOT NULL,
  `duration` varchar(45) NOT NULL,
  `price` int NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`package_id`),
  UNIQUE KEY `package_id_UNIQUE` (`package_id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `city_id_idx` (`cityid`),
  CONSTRAINT `cityid` FOREIGN KEY (`cityid`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,1,'Varanasi Bodhgaya Tour','Uttar Pradesh, India','4 Days - 3 Nights',12000,'This Tour Package is Ideal for those travellers who want to enjoy the hindu Pilgrimage tour of Varanasi & Nearby cities like Allahabad, Ayodhya, Namisharanya, Chitrakoot, Gaya, Bodhgaya. Kashi Yatra through the spiritual heart of India - Varanasi, Allahabad and Bodhgaya. For Hindu devotees, a trip to Kashi or Varanasi is a pinnacle of their spiritual life. Visit the holy river Ganga and witness the Aarti Ceremony. Pay your respects to your ancestors and perform rituals in their memory. Be enchanted by the many temples of Allahabad as well as Triveni Sangam where you have the opportunity to take a holy dip. A pilgrimage center for Buddhists, Bodhgaya is where Lord Buddha attained enlightenment. Refresh your care-worn spirit with this 5-day sojourn and return home with beautiful memories.'),(2,2,'Kolkata: Tour around the city in three days','West Bangal, India','3 Days - 2 Nights',8000,'Holidays are all about the expansion of your horizons. The person who comes back from said holiday should be more enriched, more aware and more fulfilled in their life than the person who went on. There are a few different ways vacations can do this for you. They may give you some thrills, some gorgeous scenery or some knowledge. The experience of going on a vacation with our Kolkata tour packages for 3 days falls into that third category. Kolkata is a historic city, with numerous monuments dotted throughout its expanse. Travel with us and have a comfortable trip around the capital of West Bengal. So go ahead book 2 nights 3 days Kolkata tour packages with us and see the literature city of India. Travel to the majestic city of Kolkata. Explore important cultural and historical landmarks. See the sights of the Howrah Bridge. Discover Writers Building and Pareshnath Jain Temple & much more.'),(3,3,'Charming Kashmir Sightseeing Tour Package','Srinagar, J&K, India','7 Days & 6 Nights',23000,' A typical package in Kashmir covers the cities of Srinagar, Sonmarg, Pahalgam, and Gulmarg. You can go for sightseeing, and make your tour a memorable affair amidst mighty, snowy peaks. From shikara rides and houseboats to Gondola rides and nature walks, there are a myriad of things to do in Kashmir that make it magical.'),(4,4,'Phenomenal Delhi Agra Tour Package','Delhi, India','4 Days & 3 Nights',11000,'North India is the land of breathtaking beauty and spiritual bliss! What could be more amazing than a journey to the historic capital of India, New Delhi alongwith the chance to witness the wonder of the world - Taj Mahal! Explore Delhi Agra on this splendid tour and make incredible memories.'),(5,5,'Chandigarh Kasauli Tour Package','Chandigarh, India','4 Days - 3 Nights',13000,'Kasauli is famous amongst avid hikers and it has been a wonderful holiday destination for all kinds of travellers from within the country and abroad. Chandigarh, the beautiful capital of Punjab and Haryana was designed by a Swiss-French architect Le Corbusier. One can explore the beauty of Kasauli & Chandigarh by booking Chandigarh Kasauli tour package.'),(6,6,'Mumbai Is A Marvel To Behold','Mumbai, Maharashtra, India','3 Days - 2 Nights',9000,'As the city is growing every day, it allows the visitors to enjoy the nightlife especially in the country like India where nightlife barely exists. The Mumbai itinerary for 3 days will simply make you think big. So, book our 2 nights 3 days Mumbai tour packages, and get ready to explore every aspect of this city like a local in a weekend trip.');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `places` (
  `place_id` int NOT NULL AUTO_INCREMENT,
  `city_id` int NOT NULL,
  `place_name` varchar(45) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `latitude` varchar(45) NOT NULL,
  `longitude` varchar(45) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`place_id`),
  UNIQUE KEY `place_id_UNIQUE` (`place_id`),
  KEY `city_id_idx` (`city_id`),
  CONSTRAINT `city_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `places`
--

LOCK TABLES `places` WRITE;
/*!40000 ALTER TABLE `places` DISABLE KEYS */;
INSERT INTO `places` VALUES (1,1,'Assi Ghat','Banks of the holy ganges river','25.289322','83.006499','Assi Ghat is the southernmost ghat in Varanasi. To most visitors to Varanasi, it is known for being a place where long-term foreign students, researchers, and tourists live. Assi Ghat is one of the ghats often visited for recreation and during festivals. On typical days about 300 people visit every hour in the mornings, and on festival days 2500 people arrive per hour. Most of the people visiting the ghat on usual days are students from the nearby Banaras Hindu University. The ghat accommodates about 22,500 people at once during festivals like Shivratri.'),(2,1,'Sarnath','Varanasi, Uttar Pradesh','25.380786','83.025792','Explore Sarnath, an important Buddhist pilgrimage destination, where Buddha made his first sermon. Visit temples, stupas and monuments, famous tourist attractions in the area, and pilgrimage spots. Listen to heartwarming stories of the famous temples that will help you understand Sarnath and local life. Meditate in the park after experiencing all the knowledge you\'ve acquired during your pilgrimage.'),(3,1,'Kashi Vishwanath','Heart of the city Varanasi','25.311061','83.010694','Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The Temple stands on the western bank of the holy river Ganga, and is one of the twelve Jyotirlingas, the holiest of Shiva Temples. The main deity is known by the names Shri Vishwanath and Vishweshwara (IAST: Vishveshvara) literally meaning Lord of the Universe. Varanasi city is also called Kashi in ancient time, and hence the Temple is popularly called as Kashi Vishwanath Temple. The etymology of the name Vishveshvara is Vishva: Universe, Ishvara: lord, one who has dominion.'),(4,2,'Howrah Bridge','Links two cities, Howrah and Kolkata (Calcutta)','22.580416','88.339416','Howrah Bridge is a 705m-long abstraction of shiny steel cantilevers and rivets, which serves as a carriageway of nonstop human and motorised traffic across the Hooghly River. Built during WWII, it’s one of the world’s busiest bridges and a Kolkatan architectural icon.'),(5,2,'Victoria Memorial','Queen\'s Way, Kolkata, West Bengal, India','22.544956','88.342554','The incredible Victoria Memorial is a vast, beautifully proportioned festival of white marble: think US Capitol meets Taj Mahal. Had it been built for a beautiful Indian princess rather than a colonial queen, this domed beauty flanking the southern end of the Maidan would surely be considered one of India’s greatest buildings. Commissioned by Lord Curzon, then Viceroy of India, it was designed to commemorate Queen Victoria’s demise in 1901, but construction wasn’t completed until 20 years after her death.'),(6,2,'Indian Museum','Jawaharlal Nehru Road, Park Street, Kolkata','22.557586','88.351034','India\'s biggest and oldest major museum celebrated its bicentenary in February 2014. It\'s mostly a lovably old-fashioned place that fills a large colonnaded palace ranged around a central lawn. Extensive exhibits in various galleries include fabulous sculptures dating back two millennia (notably the lavishly carved 2nd-century-BC Bharhut Gateway), Egyptian mummies, relics from the ancient Indus Valley civilisation of Harappa and Mohenjo-daro, pickled human embryos, dangling whale skeletons and some 37 types of opium in the library-like commercial botany gallery.'),(7,2,'Science City','JBS Haldane Avenue, Basanti Hwy, Kolkata','22.539925','88.39581','The Science City, one of its kind in India, inaugurated on 1st July,1997 has been developed as a major attraction for the residents’ of Kolkata as well as for the national and international visitors to the metropolis. Developed by the National Council of Science Museums, it is one of the largest and finest in the world, presenting science and technology in a stimulating and engaging environment that is truly educational and enjoyable for the people of all ages. It has, over the years, become a place for memorable experience and enjoyment for both the young and the old.'),(8,2,'Marble Palace','Raja Katra, Machuabazar, Kolkata','22.582378 ','88.360143','Built in 1835 by a raja from the prosperous Mallick family, this resplendent mansion is as grand as it is curious. Its marble-draped halls are overstuffed with dusty statues of thinkers and dancing girls, much Victoriana, ample Belgian glassware, game trophies and fine paintings, including originals by Murillo, Reynolds and Rubens.Of particular note within the building is the music room, with its lavish floor of marble inlay, where Napoleons beat Wellingtons three to one. The ballroom retains its vast array of candle chandeliers with globes of silvered glass to spread illumination (original 19th-century disco balls!). There\'s also a private menagerie on the mansion\'s grounds, dating back to the early years, which is home to a few monkey and bird species.');
/*!40000 ALTER TABLE `places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `places_id` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `rating` int NOT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `review_id_UNIQUE` (`review_id`),
  KEY `userid_idx` (`users_id`),
  KEY `places_id_idx` (`places_id`),
  CONSTRAINT `places_id` FOREIGN KEY (`places_id`) REFERENCES `places` (`place_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `users_id` FOREIGN KEY (`users_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,6,4,'Iconic bridge','The iconic bridge .It\'s electrical colour effect on night is very astonishing. Do visit the bridge after 6:30 pm in winter or after 7:15 pm in summer',5),(2,7,4,'Hangout with family and friends','Good Place To Hangout And Walk With Friends And Family',4),(3,5,4,'Nice weather and atmosphere','Soothing weather and pleasant condition seemed at night',4),(4,3,5,'Historic significance.','Showcasing how British enjoyed on the Indian money and people.',5),(5,16,5,'Architectural beauty.','Kolkata\'s Pride. One of the best architectural heritage sites in India.',4),(6,4,5,'Peaceful gardens.','Awsome historical place with exotic garden space for family',4),(7,6,6,'Egyptian, zoology and geology section','Most interesting section is Egyptian section, zoology and geology. Also the arts section has many important sculptures. Well maintained place. One day is required to visit the whole place.',4),(8,15,6,'Oldest holding glorious past','Probably the Oldest in India and also one of the Biggest. Built around 1814-15, this place holds much treasures from our glorious past',5),(9,16,6,'Geology and Zoology section','There were just 2 sections which I found interesting and worth the visit. Those are the geology and zoology sections in the ground and first floor respectively',4),(10,3,7,'Educative, good for students','This is really a very gud place for students.Its very informative and educative for young generation',5),(11,7,7,'Science Center','The Science City of Kolkata is the largest science centre in the Indian Subcontinaltal',5),(12,4,7,'Good experience','Wonderful place for students.staffs are good behaved. But one thing I have to mention is that the food quality and the behavior of the caterer is very bad',3),(13,5,8,'Hangout with family and friends','Wonderful place for hangout with family and friends.fine atmosphere',4),(14,16,8,'Bad service','Great 2 see our history...service from staff very bad',3),(15,15,8,'Food Court','Awesome place with huge collection, my suggestion is add a food court.',4),(16,16,1,'Students, researchers and travelers','It is an amazing and most peaceful place where students, researchers and travelers.',5),(17,5,1,'Divine feeling',' An early morning aarti of holy Ganges.. chanting of shlokas, full fledged aarti with bells ringing and ending with universal  होम for world peace.. a divine feeling. ',4),(18,3,1,'Pleasing sunrise','Sight of sunrise is pleasing.. yoga enthusiasts can follow up with yoga too..In winters get a chance to meet the migratory guests too.',4),(19,4,2,'Well maintained','Very beautifully maintained and excellent facilities provided by the ASI and the Govt of India. Very impressed!',5),(20,5,2,'Neat and clean','The information provided is good. The place is neat and clean. A nominal fee is taken as entry charges.',4),(21,6,2,'Unity in Diversity','The museum is excellent. The highlight being the Ashok Chakra. It’s amazing to know that the national emblem is an integration of Buddhist philosophies. Truly unity in Diversity!',4),(22,7,3,'Blessed and happy','Felt blessed and happy after visiting here . Temple is very good . Will love to visit here . Most visit place in Varanasi.',5),(23,4,3,'Oldest Shiv temple','I loved my time here, it is one of the oldest Shiv temple and is a different experience.',4),(24,15,3,'Powerful, Spiritual Energy','One of the most important shrine of lord Shiva. A must visit for Hindus. An important jyotirlinga. The energy here is too powerful, if you can feel.. just you can get the shower of the same.',5),(27,16,8,'titleeee','mesaage nice',4);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `contact` bigint NOT NULL,
  `password` varchar(300) NOT NULL,
  `email` varchar(45) NOT NULL,
  `user_type` varchar(45) NOT NULL,
  `reg_date` date NOT NULL,
  `updation_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Shivangi',1234567890,'$2a$08$EcSSUhAjRvMJATpmTuKKhumG2Noan8tvEa8yX7PTl0Lv2MLUItuAa','rai213755@gmail.com','admin','2020-05-18',NULL),(2,'Sandhya',7788995532,'$2a$08$EcSSUhAjRvMJATpmTuKKhumG2Noan8tvEa8yX7PTl0Lv2MLUItuAa','sandhyakrishnat@gmail.com','admin','2020-05-18',NULL),(3,'Harry',9876452301,'123456','harry@gmail.com','general','2020-05-18','2020-07-14'),(4,'Sophia',9876543210,'$2a$08$lXqOsrXy/SlsAF.xUr0s3e2YyZrH6BHTDS3ykjMh4zDgkJkMH0MFS','sophia@rediffmail.com','general','2020-05-19','2020-05-19'),(5,'Alice',9988675423,'$2a$08$lXqOsrXy/SlsAF.xUr0s3e2YyZrH6BHTDS3ykjMh4zDgkJkMH0MFS','alice@yahoo.com','general','2020-05-19','2020-05-19'),(6,'Bob',9876452301,'$2a$08$lXqOsrXy/SlsAF.xUr0s3e2YyZrH6BHTDS3ykjMh4zDgkJkMH0MFS','bob@gmail.com','general','2020-05-19','2020-05-19'),(7,'Lucy',9988998899,'$2a$08$EcSSUhAjRvMJATpmTuKKhumG2Noan8tvEa8yX7PTl0Lv2MLUItuAa','lucyOfficial@gmail.com','general','2020-05-19','2020-05-21'),(15,'Jack',9988675423,'$2a$08$.2Ib0wGBts31/KtbcszYqe3Jlp03A5pTwZTrj1knFsVOQrQlcVtiO','jackky@gmail.com','general','2020-05-23','2020-05-23'),(16,'test',9876543210,'$2a$08$ayHS396DsAsR.YpCSU8lZu5ZjimiuglCWtTnYEDRNIDTWepX6g22u','test@gmail.com','general','2020-05-23','2020-07-15'),(18,'admin1',9876543210,'$2a$08$62Ea0ZRGk/h8WoodV9Lcv.7cJZBR2RReakBL/MgoFSzUJUA1E57mW','abc@gmail.com','admin','2020-05-23','2020-07-15'),(21,'Elon',8060776654,'$2a$08$scfjw6nS3XVF/qSW7bjJT.U.1C4Zosqb.H5Hd9o4AW4tuc.duaSqa','elon@yahoo.com','general','2020-07-14','2020-07-14'),(23,'abc',1122334455,'$2a$08$qASrzm/SNmi0UWl.nSQRqOZdEFsoNRH4rsHu9JB9D5s.B3fVWawz2','abc@gmail.com','general','2020-07-15','2020-07-15');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-12 23:51:31
