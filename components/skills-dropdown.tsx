"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Sparkles, CheckCircle2, Type, Zap, Wrench, Palette } from "lucide-react"
import { useClickAway } from "@/hooks/use-click-away"

export interface Skill {
  id: string
  label: string
  icon: React.ElementType
  color: string
  description: string
  enabled: boolean
}

interface SkillsDropdownProps {
  skills: Skill[]
  onSkillToggle: (skillId: string) => void
  className?: string
}

const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}: { icon: React.ElementType; isHovered: boolean; color: string }) => (
  <motion.div className="w-4 h-4 mr-2 relative" initial={false} animate={isHovered ? { scale: 1.2 } : { scale: 1 }}>
    <Icon className="w-4 h-4" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </motion.div>
    )}
  </motion.div>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
}

export default function SkillsDropdown({ skills, onSkillToggle, className }: SkillsDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoveredSkill, setHoveredSkill] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const enabledCount = skills.filter(s => s.enabled).length

  // Handle click outside to close dropdown
  useClickAway(dropdownRef, () => setIsOpen(false))

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn("relative w-full max-w-sm", className)} ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-400",
            "hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-200",
            "focus:ring-2 focus:ring-blue-500 dark:focus:ring-neutral-700 focus:ring-offset-2",
            "transition-all duration-200 ease-in-out",
            "border border-gray-200 dark:border-neutral-700",
            "h-10",
            isOpen && "bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-200",
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Refinement Skills ({enabledCount} active)
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className={cn(
                  "w-full rounded-lg border border-gray-200 dark:border-neutral-800",
                  "bg-white dark:bg-neutral-900 p-1 shadow-lg"
                )}
                initial={{ borderRadius: 8 }}
                animate={{
                  borderRadius: 12,
                  transition: { duration: 0.2 },
                }}
                style={{ transformOrigin: "top" }}
              >
                <motion.div className="py-2 relative" variants={containerVariants} initial="hidden" animate="visible">
                  {skills.map((skill) => (
                    <motion.button
                      key={skill.id}
                      onClick={() => {
                        onSkillToggle(skill.id)
                      }}
                      onHoverStart={() => setHoveredSkill(skill.id)}
                      onHoverEnd={() => setHoveredSkill(null)}
                      className={cn(
                        "relative flex w-full items-center justify-between px-4 py-3 text-sm rounded-md",
                        "transition-all duration-150",
                        "focus:outline-none",
                        "hover:bg-gray-100 dark:hover:bg-neutral-800",
                        skill.enabled && "bg-gray-50 dark:bg-neutral-800/50",
                        hoveredSkill === skill.id
                          ? "text-gray-900 dark:text-neutral-200"
                          : "text-gray-600 dark:text-neutral-400"
                      )}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      <div className="flex items-center flex-1">
                        <IconWrapper
                          icon={skill.icon}
                          isHovered={hoveredSkill === skill.id}
                          color={skill.color}
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{skill.label}</span>
                          <span className="text-xs text-gray-500 dark:text-neutral-500">{skill.description}</span>
                        </div>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{
                          scale: skill.enabled ? 1 : 0,
                          opacity: skill.enabled ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle2
                          className="w-5 h-5 ml-2"
                          style={{ color: skill.color }}
                        />
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
