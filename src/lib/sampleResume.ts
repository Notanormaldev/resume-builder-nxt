import { IResume } from "@/types/resume.type";

export const SAMPLE_RESUME: Partial<IResume> = {
  title: "Alex Morgan - Senior Full Stack Engineer",
  summary:
    "Senior Full Stack Engineer with 6+ years of experience architecting resilient cloud-native applications and scalable microservices. Proven expertise across React, Next.js, Node.js, TypeScript, and AWS. Spearheaded engineering transformations that decreased page load latency by 45% and reduced system infrastructure costs by $180k annually.",
  PersonalInfo: {
    fullname: "Alex Morgan",
    email: "alex.morgan.dev@example.com",
    mobile: "+1 (555) 234-8901",
    location: "San Francisco, CA",
    github: "github.com/alexmorgan-dev",
    linkdin: "linkedin.com/in/alexmorgan",
    portfolio: "alexmorgan.tech",
  },
  Education: [
    {
      institute: "University of California, Berkeley",
      degree: "B.S. in Computer Science & Engineering",
      startdate: "2016",
      enddate: "2020",
    },
  ],
  WorkExp: [
    {
      company: "Stripe",
      position: "Senior Software Engineer",
      startdate: "2022",
      enddate: "Present",
      description:
        "Architected enterprise payment gateway integrations processing over $50M daily transactions. Mentored junior engineers and led the migration of legacy services to serverless Next.js edge functions, boosting reliability to 99.99%.",
    },
    {
      company: "Vercel Partner Labs",
      position: "Full Stack Engineer",
      startdate: "2020",
      enddate: "2022",
      description:
        "Developed high-throughput dashboard microservices using Node.js, GraphQL, and Redis. Implemented automated CI/CD pipelines cut deployment cycle times by 60%.",
    },
  ],
  Projects: [
    {
      title: "CloudPulse - Real-time Distributed Monitoring",
      description:
        "Built a distributed event-streaming monitoring dashboard handling 100k events/sec with sub-second alert dispatching.",
      techStack: ["Next.js", "TypeScript", "Kafka", "Tailwind CSS", "Go"],
      githuburl: "https://github.com/alexmorgan/cloudpulse",
      liveurl: "https://cloudpulse.demo.app",
    },
    {
      title: "FlowAI - Automated Resume Intelligence",
      description:
        "Engineered an ATS-friendly analysis pipeline leveraging LLMs to evaluate resume keywords, formatting, and structural strengths.",
      techStack: ["React", "Node.js", "Gemini API", "MongoDB"],
      githuburl: "https://github.com/alexmorgan/flowai",
      liveurl: "https://flowai.example.com",
    },
  ],
  skills: [
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "GraphQL",
    "Tailwind CSS",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Microservices",
    "RESTful APIs",
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate",
    "Certified Kubernetes Administrator (CKA)",
  ],
  acheivements: [
    "Won 1st Place at Berkeley HackTech 2019 among 250+ competing teams",
    "Author of open-source Next.js caching library with 3,500+ GitHub stars",
  ],
};

