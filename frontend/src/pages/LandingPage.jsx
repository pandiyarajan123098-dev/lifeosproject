import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Brain,
  Award,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-page flex flex-col font-sans text-mainText selection:bg-primary-light selection:text-primary-dark overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-6 border border-primary-200/80 shadow-soft">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">SaaS Productivity & Skill Acceleration</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mainText tracking-tight leading-[1.18] mb-5">
            Build Better Habits.{' '}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Achieve Your Goals.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-secondaryText leading-relaxed mb-8">
            LifeOS intelligently translates your career ambitions and skill gaps into achievable, 15 to 30-minute daily micro-tasks. Track your consistency, build SQL-verified streaks, and make tangible progress every day.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-hover">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Log In to Account
              </Button>
            </Link>
          </div>

          {/* Value Highlights Grid */}
          <div className="mt-12 pt-8 border-t border-cardBorder max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-3 rounded-control bg-white/70 border border-cardBorder/60">
              <p className="text-xl sm:text-2xl font-bold text-primary">100%</p>
              <p className="text-[11px] sm:text-xs text-secondaryText mt-0.5">Tailored Daily Tasks</p>
            </div>
            <div className="p-3 rounded-control bg-white/70 border border-cardBorder/60">
              <p className="text-xl sm:text-2xl font-bold text-primary">15–120m</p>
              <p className="text-[11px] sm:text-xs text-secondaryText mt-0.5">Daily Time Budget</p>
            </div>
            <div className="p-3 rounded-control bg-white/70 border border-cardBorder/60">
              <p className="text-xl sm:text-2xl font-bold text-primary">Live SQL</p>
              <p className="text-[11px] sm:text-xs text-secondaryText mt-0.5">Verified Progress Snapshots</p>
            </div>
            <div className="p-3 rounded-control bg-white/70 border border-cardBorder/60">
              <p className="text-xl sm:text-2xl font-bold text-primary">Private</p>
              <p className="text-[11px] sm:text-xs text-secondaryText mt-0.5">Isolated User Scopes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-16 sm:py-20 bg-white border-y border-cardBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Features</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              Built for Consistent Professional Growth
            </p>
            <p className="text-xs sm:text-sm text-secondaryText mt-2">
              Everything you need to turn high-level career objectives into daily executable routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-card bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-11 h-11 rounded-control bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-mainText mb-2">
                Intelligent Task Recommendation
              </h3>
              <p className="text-xs sm:text-[13px] leading-relaxed text-secondaryText">
                A rule-based recommendation engine balances your current skill tier, career goals, and time budget into concise, executable action items.
              </p>
            </div>

            <div className="p-6 rounded-card bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-11 h-11 rounded-control bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-mainText mb-2">
                Streak & Progress Analytics
              </h3>
              <p className="text-xs sm:text-[13px] leading-relaxed text-secondaryText">
                Monitor 7-day productivity charts and verified completion streaks calculated directly from database completion snapshots.
              </p>
            </div>

            <div className="p-6 rounded-card bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-11 h-11 rounded-control bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-mainText mb-2">
                Isolated SQL Server Data
              </h3>
              <p className="text-xs sm:text-[13px] leading-relaxed text-secondaryText">
                Enterprise architecture with Microsoft SQL Server parameterized queries, bcrypt password hashing, and user-isolated data queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-page">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Workflow</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              How LifeOS Works
            </p>
            <p className="text-xs sm:text-sm text-secondaryText mt-2">
              Four steps from onboarding to measurable skill milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                step: '01',
                title: 'Quick Onboarding',
                desc: 'Select your technical interests, skills, experience level, and available minutes.',
              },
              {
                step: '02',
                title: 'Receive Daily Plan',
                desc: 'LifeOS generates curated micro-tasks calibrated to your schedule.',
              },
              {
                step: '03',
                title: 'Check Off Items',
                desc: 'Work through interactive tasks with clear guidance and check them off in real-time.',
              },
              {
                step: '04',
                title: 'Submit Daily Snapshot',
                desc: 'Commit your progress to SQL Server to grow verified streaks and analyze trends.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 sm:p-6 rounded-card bg-white border border-cardBorder shadow-soft relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary-200 block mb-3">
                    {item.step}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-mainText mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-secondaryText leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 sm:py-20 bg-white border-t border-cardBorder">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Habit Psychology</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mainText leading-tight">
                Overcome Overwhelm with Daily Action
              </h2>
              <p className="text-xs sm:text-sm text-secondaryText mt-3.5 leading-relaxed">
                Generic roadmaps dump overwhelming months of theory on you. LifeOS breaks your roadmap into concrete, 15 to 30-minute daily tasks tailored to your actual schedule.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Bite-sized micro-tasks preventing procrastination and cognitive fatigue',
                  'Fresh recommendations that rotate topics to avoid repetitive burnout',
                  'Verified streak calculation from actual database records',
                  'Strict private isolation ensuring your personal data stays yours',
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm text-mainText">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button size="md">
                    Start Your Daily Journey Free
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="p-5 sm:p-6 rounded-card bg-page border border-cardBorder shadow-card space-y-4">
              <div className="p-4 rounded-control bg-white border border-cardBorder shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-secondaryText">Today's Completion</span>
                  <span className="text-xs font-bold text-primary">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-primary-light overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-control bg-white border border-cardBorder flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="font-medium text-gray-400 line-through truncate">
                      Practice CSS Flexbox Alignment (15 min)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary-50 text-primary shrink-0 border border-primary-200">
                    Done
                  </span>
                </div>

                <div className="p-3 rounded-control bg-white border border-cardBorder flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="font-medium text-gray-400 line-through truncate">
                      Build Responsive Navigation Bar (20 min)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary-50 text-primary shrink-0 border border-primary-200">
                    Done
                  </span>
                </div>

                <div className="p-3 rounded-control bg-white border border-primary-300 flex items-center justify-between gap-3 text-xs shadow-soft">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0"></div>
                    <span className="font-medium text-mainText truncate">
                      Practice JavaScript DOM Manipulation (15 min)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    Medium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-cardBorder py-10 sm:py-12 text-xs text-secondaryText">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-cardBorder">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-control bg-primary text-white flex items-center justify-center font-bold text-sm shadow-soft">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-mainText">
                Life<span className="text-primary">OS</span>
              </span>
              <span className="text-xs text-secondaryText hidden sm:inline">&mdash; Personal Productivity Platform</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-medium">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} LifeOS Platform. All rights reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer">Terms of Service</span>
              <span className="hover:text-primary cursor-pointer">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
