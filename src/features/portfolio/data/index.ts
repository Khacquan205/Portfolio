export const projects = [
  {
    id: "01",
    title: "Point Of Sale Systems",
    description: "Hệ thống POS cho bán lẻ với logic nghiệp vụ phức tạp, quản lý kho và phân quyền theo vai trò.",
    tags: ["Node.js", "React Native", "REST API", "PostgreSQL"],
    iconUrl: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
    highlights: [
      "Node.js backend & React Native",
      "Complex retail business logic",
      "Role-based REST APIs",
    ],
    website: null as string | null,
    docs: null as string | null,
  },
  {
    id: "02",
    title: "Real-time Restaurant KDS",
    description: "Kitchen Display System với WebSocket đồng bộ hai chiều, Redis caching và SSR cho hiệu năng tối ưu.",
    tags: ["WebSocket", "Redis", "Next.js", "TanStack Query"],
    iconUrl: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
    highlights: [
      "Layered API with Redis caching",
      "WebSocket bi-directional sync",
      "SSR/SSG & TanStack Query",
    ],
    website: null as string | null,
    docs: null as string | null,
  },
  {
    id: "04",
    title: "InMap — Indoor Navigation",
    description: "Hệ thống định vị & chỉ đường trong nhà thông minh với sơ đồ ERD tương tác, tài liệu kỹ thuật đầy đủ và nhật ký họp mentor.",
    tags: ["MongoDB", "Node.js", "Graph Algorithm", "HTML5"],
    iconUrl: "",
    highlights: [
      "Indoor wayfinding & location system",
      "Interactive ERD visualizer (16 collections)",
      "6-chapter technical documentation",
    ],
    website: null as string | null,
    docs: "/projects/inmap",
  },
  {
    id: "03",
    title: "EcoRent Platform",
    description: "Nền tảng thuê xe với KYC onboarding bằng OCR, chat realtime SignalR và tích hợp thanh toán VNPay.",
    tags: ["Next.js 16", "SignalR", "VNPay", "OCR"],
    iconUrl: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
    highlights: [
      "Next.js 16 App Router",
      "KYC onboarding with OCR",
      "SignalR chat & VNPay",
    ],
    website: null as string | null,
    docs: null as string | null,
  },
];

export const techStack = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

export const experience = [
  {
    review: "Adrian brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review: "Adrian’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2020 - December 2023",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review: "Adrian’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "React Native Developer",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

export const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review: "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review: "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review: "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review: "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review: "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review: "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];
