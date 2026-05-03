import {
  Camera,
  CheckCircle2,
  Clapperboard,
  Code2,
  GraduationCap,
  Languages,
  Mic,
  Palette,
  PenTool,
  Search,
  UserPlus,
} from "lucide-react"

export const categories = [
  { name: "Graphic Design", icon: Palette },
  { name: "Translation", icon: Languages },
  { name: "Development", icon: Code2 },
  { name: "Writing", icon: PenTool },
  { name: "Tutoring", icon: GraduationCap },
  { name: "Video Editing", icon: Clapperboard },
  { name: "Photo Editing", icon: Camera },
  { name: "Audio & Voice", icon: Mic },
]

export const steps = [
  {
    title: "Create an account",
    description:
      "Sign up as a buyer or freelancer, then build your profile in a few minutes.",
    icon: UserPlus,
  },
  {
    title: "Find or offer work",
    description:
      "Browse services or publish your own with clear pricing and delivery details.",
    icon: Search,
  },
  {
    title: "Get it done",
    description:
      "Chat, deliver, and review everything in one clean workspace.",
    icon: CheckCircle2,
  },
]

export const stats = [
  { value: "12K+", label: "services" },
  { value: "4.9", label: "avg rating" },
  { value: "8", label: "categories" },
  { value: "2k+", label: "active freelancers" },
]