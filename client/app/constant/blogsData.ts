export interface BlogPost {
  id: string
  title: string
  slug: string
  date: string
  author: string
  excerpt: string
  readTime: number
  coverImage: string
  content: string[] // Array of paragraphs for now, will be replaced with TipTap content
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Mountain Bike Maintenance',
    slug: 'ultimate-guide-mountain-bike-maintenance',
    date: '2023-05-15',
    author: 'Alex Johnson',
    excerpt:
      'Learn how to keep your mountain bike in top condition with our comprehensive maintenance guide covering everything from basic cleaning to advanced repairs.',
    readTime: 8,
    coverImage: '/placeholder.svg?height=600&width=800',
    content: [
      "Regular maintenance is crucial for keeping your mountain bike performing at its best and ensuring your safety on the trails. In this comprehensive guide, we'll cover everything you need to know about maintaining your mountain bike, from basic cleaning routines to more advanced repairs.",
      "First, let's talk about cleaning. After every ride, especially muddy ones, you should clean your bike thoroughly. Start by rinsing off any mud or debris with a gentle stream of water. Avoid using high-pressure water as it can force water into sensitive components like bearings and seals.",
      'Next, use a bike-specific cleaner and a soft brush to clean the frame, wheels, and drivetrain. Pay special attention to the chain, cassette, and derailleurs, as these components collect the most dirt and grime. After cleaning, dry your bike with a clean cloth to prevent rust.',
      'Chain maintenance is perhaps the most important aspect of bike care. A well-lubricated chain shifts better, runs quieter, and lasts longer. After cleaning your chain, apply a quality bike-specific lubricant. Let it sit for a few minutes, then wipe off any excess with a clean cloth.',
      "Tire pressure is another critical factor in your bike's performance. Check your tire pressure before every ride and adjust it according to the terrain you'll be riding on. Lower pressure provides better traction on rough terrain, while higher pressure reduces rolling resistance on smoother surfaces.",
      'Brake maintenance is essential for your safety. Regularly check your brake pads for wear and replace them when they get too thin. Also, check your brake fluid levels if you have hydraulic brakes, and bleed them if necessary.',
      'Suspension maintenance is often overlooked but is crucial for a smooth ride. Clean your suspension stanchions after every ride and check for any leaks or unusual noises. Depending on how often you ride, you should service your suspension every 50-100 hours of riding.',
      "By following these maintenance tips, you'll not only extend the life of your mountain bike but also enhance your riding experience with a smoother, more reliable bike.",
    ],
    tags: ['Maintenance', 'Mountain Biking', 'Tips'],
  },
  {
    id: '2',
    title: 'Choosing the Right Road Bike for Your Needs',
    slug: 'choosing-right-road-bike',
    date: '2023-06-22',
    author: 'Sarah Miller',
    excerpt:
      'With so many options available, finding the perfect road bike can be overwhelming. This guide will help you understand the key factors to consider when making your choice.',
    readTime: 6,
    coverImage: '/placeholder.svg?height=600&width=800',
    content: [
      'Choosing the right road bike is a crucial decision that can significantly impact your cycling experience. With numerous brands, models, and specifications available, the process can be overwhelming. This guide aims to simplify the decision-making process by highlighting the key factors to consider.',
      "First, determine your budget. Road bikes can range from a few hundred to several thousand dollars. While it's tempting to go for the cheapest option, remember that a quality road bike is an investment that can provide years of enjoyment and health benefits.",
      "Next, consider the type of riding you'll be doing. Are you planning to race, ride long distances, commute, or just ride casually? Different types of road bikes are designed for different purposes. For instance, endurance bikes are designed for comfort over long distances, while race bikes prioritize speed and aerodynamics.",
      "Frame material is another important consideration. Aluminum frames are lightweight, stiff, and affordable, making them a popular choice for entry-level bikes. Carbon fiber frames are lighter and offer better vibration damping, but they're more expensive. Steel and titanium frames are also options, each with their own pros and cons.",
      'Component quality is also crucial. The drivetrain (gears, chain, etc.) and brakes are the most important components. Higher-quality components shift more smoothly, brake more effectively, and last longer. Shimano, SRAM, and Campagnolo are the main component manufacturers, each offering several tiers of quality.',
      "Fit is perhaps the most important factor. A bike that doesn't fit properly can cause discomfort, pain, and even injury. Most bike shops offer fitting services to help you find the right size and adjust the bike to your body.",
      "Finally, test ride several bikes before making a decision. Pay attention to how the bike feels, how it handles, and how comfortable you are. A bike might look great on paper, but if it doesn't feel right when you ride it, it's not the right bike for you.",
      "By considering these factors, you'll be well on your way to finding the perfect road bike for your needs. Remember, the best bike is the one that you enjoy riding and that encourages you to ride more often.",
    ],
    tags: ['Road Biking', 'Buying Guide', 'Tips'],
  },
  {
    id: '3',
    title: 'Exploring the Benefits of E-Bikes',
    slug: 'benefits-of-e-bikes',
    date: '2023-07-10',
    author: 'Michael Chen',
    excerpt:
      'Electric bikes are revolutionizing the cycling world. Discover the many benefits they offer and why they might be the perfect choice for your next bike purchase.',
    readTime: 5,
    coverImage: '/placeholder.svg?height=600&width=800',
    content: [
      'Electric bikes, or e-bikes, have been gaining popularity in recent years, and for good reason. These innovative machines combine the health benefits of traditional cycling with the convenience of motorized transportation, offering a unique and versatile riding experience.',
      'One of the primary benefits of e-bikes is their ability to make cycling more accessible. The electric motor provides assistance when pedaling, making it easier to tackle hills, ride longer distances, or keep up with faster riders. This can be particularly beneficial for older riders, those with physical limitations, or anyone who wants to enjoy cycling without the full physical exertion.',
      'E-bikes also offer environmental benefits. As a form of active transportation, they can replace car trips, reducing carbon emissions and traffic congestion. While they do require electricity to charge, the amount is minimal compared to the energy consumption of a car.',
      'From a health perspective, e-bikes still provide a good workout. Research has shown that e-bike riders still get moderate exercise, and they often ride more frequently and for longer distances than they would on a traditional bike. This increased activity can lead to improved cardiovascular health, better mental well-being, and weight management.',
      "E-bikes can also be a cost-effective transportation option. While the initial investment is higher than a traditional bike, the ongoing costs are minimal. There's no need for gas, insurance is typically not required, and maintenance costs are generally lower than for a car.",
      "The versatility of e-bikes is another significant advantage. Whether you're commuting to work, running errands, exploring trails, or just riding for fun, there's an e-bike designed for that purpose. From city bikes to mountain bikes, folding bikes to cargo bikes, the options are vast.",
      'Finally, e-bikes are just plain fun to ride. The boost from the motor can make you feel like you have superpowers, allowing you to ride faster and farther with less effort. This enjoyment factor can lead to more frequent riding and a greater appreciation for cycling.',
      "As technology continues to improve and prices become more accessible, e-bikes are likely to become an increasingly common sight on our roads and trails. Whether you're a seasoned cyclist looking for a new experience or a newcomer to the world of biking, an e-bike could be a fantastic option to consider.",
    ],
    tags: ['E-Bikes', 'Technology', 'Sustainability'],
  },
  {
    id: '4',
    title: 'Essential Cycling Gear for Beginners',
    slug: 'essential-cycling-gear-beginners',
    date: '2023-08-05',
    author: 'Emma Thompson',
    excerpt:
      'New to cycling? This guide covers all the essential gear you need to get started safely and comfortably, from helmets to bike lights and everything in between.',
    readTime: 7,
    coverImage: '/placeholder.svg?height=600&width=800',
    content: [
      "Starting your cycling journey is an exciting time, but it can also be overwhelming when you consider all the gear that's available. This guide will help you navigate the essentials, ensuring you're safe, comfortable, and ready to enjoy your rides.",
      "First and foremost, a quality helmet is non-negotiable. It's your most important piece of safety equipment, protecting your head in case of a fall or collision. Look for a helmet that meets safety standards, fits well, and is comfortable to wear. Many modern helmets also feature MIPS (Multi-directional Impact Protection System) technology for enhanced protection.",
      "Proper clothing can significantly enhance your cycling experience. While you don't need to invest in full lycra kit right away, moisture-wicking shirts and padded cycling shorts can make longer rides much more comfortable. For cooler weather, consider layering with a windproof jacket, and for rain, a waterproof jacket and pants are invaluable.",
      'Cycling shoes and pedals are another consideration. For beginners, flat pedals with grippy athletic shoes are perfectly fine. As you progress, you might want to explore clipless pedals and cycling-specific shoes, which can improve efficiency and power transfer.',
      "Visibility is crucial for safety, especially if you'll be riding on roads. Invest in front and rear lights, even if you don't plan to ride after dark. Many accidents occur during dawn, dusk, or in poor weather conditions when visibility is reduced. Reflective clothing or accessories can also help you be seen by motorists.",
      "A water bottle and cage are essential for staying hydrated during your rides. For longer rides, you might also want to carry snacks in a saddle bag or jersey pocket. Speaking of saddle bags, they're great for carrying repair essentials like a spare tube, tire levers, and a multi-tool.",
      "A quality lock is necessary if you'll be leaving your bike unattended. U-locks offer the best security, though they're heavier than cable locks. Consider your needs and the security risk in your area when choosing a lock.",
      "Finally, don't forget about maintenance supplies. A floor pump with a pressure gauge for home use, a portable pump or CO2 inflator for on-the-go, and chain lubricant are all useful to have.",
      "Remember, you don't need to buy everything at once. Start with the essentials for safety and comfort, then gradually add to your gear collection as you spend more time on the bike and better understand your specific needs and preferences.",
    ],
    tags: ['Beginners', 'Gear', 'Safety'],
  },
  {
    id: '5',
    title: "The Rise of Gravel Biking: Why It's Taking Over the Cycling World",
    slug: 'rise-of-gravel-biking',
    date: '2023-09-18',
    author: 'David Wilson',
    excerpt:
      'Gravel biking has exploded in popularity in recent years. Discover what makes this versatile discipline so appealing and why it might be the perfect cycling style for you.',
    readTime: 6,
    coverImage: '/placeholder.svg?height=600&width=800',
    content: [
      "Gravel biking, a discipline that combines elements of road cycling and mountain biking, has seen an exponential rise in popularity over the past few years. This trend isn't just a passing fad; it represents a fundamental shift in how many cyclists approach the sport, offering a blend of adventure, versatility, and accessibility that appeals to a wide range of riders.",
      'At its core, gravel biking is about exploration and freedom. Unlike road cycling, which is confined to paved surfaces, or mountain biking, which requires technical trails, gravel biking opens up a vast network of unpaved roads, forest service roads, and mild trails. This expanded terrain allows riders to create routes that avoid heavy traffic, discover new landscapes, and enjoy a more peaceful riding experience.',
      "The bikes themselves are a testament to versatility. Gravel bikes feature a geometry that's more relaxed than a road bike but more aggressive than a mountain bike, making them comfortable for long distances while still being responsive and fun to ride. They have clearance for wider tires, which provide better traction and comfort on rough surfaces, and often include mounting points for racks and bags, enabling everything from daily commuting to multi-day bikepacking adventures.",
      'The inclusive nature of gravel biking is another key factor in its popularity. Gravel events and races often emphasize participation and completion over competition, creating a welcoming atmosphere for riders of all abilities. The varied terrain also means that technical skill can sometimes trump pure fitness, leveling the playing field and making the sport more accessible to a broader range of cyclists.',
      'From a practical standpoint, gravel biking offers a safer alternative to road cycling in many areas. With increasing traffic and distracted driving, many road cyclists have turned to gravel to avoid the risks associated with sharing the road with motor vehicles. The slower speeds and softer landing surfaces of gravel riding also tend to result in less severe injuries when falls do occur.',
      "The adventure aspect of gravel biking cannot be overstated. There's something inherently exciting about venturing off the beaten path, not knowing exactly what conditions you'll encounter, and relying on your own skills and preparation to complete a route. This sense of adventure has been particularly appealing during the COVID-19 pandemic, as people sought outdoor activities that allowed for social distancing.",
      'The industry has responded enthusiastically to the gravel trend, with virtually every major manufacturer now offering at least one gravel-specific model. This has led to rapid innovation in bike design, components, and accessories, further fueling the growth of the discipline.',
      "Whether you're a seasoned cyclist looking for a new challenge, a beginner seeking a versatile first bike, or someone returning to cycling after time away, gravel biking offers an appealing blend of adventure, safety, and community. As the infrastructure for gravel cycling continues to develop, with more events, dedicated routes, and supportive communities emerging, it's likely that this discipline will continue to grow and evolve in the coming years.",
    ],
    tags: ['Gravel Biking', 'Trends', 'Adventure'],
  },
]
