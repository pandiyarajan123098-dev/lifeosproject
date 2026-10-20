import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
      // New user registration always redirects to onboarding
      navigate('/onboarding');
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-mainText">
            Life<span className="text-primary">OS</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-mainText">Create your free account</h2>
        <p className="mt-1 text-xs text-secondaryText">
          Start generating personalized daily productivity tasks in under 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-cardBorder shadow-card">
          {serverError && (
            <ErrorMessage
              title="Registration Error"
              message={serverError}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Johnson"
              required
              leftIcon={User}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              required
              leftIcon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              helperText="Minimum 6 characters"
              leftIcon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              leftIcon={Lock}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full">
                Create Account & Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-secondaryText">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
