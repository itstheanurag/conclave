"use client";

import React from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  link: string;
}

export default function NavLinks({ links }: { links: NavLink[] }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.link}
          className="text-sm tracking-tight text-base-content hover:text-primary hover:scale-105 transition-transform duration-200 capitalize 
                     w-full md:w-auto py-2 md:py-0"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
