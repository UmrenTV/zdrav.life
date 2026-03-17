"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/lib/lucide-icon";
import type { HomePageData } from "@/types";

const HERO_ANIM = "opacity-0 animate-[fade-in-up_0.5s_ease-out_both]";
const HERO_LCP = "animate-[slide-up_0.4s_ease-out_both]";

const DEFAULT_HERO = {
  pillText: "Software Engineer & Problem Solver",
  headingWhite: "Engineer Your",
  headingAccent: "Vitality",
  subheading:
    "Build strength. Master discipline. Ride further. Live deeper.\nA software engineer's journey into high-performance living.",
  buttons: [
    {
      label: "Explore the Blog",
      href: "/blog",
      icon: "ArrowRight",
      iconPosition: "right" as const,
    },
    {
      label: "Watch the Journey",
      href: "/videos",
      icon: "Play",
      iconPosition: "left" as const,
    },
    {
      label: "Shop the Brand",
      href: "/shop",
      icon: "ShoppingBag",
      iconPosition: "left" as const,
    },
  ],
  stats: [
    { value: "50K+", label: "Subscribers" },
    { value: "100+", label: "Videos" },
    { value: "5K+", label: "Community" },
  ],
};

export function HeroSection({ home }: { home?: HomePageData }) {
  const hero = home?.hero;
  const pillText = hero?.pillText ?? DEFAULT_HERO.pillText;
  const headingWhite = hero?.headingWhite ?? DEFAULT_HERO.headingWhite;
  const headingAccent = hero?.headingAccent ?? DEFAULT_HERO.headingAccent;
  const subheading = hero?.subheading ?? DEFAULT_HERO.subheading;
  const rawButtons = hero?.buttons?.length ? hero.buttons : undefined;
  const buttons =
    rawButtons && rawButtons.length
      ? rawButtons.map((btn, index) => {
          const defaultBtn =
            DEFAULT_HERO.buttons[index] ?? DEFAULT_HERO.buttons[0];
          return {
            ...defaultBtn,
            ...btn,
            icon: btn.icon ?? defaultBtn.icon,
            iconPosition: btn.iconPosition ?? defaultBtn.iconPosition,
          };
        })
      : DEFAULT_HERO.buttons;
  const stats = hero?.stats?.length ? hero.stats : DEFAULT_HERO.stats;

  return (
    <section className="relative min-h-screen w-full max-w-full min-w-0 flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/20 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-vitality/20 to-transparent blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="max-w-4xl mx-auto text-center min-w-0">
          {/* Badge */}
          <div className={`mb-6 ${HERO_ANIM}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {pillText}
            </span>
          </div>

          {/* Main Headline — always visible for LCP, slide-up only (no opacity) */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 ${HERO_LCP}`}
          >
            <span className="block">{headingWhite}</span>
            <span className="block text-gradient">{headingAccent}</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 whitespace-pre-line ${HERO_ANIM} [animation-delay:200ms]`}
          >
            {subheading}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 ${HERO_ANIM} [animation-delay:300ms]`}
          >
            {buttons.map((btn, i) => {
              const Icon = getLucideIcon(btn.icon);
              const isFirst = i === 0;
              const isLast = i === buttons.length - 1;
              const variant = isFirst
                ? "default"
                : isLast
                  ? "secondary"
                  : "outline";
              return (
                <Button
                  key={btn.href + i}
                  asChild
                  size="lg"
                  variant={variant}
                  className="w-full sm:w-auto group"
                >
                  <Link href={btn.href}>
                    {btn.iconPosition === "left" && Icon && (
                      <Icon className="mr-2 h-4 w-4" />
                    )}
                    {btn.label}
                    {btn.iconPosition === "right" && Icon && (
                      <Icon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 max-w-lg mx-auto ${HERO_ANIM} [animation-delay:400ms]`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
