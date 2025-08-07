import React from "react";
import Banner from "../Banner/Banner";
import Featured from "../Featured/Featured";
import About from "../About/About";
import Newsletter from "../Newsletter/Newsletter";
import usePageTitle from "../../PageTitle/PageTitle";
import FeaturedClasses from "../FeaturedClasses/FeaturedClasses";
import TeamSection from "../TeamSection/TeamSection";
import Reviews from "../Reviews/Reviews";
import RecentForums from "../RecentForums/RecentForums";

const Home = () => {
  usePageTitle("Home");
  return (
    <div>
      <Banner />
      <Featured />
      <About />
      <FeaturedClasses />
      <TeamSection />
      <Reviews />
      <RecentForums />
      <Newsletter />
    </div>
  );
};

export default Home;
