import React from "react";
import Image from "next/image";
import SectionHeader from "@/app/Components/Section/SectionHeader";

const blogPosts = [
  {
    date: "May 26, 2025",
    title: "Meet the Steve Jobs of the AwaOwn Industry",
    excerpt:
      "Trends are patterns or shifts in behavior, preferences, or ideas that gain popularity within a specific industry or society.",
    image: "/images/hero-card-1.png",
  },
  {
    date: "May 26, 2025",
    title: "15 Underrated Skills That'll Make You a Rockstar",
    excerpt:
      "Technology has become an integral part of our lives, revolutionizing the way we work and communicate ourselves.",
    image: "/images/hero-card-2.png",
  },
  {
    date: "May 26, 2025",
    title: "10 Things That'll Help You With AwaOwn",
    excerpt:
      "Welcome to the ultimate shopping event that you've been waiting for. Our upcoming shopping sale with big discounts.",
    image: "/images/hero-card-3.png",
  },
  {
    date: "May 26, 2025",
    title: "12 Companies Leading the Way in AwaOwn",
    excerpt:
      "Trends are patterns or shifts in behavior, preferences, or ideas that gain popularity within a specific industry.",
    image: "/images/hero-card-4.png",
  },
  {
    date: "May 26, 2025",
    title: "The Most Innovative Things Happening Right Now",
    excerpt:
      "Welcome to the digital world, where technology is constantly evolving and shaping the way we live and work.",
    image: "/images/hero-card-5.png",
  },
  {
    date: "May 26, 2025",
    title: "7 Answers to the Most Frequently Asked Questions",
    excerpt:
      "Welcome to the ultimate shopping event that you've been waiting for. Our upcoming shopping sale with big discounts.",
    image: "/images/hero-card-6.png",
  },
];

const FromBlog = () => {
  return (
    <div className="mx-auto mt-12 w-full max-w-[1460px] px-4 font-shop md:mt-16 md:px-8">
      <SectionHeader title="From The Blog" />
      <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-2">
        {blogPosts.map((post) => (
          <a
            href="#"
            key={post.title}
            className="group flex w-[280px] shrink-0 flex-col gap-3 rounded-[10px] bg-white p-3 md:w-[320px]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-shop-bg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.15]"
                sizes="320px"
              />
            </div>
            <p className="text-[12px] text-shop-text/70">{post.date}</p>
            <h3 className="line-clamp-2 text-[16px] font-semibold leading-[22px] text-shop-heading group-hover:text-shop-accent-1">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-[13px] leading-[20px] text-shop-text">
              {post.excerpt}
            </p>
            <span className="text-[13px] font-semibold text-shop-accent-1 underline underline-offset-4">
              Read More
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FromBlog;
