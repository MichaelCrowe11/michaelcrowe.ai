"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        message: "",
      })
    } catch (error) {
      // TODO: Implement proper error tracking (e.g., Sentry)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Smith"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            type="text"
            placeholder="Your Company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (234) 567-8900"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">What are you interested in?</Label>
        <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
          <SelectTrigger id="service" className="bg-background">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer-communication">Customer Communication AI</SelectItem>
            <SelectItem value="scheduling-operations">Scheduling & Operations</SelectItem>
            <SelectItem value="marketing-automation">Marketing Automation</SelectItem>
            <SelectItem value="financial-intelligence">Financial Intelligence</SelectItem>
            <SelectItem value="voice-phone-ai">Voice & Phone AI</SelectItem>
            <SelectItem value="custom-solutions">Custom Solutions</SelectItem>
            <SelectItem value="not-sure">Not Sure Yet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Tell me about your business <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="What challenges are you facing? What takes up most of your time? What would you like to automate?"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          required
          rows={6}
          className="bg-background resize-none"
        />
        <p className="text-xs text-muted-foreground">
          The more details you share, the better I can help you on our call.
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-700 dark:text-green-400">
          Thanks for reaching out! I'll get back to you within 24 hours.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          Something went wrong. Please try again or email me directly at {config.contact.email}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to be contacted about AI automation services.
      </p>
    </form>
  )
}
