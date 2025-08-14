import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import "./CategoriesPage.css";
import developer from "../assets/developer.jpg";
import business from "../assets/business.jpg";
import education from "../assets/education.jpg";
import creative from "../assets/creative.jpg";
import productivity from "../assets/prod.jpg"
import personalGrowth from "../assets/growth.jpg"
import healthWellness from "../assets/health.jpg"
import storyteller from "../assets/story.jpg"
import funFacts from "../assets/facts.jpg"
import travelCulture from "../assets/travel.jpg"
import careerCoach from "../assets/coach.jpg"
import ChatHeader from "./ChatHeader";
const categories = [
  { name: "Creative AI", description: "Your artsy, fun AI for design, art, and storytelling magic.", img: creative },
  { name: "Business AI", description: "Your strategic partner for productivity, planning, and growth.", img: business },
  { name: "Developer Tools", description: "Your coding buddy with helpful snippets, debugging tips, and API guidance.", img: developer },
  { name: "Education AI", description: "Your friendly tutor for clear, step-by-step learning.", img: education },
  { name: "Personal Growth AI", description: "Your motivational coach to help you set goals and stay inspired.", img: personalGrowth },
  { name: "Health & Wellness AI", description: "Your wellness buddy for fitness, healthy habits, and mindfulness.", img: healthWellness },
  { name: "Storyteller AI", description: "Your guide to immersive stories, roleplays, and adventures.", img: storyteller },
  { name: "Productivity Pro AI", description: "Your efficiency expert for better time management and focus.", img: productivity },
  { name: "Fun Facts & Curiosity AI", description: "Your trivia master with surprising and fascinating facts.", img: funFacts },
  { name: "Travel & Culture AI", description: "Your virtual guide for travel tips and cultural insights.", img: travelCulture },
  { name: "Career Coach AI", description: "Your mentor for resume tips, interviews, and career growth.", img: careerCoach }
];


export default function CategoriesPage() {
  const navigate = useNavigate(); // ✅ hook for navigation

  const chooseCategory = (category) => {
    localStorage.setItem("selectedCategory", category.name);
    navigate("/home");
  };

  return (
    <div
      className="categories-page"
    //   style={{ backgroundImage: `url('../assets/dark.jpg')` }}
    >
      <div className="overlay"></div>
      <ChatHeader/>
      <h1 className="page-title">Explore AI Categories</h1>
      <p className="page-subtitle">Find the perfect AI tools for your needs</p>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            style={{ backgroundImage: `url(${cat.img})` }}
          >
            <div className="category-overlay">
              <h2>{cat.name}</h2>
              <p>{cat.description}</p>
              <button onClick={() => chooseCategory(cat)}>Explore</button> {/* ✅ onClick */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
