"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu, X, Linkedin, Github, Mail, Phone, Download,
  Server, Network, Cloud, Monitor, Headphones, Shield,
  ChevronDown, ExternalLink, Briefcase, Users,
  MessageCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About me", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact me", href: "#contact" },
]

// ============ NAVIGATION ============
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ["home", "services", "about", "portfolio", "contact"]
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="text-primary font-bold text-xl tracking-tight">
            SV
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          <Link
            href="#contact"
            className="hidden md:inline-flex px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Hire Me
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 md:hidden bg-card border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 text-sm border-b border-border/50 transition-colors ${
                    activeSection === link.href.slice(1) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="mt-3 py-3 px-6 bg-primary text-primary-foreground text-sm font-semibold rounded-full text-center"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ============ HERO ============
export function Hero() {
  const socials = [
    { icon: Linkedin, href: "https://linkedin.com/in/starlin-vilorio-988016281", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/StarlinVilorio", label: "GitHub" },
    { icon: Mail, href: "mailto:starlin.newtron@gmail.com", label: "Email" },
    { icon: MessageCircle, href: "https://wa.me/18097916765", label: "WhatsApp" },
  ]

  const stats = [
    { value: "13+", label: "Years Experience", icon: Briefcase },
    { value: "50+", label: "Projects Done", icon: Server },
    { value: "100+", label: "Happy Clients", icon: Users },
  ]

  return (
    <section id="home" className="relative min-h-screen lg:h-screen flex flex-col overflow-hidden">

      {/* ─── MAIN CONTENT ─── */}
      <div className="lg:flex-1 lg:min-h-0 max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col lg:grid lg:grid-cols-2 pt-20">

        {/* ── PHOTO — first on mobile (order-1), right column on desktop (order-2) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="order-1 lg:order-2 relative h-[280px] sm:h-[340px] lg:h-auto"
        >
          <Image
            src="/hero.png"
            alt="Starlin Vilorio"
            fill
            className="object-contain lg:object-cover"
            style={{ objectPosition: "center top" }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* ── TEXT — second on mobile (order-2), left column on desktop (order-1) ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="order-2 lg:order-1 flex flex-col justify-center py-8 lg:py-10 relative z-10"
        >
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "14px", marginBottom: "8px" }}>
            Hi I am
          </p>

          <h2 style={{ fontSize: "26px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
            Starlin Vilorio
          </h2>

          <h1
            className="text-primary font-extrabold leading-none"
            style={{ fontSize: "clamp(44px, 5.5vw, 72px)", marginBottom: "22px" }}
          >
            IT Support<br />Specialist
          </h1>

          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "15px", lineHeight: "1.75", maxWidth: "370px", marginBottom: "28px" }}>
            I build and maintain reliable infrastructure, self-hosted platforms,
            and cloud deployments with 13+ years of enterprise experience.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "11px", marginBottom: "28px" }}>
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="hover:border-primary hover:text-primary transition-all"
                style={{
                  width: "42px", height: "42px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.62)",
                  flexShrink: 0,
                }}
              >
                <s.icon size={18} />
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="#contact"
              className="hover:opacity-90 transition-opacity"
              style={{
                padding: "12px 34px",
                background: "var(--color-primary)",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "50px",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              Hire Me
            </Link>
            <Link
              href="mailto:starlin.newtron@gmail.com"
              className="hover:border-primary hover:text-primary transition-all"
              style={{
                padding: "12px 28px",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "50px",
                textDecoration: "none",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Download CV <Download size={15} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ─── STATS BAR ─── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="grid grid-cols-3 rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 py-5"
              style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
            >
              <span
                className="font-bold text-primary"
                style={{ fontSize: "clamp(24px, 5vw, 40px)", lineHeight: 1 }}
              >
                {stat.value}
              </span>
              <div className="flex items-center gap-1 lg:gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                <div
                  className="rounded-full flex items-center justify-center shrink-0"
                  style={{ width: "24px", height: "24px", background: "rgba(255,255,255,0.08)" }}
                >
                  <stat.icon size={11} />
                </div>
                <span style={{ fontSize: "clamp(9px, 2vw, 13px)" }}>{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============ SERVICES ============
export function Services() {
  const services = [
    { icon: Headphones, title: "IT Support", description: "Enterprise Help Desk with 4.8+ CSAT scores. Remote & on-site troubleshooting across web and mobile platforms." },
    { icon: Server, title: "System Admin", description: "Windows Server, Active Directory, Group Policy, DNS/DHCP configuration and management." },
    { icon: Network, title: "Networking", description: "TCP/IP, routing, switching, VPN setup, firewall configuration and Wireshark analysis." },
    { icon: Cloud, title: "Cloud Services", description: "AWS, Cloudflare, Vercel deployments. CDN optimization and Cloudflare Tunnel routing." },
    { icon: Monitor, title: "Self-Hosting", description: "Docker, Portainer, Jellyfin media servers. Complete self-hosted infrastructure stacks." },
    { icon: Shield, title: "Security", description: "Zero-trust access, Cloudflare tunnels, secure JWT authentication and compliance frameworks." },
  ]

  return (
    <section id="services" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">What I do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional IT services spanning enterprise support, infrastructure management, and cloud deployments.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-all">
                <service.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ ABOUT ============
export function About() {
  const cards = [
    { icon: Server, title: "Infrastructure", description: "Enterprise server management, Active Directory, DNS infrastructure and system administration." },
    { icon: Cloud, title: "Cloud Engineering", description: "AWS, Vercel, Cloudflare deployments. CDN optimization and zero-trust tunnel architecture." },
    { icon: Monitor, title: "Self-Hosting", description: "Docker stacks, Jellyfin media servers, Portainer and complete self-hosted infrastructure." },
    { icon: Shield, title: "Automation", description: "Automated content pipelines, Radarr/Sonarr workflows and infrastructure automation." },
  ]

  return (
    <section id="about" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* "ABOUT ME ——" label */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <span style={{ color: "var(--color-primary)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                About Me
              </span>
              <div style={{ width: "50px", height: "1px", background: "var(--color-primary)" }} />
            </div>

            <h2
              className="font-bold text-foreground leading-tight"
              style={{ fontSize: "clamp(32px, 3.2vw, 44px)", marginBottom: "24px" }}
            >
              I build infrastructure<br />
              that people{" "}
              <span className="text-primary">trust.</span>
            </h2>

            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontSize: "15px", marginBottom: "32px" }}
            >
              A bilingual IT professional with 13+ years of experience across enterprise Help Desk,
              DNS infrastructure, system administration, and technical support. I thrive solving complex
              problems — from configuring DNS records for 100+ enterprise clients to architecting
              self-hosted media platforms that rival Netflix.
            </p>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all"
              style={{ padding: "12px 28px", fontSize: "14px" }}
            >
              Read More <span>→</span>
            </Link>
          </motion.div>

          {/* ── RIGHT — single bordered 2×2 container ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="grid grid-cols-2">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-7 hover:bg-white/[0.02] transition-colors"
                  style={{
                    borderRight: idx % 2 === 0 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                    borderBottom: idx < 2 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "48px", height: "48px",
                      borderRadius: "10px",
                      background: "rgba(255,107,0,0.12)",
                      marginBottom: "18px",
                    }}
                  >
                    <card.icon size={22} className="text-primary" />
                  </div>
                  <h4
                    className="font-semibold text-foreground"
                    style={{ fontSize: "15px", marginBottom: "8px" }}
                  >
                    {card.title}
                  </h4>
                  <p
                    className="text-muted-foreground leading-relaxed"
                    style={{ fontSize: "13px" }}
                  >
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ============ PORTFOLIO ============
export function Portfolio() {
  const categories = ["All", "Infrastructure", "Web Dev", "Media Server", "Cloud"]
  const [active, setActive] = useState("All")

  const projects = [
    { title: "Interpreter App", category: "AI / ML", description: "Real-time local ES⇄EN speech interpreter. Whisper + MarianMT on GPU (NVIDIA CUDA & AMD Vulkan), browser screen-audio capture, live bilingual captions, packaged as a Windows installer.", link: "https://github.com/StarlinVilorio/interpreter-app" },
    { title: "MovieRD", category: "Media Server", description: "Self-hosted Netflix-like platform with Jellyfin, Next.js 16 frontend, Cloudflare Tunnel, and Android TV app.", link: "https://movierd.com" },
    { title: "Enterprise DNS", category: "Infrastructure", description: "DNS management for 100+ enterprise clients at Thryv. Maintained 99.9% uptime, reduced resolution time 40%." },
    { title: "Home Lab Stack", category: "Infrastructure", description: "Complete self-hosted Docker stack with Portainer, media automation (Radarr/Sonarr/Bazarr/Prowlarr)." },
    { title: "StarlinIT.com", category: "Web Dev", description: "Professional portfolio built as a single-page app. GitHub Pages + Cloudflare custom domain.", link: "https://starlinit.com" },
    { title: "Cloudflare Zero-Trust", category: "Cloud", description: "Cloudflare Tunnel setup for secure remote access — no open ports, zero-trust architecture." },
    { title: "Media Automation", category: "Media Server", description: "Radarr + Sonarr + Bazarr + Prowlarr pipeline for fully automated content management and subtitles." },
  ]

  const filtered = active === "All" ? projects : projects.filter(p => p.category === active)

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">My Work</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Portfolio</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Projects showcasing expertise in infrastructure, web development, and media systems.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="aspect-video bg-secondary relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Server size={24} className="text-primary" />
                  </div>
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink size={14} className="text-primary" />
                    </Link>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <span className="text-xs text-primary">{project.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ============ CONTACT ============
export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, service, message } = form
    if (!name || !email || !service || !message) return
    window.location.href = `mailto:starlin.newtron@gmail.com?subject=${encodeURIComponent(service)}&body=Hi%20Starlin%2C%0D%0A%0D%0AMy%20name%20is%20${encodeURIComponent(name)}%20(${encodeURIComponent(email)}).%0D%0A%0D%0A${encodeURIComponent(message)}`
  }

  return (
    <section id="contact" className="py-24 px-6 lg:px-12 bg-card">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contact me</h2>
          <p className="text-muted-foreground">Open to remote roles worldwide — I respond within 24 hours.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <input type="text" placeholder="Name" value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => set("email", e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => set("phone", e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            <div className="relative">
              <select value={form.service} onChange={e => set("service", e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-muted-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                <option value="">Service Of Interest</option>
                <option value="IT Support / Help Desk Role">IT Support / Help Desk</option>
                <option value="System Administrator Position">System Administration</option>
                <option value="Infrastructure / Cloud Role">Infrastructure / Cloud</option>
                <option value="Job Opportunity — Remote">Job Opportunity</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <textarea placeholder="Message..." rows={5} value={form.message} onChange={e => set("message", e.target.value)}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
          <div className="flex justify-end">
            <button type="submit"
              className="px-10 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}

// ============ FOOTER ============
export function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="text-primary font-bold text-2xl mb-6">SV</Link>

          <nav className="flex flex-wrap justify-center gap-6 mb-8">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 mb-8">
            {[
              { icon: Linkedin, href: "https://linkedin.com/in/starlin-vilorio-988016281" },
              { icon: Github, href: "https://github.com/StarlinVilorio" },
              { icon: Mail, href: "mailto:starlin.newtron@gmail.com" },
              { icon: MessageCircle, href: "https://wa.me/18097916765" },
            ].map((s, i) => (
              <Link key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <s.icon size={18} />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2"><Mail size={15} className="text-primary" /><span>starlin.newtron@gmail.com</span></div>
            <div className="flex items-center gap-2"><Phone size={15} className="text-primary" /><span>+1 (809) 791-6765</span></div>
          </div>

          <div className="w-full max-w-md h-px bg-border mb-6" />
          <p className="text-xs text-muted-foreground">
            © 2026 <span className="text-primary">Starlin Vilorio</span> — IT Support Specialist · 🇩🇴 Remote Worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
