"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import {
  Mail,
  User,
  Phone,
  Home,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-base-200 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          Contact Sales
        </h2>
        <p className="mt-2 text-lg leading-8 text-base-content/70">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>

      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20 space-y-6"
      >
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputWithIcon
            label="First Name"
            placeholder="John"
            icon={<User className="text-base-content/70 w-5 h-5" />}
          />
          <InputWithIcon
            label="Last Name"
            placeholder="Doe"
            icon={<User className="text-base-content/70 w-5 h-5" />}
          />
        </div>

        {/* Company */}
        <InputWithIcon
          label="Company"
          placeholder="Company Inc."
          icon={<Home className="text-base-content/70 w-5 h-5" />}
        />

        {/* Email */}
        <InputWithIcon
          label="Email"
          placeholder="john@example.com"
          type="email"
          icon={<Mail className="text-base-content/70 w-5 h-5" />}
        />

        {/* Phone */}
        <InputWithIcon
          label="Phone Number"
          placeholder="+1 234 567 890"
          type="tel"
          icon={<Phone className="text-base-content/70 w-5 h-5" />}
        />

        {/* Message */}
        <TextAreaWithIcon
          label="Message"
          placeholder="Write your message here..."
          icon={<MessageCircle className="text-base-content/70 w-5 h-5" />}
        />

        {/* Agree */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <Switch
            checked={agreed}
            onChange={setAgreed}
            className={`${
              agreed ? "bg-primary" : "bg-gray-400/50"
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
          >
            <span
              className={`${
                agreed ? "translate-x-6" : "translate-x-1"
              } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-1 ring-base-content/20 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="text-sm text-base-content/70">
            I agree to the{" "}
            <a href="#" className="text-primary font-semibold">
              privacy policy
            </a>
            .
          </span>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-3 text-white font-semibold hover:bg-primary-focus transition mt-4"
        >
          Let's Talk
        </button>
      </form>
    </div>
  );
}

// Input with icon component
function InputWithIcon({
  label,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-base-content">
      <span className="mb-1 block">{label}</span>
      <div className="relative flex items-center">
        <span className="absolute left-3">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-base-300 bg-base-100 px-10 py-3 text-base-content shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 placeholder:text-base-content/50"
        />
      </div>
    </label>
  );
}

// Textarea with icon component
function TextAreaWithIcon({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder?: string;
  icon: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-base-content">
      <span className="mb-1 block">{label}</span>
      <div className="relative flex items-start">
        <span className="absolute top-3 left-3">{icon}</span>
        <textarea
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-lg border border-base-300 bg-base-100 px-10 py-3 text-base-content shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-1 placeholder:text-base-content/50"
        />
      </div>
    </label>
  );
}
