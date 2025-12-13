export interface MetaData {
  title?: string;
  titleSuffix?: string;
  description: string;
  longDescription: string;
  cardImage: string;
  keywords: string[];
  allowSearch?: boolean;
}

export const siteConfig = {
  site: {
    devPort: 4321,
    site: "https://your-website.com",
    base: "/dark-matter",
    showHomeHero: true,
    allowThemeToggle: true,
    defaultTheme: "dark"
  },
  personal: {
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    githubProfile: "https://github.com",
    twitterProfile: "https://twitter.com",
    linkedinProfile: "https://linkedin.com/"
  },
  global: {
    title: "John Doe",
    navBarTitle: "John Doe",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"]
  },
  posts: {
    titleSuffix: "Posts",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"],
  },
  projects: {
    titleSuffix: "Projects",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"],
  },
  notes: {
    titleSuffix: "Notes",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"],
  },
  cv: {
    titleSuffix: "CV",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"],
    allowSearch: false,
    publish: ["general", "special"]
  },
  search: {
    titleSuffix: "Search",
    description: "",
    longDescription: "",
    cardImage: "/card-image.webp",
    keywords: ["web development", "design", "technology"],
  },
  notFound: {
    titleSuffix: "404",
    description: "The page you are looking for does not exist.",
    longDescription: "The page you are looking for does not exist.",
    allowSearch: false,
    cardImage: "/card-image.webp",
  },
  homeHero: {
    title: ["Software Developer.", "Robotics Enthusiast.", "Olympic Athlete.", "Dork."],
    subtitle: "This is a profound defining statement.",
  },
  aboutHero: {
    title: "Hi, I'm John",
    subtitle: "I'm a software developer and this is my page",
    image: "/hero.webp",
  },
  texts: {
    postsName: "Posts",
    projectsName: "Projects",
    cvName: "cv",
    viewAll: "View All",
    noPosts: "No posts found.",
    noProjects: "No projects found."
  },
  menu: {
    // nav_bar_name: "path/to/page",
    posts: "posts",
    projects: "projects",
    cv: "cv/general",
    about: "about",
    search: "search"
  }
};
