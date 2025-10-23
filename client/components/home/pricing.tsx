"use client";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "Freelancer",
    id: "tier-freelancer",
    href: "#",
    priceMonthly: "$24",
    description: "The essentials to get your business started.",
    features: [
      "5 products",
      "Up to 1,000 subscribers",
      "Basic analytics",
      "48-hour support response time",
    ],
    mostPopular: false,
  },
  {
    name: "Startup",
    id: "tier-startup",
    href: "#",
    priceMonthly: "$32",
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
      "Marketing automations",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$48",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited products",
      "Unlimited subscribers",
      "Advanced analytics",
      "1-hour, dedicated support response time",
      "Marketing automations",
      "Custom integrations",
    ],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  return (
    <div className="bg-base-200 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
            Pricing for every team, from small to large
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-base-content/80">
          Choose an affordable plan that&apos;s packed with the best features
          for your team.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pricingTiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: tierIdx * 0.1 }}
              className={classNames(
                tier.mostPopular ? "lg:scale-110 lg:rounded-3xl z-10 shadow-xl" : "lg:mt-8",
                "flex flex-col justify-between rounded-2xl bg-base-100 p-8 ring-1 ring-base-content/10"
              )}
            >
              <div>
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? "text-primary" : "text-base-content",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-base-content/80">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-base-content">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-base-content/60">
                    /month
                  </span>
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-base-content/80"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      {/* Heroicon name: check */}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-primary text-white shadow-sm hover:bg-primary-focus"
                    : "text-primary ring-1 ring-inset ring-primary hover:ring-primary-focus",
                  "mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                )}
              >
                Buy this plan
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
