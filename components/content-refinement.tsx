"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import SkillsDropdown, { type Skill } from "@/components/skills-dropdown"
import { CheckCircle2, Type, Zap, Wrench, Palette, FileText, Copy, RotateCcw, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const AVAILABLE_SKILLS: Skill[] = [
  {
    id: "grammar",
    label: "Grammar Expert",
    icon: CheckCircle2,
    color: "#10B981",
    description: "Improve grammar and clarity",
    enabled: false,
  },
  {
    id: "style",
    label: "Style Expert",
    icon: Type,
    color: "#8B5CF6",
    description: "Enhance writing style and flow",
    enabled: false,
  },
  {
    id: "conciseness",
    label: "Conciseness Expert",
    icon: Zap,
    color: "#F59E0B",
    description: "Make content more concise",
    enabled: false,
  },
  {
    id: "technical",
    label: "Technical Expert",
    icon: Wrench,
    color: "#3B82F6",
    description: "Improve technical accuracy",
    enabled: false,
  },
  {
    id: "creative",
    label: "Creative Expert",
    icon: Palette,
    color: "#EC4899",
    description: "Add creative flair and engagement",
    enabled: false,
  },
]

export default function ContentRefinement() {
  const [originalContent, setOriginalContent] = React.useState("")
  const [refinedContent, setRefinedContent] = React.useState("")
  const [skills, setSkills] = React.useState<Skill[]>(AVAILABLE_SKILLS)
  const [isRefining, setIsRefining] = React.useState(false)
  const [hasRefined, setHasRefined] = React.useState(false)

  const handleSkillToggle = (skillId: string) => {
    setSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill
      )
    )
  }

  const handleRefine = async () => {
    if (!originalContent.trim()) return

    setIsRefining(true)
    setHasRefined(true)

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real implementation, this would call an AI API with the enabled skills
    // For now, we'll just set the refined content to show the UX
    const enabledSkills = skills.filter(s => s.enabled)

    if (enabledSkills.length === 0) {
      setRefinedContent(originalContent)
    } else {
      // Placeholder: In production, this would call AI with skill instructions
      const skillsText = enabledSkills.map(s => s.label).join(", ")
      setRefinedContent(
        `[Content refined with: ${skillsText}]\n\n${originalContent}\n\n` +
        `Note: In production, this would be processed by Claude with the selected expert skills applied incrementally. ` +
        `Each skill adds specific improvements without rewriting the entire content.`
      )
    }

    setIsRefining(false)
  }

  const handleCopyRefined = async () => {
    if (refinedContent) {
      await navigator.clipboard.writeText(refinedContent)
    }
  }

  const handleAcceptRefined = () => {
    setOriginalContent(refinedContent)
    setRefinedContent("")
    setHasRefined(false)
  }

  const handleReset = () => {
    setRefinedContent("")
    setHasRefined(false)
  }

  const handleExport = () => {
    const content = refinedContent || originalContent
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Refinement Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create content and refine it step-by-step with expert skills. Toggle skills on/off to control exactly how your content is improved.
          </p>
        </div>

        {/* Skills Control Panel */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Refinement Skills
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select which expert skills to apply to your content
              </p>
            </div>
            <SkillsDropdown skills={skills} onSkillToggle={handleSkillToggle} />
          </div>

          {/* Active Skills Display */}
          <div className="flex flex-wrap gap-2">
            {skills
              .filter(s => s.enabled)
              .map(skill => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${skill.color}20`,
                    color: skill.color,
                    border: `1px solid ${skill.color}40`,
                  }}
                >
                  <skill.icon className="w-3.5 h-3.5" />
                  {skill.label}
                </div>
              ))}
            {skills.filter(s => s.enabled).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No skills selected. Choose skills from the dropdown above.
              </p>
            )}
          </div>
        </div>

        {/* Content Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="original-content" className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Content
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!originalContent}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Export
              </Button>
            </div>
            <Textarea
              id="original-content"
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="Start writing your content here..."
              className="min-h-[500px] resize-none font-mono text-sm"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {originalContent.length} characters
              </span>
              <Button
                onClick={handleRefine}
                disabled={!originalContent.trim() || skills.filter(s => s.enabled).length === 0 || isRefining}
                className={cn(
                  "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                  "text-white font-semibold shadow-lg"
                )}
              >
                {isRefining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Refining...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Refine Content
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Refined Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                Refined Output
              </Label>
              {hasRefined && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRefined}
                    disabled={!refinedContent}
                    className="text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
              )}
            </div>

            {hasRefined ? (
              <>
                <div className="min-h-[500px] p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                    {refinedContent}
                  </pre>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {refinedContent.length} characters
                  </span>
                  <Button
                    onClick={handleAcceptRefined}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Accept & Continue Editing
                  </Button>
                </div>
              </>
            ) : (
              <div className="min-h-[500px] flex items-center justify-center p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Refined content will appear here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Select skills and click "Refine Content" to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            How to use Content Refinement Studio:
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 ml-4 list-decimal">
            <li>Write or paste your content in the left editor</li>
            <li>Click the "Refinement Skills" dropdown to select which expert skills to apply</li>
            <li>Click "Refine Content" to process your content with the selected skills</li>
            <li>Review the refined output on the right side</li>
            <li>Click "Accept & Continue Editing" to use the refined version and make further improvements</li>
            <li>Toggle different skills on/off to refine step-by-step without full rewrites</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
