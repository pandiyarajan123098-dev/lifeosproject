import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Target,
  Clock,
  ArrowRight,
  Brain,
  Layers,
  Award,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-page flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-8 border border-primary-200 shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Smart Productivity Engine for Lifelong Learners</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-mainText tracking-tight leading-[1.15] mb-6">
            Build Better Habits. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
              Achieve Your Goals.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-secondaryText leading-relaxed mb-10">
            LifeOS analyzes your unique skills, interests, and daily available time to generate
            tailored daily tasks. Track your consistency, build streaks, and make measurable
            progress every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-hover">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white">
                Log In to Account
              </Button>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="mt-14 pt-8 border-t border-cardBorder max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-secondaryText mt-0.5">Tailored Daily Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">15-120</p>
              <p className="text-xs text-secondaryText mt-0.5">Minutes Daily Budget</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">Real-time</p>
              <p className="text-xs text-secondaryText mt-0.5">SQL Server Sync</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">Private</p>
              <p className="text-xs text-secondaryText mt-0.5">Isolated User Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-cardBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Features</h2>
            <p className="text-3xl font-extrabold text-mainText">
              Engineered to Turn Ambition into Action
            </p>
            <p className="text-sm text-secondaryText mt-3">
              Everything you need to systematically advance your tech and professional competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mainText mb-2">Personalized Task Generation</h3>
              <p className="text-xs leading-relaxed text-secondaryText">
                A rule-based recommendation engine balances your current skill level, primary career goals,
                and time limits into bite-sized daily action items.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mainText mb-2">Streak & Progress Analytics</h3>
              <p className="text-xs leading-relaxed text-secondaryText">
                Monitor weekly trends, calculated completion streaks, and task distribution across domains
                with interactive Recharts data visualizations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-page border border-cardBorder hover:border-primary-300 transition-all hover:shadow-card group">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-mainText mb-2">SQL Server Data Isolation</h3>
              <p className="text-xs leading-relaxed text-secondaryText">
                Enterprise-grade architecture using Microsoft SQL Server with strict parameterized queries,
                bcrypt password hashing, and user-isolated scopes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-page">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Workflow</h2>
            <p className="text-3xl font-extrabold text-mainText">How LifeOS Works</p>
            <p className="text-sm text-secondaryText mt-3">
              Four simple steps from onboarding to daily achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Quick Profile Onboarding',
                desc: 'Select your technical interests, skills, experience level, and daily available minutes.',
              },
              {
                step: '02',
                title: 'Generate Daily Plan',
                desc: 'LifeOS creates a realistic, curated action plan matching your chosen schedule.',
              },
              {
                step: '03',
                title: 'Check Off Completed Items',
                desc: 'Work through interactive tasks with clear guidance and check them off as you finish.',
              },
              {
                step: '04',
                title: 'Submit Daily Snapshot',
                desc: 'Commit your daily progress to SQL Server to build verified streaks and track growth.',
              },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-white border border-cardBorder shadow-soft relative">
                <span className="text-3xl font-black text-primary-200 absolute top-4 right-4">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-mainText mt-6 mb-2">{item.title}</h3>
                <p className="text-xs text-secondaryText leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white border-t border-cardBorder">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5 text-primary" />
                Proven Habit Psychology
              </div>
              <h2 className="text-3xl font-extrabold text-mainText leading-tight">
                Stop Feeling Overwhelmed by Massive Career Roadmaps
              </h2>
              <p className="text-sm text-secondaryText mt-4 leading-relaxed">
                Traditional roadmaps give you months of abstract topics with no daily guidance.
                LifeOS bridges the gap by translating high-level ambitions into concrete, 15 to 30-minute
                daily micro-tasks that fit into your actual schedule.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Bite-sized tasks preventing procrastination and burnout',
                  'Fresh recommendations that avoid repetitive tasks',
                  'Verified streak tracking calculated directly from SQL records',
                  'Private profiles ensuring complete isolation of personal data',
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-xs font-medium text-mainText">{text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button size="md">
                    Start Your Daily Journey
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-page border border-cardBorder shadow-card">
              <div className="p-4 rounded-xl bg-white border border-cardBorder mb-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-secondaryText">Today's Progress</span>
                  <span className="text-xs font-bold text-primary">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-primary-light overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-white border border-cardBorder flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-xs font-medium text-mainText line-through text-gray-400">
                      Practice CSS Flexbox Alignment (15 min)
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-cardBorder flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-xs font-medium text-mainText line-through text-gray-400">
                      Build Responsive Navigation Bar (20 min)
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-primary-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                    <span className="text-xs font-medium text-mainText">
                      Practice JavaScript DOM Manipulation (15 min)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Medium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-cardBorder py-12 text-xs text-secondaryText">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-cardBorder">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-mainText">
                Life<span className="text-primary">OS</span>
              </span>
              <span className="text-xs text-gray-400 ml-2">Personal Productivity Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-medium">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-primary transition-colors">Register</Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} LifeOS. All rights reserved.</p>
            <div className="flex items-center gap-6">
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
