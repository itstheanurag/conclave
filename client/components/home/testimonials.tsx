"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Leslie Alexander",
    handle: "@lesliealexander",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
  },
  {
    name: "Courtney Henry",
    handle: "@courtneyhenry",
    image:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "Consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  },
  {
    name: "Jenny Wilson",
    handle: "@jennywilson",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote:
      "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-base-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
            We have worked with thousands of amazing people
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.handle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="rounded-2xl bg-base-200 p-8 text-sm leading-6 shadow-lg"
            >
              <blockquote className="text-base-content/80">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <img
                  className="h-10 w-10 rounded-full bg-gray-50"
                  src={t.image}
                  alt={t.name}
                />
                <div>
                  <div className="font-semibold text-base-content">
                    {t.name}
                  </div>
                  <div className="text-base-content/60">{t.handle}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
